/* eslint-disable */
(function(root, factory) {
  if (typeof define === 'function') {
    define('@tencent/wxg-report', factory);
  } else {
    root.WX_BJ_REPORT = factory();
  }
}(window, function() {
  var WX_BJ_REPORT = window.WX_BJ_REPORT || {};
  /**
   * 页面方法加try catch
   * @authors yinshen 
   * @date    2018-10-15 11:40:20
   **/
  (function(_) {
    if (_.TryJs) {
      return;
    }
    var root = window;
    //  页面单例对象
    _.TryJs = {
      isCatchTimeout: false, //标志位 防止重复try
      isCatchJquery: false,
      isCatchCmd: false,
      isTryed: false,
      // 异常捕获接口，默认只是console.log
      _onThrow: function(e) {
        if (e.stack && console && console.error) {
          console.error(e.stack);
        }
      }
    };

    // function or not
    function _isFunction(foo) {
      return typeof foo === 'function';
    };

    // 捕获方法
    var cat = function(foo, args) {
      return function() {
        try {
          return foo.apply(this, args || arguments);
        } catch (error) {
          _.TryJs._onThrow(error);
        }
      };
    };

    function catArgs(foo) {
      return function() {
        var arg, args = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
          arg = arguments[i];
          _isFunction(arg) && (arg = cat(arg));
          args.push(arg);
        }
        return foo.apply(this, args);
      };
    };

    var catFactory = function(foo, id) {
      return function() {
        try {
          return foo.apply(this, arguments);
        } catch (error) {
          _.TryJs._onThrow(error, {
            cid: id
          });
        }
      };
    }

    /**
     * 包裹方法参数 并将包裹后的方法挂在原方法的tryWrap属性上 event.remove时用到
     * makeArgsTry
     * wrap a function's arguments with try & catch
     * @param {Function} foo
     * @param {Object} self
     * @returns {Function}
     */
    function makeArgsTry(foo, self) {
      return function() {
        var arg, tmp, args = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
          arg = arguments[i];
          // 将try过的arg方法放到tryWrap，在remove时移除tryWrap
          _isFunction(arg) && (tmp = cat(arg)) &&
            (arg.tryWrap = tmp) && (arg = tmp);
          args.push(arg);
        }
        return foo.apply(self || this, args);
      };
    };

    /**
     * makeObjTry
     * wrap a object's all value with try & catch
     * @param {Function} foo
     * @param {Object} self
     * @returns {Function}
     */
    function makeObjTry(obj) {
      var key, value;
      for (key in obj) {
        value = obj[key];
        if (_isFunction(value)) obj[key] = cat(value);
      }
      return obj;
    };

    //包裹事件 jquery zepto ajax/dom异步方法
    function catchJquery() {
      if (_.TryJs.isCatchJquery) {
        return _.TryJs;
      }
      var _jQuery = root.jQuery;

      if (!_jQuery || !_jQuery.event) {
        return;
      }

      var _add = _jQuery.event.add,
        _ajax = _jQuery.ajax,
        _remove = _jQuery.event.remove;

      if (_add) {
        _jQuery.event.add = makeArgsTry(_add);
        _jQuery.event.remove = function() {
          var arg, args = [];
          for (var i = 0, l = arguments.length; i < l; i++) {
            arg = arguments[i];
            _isFunction(arg) && (arg = arg.tryWrap);
            args.push(arg);
          }
          return _remove.apply(this, args);
        };
      }

      if (_ajax) {
        _jQuery.ajax = function(url, setting) {
          if (!setting) {
            setting = url;
            url = undefined;
          }
          makeObjTry(setting);
          if (url) return _ajax.call(_jQuery, url, setting);
          return _ajax.call(_jQuery, setting);
        };
      }

      if (jQuery.zepto) {
        var _on = _jQuery.fn.on;
        var _off = _jQuery.fn.off;
        _jQuery.fn.on = makeArgsTry(_on);
        _jQuery.fn.off = function() {
          var arg, args = [];
          for (var i = 0, l = arguments.length; i < l; i++) {
            arg = arguments[i];
            _isFunction(arg) && (arg = arg.tryWrap);
            args.push(arg);
          }
          return _off.apply(this, args);
        };
      }
      _.TryJs.isCatchJquery = true;
      return _.TryJs;
    }

    //异步settimeout包裹
    function _catchTimeout() {
      if (_.TryJs.isCatchTimeout) {
        return _.TryJs;
      }
      var catTimeout = function(foo) {
        return function(cb, timeout) {
          // for setTimeout(string, delay)
          if (typeof cb === 'string') {
            try {
              cb = new Function(cb);
            } catch (err) {
              throw err;
            }
          }
          var args = [].slice.call(arguments, 2);
          // for setTimeout(function, delay, param1, ...)
          cb = cat(cb, args.length && args);
          return foo(cb, timeout);
        };
      };
      root.setTimeout = catTimeout(root.setTimeout);
      root.setInterval = catTimeout(root.setInterval);
      _.TryJs.isCatchTimeout = true;
      return _.TryJs;
    };

    // merge
    function _merge(org, obj) {
      var key;
      for (key in obj) {
        org[key] = obj[key];
      }
      return org;
    };

    //模块包裹
    function catchCmd() {
      if (_.TryJs.isCatchCmd) {
        return _.TryJs;
      }
      var _require = root.require,
        _define = root.define;
      /*if (_define && _define.amd && _require) {
          root.require = catArgs(_require);
          _merge(root.require, _require);
          root.define = catArgs(_define);
          _merge(root.define, _define);
      }*/

      if (root.seajs && _define) {
        root.define = function() {
          var arg, args = [];
          for (var i = 0, l = arguments.length; i < l; i++) {
            arg = arguments[i];
            if (_isFunction(arg)) {
              arg = catFactory(arg, arguments[0]);
              //seajs should use toString parse dependencies , so rewrite it
              arg.toString = (function(orgArg) {
                return function() {
                  return orgArg.toString();
                };
              }(arguments[i]));
            }
            args.push(arg);
          }
          return _define.apply(this, args);
        };

        root.seajs.use = catArgs(root.seajs.use);

        _merge(root.define, _define);
        _.TryJs.isCatchCmd = true;
        //console.log("catchCmd exception")
      }
      return _.TryJs;
    }

    //全部包裹
    function catchAll() {
      catchJquery();
      catchCmd();
      _catchTimeout();
    }

    // 初始化方法，尝试执行全部包裹
    function init(throwCb) {
      throwCb && (_.TryJs._onThrow = throwCb);
      catchAll();
    }

    return _.TryJs = _merge(_.TryJs, {
      init: init, //初始化入口 定义异常处理回调（丢给BadJs）
      catchJquery: catchJquery, //包裹jquery zetpo
      catchCmd: catchCmd, //包裹cmd模块
      run: catchAll //包裹所有
    });
  })(WX_BJ_REPORT);

  /**
   * @authors yinshen 
   * @date    2018-10-15 13:30:26
   BadJs ={
      throw 主动try并抛出error    
      report 上报接口（不抛出错误）
      init 初始化uin mid
      nocache 关闭cache（默认去重）
   }
  */
  (function(_) {
    if (_.BadJs) {
      return;
    }
    //onerror上报名 
    var BADJS_WIN_ERR = 'BadjsWindowError';


    var extend = function (source, destination) {
      source = source || {};
      if (typeof source === 'string') {
        source = { vale: source };
      }
      for (var property in destination) {
        source[property] = destination[property]
      }
      return source
    }

    /*
      出错上报字段:mid name key  msg  stack file col line uin
      mid 模块名
      name 监控名
      key 特征值
      msg 额外信息
    */
    _.BadJs = {
      uin: 0,
      mid: "",
      _cache: {}, //上报_cache 同一mid name key 只会上报一次
      _info: {}, // 打点记录 会写入msg帮助定位
      _hookCallback: null,
      ignorePath: true,
      throw: function(e, extData) {
        this.onError(e, extData);
        throw e;
      },
      //接收异常并上报处理 如果有额外信息可以放在第二个参数_data中
      // _data 只能覆盖上报协议的字段mid （name,key 不建议通过data覆盖） msg  stack file col line uin
      onError: function(e, extData) {
        try {
          //标记已执行的throw
          if (e.BADJS_EXCUTED == true) {
            return;
          }
          e.BADJS_EXCUTED = true;

          var data = errToData(e);
          data.uin = this.uin;
          data.mid = this.mid;
          data.view = this.view;
          //data.msg = msg || data.msg;
          if (!!extData) {
            extData._info=extData.info;// 兼容下info
            data = extend(data, extData);
          }
          //如果cid存在 将cid合并到key
          if (data.cid) {
            data.key = "[" + data.cid + "]:" + data.key;
          }
          data._info=extend(data._info,this._info);
          if (data._info) {
            if (Object.prototype.toString.call(data._info) == "[object Object]") {
              data.msg += " || info:" + JSON.stringify(data._info);
            } else if (Object.prototype.toString.call(data._info) == "[object String]") {
              data.msg += " || info:" + data._info;
            } else {
              data.msg += " || info:" + data._info;
            }
          }
          
          if (typeof this._hookCallback == "function") {
            if (this._hookCallback(data) === false) {
              return
            }
          }
          this._send(data);
          return _.BadJs;
        } catch (e) {
          console.error(e);
        }
      },
      winErr: function(event) {
        if (event.type === 'unhandledrejection') {
          _.BadJs.onError(createError(event.type, event.reason, "", "", "", event.reason));
        } else {
          if (event.error && event.error.BADJS_EXCUTED) {
            return;
          }
          _.BadJs.onError(createError(BADJS_WIN_ERR, event.message, event.filename, event.lineno, event.colno, event.error));
        }
      },
      init: function (uin, mid, view, handlerErorr) {
        this.uin = uin || this.uin;
        this.mid = mid || this.mid;
        this.view = view || this.view;

        if (handlerErorr !== false) {
          //注册throw回调
          _.TryJs.init(function (e, data) {
            _.BadJs.throw.call(_.BadJs, e, data);
          });
          //兜底方法
          window.addEventListener && window.addEventListener('error', _.BadJs.winErr);
          window.addEventListener && window.addEventListener('unhandledrejection', _.BadJs.winErr);
        }
        return _.BadJs;
      },
      //钩子函数
      hook: function(fn) {
        this._hookCallback = fn;
        return _.BadJs;
      },
      _send: function(data) {
        //mid不能为空
        if (!data.mid) {
          return;
        }
        // 发送要去重 
        var flag = [data.mid, data.name, data.key].join("|");
        if (this._cache && this._cache[flag]) {
          return
        } else {
          this._cache && (this._cache[flag] = true);

          this._xhr(data);
        }
        try {
          if(!window.jsError) {
            window.jsError = [] ;
          }
          window.jsError && window.jsError.push(data);
        } catch(e) {
          console.log(e)
        }
        return _.BadJs;
      },
      _xhr: function(data) {
        //console.log(data);
        var xmlobj;
        if (window.ActiveXObject) {
          try {
            xmlobj = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try {
              xmlobj = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
              xmlobj = false;
            }
          }
        } else if (window.XMLHttpRequest) {
          xmlobj = new XMLHttpRequest();
        }
        var param = "";
        for (var key in data) {
          if (key && data[key]) {
            param += [key, "=", encodeURIComponent(data[key]), "&"].join("");
          }
        }
        if (xmlobj && xmlobj.open) {
          xmlobj.open("POST", "https://badjs.weixinbridge.com/report", true);
          xmlobj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
          xmlobj.onreadystatechange = function(status) {};
          xmlobj.send(param.slice(0, -1));
        } else {
          var img = new Image();
          img.src = "https://badjs.weixinbridge.com/report?" + param;
        }
      },
      // key是特征值 默认上报msg就是key，也可以主动传msg包含更多上报信息 
      report: function(name, key, data) {
        this.onError(createError(name, key), data);
        return this;
      },
      // 打点标记
      mark: function(info) {
        this._info = extend(this._info, info);
      },
      nocache: function() {
        this._cache = false;
        return _.BadJs;
      }
    }


    function createError(name, msg, url, line, col, error) {
      return {
        name: name || "",
        message: msg || "",
        file: url || "",
        line: line || "",
        col: col || "",
        stack: (error && error.stack) || "",
      }
    }

    //将异常错误转换成上报协议支持的字段
    /*
     * 先取e对象上的file line col等字段
     * 再解析e.statck
     * name 错误大类 默认取badjs_try_err|badjs_win_err
     * key  错误标识 e.message
     * msg  错误信息 e.message
     * stack 错误堆栈 e.stack
     * file 错误发生的文件
     * line 行
     * col 列
     * client_version
     */
    function errToData(e) {
      e._info = e.info || {}; // 当前错误的额外信息 最终上报到info
      var _stack = parseStack(e);
      return {
        name: e.name,
        key: e.message,
        msg: e.message,
        _info: e._info,
        stack: _stack.info,
        file: _stack.file,
        line: _stack.line,
        col: _stack.col,
        client_version: ""  
      }
    }

    function parseStack(e) {
      var stack = e.stack || "";
      var _stack = {
        info: stack,
        file: e.file || "",
        line: e.line || "",
        col: e.col || "",
      };

      if (_stack.file == "") {
        // 提取file line col
        var stackArr = stack.split(/\bat\b/);
        if (stackArr && stackArr[1]) {
          var match = /(https?:\/\/[^\n]+)\:(\d+)\:(\d+)/.exec(stackArr[1]);
          if (match) {
            //若stack提取的file line col跟e中的属性不一致，以stack为准 但在e._info中记录原始数据
            if (match[1] && match[1] != _stack.file) {
              _stack.file && (e._info.file = _stack.file);
              _stack.file = match[1];
            }
            if (match[2] && match[2] != _stack.line) {
              _stack.line && (e._info.line = _stack.line);
              _stack.line = match[2];
            }
            if (match[3] && match[3] != _stack.col) {
              _stack.col && (e._info.col = _stack.col);
              _stack.col = match[3];
            }
          }
        }
      }

      //替换堆栈中的文件路径 combojs太长
      if (_stack && _stack.file && _stack.file.length > 0) {
        _stack.info = _stack.info.replace(new RegExp(_stack.file.split("?")[0], "gi"), "__FILE__")
      }
      //堆栈路径只保存文件名
      if (_.BadJs.ignorePath) {
        _stack.info = _stack.info.replace(/http(s)?\:[^:\n]*\//ig, "").replace(/\n/gi, "");
      }

      return _stack;
    }

    return _.BadJs;
  })(WX_BJ_REPORT);

  return WX_BJ_REPORT;
}));