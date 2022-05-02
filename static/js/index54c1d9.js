define("tpl/news/home.html.js",[],function(){
return'<ul>\n	{each list as o index}\n	<li>\n		<a target="_blank" href="/cgi-bin/announce?action=getannouncement&key={o.key}&version={o.version}&lang=zh_CN&token={token}">{o.title}</a>\n		<i class="icon_common new"></i>\n	</li>\n	{/each}\n	<li class="extra"><a target="_blank" href="/cgi-bin/announce?action=getannouncementlist&lang=zh_CN&token={token}">查看更多</a></li>\n</ul>\n';
});define("common/wx/slider.js",[],function(){
"use strict";
var t={
titleId:"",
titleTag:"",
contentId:"",
contentTag:"",
prevContainer:"",
nextContainer:"",
perView:1,
className:"current",
eventType:"mouseover",
initIndex:0,
timeLag:300,
funcInit:function(){},
funcTabInit:function(){},
func:function(){},
onPage:function(){},
auto:!0,
autoKeep:!0,
autoTimes:1e3,
autoLag:5e3,
fadeLag:50,
fadeTimes:500,
initSpeed:100,
effect:"none",
width:0,
height:0,
backAttr:"back_src",
isLoadInit:!0,
funcTabChange:function(){}
},e=function(e){
this.opt=$.extend(!0,{},t,e),this._g={
total:0,
pageTotal:0,
current:0,
autoCount:0,
isInit:!0,
intr:null,
autoIntr:null,
_imgs:[],
_cont:[],
_tabs:[]
},this._init();
};
e.prototype={
_init:function(){
var t=this,e=t.opt,n=t._g;
if((0==e.width&&"scrollx"==e.effect||0==e.height&&"scrolly"==e.effect)&&(e.effect="none"),
e.contentId&&(t.oContent=$("#"+e.contentId),t.oContent.find(e.contentTag).each(function(){
var t=this;
switch(e.effect){
case"none":
t.style.display="none";
break;

case"scrollx":
t.style.width=e.width+"px",t.style.styleFloat=t.style.cssFloat="left",t.style.visibility="hidden";
break;

case"scrolly":
t.style.height=e.height+"px",t.style.visibility="hidden";
break;

case"fade":
t.style.display="block",t.style.position="absolute",t.style.left=0,t.style.top=0,
n.total!=e.initIndex?(t.style.filter="alpha(opacity=0)",t.style.opacity=0,t.style.zIndex=0):(t.style.filter="alpha(opacity=100)",
t.style.opacity=1,t.style.zIndex=1);
}
n._cont.push(t),e.funcInit(n.total++,$(t));
}),e.auto===!0&&t.oContent.mouseenter(function(){
clearInterval(n.autoIntr);
}).mouseleave(function(){
e.autoKeep===!0&&t._setAuto();
})),e.titleId){
var a=t.oTitle=$("#"+e.titleId),o=0;
a.find(e.titleTag).each(function(){
var t=$(this);
e.funcTabInit(o,t),t.attr("index",o++),n._tabs.push(t);
}),n.total=o,a.on(e.eventType,e.titleTag,function(){
var a=$(this),o=1*a.attr("index");
clearInterval(n.autoIntr),o!=n.current&&(n.intr=setTimeout(function(){
e.funcTabChange(o,e),t._setEffect(o);
},e.timeLag));
}).on("mouseout",e.titleTag,function(){
clearTimeout(n.intr),e.auto&&e.autoKeep&&t._setAuto();
});
}
n.pageTotal=Math.ceil(n.total/e.perView),n.current=e.initIndex,n.autoTotal=e.autoTimes*n.pageTotal-1,
t._setEffect(n.current),e.auto&&t._setAuto(),e.prevContainer&&$(e.prevContainer).click(t._showPrev),
e.nextContainer&&$(e.nextContainer).click(t._showNext),n.isInit=!1;
},
_setAuto:function(){
var t=this,e=t.opt,n=t._g;
clearInterval(n.autoIntr),n.autoIntr=setInterval(function(){
n.autoCount>=n.autoTotal?clearInterval(n.autoIntr):(t._setEffect(n.current+1>=n.pageTotal?0:n.current+1),
n.autoCount++);
},e.autoLag);
},
_setEffect:function(t){
function e(e){
var n=t-r.current<0?-1:1,a=t*e,o=(t-n)*e,l=r._cont[0];
return 0==r.current&&(l.style.position="static"),r.current+1==r.total&&0==t&&(n=1,
a=(r.current+1)*e,o=r.current*e,l.style.position="relative","scrollx"==i.effect?l.style.left=a+"px":l.style.top=a+"px"),
{
t:0,
distance:n*e,
end:a,
here:o
};
}
function n(t){
var e=t.here,n=t.distance,a=i.fadeTimes,o=t.t/a-1;
return parseInt(-n*(o*o*o*o-1)+e,10);
}
function a(t){
if(!(t>=r._cont.length)){
if(i.contentId&&!r._imgs[t]&&(0==r.isInit||1==r.isInit&&1==i.isLoadInit)&&($(r._cont[t]).find("img").each(function(){
var t=$(this);
t.attr("src",t.attr(i.backAttr));
}),r._imgs[t]=!0),i.contentId&&("none"==r._cont[t].style.display&&(r._cont[t].style.display="block"),
"hidden"==r._cont[t].style.visibility&&(r._cont[t].style.visibility="visible")),
i.titleId){
for(var e=0,n=r._tabs.length;n>e;e++)e!=t&&r._tabs[e].removeClass(i.className);
r._tabs[t].addClass(i.className),r._tabs[t].show();
}
i.func(t);
}
}
var o=this,i=o.opt,r=o._g,l=o.oContent[0];
if(!(t>=r._cont.length)){
if(!i.contentId)return a(t),void(r.current=t);
if(r.isInit){
switch(i.effect){
case"scrollx":
l.style.position="relative",l.style.width=(r.total+1)*i.width+"px",l.style.left=-r.current*i.width+"px";
break;

case"scrolly":
l.style.position="relative",l.style.top=-r.current*i.height+"px";
break;

case"fade":
l.style.position="relative";
}
for(var c=0;c<i.perView;c++)t+c<r.total&&a(t+c);
i.onPage(t),r.current=t;
}else{
var s=Math.floor(i.fadeTimes/i.fadeLag),u=null,f=0;
if(i.globeFadeIntr){
switch(i.effect){
case"fade":
r._cont[r.current].style.zIndex=0,r._cont[r.tempCur].style.zIndex=0,r._cont[t].style.zIndex=1,
r._cont[r.current].style.filter="alpha(opacity=0)",r._cont[r.current].style.opacity=0,
r._cont[r.tempCur].style.filter="alpha(opacity=100)",r._cont[r.tempCur].style.opacity=1,
r._cont[t].style.filter="alpha(opacity=0)",r._cont[t].style.opacity=0,r.current=r.tempCur;
}
clearInterval(i.globeFadeIntr);
}
switch(i.globeFadeIntr=null,i.effect){
case"none":
for(var c=0;c<i.perView;c++){
var d;
(d=r.current*i.perView+c)<r.total&&(r._cont[d].style.display="none"),(d=t*i.perView+c)<r.total&&a(d);
}
i.onPage(t),r.current=t;
break;

case"scrollx":
var p=e(i.width);
a(t),i.globeFadeIntr=u=setInterval(function(){
f++>=s?(clearInterval(u),i.globeFadeIntr=null,l.style.left=-p.end+"px",r.current=t):(l.style.left=-n(p)+"px",
p.t=p.t<i.fadeTimes?p.t+i.fadeLag:i.fadeTimes);
},i.fadeLag);
break;

case"scrolly":
var y=e(i.height);
a(t),i.globeFadeIntr=u=setInterval(function(){
f++>=s?(clearInterval(u),i.globeFadeIntr=null,l.style.top=-y.end+"px",r.current=t):(l.style.top=-n(y)+"px",
y.t=y.t<i.fadeTimes?y.t+i.fadeLag:i.fadeTimes);
},i.fadeLag);
break;

case"fade":
a(t),i.globeFadeIntr=u=setInterval(function(){
if(f++>=s)clearInterval(u),i.globeFadeIntr=null,r._cont[r.current].style.zIndex=0,
r._cont[t].style.zIndex=1,r.current=t;else{
var e=f/s*2;
r._cont[r.current].style.filter="alpha(opacity="+(0>1-e?0:100*(1-e))+")",r._cont[r.current].style.opacity=0>1-e?0:1-e,
r._cont[t].style.filter="alpha(opacity="+(e>1?100*Math.abs(1-e):0)+")",r._cont[t].style.opacity=e>1?Math.abs(1-e):0,
r.tempCur=t;
}
},i.fadeLag);
}
}
}
},
_showPrev:function(){
var t=this,e=t._g;
clearInterval(e.autoIntr),t._setEffect(e.current-1<0?e.pageTotal-1:e.current-1);
},
_showNext:function(){
var t=this,e=t._g;
clearInterval(e.autoIntr),t._setEffect(e.current+1>=e.pageTotal?0:e.current+1);
},
destroy:function(){
self.oTitle.off(),self.oContent.off(),self.prevContainer.off(),self.nextContainer.off();
}
};
return e;
});define("common/lib/json.js",[],function(require,exports,module){
return"object"!=typeof JSON&&(JSON={}),function(){
"use strict";
function f(t){
return 10>t?"0"+t:t;
}
function quote(t){
return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){
var e=meta[t];
return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4);
})+'"':'"'+t+'"';
}
function str(t,e){
var r,n,o,f,u,i=gap,p=e[t];
switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(t)),"function"==typeof rep&&(p=rep.call(e,t,p)),
typeof p){
case"string":
return quote(p);

case"number":
return isFinite(p)?String(p):"null";

case"boolean":
case"null":
return String(p);

case"object":
if(!p)return"null";
if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(p)){
for(f=p.length,r=0;f>r;r+=1)u[r]=str(r,p)||"null";
return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+i+"]":"["+u.join(",")+"]",
gap=i,o;
}
if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],
o=str(n,p),o&&u.push(quote(n)+(gap?": ":":")+o));else for(n in p)Object.prototype.hasOwnProperty.call(p,n)&&(o=str(n,p),
o&&u.push(quote(n)+(gap?": ":":")+o));
return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+i+"}":"{"+u.join(",")+"}",
gap=i,o;
}
}
"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){
return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null;
},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){
return this.valueOf();
});
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={
"\b":"\\b",
"	":"\\t",
"\n":"\\n",
"\f":"\\f",
"\r":"\\r",
'"':'\\"',
"\\":"\\\\"
},rep;
JSON.stringify2=function(t,e,r){
var n;
if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);
if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");
return str("",{
"":t
});
},"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){
function walk(t,e){
var r,n,o=t[e];
if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),
void 0!==n?o[r]=n:delete o[r]);
return reviver.call(t,e,o);
}
var j;
if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){
return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4);
})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),
"function"==typeof reviver?walk({
"":j
},""):j;
throw new SyntaxError("JSON.parse");
});
}(),JSON;
});define("home/index.js",["common/lib/json.js","common/wx/slider.js","tpl/news/home.html.js"],function(e){
"use strict";
e("common/lib/json.js");
var t=e("common/wx/slider.js"),n=e("tpl/news/home.html.js"),i=48;
!function(){
function e(){
new t({
fadeTimes:1e3,
width:$("#slider_container li").width(),
effect:"fade",
initIndex:0,
titleId:"slider_title",
titleTag:"li",
contentId:"slider_container",
contentTag:"li"
}),o(JSON.parse(window.cgiData.announcementlist));
}
function o(e){
for(var t=0,o=[],s=0,l=Math.min(e.length,2);l>s;s++){
var m=e[s].title.length;
i>=m+t?o.push(e[s]):(e[s].title=e[s].title.substr(0,i-t-3)+"...",o.push(e[s])),t+=m;
}
$("#newsDiv").append(template.compile(n)({
list:o,
token:wx.token
}));
}
e();
}();
});