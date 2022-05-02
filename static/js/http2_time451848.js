function _typeof(e){
return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e;
}
!function(){
function e(e){
return/^https/.test(e.name)?1:0;
}
var t={
"mp.weixin.qq.com":1,
"open.weixin.qq.com":2,
"developers.weixin.qq.com":3,
"mp.weixinbridge.com":4
},n={
5:{
reg:/^https?:\/\/mp\.weixin\.qq\.com\/cgi-bin\/safeqrcode((\?|&)[^=]*?=[^&]*?)*?(\?|&)action=ask/,
times:0
}
};
if(performance&&performance.getEntries){
var o=!1,i=function(){
if(!o){
var i=!1,r=[],a=performance.getEntries().map(function(t){
if("object"!==("undefined"==typeof t?"undefined":_typeof(t)))i=!0;else if(void 0===t.entryType)i=!0;else{
if("navigation"!==t.entryType&&"resource"!==t.entryType)return null;
if(void 0===t.initiatorType)i=!0;else if("xmlhttprequest"===t.initiatorType){
if(void 0===t.name||void 0===t.duration)i=!0;else for(var o in n)if(Object.prototype.hasOwnProperty.call(n,o)){
var a=n[o];
a.times<10&&a.reg.test(t.name)&&(r.push({
scene:o,
protocol:t.nextHopProtocol,
is_https:e(t),
time:t.duration
}),a.times++);
}
return null;
}
}
return t;
});
if(!i){
var s=0;
if(a.forEach(function(e){
null!==e&&(void 0===e.responseEnd?i=!0:e.responseEnd>s&&(s=e.responseEnd));
}),!i){
var p=location.search.match(/((\?)|(\&))action=([^&]*)/),c={
domain:t[location.hostname]||"",
cginame:location.pathname,
action:p?p[4]:"",
protocol:a[0].nextHopProtocol,
is_https:e(a[0]),
first_print_time:s,
stat_list:r
},f=new Image;
f.src="https://mp.weixin.qq.com/mp/timereport?data="+JSON.stringify(c),o=!0;
}
}
}
};
window.addEventListener("beforeunload",i,!1),window.addEventListener("unload",i,!1);
}
}();