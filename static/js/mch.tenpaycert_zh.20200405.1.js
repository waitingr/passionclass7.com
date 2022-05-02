function $addToken(url, type, skey) {
    var token = $getToken(skey);
    if (url == "" || (url.indexOf("://") < 0 ? location.href : url).indexOf("http") != 0) {
        return url;
    }
    if (url.indexOf("#") != -1) {
        var f1 = url.match(/\?.+\#/);
        if (f1) {
            var t = f1[0].split("#"), newPara = [ t[0], "&g_tk=", token, "&g_ty=", type, "#", t[1] ].join("");
            return url.replace(f1[0], newPara);
        } else {
            var t = url.split("#");
            return [ t[0], "?g_tk=", token, "&g_ty=", type, "#", t[1] ].join("");
        }
    }
    return token == "" ? url + (url.indexOf("?") != -1 ? "&" : "?") + "g_ty=" + type : url + (url.indexOf("?") != -1 ? "&" : "?") + "g_tk=" + token + "&g_ty=" + type;
}

var $ajax = function(window, undefined) {
    var oXHRCallbacks, xhrCounter = 0;
    var fXHRAbortOnUnload = window.ActiveXObject ? function() {
        for (var key in oXHRCallbacks) {
            oXHRCallbacks[key](0, 1);
        }
    } : false;
    return function(opt) {
        var o = {
            url: "",
            method: "GET",
            data: null,
            type: "text",
            async: true,
            cache: false,
            timeout: 0,
            autoToken: true,
            username: "",
            password: "",
            beforeSend: $empty(),
            onSuccess: $empty(),
            onError: $empty(),
            onComplete: $empty()
        };
        for (var key in opt) {
            o[key] = opt[key];
        }
        var callback, timeoutTimer, xhrCallbackHandle, ajaxLocation, ajaxLocParts;
        try {
            ajaxLocation = location.href;
        } catch (e) {
            ajaxLocation = document.createElement("a");
            ajaxLocation.href = "";
            ajaxLocation = ajaxLocation.href;
        }
        ajaxLocParts = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/.exec(ajaxLocation.toLowerCase()) || [];
        o.isLocal = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(ajaxLocParts[1]);
        o.method = typeof o.method != "string" || o.method.toUpperCase() != "POST" ? "GET" : "POST";
        o.data = typeof o.data == "string" ? o.data : $makeUrl(o.data);
        if (o.method == "GET" && o.data) {
            o.url += (o.url.indexOf("?") < 0 ? "?" : "&") + o.data;
        }
        if (o.autoToken) {
            o.url = $addToken(o.url, "ajax");
        }
        o.xhr = $xhrMaker();
        if (o.xhr === null) {
            return false;
        }
        try {
            if (o.username) {
                o.xhr.open(o.method, o.url, o.async, o.username, o.password);
            } else {
                o.xhr.open(o.method, o.url, o.async);
            }
        } catch (e) {
            o.onError(-2, e);
            return false;
        }
        if (o.method == "POST") {
            o.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        if (!o.cache) {
            o.xhr.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
            o.xhr.setRequestHeader("Cache-Control", "no-cache");
        }
        o.beforeSend(o.xhr);
        if (o.async && o.timeout > 0) {
            if (o.xhr.timeout === undefined) {
                timeoutTimer = setTimeout(function() {
                    if (o.xhr && callback) {
                        callback(0, 1);
                    }
                    o.onError(0, null, "timeout");
                }, o.timeout);
            } else {
                o.xhr.timeout = o.timeout;
                o.xhr.ontimeout = function() {
                    if (o.xhr && callback) {
                        callback(0, 1);
                    }
                    o.onError(0, null, "timeout");
                };
            }
        }
        o.xhr.send(o.method == "POST" ? o.data : null);
        callback = function(e, isAbort) {
            if (timeoutTimer) {
                clearTimeout(timeoutTimer);
                timeoutTimer = undefined;
            }
            if (callback && (isAbort || o.xhr.readyState === 4)) {
                callback = undefined;
                if (xhrCallbackHandle) {
                    o.xhr.onreadystatechange = $empty();
                    if (fXHRAbortOnUnload) {
                        try {
                            delete oXHRCallbacks[xhrCallbackHandle];
                        } catch (e) {}
                    }
                }
                if (isAbort) {
                    if (o.xhr.readyState !== 4) {
                        o.xhr.abort();
                    }
                } else {
                    var status, statusText, responses;
                    responses = {
                        headers: o.xhr.getAllResponseHeaders()
                    };
                    status = o.xhr.status;
                    try {
                        statusText = o.xhr.statusText;
                    } catch (e) {
                        statusText = "";
                    }
                    try {
                        responses.text = o.xhr.responseText;
                    } catch (e) {
                        responses.text = "";
                    }
                    if (!status && o.isLocal) {
                        status = responses.text ? 200 : 404;
                    } else if (status === 1223) {
                        status = 204;
                    }
                    if (status >= 200 && status < 300) {
                        responses.text = responses.text.replace(/<!--\[if !IE\]>[\w\|]+<!\[endif\]-->/g, "");
                        switch (o.type) {
                          case "text":
                            o.onSuccess(responses.text);
                            break;

                          case "json":
                            var json;
                            try {
                                json = new Function("return (" + responses.text + ")")();
                            } catch (e) {
                                o.onError(status, e, responses.text);
                            }
                            if (json) {
                                o.onSuccess(json);
                            }
                            break;

                          case "xml":
                            o.onSuccess(o.xhr.responseXML);
                            break;
                        }
                    } else {
                        if (status === 0 && o.timeout > 0) {
                            o.onError(status, null, "timeout");
                        } else {
                            o.onError(status, null, statusText);
                        }
                    }
                    o.onComplete(status, statusText, responses);
                }
                delete o.xhr;
            }
        };
        if (!o.async) {
            callback();
        } else if (o.xhr.readyState === 4) {
            setTimeout(callback, 0);
        } else {
            xhrCallbackHandle = ++xhrCounter;
            if (fXHRAbortOnUnload) {
                if (!oXHRCallbacks) {
                    oXHRCallbacks = {};
                    if (window.attachEvent) {
                        window.attachEvent("onunload", fXHRAbortOnUnload);
                    } else {
                        window["onunload"] = fXHRAbortOnUnload;
                    }
                }
                oXHRCallbacks[xhrCallbackHandle] = callback;
            }
            o.xhr.onreadystatechange = callback;
        }
    };
}(window, undefined);

var $base64 = function() {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function _utf8_encode(string) {
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128);
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128);
            }
        }
        return utftext;
    }
    function _utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                i += 3;
            }
        }
        return string;
    }
    return {
        encode: function(str) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            str = _utf8_encode(str);
            while (i < str.length) {
                chr1 = str.charCodeAt(i++);
                chr2 = str.charCodeAt(i++);
                chr3 = str.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        },
        decode: function(str) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < str.length) {
                enc1 = _keyStr.indexOf(str.charAt(i++));
                enc2 = _keyStr.indexOf(str.charAt(i++));
                enc3 = _keyStr.indexOf(str.charAt(i++));
                enc4 = _keyStr.indexOf(str.charAt(i++));
                chr1 = enc1 << 2 | enc2 >> 4;
                chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                chr3 = (enc3 & 3) << 6 | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        }
    };
}();

function $empty() {
    return function() {
        return true;
    };
}

function $getCookie(name) {
    var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
    return val ? val[2] ? unescape(val[2]) : "" : null;
}

function $getToken(skey) {
    var skey = skey ? skey : $getCookie("skey");
    return skey ? $time33(skey) : "";
}

function $isLoginFromQrcode() {
    var login_from = $getCookie("login_from");
    var is_login = $getCookie("is_login");
    var is_to_launch = $getCookie("is_to_launch");
    if (is_login == 1 && login_from == 1 && is_to_launch == 1) {
        return true;
    }
    return false;
}

function $makeUrl(data) {
    var arr = [];
    for (var k in data) {
        arr.push(k + "=" + data[k]);
    }
    return arr.join("&");
}

function $namespace(name) {
    for (var arr = name.split(","), r = 0, len = arr.length; r < len; r++) {
        for (var i = 0, k, name = arr[r].split("."), parent = {}; k = name[i]; i++) {
            i === 0 ? eval("(typeof " + k + ')==="undefined"?(' + k + '={}):"";parent=' + k) : parent = parent[k] = parent[k] || {};
        }
    }
}

function $phpurlencode(clearString) {
    var output = "";
    var x = 0;
    clearString = utf16to8(clearString.toString());
    var regex = /(^[a-zA-Z0-9-_.]*)/;
    while (x < clearString.length) {
        var match = regex.exec(clearString.substr(x));
        if (match != null && match.length > 1 && match[1] != "") {
            output += match[1];
            x += match[1].length;
        } else {
            if (clearString.substr(x, 1) == " ") output += "+"; else {
                var charCode = clearString.charCodeAt(x);
                var hexVal = charCode.toString(16);
                output += "%" + (hexVal.length < 2 ? "0" : "") + hexVal.toUpperCase();
            }
            x++;
        }
    }
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 1 && c <= 127) {
                out += str.charAt(i);
            } else if (c > 2047) {
                out += String.fromCharCode(224 | c >> 12 & 15);
                out += String.fromCharCode(128 | c >> 6 & 63);
                out += String.fromCharCode(128 | c >> 0 & 63);
            } else {
                out += String.fromCharCode(192 | c >> 6 & 31);
                out += String.fromCharCode(128 | c >> 0 & 63);
            }
        }
        return out;
    }
    return output;
}

function $time33(str) {
    for (var i = 0, len = str.length, hash = 5381; i < len; ++i) {
        hash += (hash << 5) + str.charAt(i).charCodeAt();
    }
    return hash & 2147483647;
}

function $xhrMaker() {
    var xhr;
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                xhr = null;
            }
        }
    }
    return xhr;
}

$namespace("MCH");

MCH.tenpayCertZH = function() {
    var is_first_instance = false;
    if (typeof MCH.wxpayTenpayCert != "undefined") {
        MCH.mmpayCert.cubeReport("multi_instance", -1, "MCH.tenpayCertZH");
    } else {
        is_first_instance = true;
        MCH.wxpayTenpayCert = this;
    }
    this.certHtml = '<div id="certObjContainer"style="overflow:hidden;width:0px;height:0px"></div>';
    this.certObj = null;
    this.statusEnum = {
        ok: 0,
        uninstall: 1,
        needUpdateExplore: 2,
        unknown: 3,
        unsuport: 4,
        noCert: 5,
        uninstallCert: 6,
        getCertFail: 7
    };
    this.pluginStatus = this.statusEnum.getCertFail;
    this.certId = "0";
    this.errmsg = "";
    this.ctrlInitFinished = false;
    this.certListener = [];
    this.is_upgraded = null;
    this.is_in_pin_whitelist = null;
    this.remote_cert_list = null;
    this.sessionId = parseInt(Math.random() * 1e9) + "@" + parseInt(new Date().getTime() / 1e3);
    if (is_first_instance) {
        this.createCert();
    }
};

MCH.tenpayCertZH.Init = function() {
    if ($getCookie("is_login") != 1) {
        return;
    }
    var pages = [ "/index.php/partner/public/home", "/partner/public/home", "/index.php/core/home/login", "/core/home/login" ];
    var current_page_path = window.location.pathname;
    for (var index = 0; index < pages.length; index++) {
        if (pages[index] == current_page_path) {
            return;
        }
    }
    var begin_time_ms = Math.round(new Date() / 1);
    var interval_id = setInterval(function() {
        if (typeof MCH.wxpayTenpayCert != "undefined") {
            if (interval_id != 0) {
                clearInterval(interval_id);
                interval_id = 0;
            }
            return;
        }
        if (typeof jQuery == "function") {
            if (interval_id != 0) {
                clearInterval(interval_id);
                interval_id = 0;
            }
            new MCH.tenpayCertZH();
            return;
        } else {
            var current_time_ms = Math.round(new Date() / 1);
            if (current_time_ms - begin_time_ms >= 3e3) {
                clearInterval(interval_id);
                interval_id = 0;
                MCH.tenpayCertZH.cubeReport("undefined", -1, "jQuery.final");
            }
        }
    }, 300);
    if (typeof jQuery != "function") {
        MCH.tenpayCertZH.cubeReport("undefined", -1, "jQuery.initial");
    }
};

MCH.tenpayCertZH.prototype.addCertListener = function(mmpayCertObj) {
    if (this.ctrlInitFinished == true) {
        setTimeout(function() {
            try {
                this.certListener[this.certListener.length] = mmpayCertObj;
            } catch (e) {}
            mmpayCertObj.onCertCallBack();
        }, 1);
    } else {
        this.certListener[this.certListener.length] = mmpayCertObj;
    }
};

MCH.tenpayCertZH.cubeReport = function(event, retcode, retmsg) {
    try {
        if (typeof MCH.tenpayCertZH.comp_identifier === "undefined") {
            MCH.tenpayCertZH.comp_identifier = document.scripts[document.scripts.length - 1].src;
        }
        var item = {
            biz_id: 975,
            time: Math.round(new Date() / 1e3)
        };
        item["comp_identifier"] = MCH.tenpayCertZH.comp_identifier;
        item["event"] = event;
        item["retcode"] = retcode;
        item["retmsg"] = retmsg;
        item["refer_url"] = document.location.pathname;
        item["mch_id"] = $getCookie("merchant_id");
        var report_items = [ item ];
        var image = new Image();
        image.src = "https://cube.weixinbridge.com/cube/report/reportbizdata?f=json&report_items=" + JSON.stringify(report_items);
    } catch (e) {}
};

MCH.tenpayCertZH.getCsrfTokenName = function() {
    var token_name = $("#token").attr("name");
    if (typeof token_name != "string" || token_name.length == 0) {
        return "ecc_csrf_token";
    }
    return token_name;
};

MCH.tenpayCertZH.getCsrfTokenValue = function() {
    var token_value = $("#token").val();
    if (typeof token_value != "string" || token_value.length == 0) {
        return $getCookie("ecc_csrf_cookie");
    }
    return token_value;
};

MCH.tenpayCertZH.prototype.ignoreCert = function() {
    if (this.certId != "0") {
        return false;
    }
    if (this.isUpgraded()) {
        return true;
    }
    return this.isInPinWhiteList();
};

MCH.tenpayCertZH.prototype.querySecFactorStatus = function() {
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    var post_data = token_name + "=" + hash;
    var is_upgraded = 0;
    var is_in_pin_whitelist = 0;
    $ajax({
        url: "/index.php/core/risk_ctrl/query_sec_factor_status",
        data: post_data,
        method: "get",
        type: "json",
        async: false,
        onSuccess: function(data) {
            if (data.errorcode == 0) {
                is_upgraded = data.data.is_upgraded;
                is_in_pin_whitelist = data.data.is_in_pin_whitelist;
            }
        },
        onError: function(msg) {}
    });
    this.is_upgraded = is_upgraded == 1;
    this.is_in_pin_whitelist = is_in_pin_whitelist == 1;
    if (this.is_upgraded) {
        if ($isLoginFromQrcode()) {
            this.commonOssAttrIncAPI(119722, 30);
        } else {
            this.commonOssAttrIncAPI(119722, 32);
        }
    } else {
        if ($isLoginFromQrcode()) {
            this.commonOssAttrIncAPI(119722, 31);
        }
        this.commonOssAttrIncAPI(119722, 33);
        if (this.is_in_pin_whitelist) {
            this.commonOssAttrIncAPI(119722, 34);
        } else {
            this.commonOssAttrIncAPI(119722, 35);
        }
    }
};

MCH.tenpayCertZH.prototype.isUpgraded = function() {
    if (this.is_upgraded === null) {
        this.querySecFactorStatus();
    }
    return this.is_upgraded;
};

MCH.tenpayCertZH.prototype.isInPinWhiteList = function() {
    if (this.isUpgraded()) {
        if (!$isLoginFromQrcode()) {
            return true;
        }
    }
    return this.is_in_pin_whitelist;
};

MCH.tenpayCertZH.prototype.webReport = function(operation, step) {
    var full_operation = "MCH.tenpaycertZH." + operation;
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    var post_data = token_name + "=" + hash + "&operation=" + full_operation + "&step=" + step + "&session_id=" + this.sessionId;
    $ajax({
        url: "/index.php/core/cert/report_web_operation",
        data: post_data,
        method: "post",
        type: "json",
        async: true,
        onSuccess: function(data) {},
        onError: function(msg) {}
    });
};

MCH.tenpayCertZH.prototype.commonOssAttrIncAPI = function(id, key) {
    try {
        Common.ossAttrIncAPI(id, key);
    } catch (e) {}
};

MCH.tenpayCertZH.prototype.ossAttrIncAPI = function(id, key) {
    var postData = "id=" + id + "&key=" + key;
    $ajax({
        url: "/webreport/ossattrapi",
        data: postData,
        method: "post",
        type: "json",
        async: true,
        onSuccess: function(data) {},
        onError: function(msg) {}
    });
};

MCH.tenpayCertZH.prototype.createCert = function() {
    if (!this.isUpgraded()) {
        this.commonOssAttrIncAPI(119722, 14);
        if (!document.getElementById("certObjContainer")) {
            if (document.body) {
                var ctDiv = document.createElement("div");
                ctDiv.id = "certObjContainer";
                ctDiv.style.cssText = "overflow:hidden;width:0px;height:0px";
                document.body.appendChild(ctDiv);
            } else {
                document.write(this.certHTML);
            }
        }
        this.certObj = new TENPAYCTL.QQCertCtrl();
        var para = {
            div_id: "certObjContainer",
            version: "1206"
        };
        this.certObj.create(para, this.createHandler, this);
        var that = this;
        var toFn = function() {
            if (that.pluginStatus == that.statusEnum.getCertFail) {
                that.createHandler(-1);
            }
        };
        setTimeout(toFn, 5e3);
    } else {
        this.webReport("createCert", "0");
        this.commonOssAttrIncAPI(119722, 15);
        setTimeout(function() {
            MCH.wxpayTenpayCert.tenpayCertZHCallback();
        }, 1);
    }
};

MCH.tenpayCertZH.prototype.createHandler = function(ret) {
    switch (ret) {
      case 0:
        this.errmsg = "";
        this.pluginStatus = this.statusEnum.ok;
        this.ossAttrIncAPI(63769, 0);
        break;

      case 10101:
        this.errmsg = "不支持当前系统的该浏览器环境";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 1);
        break;

      case 10102:
        this.errmsg = "当前浏览器版本太旧，需要升级浏览器";
        this.pluginStatus = this.statusEnum.needUpdateExplore;
        this.ossAttrIncAPI(63769, 2);
        break;

      case 10103:
        this.errmsg = "当前浏览器版本太新，财付通还未支持";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 3);
        break;

      case 30101:
        this.errmsg = "缺少创建参数";
        this.pluginStatus = this.statusEnum.unknown;
        this.ossAttrIncAPI(63769, 4);
        break;

      case 30102:
        this.errmsg = "";
        this.pluginStatus = this.statusEnum.ok;
        this.ossAttrIncAPI(63769, 5);
        break;

      case 30103:
        this.errmsg = "不支持当前系统和浏览器环境";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 6);
        break;

      case 30104:
        this.errmsg = "未安装安全控件";
        this.pluginStatus = this.statusEnum.uninstall;
        this.ossAttrIncAPI(63769, 7);
        break;

      case 30105:
        this.errmsg = "控件版本太旧，需强制升级";
        this.pluginStatus = this.statusEnum.uninstall;
        this.ossAttrIncAPI(63769, 8);
        break;

      case 30106:
        this.errmsg = "该场景版本太旧，需强制升级";
        this.pluginStatus = this.statusEnum.uninstall;
        this.ossAttrIncAPI(63769, 9);
        break;

      case 30107:
        this.errmsg = "有更新的控件版本，可提示升级";
        this.pluginStatus = this.statusEnum.ok;
        this.ossAttrIncAPI(63769, 10);
        break;

      case 20109:
        this.errmsg = "当前浏览器已禁用natvie client";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 11);
        break;

      case 1e3:
        this.errmsg = "用户未允许使用存储空间";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 12);
        break;

      case 1001:
        this.errmsg = "请求存储空间失败";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 13);
        break;

      case 1002:
        this.errmsg = "请求存储空间成功，控件暂未创建";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 14);
        break;

      case 1003:
        this.errmsg = "创建控件失败";
        this.pluginStatus = this.statusEnum.unsuport;
        this.ossAttrIncAPI(63769, 15);
        break;

      default:
        this.errmsg = "未知异常";
        this.pluginStatus = this.statusEnum.unknown;
        this.ossAttrIncAPI(63769, 16);
    }
    this.tenpayCertZHCallback();
};

MCH.tenpayCertZH.prototype.tenpayCertZHCallback = function() {
    if (this.ctrlInitFinished === true) {
        return;
    }
    this.ctrlInitFinished = true;
    if (this.pluginStatus == this.statusEnum.ok && this.certObj != null) {
        this.checkCert();
    }
    try {
        for (var i = 0; i < this.certListener.length; i++) {
            this.certListener[i].onCertCallBack();
        }
    } catch (e) {}
};

MCH.tenpayCertZH.prototype.checkCert = function() {
    if (this.isUpgraded()) {
        return true;
    }
    if (this.pluginStatus != this.statusEnum.ok || this.certObj == null) {
        return this.isInPinWhiteList();
    }
    var certList = this.getCertList();
    if (certList.code != 0) {
        this.certId = "0";
        this.errmsg = "[" + certList.code + "]检查操作证书失败";
    } else if (certList.data.length <= 0) {
        this.certId = "0";
        this.errmsg = "未安装安全证书";
    } else {
        for (var i = 0; i < certList.data.length; i++) {
            if (this.certObj.isCertExist(certList.data[i] + "") == 1) {
                this.certId = certList.data[i] + "";
                var res = "";
                try {
                    res = this.certObj.certSign(this.certId, $base64.encode("0123456789abcdef"));
                } catch (e) {}
                if (res != "") {
                    this.errmsg = "";
                    return true;
                } else {
                    this.certId = "0";
                    this.errmsg = "未安装安全证书";
                    return this.isInPinWhiteList();
                }
            }
        }
        this.certId = "0";
        this.errmsg = "未安装安全证书";
    }
    return this.isInPinWhiteList();
};

MCH.tenpayCertZH.prototype.isCertExist = function(certId) {
    if (this.ignoreCert()) {
        return true;
    }
    return this.certObj.isCertExist(certId);
};

MCH.tenpayCertZH.prototype.isPluginInstalled = function() {
    if (this.pluginStatus == this.statusEnum.ok) {
        return true;
    } else {
        return false;
    }
};

MCH.tenpayCertZH.prototype.isCertInstalled = function() {
    if (this.certId != "0") {
        return true;
    } else {
        if (this.ignoreCert()) {
            return true;
        }
        return this.checkCert();
    }
};

MCH.tenpayCertZH.prototype.getCSR = function() {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 1);
        return $isLoginFromQrcode() ? "isLoginFromQrcode" : "isDeprecatePwdCtrl";
    }
    this.certObj.setChallenge("floatman", "1008");
    var subject = "C=CN, L=shenzhen, O=tencent, OU=wxg, CN=MCHUSER, SN=" + $getCookie("employee_id");
    this.certObj.setSubject(subject);
    return this.certObj.base64Encode(this.certObj.getCSR());
};

MCH.tenpayCertZH.prototype.importCert = function(cert_info) {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 2);
        return true;
    }
    this.remote_cert_list = null;
    if (this.certObj.importCert(cert_info) == 1) {
        return true;
    } else {
        return false;
    }
};

MCH.tenpayCertZH.prototype.getCertId = function() {
    return this.certId;
};

MCH.tenpayCertZH.prototype.getErrMsg = function() {
    return this.errmsg;
};

MCH.tenpayCertZH.prototype.delCert = function() {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 3);
        return true;
    }
    this.remote_cert_list = null;
    if (this.certObj.delCert(this.certId) == 1) {
        return true;
    }
    return false;
};

MCH.tenpayCertZH.prototype.certSign = function(postMap) {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 4);
    } else {
        this.commonOssAttrIncAPI(119722, 5);
    }
    if (this.certId == "0") {
        if (this.ignoreCert()) {
            return $isLoginFromQrcode() ? "isLoginFromQrcode" : "isDeprecatePwdCtrl";
        }
        this.showNoInsCertDialog();
        return false;
    }
    var post_arr = [];
    for (var key in postMap) {
        if ("[object Array]" == Object.prototype.toString.call(postMap[key])) {
            post_arr.push(postMap[key].join(","));
        } else {
            post_arr.push(postMap[key]);
        }
    }
    post_arr.sort();
    var message = $base64.encode($base64.encode(post_arr.join("|")));
    return this.certObj.certSign(this.certId, message);
};

MCH.tenpayCertZH.prototype.certMapEncodeSign = function(postMap) {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 6);
    } else {
        this.commonOssAttrIncAPI(119722, 7);
    }
    if (this.certId == "0") {
        if (this.ignoreCert()) {
            return $isLoginFromQrcode() ? "isLoginFromQrcode" : "isDeprecatePwdCtrl";
        }
        this.showNoInsCertDialog();
        return false;
    }
    var post_arr = [];
    for (var key in postMap) {
        if ("[object Array]" == Object.prototype.toString.call(postMap[key])) {
            post_arr.push(key.toString() + "=" + $phpurlencode(postMap[key].join(",")));
        } else {
            post_arr.push(key.toString() + "=" + $phpurlencode(postMap[key]));
        }
    }
    post_arr.sort();
    var message = $base64.encode($base64.encode(post_arr.join("&")));
    return this.certObj.certSign(this.certId, message);
};

MCH.tenpayCertZH.prototype.depositSign = function(postMap) {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 8);
        return $isLoginFromQrcode() ? "isLoginFromQrcode" : "isDeprecatePwdCtrl";
    } else {
        this.commonOssAttrIncAPI(119722, 9);
    }
    if (this.certId == "0") {
        this.showNoInsCertDialog();
        return false;
    }
    var post_arr = [];
    for (var key in postMap) {
        if ("[object Array]" == Object.prototype.toString.call(postMap[key])) {
            post_arr.push(key + "=" + postMap[key].join(","));
        } else {
            post_arr.push(key + "=" + postMap[key]);
        }
    }
    post_arr.sort();
    var message = $base64.encode($base64.encode(post_arr.join("&")));
    return this.certObj.certSign(this.certId, message);
};

MCH.tenpayCertZH.prototype.certSignForString = function(source) {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 8);
        return $isLoginFromQrcode() ? "isLoginFromQrcode" : "isDeprecatePwdCtrl";
    } else {
        this.commonOssAttrIncAPI(119722, 9);
    }
    if (this.certId == "0") {
        this.showNoInsCertDialog();
        return false;
    }
    return this.certObj.certSign(this.certId, source);
};

MCH.tenpayCertZH.prototype.certSignForURLEncode = function(postMap) {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 10);
        return "";
    } else {
        this.commonOssAttrIncAPI(119722, 11);
    }
    var post_arr = [];
    for (var key in postMap) {
        if ("[object Array]" == Object.prototype.toString.call(postMap[key])) {
            var value = encodeURIComponent(postMap[key].join(","));
            post_arr.push(value);
        } else {
            var value = encodeURIComponent(postMap[key]);
            post_arr.push(value);
        }
    }
    post_arr.sort();
    var message = $base64.encode($base64.encode(post_arr.join("|")));
    return this.certObj.certSign(this.certId, message);
};

MCH.tenpayCertZH.prototype.base64Encode = function(msg) {
    if (this.ignoreCert()) {
        this.commonOssAttrIncAPI(119722, 0);
        var result = $base64.encode(msg);
        this.webReport("base64Encode", "0");
        return result;
    }
    return $base64.encode(msg);
};

MCH.tenpayCertZH.prototype.showNoInsCertDialog = function() {
    var tpl_model = '<div class="dialog-hd"><h4>温馨提示</h4><a class="ico-cls cls_ins_cert_button close-dialog" href="javascript:;">关闭</a></div>' + '<div class="dialog-bd"><div class="page-msg align-center"><div class="inner"><div class="msg-ico"><i class="ico-msg warn"></i></div>' + '<div class="msg-cnt"><h4>你没有安装证书，无权进行该操作</h4><p>点击确定前往安装证书页面</p></div></div></div></div>' + '<div class="dialog-ft"><a class="btn btn-primary cls_ins_cert_button close-dialog" href="javascript:;" id="cf_ins_cert_button">确定</a></div>';
    if (!document.getElementById("no_ins_cert_dialog")) {
        if (document.body) {
            var ctDiv = document.createElement("div");
            ctDiv.id = "no_ins_cert_dialog";
            ctDiv.className = "dialog hide";
            ctDiv.style.cssText = "margin-top:-200px";
            ctDiv.innerHTML = tpl_model;
            document.body.appendChild(ctDiv);
        } else {
            document.write('<div class="dialog hide" style="margin-top:-200px;" id="no_ins_cert_dialog">' + this.certHTML + "</div>");
        }
        $("#cf_ins_cert_button").on("click", function() {
            $("#no_ins_cert_dialog").addClass("hide");
            MCH.header.floatMask.hide();
            window.open("/index.php/core/cert");
        });
        $(".cls_ins_cert_button").on("click", function() {
            $("#no_ins_cert_dialog").addClass("hide");
            MCH.header.floatMask.hide();
        });
    }
    $("#no_ins_cert_dialog").removeClass("hide");
    MCH.header.floatMask.show();
};

MCH.tenpayCertZH.prototype.getCertList = function() {
    if (this.remote_cert_list != null) {
        return this.remote_cert_list;
    }
    var ret = {
        code: 0,
        data: []
    };
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    var post_data = token_name + "=" + hash;
    $ajax({
        url: "/index.php/core/cert/get_cert_list",
        data: post_data,
        method: "post",
        type: "json",
        async: false,
        onSuccess: function(data) {
            MCH.header.handleAjax(data);
            if (data.errorcode == 0) {
                ret.data = data.data;
            } else {
                ret.code = data.errorcode;
            }
        },
        onError: function(msg) {
            ret.code = -1;
        }
    });
    this.remote_cert_list = ret;
    return this.remote_cert_list;
};

MCH.tenpayCertZH.prototype.getCertListInfo = function(page) {
    var ret = {
        code: 0,
        data: {}
    };
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    var post_data = token_name + "=" + hash + "&curpage=" + page;
    $ajax({
        url: "/index.php/core/cert/get_cert_list_info",
        data: post_data,
        method: "post",
        type: "json",
        async: false,
        onSuccess: function(data) {
            MCH.header.handleAjax(data);
            if (data.errorcode == 0) {
                ret.data = data.data;
            } else {
                ret.code = -1;
            }
        },
        onError: function(msg) {
            ret.code = -1;
        }
    });
    return ret;
};

MCH.tenpayCertZH.prototype.getSelfCertListInfo = function(page) {
    var ret = {
        code: 0,
        data: {}
    };
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    var post_data = token_name + "=" + hash + "&curpage=" + page;
    $ajax({
        url: "/index.php/core/cert/get_self_cert_list_info",
        data: post_data,
        method: "post",
        type: "json",
        async: false,
        onSuccess: function(data) {
            MCH.header.handleAjax(data);
            if (data.errorcode == 0) {
                ret.data = data.data;
            } else {
                ret.code = -1;
            }
        },
        onError: function(msg) {
            ret.code = -1;
        }
    });
    return ret;
};

MCH.tenpayCertZH.prototype.getOtherCertListInfo = function(page) {
    var ret = {
        code: 0,
        data: {}
    };
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    var post_data = token_name + "=" + hash + "&curpage=" + page;
    $ajax({
        url: "/index.php/core/cert/get_other_cert_list_info",
        data: post_data,
        method: "post",
        type: "json",
        async: false,
        onSuccess: function(data) {
            MCH.header.handleAjax(data);
            if (data.errorcode == 0) {
                ret.data = data.data;
            } else {
                ret.code = -1;
            }
        },
        onError: function(msg) {
            ret.code = -1;
        }
    });
    return ret;
};

MCH.tenpayCertZH.prototype.getSearchCertListInfo = function(username) {
    var ret = {
        code: 0,
        data: {}
    };
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    var post_data = token_name + "=" + hash + "&username=" + username;
    $ajax({
        url: "/index.php/core/cert/get_search_cert_list_info",
        data: post_data,
        method: "post",
        type: "json",
        async: false,
        onSuccess: function(data) {
            MCH.header.handleAjax(data);
            if (data.errorcode == 0) {
                ret.data = data.data;
            } else {
                ret.code = -1;
                ret.msg = data.msg;
            }
        },
        onError: function(msg) {
            ret.code = -1;
            ret.msg = data.msg;
        }
    });
    return ret;
};

MCH.tenpayCertZH.prototype.showError = function(errmsg) {
    alert(errmsg);
};

MCH.tenpayCertZH.prototype.send_phone_msg = function(type, errCB) {
    var token_name = MCH.tenpayCertZH.getCsrfTokenName();
    var hash = MCH.tenpayCertZH.getCsrfTokenValue();
    !errCB && (errCB = alert);
    if (hash == "") {
        token_name = $("#CsrfInput").attr("name");
        hash = $("#CsrfInput").val();
    }
    var post_data = token_name + "=" + hash + "&option=" + type;
    var ret = false;
    $ajax({
        url: "/index.php/core/cert/send_phone_msg",
        data: post_data,
        method: "post",
        type: "json",
        async: false,
        onSuccess: function(data) {
            if (data.errorcode == 0) {
                ret = true;
            } else {
                errCB("短信发送失败:" + data.msg);
            }
        },
        onError: function(msg) {
            errCB("短信发送发生错误");
        }
    });
    return ret;
};

MCH.tenpayCertZH.cubeReport("page_load", 0, "");

MCH.tenpayCertZH.Init();/*  |xGv00|7b91aa98e7104d3e2359db213b13e1ff */