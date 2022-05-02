/**KF登录插件**/
"use script";
(function ($, undefined) {
    /**
     *  登录插件
     */
    (function (pluginName) {
        var defaults = {
            qqappid:      "", //qq appid
            wxappid:      "", //微信appid
            qqUrl:      "", //跳转url
            wxUrl:    "", //跳转url
            tips_txt:     "", //小标题
            loginType:    "",
            tips_notes:   "", //大标题
            loginCssUrl:  "" ,//微信登录窗口外部扩展样式地址
            needSelectType:false, //是否需要选择账号
            defaultLoginType:'qq', //0微信，1qq
        };
        $.fn[pluginName] = function (targetid,opts) {
            opts = $.extend(true, {}, defaults, opts);
            var $container = $(this);

            /**初始化 */
            init();


            function init(){
                $container.empty();
                var needSelectType = opts.needSelectType && opts.qqappid && opts.wxappid ? true : false;
                var htmlLogin = ''
                var html = '<div class="login-mask"></div>';
                    html += '<div class="login-dialog">';
                        // html += '<i class="login-font icon-close"></i>';
                    
                if(needSelectType){
                    var selectHtml = typeSelectHtml();
                    html += selectHtml;
                    
                }
                htmlLogin = initHtml();
                html += htmlLogin;
                html += '</div>';
                $container.append(html);

                //默认按钮触发点击打开登录窗口（如果不传需要外部自行写代码打开登录窗口）
                if(typeof(targetid) === 'string'){
                    $(targetid).unbind('click').bind('click', function () {
                        // $container.show();
                        show(needSelectType);
                    });
                }else if(typeof(targetid) === 'object'){
                    for(var i in targetid){
                        $(targetid[i]).unbind('click').bind('click', function () {
                            show(needSelectType)
                            // $container.show();
                        });
                    }
                }

                $container.find('.btn_close').unbind('click').bind('click', function () {
                    // $container.hide();
                    closeDialog();
                });

                initTabs(opts.qqappid,opts.wxappid);
                wxInit(opts.wxappid,opts.wxUrl);
                if(needSelectType){
                    initSelectType();
                }
            }

            function initSelectType(){
                $container.off('click','.m-select-login-box .login-type').on('click','.m-select-login-box .login-type',function(){
                    var type = $(this).data('type');
                    $('.m-select-login-box').hide();
                    showLoginDialog(type);
                });

            }

            function show(needSelectType){
                if(needSelectType){
                    $container.find(".m-login-box").hide();
                    $container.find('.m-select-login-box').show();
                    $container.show();
                }
                else{
                    showLoginDialog();
                }
                
            }

            /**
             * 显示登录窗口
             */
            function showLoginDialog(loginType){
                $container.show();
                $container.find(".m-login-box").show();
                if(loginType){
                    $container.find('.m-login-box .tab-item[data-type="'+loginType+'"]').addClass('current').siblings().removeClass('current');
                    $container.find('.cont_inner_'+loginType+'').addClass('cont_inner_in').siblings().removeClass('cont_inner_in');
                }
                if(loginType == "qq" && opts.qqappid && $("#_login_frame_quick_").attr('src') == 'about:blank'){
                    qqInit(opts.qqappid,opts.qqUrl);
                }else if(opts.wxappid && $("#_login_frame_wechat_").attr('src') == 'about:blank'){
                    wxInit(opts.wxappid,opts.wxUrl);
                }
            }
            /**
             * 初始化导航菜单
             * @param string qqappid
             * @param string wxappid
             */
            function initTabs(qqappid,wxappid){
                if(qqappid && wxappid){
                    $container.find('.m-login-box .login-tab .tab-item').unbind('click').bind('click', function () {
                        var dataType = $(this).attr('data-type');
                        $(this).addClass('current').siblings().removeClass('current');
                        $container.find('.cont_inner_' + dataType).addClass('cont_inner_in').siblings().removeClass('cont_inner_in');
                        if(dataType == 'qq' && $("#_login_frame_quick_").attr('src') == 'about:blank'){
                            qqInit(opts.qqappid,opts.qqUrl);
                        }else if(dataType == 'weixin' && $("#_login_frame_wechat_").attr('src') == 'about:blank'){
                            wxInit(opts.wxappid,opts.wxUrl);
                        }
                    });
                }
            }

            /** QQ登录相关方法 **/
            /**
             * qq登录插件初始化
             */
            function qqInit(appid,goToUrl){
                if(!appid){
                    return;
                };
                goToUrl = encodeURIComponent(goToUrl);
                // url += "xui.ptlogin2.qq.com/cgi-bin/xlogin?link_target=blank&hide_border=1&style=40&hide_close_icon=1&appid="+appid+"&s_url="+goToUrl;
                // var url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + appid + '&redirect_uri='+encodeURIComponent('https://kf.qq.com/cgi-bin/qqConnectLogin?jumpurl=' + goToUrl);
                var url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + appid + '&redirect_uri='+encodeURIComponent('https://kf.qq.com/cgi-bin/qqConnectLogin');
                $("#_login_frame_quick_").attr('src',url);
                if(window.addEventListener){
                    window.addEventListener('message',handleQQLogin)
                }
                else if(window.attachEvent){
                    window.attachEvent('onmessage',handleQQLogin)
                }
            }

            function handleQQLogin(event){
                var e = event || window.event; // 兼容IE8
                var data = e.data;
                var origin = e.origin
                if(data=="qqConnect"){
                    if(origin == 'https://kf.qq.com'){
                        location.reload()
                        if(window.removeEventListener){
                            window.removeEventListener('message',handleQQLogin)
                        }
                        else if(window.detachEvent){
                            window.detachEvent('onmessage',handleQQLogin)
                        }
                    }
                    // $container.hide();
                    closeDialog()
                }
            }

            function closeDialog(){
                $container.hide();
                $container.find('#_login_frame_quick_').attr('src',"about:blank")
                $container.find('#_login_frame_wechat_').attr('src',"about:blank")
            }

            /** 微信登录相关方法 **/
            /**
             * 微信登录插件初始化
             */
            function wxInit(appid,goToUrl){
                if(!appid){
                    return;
                }
                var url = 'https://';
                var randNum = Math.random();
                //修改iframe样式
                var cssUrl = "";
                if(opts.loginCssUrl){
                    cssUrl = encodeURIComponent(opts.loginCssUrl);
                }else{
                    cssUrl = encodeURIComponent('https://110.qq.com/ext/login/css/iframe_login_wx.css');
                }
                goToUrl = encodeURIComponent(goToUrl);
                url += "open.weixin.qq.com/connect/qrconnect?self_redirect=false&appid="+appid+"&redirect_uri="+goToUrl+"&response_type=code&scope=snsapi_login&state="+randNum+"&href="+cssUrl;
                $("#_login_frame_wechat_").attr('src',url);
            }

            /**
             * 登录页面代码
             */

            function initHtml(){
                var oneLoginTypeStyle = "width:100%;";
                var currentTab = opts.wxappid && opts.qqappid ? opts.defaultLoginType : opts.wxappid ? "weixin" : "qq";
                var html = '<div class="m-login m-login-box" style="display:none">';
                    html += '<i class="btn_close login-font icon-login__close"></i>'
                        html += '<div class="login-tab">';
                            if(opts.wxappid){
                                html += '<div style="' + (opts.wxappid && !opts.qqappid ? oneLoginTypeStyle : '')  + '"  class="tab-item weixin" data-type="weixin" data-kftag="login.tab_wx" ><i class="login-font icon-login__weixin"></i>微信账号登录</div>';
                            }
                            if(opts.qqappid){
                                html += '<div style="' + (opts.qqappid && !opts.wxappid ? oneLoginTypeStyle : '')  + '" class="tab-item qq current" data-type="qq" data-kftag="login.tab_qq"><i class="login-font icon-login__qq"></i>QQ账号登录</div>';
                            }
                        html += '</div>'
                        if(opts.tips_txt || opts.tips_notes){
                            html += '<div class="login-tips" style="line-height:1.4">';
                                if(opts.tips_txt) {html += '<div class="tips-text">' + opts.tips_txt + '</div>';}
                                if(opts.tips_notes) {html += '<div class="tips-note">'+ opts.tips_notes +'</div>'}
                            html += '</div>'
                        }
                            html += '<div class="login-cont" style="overflow:hidden;">'
                                html += ' <div class="cont_inner cont_inner_qq ' + (currentTab == 'qq' ? 'cont_inner_in' : '') + '" style="height:382px;">';
                                    html += '<div class="login_iframe login_iframe_qq" id="login_div" style="margin-left: 0 !important;">';
                                        html += '<iframe name="_login_frame_quick_" id="_login_frame_quick_" frameborder="no" scrolling="no" style="width:690px; height:382px;margin-top: -50px;margin-left: -25px;" src="about:blank"></iframe>';
                                    html += '</div>';
                                html += '</div>';
                                html += '<div class="cont_inner cont_inner_weixin ' + (currentTab == 'weixin' ? 'cont_inner_in' : '') + '">';
                                    html += '<label class="iframe_title">安全登录，防止被盗</label>'
                                    html += '<div class="login_iframe login_iframe_weixin">';
                                        html += '<iframe name="_login_frame_wechat_" id="_login_frame_wechat_" frameborder="no" scrolling="no" style="width:100%; height:215px;" src="about:blank"></iframe>';
                                    html += '</div>';
                                html += '</div>';
                            html += '</div>';
                    html += '</div>'
                return html;
            }

            /** 选择账号类型 */
            function typeSelectHtml(){
                var html = '';
                html += '<div class="m-login m-select-login-box" style="display:none">';
                    html += '<i class="btn_close login-font icon-login__close"></i>'
                    html += '<div class="login-tab">';
                        html += '<div class="tab-item">选择登录帐号类型</div>';
                    html += '</div>';
                    html += '<div class="login-style">';
                        html += '<div class="login-item">请以使用产品时遇到问题的帐号进行登录。</div>';
                        html += '<div class="login-fail">若帐号无法登录，可<a data-kftag="login.cannot_login" target="_blank" href="https://kf.qq.com/product/zhzh.html">点击这里</a></div>'
                        html += '<div class="login-choice">'
                            html += '<div class="style-item label-item login-type" data-type="weixin"  data-kftag="login.select_wx">';
                                html += '<img class="app-pic" data-type="weixin" src="../img/wechat.png" />';
                                html += '<div class="label">微信</div>';
                            html += '</div>';
                            html += '<div class="style-item label-item login-type" data-type="qq" data-kftag="login.select_qq">';
                                html += '<img class="app-pic" data-type="qq" src="../img/qq.png" />';
                                html += '<div class="label">QQ</div>';
                            html += '</div>';
                        html += '</div>';
                    html += '</div>'
                html += '</div>';
                return html;
            }

           
                              
        };
    })('login');
})(jQuery);
