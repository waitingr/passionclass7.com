window["MCH.tenpaycertV2.time"] && window["MCH.tenpaycertV2.time"].push(new Date());

$namespace("MCH");

MCH.mmpayCert = function(initOpt, handlerOpt, context) {
    if (typeof MCH.mmpayCertObjV2 != "undefined") {
        MCH.mmpayCert.cubeReport("multi_instance", -1, "MCH.mmpayCert");
    }
    MCH.mmpayCertObjV2 = this;
    if (typeof MCH.wxpayTenpayCert == "undefined") {
        new MCH.tenpayCertZH();
    }
    this.context = context ? context : null;
    this.certId = "0";
    this.errmsg = "";
    this.certHandlerOpt = {
        succeedCallBack: null,
        failedCallBack: null,
        returnCallBack: null
    };
    this.certInitOpt = {
        certInit: true
    };
    for (var i in handlerOpt) {
        this.certHandlerOpt[i] = handlerOpt[i];
    }
    for (var i in initOpt) {
        this.certInitOpt[i] = initOpt[i];
    }
    MCH.wxpayTenpayCert.addCertListener(this);
};

MCH.mmpayCert.cubeReport = function(event, retcode, retmsg) {
    try {
        if (typeof MCH.mmpayCert.comp_identifier === "undefined") {
            MCH.mmpayCert.comp_identifier = document.scripts[document.scripts.length - 1].src;
        }
        var item = {
            biz_id: 975,
            time: Math.round(new Date() / 1e3)
        };
        item["comp_identifier"] = MCH.mmpayCert.comp_identifier;
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

MCH.mmpayCert.getCsrfTokenName = function() {
    return MCH.tenpayCertZH.getCsrfTokenName();
};

MCH.mmpayCert.getCsrfTokenValue = function() {
    return MCH.tenpayCertZH.getCsrfTokenValue();
};

MCH.mmpayCert.prototype.ignoreCert = function() {
    var ret = MCH.wxpayTenpayCert.ignoreCert();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.copyCertData = function() {
    this.certId = MCH.wxpayTenpayCert.getCertId();
    this.errmsg = MCH.wxpayTenpayCert.getErrMsg();
};

MCH.mmpayCert.prototype.onCertCallBack = function() {
    this.copyCertData();
    if (MCH.wxpayTenpayCert.isCertInstalled()) {
        if (typeof this.certHandlerOpt.succeedCallBack == "function") {
            this.certHandlerOpt.succeedCallBack.call(this.context, this);
        }
        if (typeof this.certHandlerOpt.returnCallBack == "function") {
            this.certHandlerOpt.returnCallBack.call(this.context, this);
        }
    } else {
        if (typeof this.certHandlerOpt.failedCallBack == "function") {
            this.certHandlerOpt.failedCallBack.call(this.context, this);
        }
        if (typeof this.certHandlerOpt.returnCallBack == "function") {
            this.certHandlerOpt.returnCallBack.call(this.context, this);
        }
    }
};

MCH.mmpayCert.prototype.isUpgraded = function() {
    return MCH.wxpayTenpayCert.isUpgraded();
};

MCH.mmpayCert.prototype.isInPinWhiteList = function() {
    return MCH.wxpayTenpayCert.isInPinWhiteList();
};

MCH.mmpayCert.prototype.webReport = function(operation, step) {
    return MCH.wxpayTenpayCert.webReport(operation, step);
};

MCH.mmpayCert.prototype.commonOssAttrIncAPI = function(id, key) {
    return MCH.wxpayTenpayCert.commonOssAttrIncAPI(id, key);
};

MCH.mmpayCert.prototype.ossAttrIncAPI = function(id, key) {
    return MCH.wxpayTenpayCert.ossAttrIncAPI(id, key);
};

MCH.mmpayCert.prototype.checkCert = function() {
    var ret = MCH.wxpayTenpayCert.checkCert();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.isCertExist = function(certId) {
    var ret = MCH.wxpayTenpayCert.isCertExist(certId);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.isPluginInstalled = function() {
    var ret = MCH.wxpayTenpayCert.isPluginInstalled();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.isCertInstalled = function() {
    var ret = MCH.wxpayTenpayCert.isCertInstalled();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.getCSR = function() {
    var ret = MCH.wxpayTenpayCert.getCSR();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.importCert = function(cert_info) {
    var ret = MCH.wxpayTenpayCert.importCert(cert_info);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.getCertId = function() {
    return MCH.wxpayTenpayCert.getCertId();
};

MCH.mmpayCert.prototype.delCert = function() {
    var ret = MCH.wxpayTenpayCert.delCert();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.certSign = function(postMap) {
    var ret = MCH.wxpayTenpayCert.certSign(postMap);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.certMapEncodeSign = function(postMap) {
    var ret = MCH.wxpayTenpayCert.certMapEncodeSign(postMap);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.depositSign = function(postMap) {
    var ret = MCH.wxpayTenpayCert.depositSign(postMap);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.certSignForString = function(source) {
    var ret = MCH.wxpayTenpayCert.certSignForString(source);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.certSignForURLEncode = function(postMap) {
    var ret = MCH.wxpayTenpayCert.certSignForURLEncode(postMap);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.base64Encode = function(msg) {
    var ret = MCH.wxpayTenpayCert.base64Encode(msg);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.showNoInsCertDialog = function() {
    var ret = MCH.wxpayTenpayCert.showNoInsCertDialog();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.getCertList = function() {
    var ret = MCH.wxpayTenpayCert.getCertList();
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.getCertListInfo = function(page) {
    var ret = MCH.wxpayTenpayCert.getCertListInfo(page);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.getSelfCertListInfo = function(page) {
    var ret = MCH.wxpayTenpayCert.getSelfCertListInfo(page);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.getOtherCertListInfo = function(page) {
    var ret = MCH.wxpayTenpayCert.getOtherCertListInfo(page);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.getSearchCertListInfo = function(username) {
    var ret = MCH.wxpayTenpayCert.getSelfCertListInfo(username);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.showError = function(errmsg) {
    var ret = MCH.wxpayTenpayCert.showError(errmsg);
    this.copyCertData();
    return ret;
};

MCH.mmpayCert.prototype.send_phone_msg = function(type, errCB) {
    var ret = MCH.wxpayTenpayCert.send_phone_msg(type, errCB);
    this.copyCertData();
    return ret;
};

MCH.mmpayEdit = function(paramsOpt, handlerOpt, context) {
    this.editObj = null;
    this.errmsg = "";
    this.created = false;
    this.pwd = null;
    this.shapwd = null;
    this.isShow = false;
    this.refreshInt = false;
    this.context = context ? context : null;
    this.noLoginCtrl = null;
    this.ctrlInitFinished = false;
    var objId = "mmpayPwdEdit";
    var isShowFuncDefault = function() {
        if ($getCookie("login_id_type") == "1") {
            return true;
        } else {
            return false;
        }
    };
    if (paramsOpt && paramsOpt.hasOwnProperty("bindObjId")) {
        objId = paramsOpt.bindObjId;
    }
    this.paraOpt = {
        bindObjId: objId,
        pwdEditObjId: objId + "EditObjID",
        pwdEditContrId: objId + "ContainerID",
        pwdEditPaContrId: objId + "PaContainerID",
        pwdEditName: objId + "_editName",
        pwdErrMsgId: "",
        width: 298,
        height: 30,
        autoRefresh: true
    };
    var failedCallBack = function() {
        var pwdEditContrIdName = "#" + this.paraOpt.pwdEditContrId;
        $(pwdEditContrIdName).innerHTML = '<input type="password" name="passwordrsa" placeholder="登录密码" id="idPasswordrsa">';
    };
    this.funcOpt = {
        isShowFunc: isShowFuncDefault,
        focusCallBack: null,
        blurCallBack: null,
        enterCallBack: null,
        succeedCallBack: null,
        failedCallBack: null,
        returnCallBack: null
    };
    for (var i in paramsOpt) {
        this.paraOpt[i] = paramsOpt[i];
    }
    var bindObjIdName = "#" + this.paraOpt.bindObjId;
    var pwdEditContrIdName = "#" + this.paraOpt.pwdEditContrId;
    var pwdEditPaContrIdName = "#" + this.paraOpt.pwdEditPaContrId;
    var pwdOriginObj = $(bindObjIdName);
    var pwdOriginObjInput = $(bindObjIdName).find("input");
    var pwdOriginObjErr = "";
    if (this.paraOpt.pwdErrMsgId == "") {
        pwdOriginObjErr = pwdOriginObj.parent().find(".tips-error");
    } else {
        var pwdErrMsgIdName = "#" + this.paraOpt.pwdErrMsgId;
        pwdOriginObjErr = $(pwdErrMsgIdName);
    }
    var pwdEditContrObj = $(pwdEditContrIdName);
    var pwdEditPaContrObj = $(pwdEditPaContrIdName);
    for (var i in handlerOpt) {
        this.funcOpt[i] = handlerOpt[i];
    }
    var ctrlCheck = new TENPAYCTL.CheckIsWork();
    ctrlCheck.stop();
    this.isShow = this.funcOpt.isShowFunc();
    this.initHtml();
    this.paraOpt.autoRefresh && this.refreshSeedIntv();
};

MCH.mmpayEdit.prototype.md5 = function md5() {
    var hexcase = 0;
    var b64pad = "";
    var chrsz = 8;
    var option = {};
    option.hexcase = hexcase;
    option.b64pad = b64pad;
    option.chrsz = chrsz;
    option.hex_md5 = hex_md5;
    option.binl2hex = binl2hex;
    option.core_md5 = core_md5;
    return option;
    function hex_md5(s) {
        return binl2hex(core_md5(str2binl(s), s.length * option.chrsz));
    }
    function binl2hex(binarray) {
        var hex_tab = option.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 15);
        }
        return str;
    }
    function core_md5(x, len) {
        x[len >> 5] |= 128 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    }
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn(b & c | ~b & d, a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn(b & d | c & ~d, a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
    }
    function safe_add(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 65535;
    }
    function bit_rol(num, cnt) {
        return num << cnt | num >>> 32 - cnt;
    }
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << option.chrsz) - 1;
        for (var i = 0; i < str.length * option.chrsz; i += option.chrsz) bin[i >> 5] |= (str.charCodeAt(i / option.chrsz) & mask) << i % 32;
        return bin;
    }
};

MCH.mmpayEdit.strToHex = function(s) {
    var hex, i;
    var result = "";
    for (i = 0; i < s.length; i++) {
        hex = s.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-2);
    }
    return result;
};

MCH.mmpayEdit.hexToStr = function(hex) {
    var arr = hex.split("");
    var out = "";
    for (var i = 0; i < arr.length / 2; i++) {
        var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1];
        var charValue = String.fromCharCode(tmp);
        out += charValue;
    }
    return out;
};

MCH.mmpayEdit.prototype.realRsaEncPassword = function(passwd) {
    this.rsaPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4XQ5k0NNdEgNhvWtvbf3\nPbIP5QbqxWO5GmRFqNQsqOP6xNmeAsDL+1JH9H9lqb6rPGZwwSbr6f4VU8alVeNU\nyWst12tRW3oCXJKzeEOiEEgldo6hFteXdS4zk9+EAmCZ1LLvSbe6m+Ro9jq0LVMp\nzxyPgMMsl7+xWVH83ObT/FDIKa0GbaQBfdjfjmybRskB+joUxWPQpw3Fi6ko7WEC\nuVIy1Aa5WXDTgCXo8tgowOIMFzjq3cc9T1QVsNTymyBKK1Hd4TWoh9yMBoGY181l\nIG9r+cKxg75JUgmMtlUU1DosXCJTqKwsjdlZpt6yLUocp3Zlza2RDS+A00wwmqi1\nYwIDAQAB\n-----END PUBLIC KEY-----";
    this.rsaEncryptObj = new JSEncrypt();
    this.rsaEncryptObj.setPublicKey(this.rsaPublicKey);
    this.encPasswd = this.rsaEncryptObj.encrypt(passwd);
    return MCH.mmpayEdit.strToHex(this.encPasswd);
};

MCH.mmpayEdit.prototype.rsaEncPassword = function(passwd) {
    if (typeof MCH.mmpayEdit.encMap == "undefined") {
        MCH.mmpayEdit.encMap = {};
    }
    var currentTimestmap = Math.round(new Date() / 1e3);
    if (typeof MCH.mmpayEdit.encMap[passwd] != "undefined") {
        var encResult = MCH.mmpayEdit.encMap[passwd].hexEncVal;
        var encTimestamp = MCH.mmpayEdit.encMap[passwd].encTimestamp;
        if (currentTimestmap - encTimestamp < 5) {
            MCH.mmpayEdit.encMap[passwd].encTimestamp = currentTimestmap;
            return encResult;
        }
    }
    var passwdTimestamp = currentTimestmap;
    if (MCH.mmpayEdit.serverTimestamp && MCH.mmpayEdit.serverTimestamp > 1577938413) {
        passwdTimestamp = MCH.mmpayEdit.serverTimestamp;
    }
    var encSource = passwd + passwdTimestamp;
    var encResult = this.realRsaEncPassword(encSource);
    MCH.mmpayEdit.encMap[passwd] = {
        hexEncVal: encResult,
        encTimestamp: currentTimestmap
    };
    return encResult;
};

MCH.mmpayEdit.prototype.isHitNoLoginCtrl = function() {
    if (this.noLoginCtrl === null) {
        this.noLoginCtrl = $getCookie("no_pwd_ctrl") == 1;
    }
    return this.noLoginCtrl;
};

MCH.mmpayEdit.prototype.initUpdateTimestampTimer = function() {
    if (!MCH.mmpayEdit.updateTimestampInit) {
        MCH.mmpayEdit.asyncUpdateTimestamp();
        MCH.mmpayEdit.updateTimestampInit = setInterval(MCH.mmpayEdit.asyncUpdateTimestamp, 3e5);
    }
};

MCH.mmpayEdit.getTimeSeed = function() {
    var time_seed = $("input[name=time_seed]").val().substring(0, 20);
    if (time_seed.length == 0) {
        if (typeof MCH.mmpayEdit.serverTimestamp != "undefined") {
            return MCH.mmpayEdit.strToHex(MCH.mmpayEdit.serverTimestamp);
        }
    }
    return time_seed;
};

MCH.mmpayEdit.asyncUpdateTimestamp = function() {
    var post_data = MCH.mmpayCert.getCsrfTokenName() + "=" + MCH.mmpayCert.getCsrfTokenValue();
    $ajax({
        url: "/index.php/public/commoncgi/update_time_seed",
        data: post_data,
        method: "get",
        type: "json",
        async: true,
        onSuccess: function(data) {
            if (data.errorcode != 0) {
                errmsg = data.msg;
            } else {
                ret = data.data;
                if (ret.hasOwnProperty("time_seed")) {
                    MCH.mmpayEdit.serverTimestamp = MCH.mmpayEdit.hexToStr(ret.time_seed);
                }
            }
        },
        onError: function() {}
    });
};

MCH.mmpayEdit.prototype.getCurrentMchCode = function() {
    if ($getCookie("is_login") == "1") {
        return $getCookie("merchant_code");
    } else {
        return $("#idUserName").val();
    }
};

MCH.mmpayEdit.prototype.asyncQueryLoginCtrlConfig = function() {
    var login_pages = [ "/index.php/partner/public/home", "/partner/public/home", "/index.php/core/home/login", "/core/home/login" ];
    var is_login_page = false;
    var current_page_path = window.location.pathname;
    for (var index = 0; index < login_pages.length; index++) {
        if (login_pages[index] == current_page_path) {
            is_login_page = true;
            break;
        }
    }
    if (is_login_page === false) {
        return;
    }
    var mchcode = this.getCurrentMchCode();
    if (MCH.mmpayEdit.lastCheckNoLoginCtrlMchCode == mchcode) {
        return;
    }
    MCH.mmpayEdit.lastCheckNoLoginCtrlMchCode = mchcode;
    MCH.mmpayEdit.isInGrayList = null;
    var thatEdit = this;
    var post_data = MCH.mmpayCert.getCsrfTokenName() + "=" + MCH.mmpayCert.getCsrfTokenValue() + "&mchcode=" + mchcode;
    $ajax({
        url: "/index.php/public/tenpay_cert/isInNoCtrlGrayList",
        data: post_data,
        method: "post",
        type: "json",
        async: true,
        onSuccess: function(data) {
            MCH.mmpayEdit.isInGrayList = data.errorcode === 1;
            thatEdit.updateNoCtrlLoginState();
        },
        onError: function(msg) {}
    });
};

MCH.mmpayEdit.prototype.setNoCtrlLoginCookieState = function(no_ctrl_login) {
    var cookie_value = no_ctrl_login == true ? 1 : 0;
    document.cookie = "no_pwd_ctrl=" + cookie_value + ";path=/" + ";expires=" + new Date("2025-01-01").toGMTString();
};

MCH.mmpayEdit.prototype.updateNoCtrlLoginState = function() {
    if (MCH.mmpayEdit.isInGrayList === false) {
        this.setNoCtrlLoginCookieState(false);
    } else if (MCH.mmpayEdit.isInGrayList === true) {
        if (this.created === false && this.ctrlInitFinished === true) {
            this.setNoCtrlLoginCookieState(true);
        }
    }
};

MCH.mmpayEdit.prototype.initHtml = function() {
    if (!document.getElementById(this.paraOpt.bindObjId)) {
        this.errmsg = "不存在该对象，请检查入参是否正确";
        return false;
    }
    var bindObjIdName = "#" + this.paraOpt.bindObjId;
    var pwdEditContrIdName = "#" + this.paraOpt.pwdEditContrId;
    var pwdEditPaContrIdName = "#" + this.paraOpt.pwdEditPaContrId;
    var pwdOriginObj = $(bindObjIdName);
    var pwdEditContrObj = $(pwdEditContrIdName);
    var pwdEditPaContrObj = $(pwdEditPaContrIdName);
    var objTagName = document.getElementById(this.paraOpt.bindObjId).tagName;
    if (this.isShow) {
        this.asyncQueryLoginCtrlConfig();
        this.initUpdateTimestampTimer();
        if (this.isHitNoLoginCtrl()) {} else {
            var version = 0;
            try {
                version = this.editObj.ctrl.Version.toString();
                if (version && version > 1206) {} else {
                    version = -1e3;
                }
            } catch (e) {
                version = -1e3;
            }
            if (this.created === false || this.editObj == null || version <= 1206) {
                if (objTagName == "DIV") {
                    var className = document.getElementById(this.paraOpt.bindObjId).className;
                    if (!document.getElementById(this.paraOpt.pwdEditPaContrId)) {
                        pwdOriginObj.after('<div class="' + className + ' hide" id="' + this.paraOpt.pwdEditPaContrId + '">' + pwdOriginObj.html() + "</div>");
                    }
                    pwdEditPaContrObj = $(pwdEditPaContrIdName);
                    pwdEditPaContrObj.find("input").after('<span id="' + this.paraOpt.pwdEditContrId + '"></span>').remove();
                    pwdOriginObj.addClass("hide");
                    pwdEditPaContrObj.removeClass("hide");
                    this.create();
                } else if (objTagName == "SPAN") {
                    if (!document.getElementById(this.paraOpt.pwdEditContrId)) {
                        pwdOriginObj.after('<span class="ipt-box ctrl hide" id="' + this.paraOpt.pwdEditContrId + '"></span>');
                    }
                    pwdEditContrObj = $(pwdEditContrIdName);
                    pwdOriginObj.addClass("hide");
                    pwdEditContrObj.removeClass("hide");
                    this.create();
                } else {}
            }
        }
    } else {
        if (objTagName == "DIV") {
            if (document.getElementById(this.paraOpt.pwdEditPaContrId)) {
                pwdEditPaContrObj = $(pwdEditPaContrIdName);
                pwdEditPaContrObj.addClass("hide");
            }
            pwdOriginObj.removeClass("hide");
        } else if (objTagName == "SPAN") {
            if (document.getElementById(this.paraOpt.pwdEditContrId)) {
                pwdEditContrObj = $(pwdEditContrIdName);
                pwdEditContrObj.addClass("hide");
            }
            pwdOriginObj.removeClass("hide");
        } else {}
    }
    if (!document.getElementById("seed")) {
        if (document.body) {
            var tsDiv = document.createElement("input");
            tsDiv.name = "time_seed";
            tsDiv.type = "hidden";
            tsDiv.id = "seed";
            document.body.appendChild(tsDiv);
        } else {
            document.write('<input id="seed" type="hidden" name="time_seed" value="">');
        }
        this.refreshFunc();
    }
};

MCH.mmpayEdit.prototype.create = function() {
    if (this.editObj == null) {
        this.editObj = new TENPAYCTL.QQEditCtrl();
    }
    var path = this.editObj.getExeDownloadPath();
    var unInstall = '<a class="btn btn-default" href="' + path + '">请点击下载并安装安全控件</a>';
    var para = {
        parentNode: this.paraOpt.pwdEditContrId,
        ctrlId: this.paraOpt.pwdEditObjId,
        w: this.paraOpt.width,
        h: this.paraOpt.height,
        version: "1206",
        showLost: false,
        tabIndex: 2,
        submitName: this.paraOpt.pwdEditName,
        unSetupContent: unInstall,
        focus_callback: this.paraOpt.focusCallBack,
        blur_callback: this.paraOpt.blurCallBack,
        enter_callback: this.paraOpt.enterCallBack
    };
    this.editObj.create(para, this.createHandler, this);
};

MCH.mmpayEdit.prototype.ossAttrIncAPI = function(id, key) {
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

MCH.mmpayEdit.prototype.createHandler = function(ret) {
    switch (ret) {
      case 0:
        this.errmsg = "";
        this.created = true;
        this.ossAttrIncAPI(63769, 0);
        break;

      case 10101:
        this.errmsg = "不支持当前系统的该浏览器环境";
        this.created = false;
        this.ossAttrIncAPI(63769, 1);
        break;

      case 10102:
        this.errmsg = "当前浏览器版本太旧，需要升级浏览器";
        this.created = false;
        this.ossAttrIncAPI(63769, 2);
        break;

      case 10103:
        this.errmsg = "当前浏览器版本太新，财付通还未支持";
        this.created = false;
        this.ossAttrIncAPI(63769, 3);
        break;

      case 20101:
        this.errmsg = "缺少创建参数";
        this.created = false;
        this.ossAttrIncAPI(63769, 4);
        break;

      case 20102:
        this.errmsg = "不支持当前系统和浏览器环境";
        this.created = false;
        this.ossAttrIncAPI(63769, 6);
        break;

      case 20103:
        this.errmsg = "未安装安全控件";
        this.created = false;
        this.ossAttrIncAPI(63769, 7);
        break;

      case 20104:
        this.errmsg = "控件版本太旧，需强制升级";
        this.created = false;
        this.ossAttrIncAPI(63769, 8);
        break;

      case 20105:
        this.errmsg = "该场景版本太旧，需强制升级";
        this.created = false;
        this.ossAttrIncAPI(63769, 9);
        break;

      case 20106:
        this.errmsg = "有更新的控件版本，可提示升级";
        this.created = false;
        this.ossAttrIncAPI(63769, 10);
        break;

      case 20109:
        this.errmsg = "当前浏览器已禁用natvie client";
        this.created = false;
        this.ossAttrIncAPI(63769, 11);
        break;

      case 1e3:
        this.errmsg = "用户未允许使用存储空间";
        this.created = false;
        this.ossAttrIncAPI(63769, 12);
        break;

      case 1001:
        this.errmsg = "请求存储空间失败";
        this.created = false;
        this.ossAttrIncAPI(63769, 13);
        break;

      case 1002:
        this.errmsg = "请求存储空间成功，控件暂未创建";
        this.created = false;
        this.ossAttrIncAPI(63769, 14);
        break;

      case 1003:
        this.errmsg = "创建控件失败";
        this.created = false;
        this.ossAttrIncAPI(63769, 15);
        break;

      default:
        this.errmsg = "创建密码控件未知异常";
        this.created = false;
        this.ossAttrIncAPI(63769, 16);
    }
    this.ctrlInitFinished = true;
    this.updateNoCtrlLoginState();
    this.tenpayeditCallBack();
};

MCH.mmpayEdit.prototype.showErr = function() {
    var msg = arguments[0] ? arguments[0] : this.errmsg;
    var bindObjIdName = "#" + this.paraOpt.bindObjId;
    var pwdOriginObj = $(bindObjIdName);
    var pwdOriginObjErr = "";
    if (this.paraOpt.pwdErrMsgId == "") {
        pwdOriginObjErr = pwdOriginObj.parent().find(".tips-error");
    } else {
        var pwdErrMsgIdName = "#" + this.paraOpt.pwdErrMsgId;
        pwdOriginObjErr = $(pwdErrMsgIdName);
    }
    if (pwdOriginObjErr instanceof jQuery) {
        if (msg == "") {
            pwdOriginObjErr.text("").addClass("hide");
        } else {
            pwdOriginObjErr.text(msg).removeClass("hide");
        }
        return true;
    } else {
        return false;
    }
};

MCH.mmpayEdit.prototype.show = function() {
    this.isShow = this.funcOpt.isShowFunc();
    this.initHtml();
    if (this.editObj !== null && this.isShow) {
        this.editObj.setEditFocus();
    }
    this.clearText();
};

MCH.mmpayEdit.prototype.isCreated = function() {
    if (!this.created || this.editObj == "") {
        return false;
    } else {
        return true;
    }
};

MCH.mmpayEdit.prototype.getPlainPwd = function() {
    var bindObjIdName = "#" + this.paraOpt.bindObjId;
    var pwdOriginObjInput = $(bindObjIdName).find("input");
    return pwdOriginObjInput.val();
};

MCH.mmpayEdit.prototype.getPwd = function() {
    this.isShow = this.funcOpt.isShowFunc();
    this.errmsg = "";
    this.showErr();
    this.pwd = "";
    this.shapwd = "";
    var bindObjIdName = "#" + this.paraOpt.bindObjId;
    var pwdOriginObjInput = $(bindObjIdName).find("input");
    if (this.isShow) {
        if (this.isHitNoLoginCtrl()) {
            var password = pwdOriginObjInput.val();
            if (!password || password === "") {
                this.errmsg = "请输入密码";
                this.showErr();
                return false;
            } else if (password.length >= 6 && password.length <= 20) {
                var password_md5 = this.md5().hex_md5(password);
                var enc_password = "@" + this.rsaEncPassword(password_md5);
                this.pwd = enc_password;
                this.shapwd = enc_password;
                return enc_password;
            } else {
                this.errmsg = "请输入正确格式的密码";
                this.showErr();
                return false;
            }
        } else {
            var time_seed = MCH.mmpayEdit.getTimeSeed();
            this.editObj.setSalt(time_seed);
            var pwd_info = this.editObj.getInputInfo();
            var pwd_len = pwd_info >> 16 & 65535;
            if (pwd_len == 0) {
                this.errmsg = "请输入密码";
                this.showErr();
                return false;
            } else if (pwd_len >= 6 && pwd_len <= 20) {
                var password = this.editObj.getRsaPassword2();
                var sha1pwd = this.editObj.getSha1Value();
                this.pwd = time_seed + password;
                this.shapwd = sha1pwd;
                return this.pwd;
            } else {
                this.errmsg = "请输入正确格式的密码";
                this.showErr();
                return false;
            }
        }
    } else {
        var password = "";
        password = pwdOriginObjInput.val();
        if (!password || password == "") {
            this.errmsg = "请输入密码";
            this.showErr();
            return false;
        } else if (password.length >= 6 && password.length <= 20) {
            this.pwd = password;
            this.shapwd = password;
            return password;
        } else {
            this.errmsg = "请输入正确格式的密码";
            this.showErr();
            return false;
        }
    }
};

MCH.mmpayEdit.prototype.refreshFunc = function() {
    var post_data = MCH.mmpayCert.getCsrfTokenName() + "=" + MCH.mmpayCert.getCsrfTokenValue();
    $ajax({
        url: "/index.php/public/commoncgi/update_time_seed",
        data: post_data,
        method: "post",
        type: "json",
        async: true,
        onSuccess: function(data) {
            if (data.errorcode != 0) {
                errmsg = data.msg;
            } else {
                ret = data.data;
                if (ret.hasOwnProperty("time_seed")) {
                    $("input[name=time_seed]").val(ret.time_seed);
                }
            }
        },
        onError: function(msg) {}
    });
};

MCH.mmpayEdit.prototype.refreshSeedIntv = function() {
    if (!this.refreshInt) {
        this.refreshInt = setInterval(this.refreshFunc, 3e5);
    }
};

MCH.mmpayEdit.prototype.setEditFocus = function() {
    if (!this.isCreated()) {
        return false;
    }
    this.editObj.setEditFocus();
};

MCH.mmpayEdit.prototype.clearText = function() {
    var bindObjIdName = "#" + this.paraOpt.bindObjId;
    var pwdOriginObjInput = $(bindObjIdName).find("input");
    if (!this.isCreated()) {
        return false;
    }
    if (this.isShow && this.editObj !== null && this.editObj.hasOwnProperty("clearText")) {
        this.editObj.clearText();
    }
    pwdOriginObjInput.val("");
};

MCH.mmpayEdit.prototype.tenpayeditCallBack = function() {
    this.isShow = this.funcOpt.isShowFunc();
    if (this.isShow && (this.created === false || this.editObj == null)) {
        try {
            var version = this.editObj.ctrl.Version.toString();
            if (version && version > 1206) {
                typeof this.funcOpt.succeedCallBack == "function" && this.funcOpt.succeedCallBack.call(this.context, this);
                typeof this.funcOpt.returnCallBack == "function" && this.funcOpt.returnCallBack.call(this.context, this);
                return true;
            }
        } catch (e) {}
        if (this.funcOpt.failedCallBack === null) {
            var path = this.editObj.getExeDownloadPath();
            var unInstall = '<a class="btn btn-default" href="' + path + '">请点击下载并安装安全控件</a>';
            var pwdEditContrIdName = "#" + this.paraOpt.pwdEditContrId;
            $(pwdEditContrIdName).html(unInstall);
            typeof this.funcOpt.returnCallBack == "function" && this.funcOpt.returnCallBack.call(this.context, this);
        } else {
            typeof this.funcOpt.failedCallBack == "function" && this.funcOpt.failedCallBack.call(this.context, this);
            typeof this.funcOpt.returnCallBack == "function" && this.funcOpt.returnCallBack.call(this.context, this);
        }
    } else {
        typeof this.funcOpt.succeedCallBack == "function" && this.funcOpt.succeedCallBack.call(this.context, this);
        typeof this.funcOpt.returnCallBack == "function" && this.funcOpt.returnCallBack.call(this.context, this);
    }
};

MCH.mmpayCert.cubeReport("page_load", 0, "");

window["MCH.tenpaycertV2"] = "22410:20200302:20200302231845";

window["MCH.tenpaycertV2.time"] && window["MCH.tenpaycertV2.time"].push(new Date());/*  |xGv00|e19817806759d2c0e8584a40f59ff526 */