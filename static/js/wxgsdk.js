/*
Project in http://git.oa.com/WechatFe/wxg-speeds/tree/master

usage��
// --- global window
    wxgsdk.saveSpeeds({
        rid : 123,
        uin : 1235458,
        pid : 2,
        speeds : {sid:21, time:1101}
    });
    wxgsdk.setBasicTime({
        uin : 9876273,
        pid : 2,
        rid : 223
    });
    wxgsdk.send();// send after page onload is better

see more at http://git.oa.com/WechatFe/wxg-speeds/blob/master/api/fe.md
*/
window.wxgsdk = (function(){ 
    var _Speed={};
    /*
    _Speed = {
        "pid_uin_rid" : [] // _Speed["pid_uin_rid"][0]=[t1,t2,t3], _Speed["pid_uin_rid"][1]=[t4,t5,t6]
    }
    */
    var _imgurl = 'https://badjs.weixinbridge.com/frontend/reportspeed?';
    
    function saveSpeeds(obj){
        if(!obj.pid || !obj.speeds){
            return -1;
        }
        
        if(!obj.speeds.length > 0){ // if speeds has only one object
            var item = obj.speeds;
            obj.speeds = [];
            obj.speeds.push(item);
        }

        var pid_uin_rid = _conbinUPRid(obj);
        
        for(var i=0; i<obj.speeds.length; i++){ // combine data with same uin,rid,uid
            var os = obj.speeds[i];
            os.time = parseInt(os.time);
            if(os.sid > 20 && os.time>0 )
                _setSidTime(pid_uin_rid, os.sid, os.time); 
        }
    }

    function send(){
        _doFunc(function(){
            setTimeout(function(){
                for(var item in _Speed){
                    _get({
                        pid_uin_rid : item,
                        speeds : _Speed[item]
                    }, _imgurl);
                }
                _Speed = {}; // clear _Speed after send
            }, 100); // the data may send after 100ms
        });
    }

    function setFirstViewTime(obj){
        _doFunc(function(){
            if( !obj.pid || !obj.time) 
            return -1;
            var pid_uin_rid = _conbinUPRid(obj);
            _setSidTime(pid_uin_rid, 9, obj.time);
        });
    }

    function setBasicTime(obj){ 
        _doFunc(function(){
            var pid_uin_rid = _conbinUPRid(obj);
            if(!_Speed[pid_uin_rid]) _Speed[pid_uin_rid] = [];
            var performance = window.performance || window.msPerformance || window.webkitPerformance;
            if(!!performance && !!performance.timing){
                var timing = performance.timing;
                _setSidTime(pid_uin_rid, 1, timing.domainLookupEnd - timing.domainLookupStart); //DNS
                _setSidTime(pid_uin_rid, 2, ((location.protocol == "https:") && (timing.secureConnectionStart != 0)) ? (timing.connectEnd - timing.secureConnectionStart) : 0);//SSL
                _setSidTime(pid_uin_rid, 3, timing.connectEnd - timing.connectStart );// TCP
                _setSidTime(pid_uin_rid, 4, timing.responseStart - timing.requestStart);//request
                _setSidTime(pid_uin_rid, 5, timing.responseEnd - timing.responseStart);// get packetage
                _setSidTime(pid_uin_rid, 6, timing.domContentLoadedEventStart - timing.domLoading);//domContentLoaded
                _setSidTime(pid_uin_rid, 7, timing.domComplete == 0 ? 0 : (timing.domComplete - timing.domLoading));// domComplete
                _setSidTime(pid_uin_rid, 8, timing.loadEventEnd == 0 ? 0 : (timing.loadEventEnd - timing.loadEventStart));// must set after page onload 
                (function(_Speed){
                    setTimeout(function(){
                        if(timing.loadEventEnd) {
                            _setSidTime(pid_uin_rid, 7, timing.domComplete == 0 ? 0 : (timing.domComplete - timing.domLoading));// domComplete
                            _setSidTime(pid_uin_rid, 8, timing.loadEventEnd == 0 ? 0 : (timing.loadEventEnd - timing.loadEventStart));// must set after page onload 
                        }
                    }, 0);
                })(_Speed);
                if( !_Speed[pid_uin_rid][9] ) // not have first view time, must set
                    _setSidTime(pid_uin_rid, 9, timing.domContentLoadedEventStart - timing.navigationStart );// first view time
                _setSidTime(pid_uin_rid, 10, timing.domainLookupStart - timing.navigationStart); // time before dns start
                _setSidTime(pid_uin_rid, 11, timing.domLoading - timing.responseStart); // time between package receive and dom parse
            }
        });
    }
    
    function _setSidTime(pid_uin_rid, sid, time){
        _Speed[pid_uin_rid] = _Speed[pid_uin_rid] || [];
        _Speed[pid_uin_rid][sid] =  _Speed[pid_uin_rid][sid]||[];
        if(time < 0) return;
        if(sid < 21)
            _Speed[pid_uin_rid][sid][0] = time;
        else
            _Speed[pid_uin_rid][sid].push(time);
    }
    function _conbinUPRid(obj){
        if(!obj || !obj.pid) {
            console && console.error('Must provide a pid');
            return;
        }
        return obj.pid + '_' + (obj.uin || 0 ) + '_' + (obj.rid || 0);
    }
    function _get(obj, url){
        var apur = obj.pid_uin_rid.split('_'); // array pid uin rid
        if(apur.length == 3) {
            var spur = 'pid=' + apur[0] + '&uin=' + apur[1] + '&rid=' + apur[2]; // string pur
        }else {
            console && console.error('pid,uin,rid, invalid args');
            return;
        }

        var url1 = url + spur + '&speeds=';
        var url2 = ''; // 1_2002;1_222;2_9988;3_333  url=url1+url2
        var urlarr = [];
        for(var i =1;i < obj.speeds.length; i++){
            if( obj.speeds[i] ){
                for(var j=0;j<obj.speeds[i].length; j++){
                    var s = i + '_' + obj.speeds[i][j];
                    if( (url1.length + url2.length + s.length) < 1024){
                        url2 = url2 + s +';';
                    }else {
                        if(!!url2.length)  // fix when limit length < 90
                            urlarr.push( url1 + url2.substring(0,url2.length-1) );
                        url2 = s + ';';
                    }
                }
                if( i==obj.speeds.length-1 ){
                    urlarr.push( url1 + url2.substring(0,url2.length-1) );
                }
            }
        }
        for(var i=0;i<urlarr.length;i++) {
            (new Image()).src = urlarr[i];
        }
    }
    var cblist = [];
    function _doFunc(fnc){
        if (document.readyState == "complete"){
            fnc();
        }else{
            cblist.push(fnc);
        }
    }
    if(window.addEventListener){
        window.addEventListener('load', onLoad, false);
    }else if(window.attachEvent){
        window.attachEvent('onload', onLoad);
    }
    function onLoad(){
        for (var i in cblist){
            cblist[i]();
        }
        cblist = [];
    }
    // return method
    return {
        saveSpeeds:saveSpeeds,
        send:send,
        setFirstViewTime:setFirstViewTime,
        setBasicTime:setBasicTime
    }
})();