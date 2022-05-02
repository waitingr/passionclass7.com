window['MCH.header.time'] && window['MCH.header.time'].push(new Date());
function $addToken(url,type,skey){var token=$getToken(skey);if(url==""||(url.indexOf("://")<0?location.href:url).indexOf("http")!=0){return url;}
if(url.indexOf("#")!=-1){var f1=url.match(/\?.+\#/);if(f1){var t=f1[0].split("#"),newPara=[t[0],"&g_tk=",token,"&g_ty=",type,"#",t[1]].join("");return url.replace(f1[0],newPara);}else{var t=url.split("#");return[t[0],"?g_tk=",token,"&g_ty=",type,"#",t[1]].join("");}}
return token==""?(url+(url.indexOf("?")!=-1?"&":"?")+"g_ty="+type):(url+(url.indexOf("?")!=-1?"&":"?")+"g_tk="+token+"&g_ty="+type);};var $ajax=(function(window,undefined){var oXHRCallbacks,xhrCounter=0;var fXHRAbortOnUnload=window.ActiveXObject?function(){for(var key in oXHRCallbacks){oXHRCallbacks[key](0,1);}}:false;return function(opt){var o={url:'',method:'GET',data:null,type:"text",async:true,cache:false,timeout:0,autoToken:true,username:'',password:'',beforeSend:$empty(),onSuccess:$empty(),onError:$empty(),onComplete:$empty()};for(var key in opt){o[key]=opt[key]}
var callback,timeoutTimer,xhrCallbackHandle,ajaxLocation,ajaxLocParts;try{ajaxLocation=location.href;}
catch(e){ajaxLocation=document.createElement("a");ajaxLocation.href="";ajaxLocation=ajaxLocation.href;}
ajaxLocParts=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/.exec(ajaxLocation.toLowerCase())||[];o.isLocal=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(ajaxLocParts[1]);o.method=(typeof(o.method)!="string"||o.method.toUpperCase()!="POST")?"GET":"POST";o.data=(typeof o.data=="string")?o.data:$makeUrl(o.data);if(o.method=='GET'&&o.data){o.url+=(o.url.indexOf("?")<0?"?":"&")+o.data;}
if(o.autoToken){o.url=$addToken(o.url,"ajax");}
o.xhr=$xhrMaker();if(o.xhr===null){return false;}
try{if(o.username){o.xhr.open(o.method,o.url,o.async,o.username,o.password);}
else{o.xhr.open(o.method,o.url,o.async);}}
catch(e){o.onError(-2,e);return false;}
if(o.method=='POST'){o.xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');}
if(!o.cache){o.xhr.setRequestHeader('If-Modified-Since','Thu, 1 Jan 1970 00:00:00 GMT');o.xhr.setRequestHeader('Cache-Control','no-cache');}
o.beforeSend(o.xhr);if(o.async&&o.timeout>0){if(o.xhr.timeout===undefined){timeoutTimer=setTimeout(function(){if(o.xhr&&callback){callback(0,1);}
o.onError(0,null,'timeout');},o.timeout);}
else{o.xhr.timeout=o.timeout;o.xhr.ontimeout=function(){if(o.xhr&&callback){callback(0,1);}
o.onError(0,null,'timeout');};}}
o.xhr.send(o.method=='POST'?o.data:null);callback=function(e,isAbort){if(timeoutTimer){clearTimeout(timeoutTimer);timeoutTimer=undefined;}
if(callback&&(isAbort||o.xhr.readyState===4)){callback=undefined;if(xhrCallbackHandle){o.xhr.onreadystatechange=$empty();if(fXHRAbortOnUnload){try{delete oXHRCallbacks[xhrCallbackHandle];}
catch(e){}}}
if(isAbort){if(o.xhr.readyState!==4){o.xhr.abort();}}
else{var status,statusText,responses;responses={headers:o.xhr.getAllResponseHeaders()};status=o.xhr.status;try{statusText=o.xhr.statusText;}
catch(e){statusText="";}
try{responses.text=o.xhr.responseText;}
catch(e){responses.text="";}
if(!status&&o.isLocal){status=responses.text?200:404;}
else if(status===1223){status=204;}
if(status>=200&&status<300){responses.text=responses.text.replace(/<!--\[if !IE\]>[\w\|]+<!\[endif\]-->/g,'');switch(o.type){case'text':o.onSuccess(responses.text);break;case"json":var json;try{json=(new Function("return ("+responses.text+")"))();}
catch(e){o.onError(status,e,responses.text);}
if(json){o.onSuccess(json);}
break;case"xml":o.onSuccess(o.xhr.responseXML);break;}}
else{if(status===0&&o.timeout>0){o.onError(status,null,'timeout');}
else{o.onError(status,null,statusText);}}
o.onComplete(status,statusText,responses);}
delete o.xhr;}};if(!o.async){callback();}
else if(o.xhr.readyState===4){setTimeout(callback,0);}
else{xhrCallbackHandle=++xhrCounter;if(fXHRAbortOnUnload){if(!oXHRCallbacks){oXHRCallbacks={};if(window.attachEvent){window.attachEvent("onunload",fXHRAbortOnUnload);}
else{window["onunload"]=fXHRAbortOnUnload;}}
oXHRCallbacks[xhrCallbackHandle]=callback;}
o.xhr.onreadystatechange=callback;}};})(window,undefined);function $empty(){return function(){return true;}};function $getCookie(name){var reg=new RegExp("(^| )"+name+"(?:=([^;]*))?(;|$)"),val=document.cookie.match(reg);return val?(val[2]?unescape(val[2]):""):null;};function $getToken(skey){var skey=skey?skey:$getCookie("skey");return skey?$time33(skey):"";};function $makeUrl(data){var arr=[];for(var k in data){arr.push(k+"="+data[k]);};return arr.join("&");};function $namespace(name){for(var arr=name.split(','),r=0,len=arr.length;r<len;r++){for(var i=0,k,name=arr[r].split('.'),parent={};k=name[i];i++){i===0?eval('(typeof '+k+')==="undefined"?('+k+'={}):"";parent='+k):(parent=parent[k]=parent[k]||{});}}};function $time33(str){for(var i=0,len=str.length,hash=5381;i<len;++i){hash+=(hash<<5)+str.charAt(i).charCodeAt();};return hash&0x7fffffff;};function $urlEncode(str){if(str&&str.length){return escape(str).replace(/\+/g,'%2B').replace(/\"/g,'%22').replace(/\'/g,'%27').replace(/\//g,'%2F');}
return"";};function $xhrMaker(){var xhr;try{xhr=new XMLHttpRequest();}catch(e){try{xhr=new ActiveXObject("Msxml2.XMLHTTP");}catch(e){try{xhr=new ActiveXObject("Microsoft.XMLHTTP");}catch(e){xhr=null;}}};return xhr;};$namespace("MCH.header");MCH.header={floatMask:'',noAuthDG:'',notAdminDg:'',errDg1:'',noAuthDg:'',authName:'',roleName:''};MCH.header.init=function(){headerThat=this;if($('#header-masker').length==0){var maskDivModel='<div class="mask-layer hide" id="header-masker"></div>';$('body').append(maskDivModel);}
var mask=$('#header-masker');headerThat.floatMask={show:function(){mask.removeClass('hide');},hide:function(){mask.addClass('hide');}};MCH.header.noAuthDG=Common.getPop('NoAuthDG');MCH.header.notAdminDg=Common.getPop('NotAdminDg','jsCloseNotAdminDg');MCH.header.errDg1=$('#ErrDg1');MCH.header.infoDg=$('#RiskInfoDg');MCH.header.noAuthDg=$('#NoAuthDg');this.showUnReadInnerMsgAmount();this.bind();};MCH.header.getCookie=function(c_name){if(document.cookie.length>0){c_start=document.cookie.indexOf(c_name+'=');if(c_start!=-1){c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(';',c_start);if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end));}}
return"";};MCH.header.bind=function(){if($getCookie("is_login")){var login_id=$getCookie("login_id");var merchant_code=$getCookie("merchant_code");if(login_id&&merchant_code){var username=login_id+"@"+merchant_code;if(login_id==merchant_code)
$("#username").text(login_id);else
$("#username").text(username);$("#user-head").show();}}else{$("#user-head").hide();}
$('.jsCloseErrDg1').on('click',function(){MCH.header.errDg1.addClass('hide');MCH.header.errDg1.find('.jsErrorText').text('系统繁忙，请稍后再试');MCH.header.floatMask.hide();});$('.jsCloseInfoDg').on('click',function(){MCH.header.infoDg.addClass('hide');});$('.jsCloseNoAuthDg').on('click',function(){MCH.header.noAuthDg.addClass('hide');});};MCH.header.showErrDg1=function(text){headerThat.floatMask.show();MCH.header.errDg1.find('.jsErrorText').text(text);MCH.header.errDg1.removeClass('hide');};MCH.header.showNoAuthDg=function(location){headerThat.floatMask.show();MCH.header.noAuthDg.find('.jsNoAuthDgP').text(location);MCH.header.noAuthDg.removeClass('hide');};MCH.header.bindCloseDialog=function(){$(".close-dialog").on('click',function(){headerThat.floatMask.hide();});$(".open-dialog").on('click',function(){headerThat.floatMask.show();});};MCH.header.handleAjax=function(data){if(typeof(data)==="string"){try{data=JSON.parse(data);}catch(err){return;}}
if(data.errorcode==10){var href=window.location.href;window.location.href='/index.php/core/home/session_expired?return_url='+$urlEncode(href);return false;}
if(data.errorcode==269601849){var href=window.location.href;window.location.href='/index.php/core/risk_ctrl?uri='+data.uri+'&return_url='+$urlEncode(href);return false;}
if(data.errorcode==269601850){window.location.href='/index.php/core/risk_ctrl/block';return false;}
if(data.errorcode==269601851){window.location.href='/index.php/core/risk_ctrl/invalid';return false;}
if(data.errorcode==269601852){window.location.href='/index.php/core/risk_ctrl/exceed_fail_limits';return false;}
if(data.errorcode==269601853){window.location.href='/index.php/core/risk_ctrl/system_error';return false;}
return true;};MCH.header.showNoAuthorityDialog=function(){$('#idRoleName').text(roleName);$('#idAuthName').text(authName);MCH.header.noAuthDG.open();};MCH.header.showNotAdminDialog=function(){MCH.header.notAdminDg.open();};MCH.header.hasAuthority=function(authority){var token_name=$("#token").attr("name");var hash=$("#token").val();var post_data=token_name+'='+hash+'&authority='+authority;var hasAuthority=false;$ajax({url:'/index.php/core/authority/has_authority',data:post_data,method:'post',type:'json',async:false,onSuccess:function(data){MCH.header.handleAjax(data);if(data.errorcode!=0){hasAuthority=false;authName=data.data.authority_name;roleName=data.data.role_name;}else{hasAuthority=true;}},onError:function(msg){hasAuthority=true;}});return hasAuthority;};MCH.header.isMajorMerchant=function(){if($getCookie('mmode')=='major'){return true;}
return false;};MCH.header.isNormalMerchant=function(){if($getCookie('mmode')=='normal'){return true;}
return false;};MCH.header.isChild=function(){if($getCookie('mmode')=='child'){return true;}
return false;};MCH.header.showDialog=function(id){$('#'+id).removeClass('hide');var height=window.document.getElementById(id).clientHeight;$('#'+id).css('margin-top',-height);MCH.header.floatMask.show();};MCH.header.closeDialog=function(id){$('#'+id).addClass('hide');MCH.header.floatMask.hide();};MCH.header.showUnReadInnerMsgAmount=function(){if($getCookie("employee_id")===""||$getCookie("employee_id")===null){return;}
var post_data='ecc_csrf_token='+MCH.header.getCookie('ecc_csrf_cookie');$ajax({url:'/index.php/public/cms/get_message_center_home_info',data:post_data,method:'post',type:'json',async:true,onSuccess:function(data){MCH.header.handleAjax(data);if(data.errorcode!=0){$('span.num-feed').addClass('hide');}else{var innerMsgAmount=data.data['unread_message_count'];if(innerMsgAmount>99){innerMsgAmount='99+';}
if(innerMsgAmount==0){$('span.num-feed').addClass('hide');}else{$('span.num-feed').removeClass('hide');$('span.num-feed').text(innerMsgAmount);}}},onError:function(msg){$('span.num-feed').addClass('hide');}});}
MCH.header.showRiskCtlDialog=function(){headerThat.bindCloseDialog();headerThat.floatMask.show();$("#RiskCtrlDialog").removeClass('hide');};MCH.header.closeRiskCtlDialog=function(){headerThat.floatMask.hide();var elem=document.getElementById("RiskCtrlDialogSecFactor");if(elem){elem.innerHTML='';}
$("#RiskCtrlDialog").addClass('hide');};MCH.header.showInfoDg=function(text){headerThat.bindCloseDialog();headerThat.floatMask.show();headerThat.infoDg.find('.headerInfoDgText').text(text);headerThat.infoDg.removeClass('hide');}
MCH.header.init();
window['MCH.header']='22118:20201111:20201111154702';
window['MCH.header.time'] && window['MCH.header.time'].push(new Date());/*  |xGv00|15a27bcb3088dfb7bcc63b7a991b07dc */