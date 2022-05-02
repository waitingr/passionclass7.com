/*eslint-disable */
/*
 *上报接口
 */
var BJ_REPORT = (function(global) {
  if (global.BJ_REPORT) return global.BJ_REPORT;

  var _error = [];
  var _config = {
    //id: report.IDS.DEFAULT, //mp默认上报id
    //key: report.KEY, //告警默认key
    uin: 0,
    url: 'https://badjs.weixinbridge.com/badjs',
    combo: 0,
    level: 4, // 1-debug 2-info 4-error 8-fail
    ignore: [],
    random: 1,
    delay: 0,
    submit: null
  };

  var _isOBJByType = function(o, type) {
    return Object.prototype.toString.call(o) === '[object ' + (type || 'Object') + ']';
  };

  var _isOBJ = function(obj) {
    var type = typeof obj;
    return type === 'object' && !!obj;
  };

  var _isEmpty = function(obj) {
    if (obj === null) return true;
    if (_isOBJByType(obj, 'Number')) {
      return false;
    }
    return !obj;
  };

  //根据页面路由到badjs上报模块
  function _init_id_key() {
    //页面id和key不是默认值，说明已经调用init设置过。则不走页面路由规则设置id key
    if (_config.id != report.IDS.DEFAULT || _config.key != report.KEY) {
      return {
        id: _config.id,
        key: _config.key
      }
    }
    var data = {
      _href: location.href,
      href: location.href.replace('https://mp.weixin.qq.com/', ''),
      //href: location.href.replace('http://devyin.mp.weixin.qq.com:8080/', ''),
    };
    if (data.href.indexOf('?') > -1) {
      data.cgi = data.href.match(/.*?\?/g)[0].slice(0, -1);
    } else {
      data.cgi = data.href;
    }
    var match = (data.href + '&').match(/action\=(.*?)&/);
    if (match && match[1]) {
      data.action = match[1];
    }
    var id = report.IDS.DEFAULT;
    var key = report.KEY;
    //群发
    if (data.cgi == 'cgi-bin/masssendpage') {
      id = report.IDS.MASS;
      key = 66;
    }
    //自动回复
    else if (data.cgi == 'advanced/autoreply') {
      id = report.IDS.AUTO_REPLY;
      key = 70;
    }
    //自定义菜单
    else if (data.cgi == 'advanced/selfmenu') {
      id = report.IDS.SELF_MENU;
      key = 68;
    }
    //留言
    else if (data.cgi == 'misc/appmsgcomment') {
      id = report.IDS.COMMENT;
      key = 71;
    }
    //投票
    else if (data.cgi == 'cgi-bin/newoperatevote') {
      id = report.IDS.VOTE;
      key = 72;
    }
    //客服
    else if (data.cgi == 'misc/kf') {
      id = report.IDS.KF;
      key = 73;
    }
    //赞赏
    else if (data.cgi == 'merchant/rewardstat' || data.cgi == 'merchant/reward') {
      id = report.IDS.REWARD;
      key = 74;
    }
    //原创
    else if (data.cgi == 'cgi-bin/appmsgcopyright' || data.cgi == 'cgi-bin/imgcopyright' || data.cgi == 'cgi-bin/ori_video') {
      id = report.IDS.COPYRIGHT;
      key = 75;
    }
    //消息管理
    else if (data.cgi == 'cgi-bin/message') {
      id = report.IDS.MSG;
      key = 76;
    }
    //用户管理
    else if (data.cgi == 'cgi-bin/user_tag') {
      id = report.IDS.USER;
      key = 77;
    }
    //素材列表 图文 音频 视频 图片
    else if ((data.cgi == 'cgi-bin/appmsg' && (data.action == 'list_card' || data.action == 'list')) || data.cgi == 'cgi-bin/filepage') {
      id = report.IDS.LIST;
      key = 78;
    }
    //音频编辑
    else if (data.cgi == 'cgi-bin/operate_voice') {
      id = report.IDS.AUDIO;
      key = 79;
    }
    //视频编辑
    else if (data.cgi == 'cgi-bin/appmsg' && data.action == 'video_edit') {
      id = report.IDS.VEDIO;
      key = 80;
    }
    //图文编辑
    else if (data.cgi == 'cgi-bin/appmsg' && data.action == 'edit') {
      id = report.IDS.APPMSG;
      key = 62;
    }
    //广告
    else if ((data.cgi == 'cgi-bin/frame' && /t=ad_system/.test(data.href)) || /merchant\/ad_/.test(data.cgi)) {
      id = report.IDS.AD;
      key = 81;
    }
    //统计
    else if (data.cgi == 'misc/useranalysis' || data.cgi == 'misc/appmsganalysis' || data.cgi == 'misc/menuanalysis' || data.cgi == 'misc/messageanalysis' || data.cgi == 'misc/interfaceanalysis') {
      id = report.IDS.ANALYSIS;
      key = 82;
    }
    //设置
    else if (data.cgi == 'cgi-bin/settingpage' || data.cgi == 'acct/contractorinfo') {
      id = report.IDS.SETTING;
      key = 83;
    }
    //认证
    else if (data.cgi == 'merchant/store' || data.cgi == 'merchant/order' || data.cgi == 'acct/wxverify') {
      id = report.IDS.VERIFY;
      key = 84;
    }
    //安全
    else if (data.cgi == 'cgi-bin/safecenterstatus') {
      id = report.IDS.SAFE;
      key = 85;
    }
    //违规投诉
    else if (data.cgi == 'cgi-bin/illegalrecord') {
      id = report.IDS.ILLEGAL;
      key = 86;
    }
    //开发者配置
    else if (data.cgi == 'advanced/advanced' || data.cgi == 'advanced/diagram' || (data.cgi == 'cgi-bin/frame' && /t=advanced\/dev_tools_frame/.test(data.href))) {
      id = report.IDS.ADVANCED;
      key = 87;
    }
    //注册
    else if (data.cgi == 'acct/contractorpage') {
      id = report.IDS.REGISTER;
      key = 88;
    }
    //静态模版
    else if (data.cgi == 'cgi-bin/readtemplate') {
      id = report.IDS.TMPL;
      key = 89;
      //模版消息
    } else if (data.cgi == 'advanced/tmplmsg') {
      id = report.IDS.TMPLMSG;
      key = 90;
    } else if (data.cgi == 'merchant/entityshop' || data.cgi == 'merchant/newentityshop'){
      id = report.IDS.SHOP;
      key = 92;
    }else if (data.cgi =='merchant/goods'||data.cgi =='merchant/goodsgroup'||data.cgi =='merchant/shelf'||data.cgi =='merchant/goodsimage'||data.cgi =='merchant/delivery'||data.cgi =='merchant/productorder'||data.cgi =='merchant/merchantstat'||data.cgi =='merchant/introduction'||data.cgi =='merchant/merchantpush'||data.cgi =='merchant/merchantentrance') {
      id = report.IDS.MERCHANT;
      key = 104;
    } else if (data.cgi == 'cgi-bin/home') {
      id = report.IDS.HOME;
      key = 93;
    } else if (data.cgi == 'merchant/cardapply' && data.action=='listapply') {
      // id不变, 看key
      // 申请卡券
      key = 95;
    } else if (data.cgi.indexOf('beacon') > -1) { // ibeacon
      id = report.IDS.IBEACON;
      key = 96;
    }
    _config.id = id;
    _config.key = key;
    if(wx&&wx.lang=="en_US"){
        id=125;
        key=125;
    }
    return {
      id: id,
      key: key
    }
  }

  function _filter(err_msg, ua) {
    /*if(err_msg=='Script error.'||err_msg=='Script error'){
      var gImg = new Image();
      gImg.src = '/misc/jslog?id=60&content='+err_msg+encodeURIComponent('['+ua+']')+'&level=error';
      return false;
    }*/
    //chrome noads插件报错
    if(err_msg.indexOf('TypeError: #<KeyboardEvent> is not a function') > -1||err_msg.indexOf('TypeError: #<MouseEvent> is not a function') > -1){
      return false;
    }

    //chrome插件错误
    if(err_msg.indexOf('ReferenceError: LIST_INFO is not defined') > -1){
      return false;
    }

    //资源加载失败触发模块不存在报错  非业务问题排除（网络波动等 专门提出来监控）
    if(err_msg.indexOf('TypeError: e is not a constructor') > -1){
      return false;
    }

    //有token uin为0 说明是登录态过期
    if(location&&/token=\d+/.test(location.href)&&wx.uin=='0'){
      return false;
    }

    //ipad  baiduHD:Mozilla/5.0 (iPad; CPU OS 9_2_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) BaiduHD4.6.1.6 Mobile/10A406 Safari/8536.25
    if (/Mozilla\/5.0.*ipad.*BaiduHD/i.test(ua) && err_msg.indexOf('ReferenceError: Can\'t find variable: bds') > -1) {
      return false;
    }
    //letv手机:Mozilla/5.0 (Linux; U; Android 5.0; zh-cn; Letv X500 Build/DBXCNOP5501203171S) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/37.0.0.0 Mobile Safari/537.36 EUI Browser/1.0
    if (/Linux; U; Android.*letv/i.test(ua) && err_msg.indexOf('ReferenceError: diableNightMode is not defined') > -1) {
      return false;
    }

    return true;
  }


  var _processError = function(errObj) {
    try {
      if (errObj.stack) {
        var url = errObj.stack.match('https?://[^\n]+');
        url = url ? url[0] : '';
        var rowCols = url.match(':(\\d+):(\\d+)');

        //域名限制 非mp.weixin.qq.com和res.wx.qq.com不上报
         /* if (url && url.length > 0) {
          if (/^https?\:\/\/(mp\.weixin\.qq\.com|res\.wx\.qq\.com)/.test(url) == false) {
            return null;
          }
        }*/

        if (!rowCols) {
          rowCols = [0, 0, 0];
        }
        var stack = _processStackMsg(errObj).replace(/https?\:\/\/.*?\.js\:/g, '');
        if (_filter(stack, window.navigator.userAgent) == false) {
          return null;
        }

        return {
          msg: stack,
          rowNum: rowCols[1],
          colNum: rowCols[2],
          target: url.replace(rowCols[0], '')
        };
      } else {
        return errObj;
      }
    } catch (err) {
      return errObj;
    }
  };

  var _processStackMsg = function(error) {
    var stack = error.stack.replace(/\n/gi, '').split(/\bat\b/).slice(0, 5).join('@').replace(/\?[^:]+/gi, '');
    var msg = error.toString();
    if (stack.indexOf(msg) < 0) {
      stack = msg + '@' + stack;
    }
    return stack;
  };

  var _error_tostring = function(error, index) {
    var param = [];
    var params = [];
    var stringify = [];
    if (_isOBJ(error)) {
      error.level = error.level || _config.level;
      for (var key in error) {
        var value = error[key];
        if (!_isEmpty(value)) {
          if (_isOBJ(value)) {
            try {
              value = JSON.stringify(value);
            } catch (err) {
              value = '[BJ_REPORT detect value stringify error] ' + err.toString();
            }
          }
          stringify.push(key + ':' + value);
          param.push(key + '=' + encodeURIComponent(value));
          params.push(key + '[' + index + ']=' + encodeURIComponent(value));
        }
      }
    }

    // msg[0]=msg&target[0]=target -- combo report
    // msg:msg,target:target -- ignore
    // msg=msg&target=target -- report with out combo
    return [params.join('&'), stringify.join(','), param.join('&')];
  };

  var _imgs = [];
  var _send_cache = [];
  var _submit = function(url) {

    /*发送的错误缓存下排重*/
    var _url = url.replace(/\&_t=\d*/, ''); //去时间戳
    for (var key in _send_cache) {
      if (_send_cache[key] == _url) {
        return;
      }
    }
    _send_cache.push(_url);

    if (_config.submit) {
      _config.submit(url);
    } else {
      var _img = new Image();
      _imgs.push(_img);
      _img.src = url;
    }
    //发送个全局的告警  直接报到告警
    var content='error';
    content=url.match(/msg=(.*?)&/);
    if(content&&content[1]){
      content=content[1];
    }

    if(wx&&wx.uin){
       content +=encodeURIComponent('|uin|'+wx.uin);
    }
    //各自模块告警
    if (_config.key) {
      var _img=new Image();
      _img.src = '/misc/jslog?id=' + _config.key + '&content=' + content + '&level=error';
    }
    var gImg = new Image();
    gImg.src = '/misc/jslog?id=65&content=' + content + '&level=error';
  };

  var error_list = [];
  var comboTimeout = 0;
  var _send = function(isReoprtNow) {
    if (!_config.report) return;

    while (_error.length) {
      var isIgnore = false;
      var error = _error.shift();
      var error_str = _error_tostring(error, error_list.length);
      if (_isOBJByType(_config.ignore, 'Array')) {
        for (var i = 0, l = _config.ignore.length; i < l; i++) {
          var rule = _config.ignore[i];
          if ((_isOBJByType(rule, 'RegExp') && rule.test(error_str[1])) ||
            (_isOBJByType(rule, 'Function') && rule(error, error_str[1]))) {
            isIgnore = true;
            break;
          }
        }
      }
      if (!isIgnore) {
        if (_config.combo) {
          error_list.push(error_str[0]);
        } else {
          _submit(_config.report + error_str[2] + '&_t=' + (+new Date));
        }
        _config.onReport && (_config.onReport(_config.id, error));
      }
    }

    // 合并上报
    var count = error_list.length;
    if (count) {
      var comboReport = function() {
        clearTimeout(comboTimeout);
        console.log('comboReport'+error_list.join('&'));
        _submit(_config.report + error_list.join('&') + '&count=' + count + '&_t=' + (+new Date));
        comboTimeout = 0;
        error_list = [];
      };

      if (isReoprtNow) {
        comboReport(); // 立即上报
      } else if (!comboTimeout) {
        comboTimeout = setTimeout(comboReport, _config.delay, true); // 延迟上报
        console.log('_config.delay'+_config.delay);
      }
    }
  };

  var report = {
    KEY: 67,
    //http://weixin.oa.com/monitor/custom?action=Index&idkey_id=20802  mp告警页面
    IDS: {
      DEFAULT: '5', //默认
      MASS: '6', //群发
      SELF_MENU: '7', //自定义菜单
      LINK: '11', //资源拉不到
      AUTO_REPLY: '12', //自动回复
      COMMENT: '13', //留言
      VOTE: '14', //投票
      KF: '15', //客服86
      REWARD: '16', //赞赏
      COPYRIGHT: '17', //原创
      MSG: '18', //消息管理
      USER: '19', //用户管理
      LIST: '20', //素材列表
      AUDIO: '21', //音频编辑
      VEDIO: '22', //视频编辑
      APPMSG: '4', //图文编辑
      AD: '23', //广告
      ANALYSIS: '24', //统计
      SETTING: '25', //设置
      VERIFY: '26', //认证
      SAFE: '27', //安全
      ILLEGAL: '28', //违规投诉
      ADVANCED: '29', //开发者配置
      REGISTER: '30', //注册
      TMPL: '31', //静态模版
      IE: '32', //ie
      CARD: '33', //卡券
      SHOP: '34', //门店
      TMPLMSG: '35', //模版消息
      HOME: '36', //home页
      Android: '37', //安卓
      IOS: '38', //ios
      IBEACON: '72' ,// ibeacon
      MERCHANT:'82'//小店
    },
    destory: function() {
      _send = function() {}; //不发送请求
    },
    push: function(msg,id) { // 将错误推到缓存池
      if (Math.random() >= _config.random) {
        return report;
      }
      var _err_obj;

      if (_isOBJ(msg)) {
        _err_obj = _processError(msg);
        if(id){
          _err_obj.msg+='['+id+']';
        }
        if (_err_obj) {
          //上报js错误是外域的忽略（用户加载外域js）
          if(_err_obj.target&&/^https?\:\/\/(mp\.weixin\.qq\.com|res\.wx\.qq\.com)/.test(_err_obj.target) == false){
            return report;
          }else{
             _error.push(_err_obj);
          }
        }
      } else {
        if(id){
          msg+='['+id+']';
        }
        _error.push({
          msg: msg
        });
      }
      /* _error.push(_isOBJ(msg) ? _processError(msg) : {
         msg: msg
       });*/
      _send();
      return report;
    },
    report: function(msg,id) { // error report
      msg && report.push(msg,id);
      //fix 立即上报没有combo 的bug
      //_send(true);
      return report;
    },
    info: function(msg) { // info report
      if (!msg) {
        return report;
      }
      if (_isOBJ(msg)) {
        msg.level = 2;
      } else {
        msg = {
          msg: msg,
          level: 2
        };
      }
      report.push(msg);
      return report;
    },
    debug: function(msg) { // debug report
      if (!msg) {
        return report;
      }
      if (_isOBJ(msg)) {
        msg.level = 1;
      } else {
        msg = {
          msg: msg,
          level: 1
        };
      }
      report.push(msg);
      return report;
    },
    init: function(config) { // 初始化
      for (var key in config) {
        _config[key] = config[key];
      }
      // 没有设置id将不上报
      var id = parseInt(_config.id, 10);
      var key = parseInt(_config.key, 10);
      //ie的错误特殊归到模块
      if (window.navigator.userAgent && /;\s*MSIE\s*[8|7]\.0b?;/i.test(window.navigator.userAgent)) {
        id = report.IDS.IE;
        key = 0;
        //安卓错误
      } else if (window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1) {
        id = report.IDS.Android;
        key =  0;
        //ios
      } else if (!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        id = report.IDS.IOS;
        key =  0;
      }
      if (id && key) {
        _config.report = _config.url + '?id=' + id + '&key=' + key + '&uin='+(wx&&wx.uin)+'&from=' + encodeURIComponent(location.href) + '&';
        //_config.report = (_config.url || 'http://badjs2.qq.com/badjs') + '?id=' + id + '&uin=' + parseInt(_config.uin || (document.cookie.match(/\buin=\D+(\d+)/) || [])[1], 10) + '&from=' + encodeURIComponent(location.href) + '&ext=' + JSON.stringify(_config.ext) + '&';
      }
      return report;
    },
    //转发到告警平台  key是告警id,msg错误信息，id是badjs模块id
    monitor: function(key, msg, id) {
      msg =  msg||'badjs|monitor';
      //有告警key则发到mp告警
      if (key) {
        var key_img=new Image();
        key_img.src = '/misc/jslog?id='+key+'&content='+encodeURIComponent(msg)+'&level=error';
      }
      //有id则发到badjs
      if (id) {
        var e_img = new Image();
        e_img.src = _config.url + '?id=' + id + '&msg=' + encodeURIComponent(msg) + '&uin='+(wx&&wx.uin)+'&from=' + encodeURIComponent(location.href) + '&level=4';
      }
    },
    getConfig: function() {
      return _config; 
    }
  };

  typeof console !== 'undefined' && console.error && setTimeout(function() {
    var err = ((location.hash || '').match(/([#&])BJ_ERROR=([^&$]+)/) || [])[2];
    err && console.error('BJ_ERROR', decodeURIComponent(err).replace(/(:\d+:\d+)\s*/g, '$1\n'));
  }, 0, true);
  _config.id = report.IDS.DEFAULT;
  _config.key = report.KEY;

  _init_id_key();
  report.init(); //默认初始化

  return report;
}(window));


