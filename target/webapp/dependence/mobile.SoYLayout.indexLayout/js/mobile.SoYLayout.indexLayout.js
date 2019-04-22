( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget",'bscroll'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,scroll) {
        "use strict";

        var
            Tab,Router,
            $AW=window.parent.$AW;


        Tab = function (options) {
            var _default = this._default,
                context = this;



            $.extend(true, context, _default, options);

            context.$ctn = $(context.ctn);

            if (options._style) {
                this.style(options._style);
            }






        };
        Tab.prototype = {
            version: '20180802',
            constructor:Tab,
            _default: {
                ctn: '[data-role=container]',

                count: {},
                stack: [],
                map:{},

                untitled: '未定义',

                cttTemp: '<div id="_domID_" />'
            },

            TYPE: {
                BLANK: 'BLANK',
                SUB: 'SUB',
                SELF: 'SELF',
                WINDOW:'WINDOW',
                POPOVER:'POPOVER'


            },

            open: function (options) {
                var TYPE = this.TYPE,
                    map = this.map,

                    ret = false,
                    title = options.title || this.untitled,
                    id = options.id,

                    domID,
                    href = $.camelCase(options.sections.join('-')),
                    handler,
                    $renderTo;

                if (!this.stack.length && options.type === TYPE.SELF) {
                    options.type = TYPE.BLANK;
                }

                if (!options.type || options.type === TYPE.BLANK) {

                    if(map[id]){
                        domID =map[id];
                        this.switchView(domID,false);
                    }else{
                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 2])) && (handler.type === TYPE.SUB)) {
                            app.alert('系统错误 0x01：子页面下不能打开新页面！', app.alert.ERROR, '0x01');
                        } else {
                            domID = this.getUID(id || href);

                            $renderTo = $(this.cttTemp.replace(/_domID_/, domID));
                            this.$ctn.append($renderTo);

                            map[domID] = domID ;

                            ret = {
                                domID: domID,
                                $renderTo: $renderTo,
                                type: TYPE.BLANK
                            };
                        }
                    }


                } else {
                    switch (options.type) {
                        case TYPE.SELF:
                            //暂时阻止气泡页面下自身打开页面
                            if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                                app.alert('系统错误 0x01：气泡页面下不能打开自身页面！', app.alert.ERROR, '0x01');
                            } else {
                                handler = this.controller.getCurrentHandler();

                                this.controller.unload(handler.domID, true);

                                domID = this.getUID(id || href);

                                $renderTo = handler.$renderTo = this.updateTitleAndID(handler.type, handler.domID, domID, title, id, href, handler.$renderTo);

                                ret = {
                                    $renderTo: handler.$renderTo,
                                    domID: domID,
                                    type: handler.type
                                };
                            }


                            break;
                        case TYPE.SUB:

                            if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                                app.alert('系统错误 0x01：气泡页面下不能打开子页面！', app.alert.ERROR, '0x01');
                            } else {
                                domID = this.getUID(id || href);

                                $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                                ret = {
                                    $renderTo: $renderTo,
                                    domID: domID,
                                    type: TYPE.SUB
                                };

                                app.modal({
                                    title: title,
                                    content: '',
                                    btnConfirm: options.btnConfirm || '关闭',
                                    btnCancel: options.btnCancel || '取消',
                                    init: function (controller) {
                                        var $body = $(this),
                                            $close = $('<button title="关闭子页面" type="button" class="close iconfont icon-topbar-close"></button>');

                                        $body.prev().prepend($close);
                                        $body.append($renderTo);

                                        $close.one('click', function () {
                                            controller.unload();

                                            $(this).closest('.modal').modal('hide');

                                            controller.tab.resumeView();
                                        });
                                    },
                                    confirmHandler: function (controller) {
                                        controller.unload();

                                        $(this).closest('.modal').modal('hide');

                                        controller.tab.resumeView();
                                    },
                                    cancelHandler: function (controller) {
                                        controller.unload();

                                        $(this).closest('.modal').modal('hide');

                                        controller.tab.resumeView();

                                    },
                                    width: options.width,
                                    height: options.height,
                                    args: [this.controller],
                                    isLargeModal: true,
                                    isDialog: true,
                                    backdrop: 'static',
                                    noFooter: !options.hasFooter,
                                    noHeader: !options.title
                                });
                            }

                            break;
                        case TYPE.POPOVER:

                            if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                                app.alert('系统错误 0x01：气泡页面下不能打开新气泡页面！', app.alert.ERROR, '0x01');

                            } else {
                                domID = this.getUID(id || href);

                                $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                                ret = {
                                    $renderTo: $renderTo,
                                    domID: domID,
                                    type: TYPE.POPOVER
                                };


                                /*  //需要阻止第二次点击的时候仍然进行 popover 动作
                                  if (this.popOption.popSwitch) {
                                      this.popOption.popSwitch = !this.popOption.popSwitch;

                                  } else {*/
                                app.popover({
                                    $elem: options.$elem,
                                    title: title,
                                    content: '',
                                    placement: 'auto left',
                                    init: function (popIns, controller) {
                                        var $body = $(this).find('.aweb-popover-content');

                                        $body.append($renderTo);


                                    },
                                    confirmHandler: function (popIns, controller, popOption) {

                                        if (!popIns.popInstance.inState.click) {
                                            popOption.popSwitch = !popOption.popSwitch;
                                        }
                                        controller.unload();
                                        controller.tab.resumeView();
                                    },

                                    width: options.width,
                                    height: options.height,
                                    args: [this.controller, this.popOption]
                                });
                                /*  }*/
                            }

                            break;
                    }
                }

                return ret;
            },
            close: function (domID, _doNotResume) {
                var handler,
                    controller = this.controller,
                    currentViewID = this.getCurrentView();

                handler = controller.getCacheHandler(domID) || controller.getCurrentHandler();
                domID = domID || currentViewID;

                if (handler) {
                    if (handler.type === this.TYPE.SUB) {
                        controller.unload(domID, true);

                        handler.$renderTo.closest('.modal').modal('hide');
                    } else {
                        controller.unload(domID);

                        delete this.map.domID;

                        this.$ctn.children('#' + domID).remove();
                    }

                    if (!_doNotResume && domID === currentViewID) {
                        this.resumeView();
                    }
                }
                return this;
            },
            getUID: function (domID) {

                if (this.count[domID]) {
                    domID += (++this.count[domID]);
                } else {
                    this.count[domID] = 1;
                }
                return domID;
            },
            updateTitleAndID: function (type, oldID, newID, title, id, href, $renderTo) {
                var TYPE = this.TYPE;

                title = title || this.untitled;

                switch (type) {
                    case TYPE.SUB:
                        $renderTo.closest('.modal').children('.modal-header').children(':not(button)').text(title);
                        break;
                    case TYPE.POPOVER:
                        $renderTo.closest('.aweb-popover').children('.aweb-popover-header').children('.aweb-popover-title').text(title);
                        break;
                    default:
                        if(this.map[oldID]){
                            delete this.map[oldID]
                        }
                        this.map[newID] = newID;
                        break;
                }

                return $renderTo.attr('id', newID);
            },
            setCurrentView: function (domID) {
                if (domID) {
                    var stack = [],
                        _stack = this.stack,
                        i, id;

                    for (i = _stack.length; id = _stack[--i];) {
                        if (domID !== id) {
                            stack.push(id);
                        }
                    }
                    this.stack = stack.reverse();
                    this.stack.push(domID);

                    this.$ctn.removeClass('hidden');
                }

            },
            getCurrentView: function () {
                return this.stack[this.stack.length - 1]+'';
            },
            removeView: function (domID) {
                if (domID) {
                    var stack = [],
                        _stack = this.stack,
                        i, id;

                    for (i = _stack.length; id = _stack[--i];) {
                        if (domID !== id) {
                            stack.push(id);
                        }
                    }
                    this.stack = stack.reverse();

                    if (!stack.length) {
                        this.$ctn.addClass('hidden');
                }
                }
            },
            switchView: function (domID, isLoad) {
                var

                    lastDomID = this.getCurrentView(),
                    $ctn, $page,
                    model;

                if (isLoad || lastDomID !== domID) {


                    model = this.controller.getCacheHandler(domID);

                    if (model) {
                        this.controller.pause();

                        if (model.type !== this.TYPE.SUB) {


                            $ctn = this.$ctn;

                            $page = $ctn.children('#' + lastDomID);
                            $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');


                            $page = $ctn.children('#' + domID);
                            $page.removeClass('hide');

                            $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

	                        $(window).trigger('resize');
                        } else {
                            $ctn = this.$ctn;
                            $page = $ctn.children('#' + lastDomID);
                            $page.attr('data-scroll-top', $page.parent().scrollTop());

                            $page = model.$renderTo;
                            $page.removeClass('hide');
                        }


                        !isLoad && this.controller.resume(domID);

                        this.setCurrentView(domID);

                    }


                }
            },
            resumeView: function () {
                var TYPE = this.TYPE,
                    lastDomID = this.getCurrentView(),
                    handler = this.controller.getCurrentHandler(),
                    domID,
                    $ctn, $page, model;

                if (handler) {
                    domID = handler.domID;
                    model = this.controller.getCacheHandler(domID);

                    if ((model.type !== this.TYPE.SUB) && (model.type !== this.TYPE.POPOVER)) {

                        $ctn = this.$ctn;


                        $page = $ctn.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');

                        $page = $ctn.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

	                    $(window).trigger('resize');
                    }
                    this.controller.resume(domID);


                }
            },
            style: function (style) {
                if(style){
                    if(style.ctn){
                        this.$ctn.css(style.ctn);
                    }
                }
                return this;
            },
            closeAll: function () {
                var stack = this.stack,
                    i, domID;

                for (i = -1; domID = stack[++i];) {
                    this.close(domID,true);
                }

            }

        };

        Router = function(spaModule){

            var siteName = document.title,
                context = this;


            this.spaModule = spaModule;

            this.spaModule.on(this.spaModule.STATUS.AFTER_RESUME + ".seo," +this.spaModule.STATUS.AFTER_LOAD+".seo", function (type, handler) {

                var option = handler.option,
                    title = option.title,
                    content = option.content,
                    type = option.type,
                    hash = decodeURI(window.location.hash),
                    page = '#/' + handler.option.page.replace(/#/g, '/'),
                    queryStrings = '',
                    key;

                if(type==='SUB'||type==='POPOVER'){
                    return;
                }

                if(!$.isEmptyObject(content)){
                    for (key in content) {
                        if(content.hasOwnProperty(key)&&content[key]){
                            queryStrings += '&' + key + '=' + content[key];
                        }
                    }
                }


                if (title) {

                    if (queryStrings) {

                        if (option.id) {
                            page = page + '?' + 'title=' + title + '&pageId=' + option.id + queryStrings;
                        } else {
                            page = page + '?' + 'title=' + title + queryStrings;
                        }
                    } else {

                        if (option.id) {
                            page = page + '?' + 'title=' + title + '&pageId=' + option.id;
                        } else {
                            page = page + '?' + 'title=' + title;
                        }
                    }
                    document.title = title + '-' + siteName;

                } else {
                    if (queryStrings) {

                        if (option.id) {
                            page = page + '?' + 'pageId=' + option.id + queryStrings;
                        } else {
                            page = page + '?' + queryStrings;
                        }
                    } else {

                        if (option.id) {
                            page = page + '?' + 'pageId=' + option.id;
                        }
                    }
                    document.title = siteName;
                }

                // if ((option.id != 'mainPage' && hash != page)||(option.id === 'mainPage' && hash != page&&hash!='')) {
                //     if (window.history.pushState) {
                //         window.history.pushState(null, null, page);
                //     } else {
                //         window.location.hash = page;
                //     }
                //
                // }

                if (hash !== page) {
	                if (window.history.pushState) {
		                window.history[window.location.hash ? 'pushState' : 'replaceState'](null, null, page);
	                } else {
		                window.location.hash = page;
	                }
                }


            });

            if (!app.getQueryStringMap().windowId) {
                context.openPage();

            }

            window.addEventListener('hashchange', function () {
                context.openPage();
            })
        };

        Router.prototype = {
            openPage :function(){
                var hash = decodeURI(window.location.hash),
                    hashArr = hash&&hash.split('?'),
                    i,hashItem,path,querys,j,queryItem,title,pageId,
                    pages = this.spaModule.pages,
                    option = {},
                    content = {},
                    flag = false,
                    domID,key;
                if (hash && hash.match('#/')) {
                    path = hashArr[0].slice(2);

                    if (hashArr[1]) {
                        hashItem = hashArr[1];
                        querys = hashItem.split('&');

                        for (j = 0; j < querys.length; j++) {
                            queryItem = querys[j].split('=');

                            if (queryItem[0] === 'title' && queryItem[1]) {
                                title = queryItem[1];

                            } else if (queryItem[0] === 'pageId' && queryItem[1]) {
                                pageId = queryItem[1];

                            } else if (queryItem[0] && queryItem[1]) {
                                content[queryItem[0]] = queryItem[1];
                            }
                        }
                    }

                    if (path) {

                        if (!$.isEmptyObject(pages)) {
                            for (key in pages) {
                                if (pages.hasOwnProperty(key) && pages[key]) {
                                    if (pageId && pages[key].id === pageId && path && path === pages[key].page.replace(/#/g, '/')) {
                                        flag = true;
                                        domID = key;
                                    }
                                }
                            }
                        }

                        if (flag) {
                            this.spaModule.open(pages[domID]);
                        } else {
                            option.page = path.replace(/\//g, '#');
                            option.status = true;
                            option.id = pageId;
                            option.title = title;
                            option.content = content;
                            option.page && this.spaModule.open(option);
                        }

                    }
                }
            }

        };



        if(!widget.mobile.SoYLayout) {
            widget.mobile.SoYLayout = {};
        }
        //mobile.SoYLayout.indexLayout
        widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE].join('.mobile.SoYLayout.indexLayout,') + '.mobile.SoYLayout.indexLayout', function (type, oWidget) {
            var option, flag=false;

            oWidget && oWidget.length && oWidget.each(function (index, elem) {

                oWidget = oWidget.eq(index);

                // if (oWidget.href && oWidget.href() === 'mobile.SoYLayout.indexLayout') {
                //
                //     option=oWidget.option();
                //
                //     if(option.type==='pageFlow'){
                //         oWidget.accept(false);
                //
                //         var uuid = oWidget.id();
                //
                //         (!option.data) && (option.data = {});
                //
                //         if (option.data.active !== true) {
                //             option.data.active = true;
                //             option.data.uuid = app.getUID();
                //             option.data.code = '##_VAR##.open(##_RESPONSE_DATA##,"' + option.data.uuid + '")';
                //             flag=true;
                //         }
                //
                //         if (!option.data.name) {
                //             option.data.name = option.name;
                //         }
                //
                //
                //     }else{
                //
                //         oWidget.accept(true);
                //
                //         (!option.data) && (option.data = {});
                //
                //         if (option.data.active !== false) {
                //             option.data.active = false;
                //             flag=true;
                //         }
                //     }
                //
                //     if(flag){
                //         oWidget.option(option, true);
                //     }
                //
                // }
            })
        });


        widget.mobile.SoYLayout.indexLayout = function (widgetIns, oOption, attr, oCss, auiCtx) {
            var TAB_TEMP = Tab.prototype._default.tabTemp,

                $ctn,

                $widget,

                css,

                Controller,

                spaModule;

                $ctn= widgetIns;
                css = oCss;
                Controller = app.Controller;

                spaModule = new Controller({
                    View:Tab,
                    view:{
                        ctn:$ctn,
                        _style:css && css.style
                    }
                });

                new Router(spaModule);

                return{
	                spaModule:spaModule,
                    pause: function () {
                        spaModule.pause();
                    },
                    resume: function(){
                        var stack;

                        if (spaModule && (stack = spaModule.tab.stack) && stack.length) {
                            spaModule.resume(stack[stack.length - 1]);
                        }
                    },
                    show: function () {
                        $widget.removeClass('hide');
                    },
                    hide: function () {
                        $widget.addClass('hide');
                    },
                    open: function (response) {
                        response = $.extend(true, {
                            page: 'error#404'
                        }, response);
                        spaModule.open(response);
                    },
                    close:function(domID){
                        spaModule.tab.close(domID);
                    },
                    switchTab: function (id) { //切换标签
                        spaModule.tab.switchView(id);
                    },
                    closeAll:function(){
                        spaModule.tab.closeAll();
                    }
                }

            
        };

        return widget;
    });
})();