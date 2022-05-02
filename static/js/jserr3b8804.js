var BJ_REPORT=function(e){
function n(){
if(o.id!=y.IDS.DEFAULT||o.key!=y.KEY)return{
id:o.id,
key:o.key
};
var e=y.IDS.DEFAULT,n=y.KEY;
return o.id=e,o.key=n,{
id:e,
key:n
};
}
function r(e,n){
return e.indexOf("TypeError: #<KeyboardEvent> is not a function")>-1||e.indexOf("TypeError: #<MouseEvent> is not a function")>-1?!1:e.indexOf("ReferenceError: LIST_INFO is not defined")>-1?!1:e.indexOf("TypeError: e is not a constructor")>-1?!1:location&&/token=\d+/.test(location.href)&&"0"==wx.fake_id?!1:/Mozilla\/5.0.*ipad.*BaiduHD/i.test(n)&&e.indexOf("ReferenceError: Can't find variable: bds")>-1?!1:/Linux; U; Android.*letv/i.test(n)&&e.indexOf("ReferenceError: diableNightMode is not defined")>-1?!1:!0;
}
if(e.BJ_REPORT)return e.BJ_REPORT;
var t=[],o={
uin:0,
url:"https://badjs.weixinbridge.com/badjs",
combo:0,
level:4,
ignore:[],
random:1,
delay:0,
submit:null
},i=function(e,n){
return Object.prototype.toString.call(e)==="[object "+(n||"Object")+"]";
},a=function(e){
var n=typeof e;
return"object"===n&&!!e;
},c=function(e){
return null===e?!0:i(e,"Number")?!1:!e;
},u=e.onerror;
e.onerror=function(n,t,o,a,c){
var s=n;
c&&c.stack&&(s=f(c)),i(s,"Event")&&(s+=s.type?"--"+s.type+"--"+(s.target?s.target.tagName+"::"+s.target.src:""):""),
t&&t.length>0&&0==/^https\:\/\/(open\.weixin\.qq\.com|res\.wx\.qq\.com)/.test(t)||(1!=o||1!=a&&86!=a||-1!=n.indexOf("eval"))&&0!=r(s,window.navigator.userAgent)&&(y.push({
msg:s+"|onerror",
target:t,
rowNum:o,
colNum:a
}),h(),u&&u.apply(e,arguments));
};
var s=function(e){
try{
if(e.stack){
var n=e.stack.match("https?://[^\n]+");
n=n?n[0]:"";
var t=n.match(":(\\d+):(\\d+)");
t||(t=[0,0,0]);
var o=f(e).replace(/https?\:\/\/.*?\.js\:/g,"");
return 0==r(o,window.navigator.userAgent)?null:{
msg:o,
rowNum:t[1],
colNum:t[2],
target:n.replace(t[0],"")
};
}
return e;
}catch(i){
return e;
}
},f=function(e){
var n=e.stack.replace(/\n/gi,"").split(/\bat\b/).slice(0,5).join("@").replace(/\?[^:]+/gi,""),r=e.toString();
return n.indexOf(r)<0&&(n=r+"@"+n),n;
},l=function(e,n){
var r=[],t=[],i=[];
if(a(e)){
e.level=e.level||o.level;
for(var u in e){
var s=e[u];
if(!c(s)){
if(a(s))try{
s=JSON.stringify(s);
}catch(f){
s="[BJ_REPORT detect value stringify error] "+f.toString();
}
i.push(u+":"+s),r.push(u+"="+encodeURIComponent(s)),t.push(u+"["+n+"]="+encodeURIComponent(s));
}
}
}
return[t.join("&"),i.join(","),r.join("&")];
},d=[],p=[],m=function(e){
var n=e.replace(/\&_t=\d*/,"");
for(var r in p)if(p[r]==n)return;
if(p.push(n),o.submit)o.submit(e);else{
var t=new Image;
d.push(t),t.src=e;
}
var i="error";
if(i=e.match(/msg=(.*?)&/),i&&i[1]&&(i=i[1]),wx&&wx.fake_id&&(i+=encodeURIComponent("|uin|"+wx.fake_id)),
o.key){
var t=new Image;
t.src="https://mp.weixin.qq.com/misc/jslog?id="+o.key+"&content="+i+"&level=error";
}
},g=[],v=0,h=function(e){
if(o.report){
for(;t.length;){
var n=!1,r=t.shift(),a=l(r,g.length);
if(i(o.ignore,"Array"))for(var c=0,u=o.ignore.length;u>c;c++){
var s=o.ignore[c];
if(i(s,"RegExp")&&s.test(a[1])||i(s,"Function")&&s(r,a[1])){
n=!0;
break;
}
}
n||(o.combo?g.push(a[0]):m(o.report+a[2]+"&_t="+ +new Date),o.onReport&&o.onReport(o.id,r));
}
var f=g.length;
if(f){
var d=function(){
clearTimeout(v),console.log("comboReport"+g.join("&")),m(o.report+g.join("&")+"&count="+f+"&_t="+ +new Date),
v=0,g=[];
};
e?d():v||(v=setTimeout(d,o.delay,!0),console.log("_config.delay"+o.delay));
}
}
},y={
KEY:116,
IDS:{
DEFAULT:"122"
},
destory:function(){
h=function(){};
},
push:function(e,n){
if(Math.random()>=o.random)return y;
var r;
if(a(e)){
if(r=s(e),n&&(r.msg+="["+n+"]"),r){
if(r.target&&0==/^https?\:\/\/(open\.weixin\.qq\.com|res\.wx\.qq\.com)/.test(r.target))return y;
t.push(r);
}
}else n&&(e+="["+n+"]"),t.push({
msg:e
});
return h(),y;
},
report:function(e,n){
return e&&y.push(e,n),y;
},
info:function(e){
return e?(a(e)?e.level=2:e={
msg:e,
level:2
},y.push(e),y):y;
},
debug:function(e){
return e?(a(e)?e.level=1:e={
msg:e,
level:1
},y.push(e),y):y;
},
init:function(e){
for(var n in e)o[n]=e[n];
return"en_US"==wx.data.lang&&(o.id=id=146,o.key=n=117),o.id&&o.key&&(o.report=o.url+"?id="+o.id+"&key="+o.key+"&uin="+(wx&&wx.fake_id)+"&from="+encodeURIComponent(location.href)+"&"),
y;
},
monitor:function(e,n,r){
if(n=n||"badjs|monitor",e){
var t=new Image;
t.src="https://mp.weixin.qq.com/misc/jslog?id="+e+"&content="+encodeURIComponent(n)+"&level=error";
}
if(r){
var i=new Image;
i.src=o.url+"?id="+r+"&msg="+encodeURIComponent(n)+"&uin="+(wx&&wx.fake_id)+"&from="+encodeURIComponent(location.href)+"&level=4";
}
},
getConfig:function(){
return o;
},
__onerror__:e.onerror
};
return"undefined"!=typeof console&&console.error&&setTimeout(function(){
var e=((location.hash||"").match(/([#&])BJ_ERROR=([^&$]+)/)||[])[2];
e&&console.error("BJ_ERROR",decodeURIComponent(e).replace(/(:\d+:\d+)\s*/g,"$1\n"));
},0,!0),o.id=y.IDS.DEFAULT,o.key=y.KEY,n(),y.init(),y;
}(window);