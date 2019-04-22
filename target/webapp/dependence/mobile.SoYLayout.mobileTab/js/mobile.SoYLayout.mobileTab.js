/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", 'bscroll'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, scroll) {
        "use strict";

        var Controller = app.Controller,
            Tab,
            renderTab;

        //tab
        !function ($) {

            "use strict"; // jshint ;_;


            /* TAB CLASS DEFINITION
             * ==================== */

            var Tab = function (element) {
                this.element = $(element)
            };

            Tab.prototype = {

                constructor: Tab,
                show: function () {
                    var $this = this.element
                        , $ul = $this.closest('ul:not(.dropdown-menu)')
                        , selector = $this.attr('data-target')
                        , previous
                        , $target
                        , e;

                    if (!selector) {
                        selector = $this.attr('href');
                        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
                    }

                    if ($this.parent('li').hasClass('active')) return;

                    previous = $ul.find('.active:last a')[0];

                    e = $.Event('show', {
                        relatedTarget: previous
                    });

                    $this.trigger(e);

                    if (e.isDefaultPrevented()) return;

                    /**
                     * lijiancheng@cfischina.com
                     * 修复nav-tabs在id相同的情况下无法正确指向对应容器的bug
                     * */
                    if ($ul.hasClass('nav-tabs')) {
                        $target = $(selector, $ul.parent())
                    } else {
                        $target = $(selector)
                    }

                    this.activate($this.parent('li'), $ul);
                    this.activate($target, $target.parent(), function () {
                        $this.trigger({
                            type: 'shown'
                            , relatedTarget: previous
                        })
                    })
                }

                , activate: function (element, container, callback) {
                    var $active = container.find('> .active')
                        , transition = callback
                        && $.support.transition
                        && $active.hasClass('fade');

                    function next() {
                        $active
                            .removeClass('active')
                            .find('> .dropdown-menu > .active')
                            .removeClass('active');

                        element.addClass('active');

                        if (transition) {
                            element[0].offsetWidth; // reflow for transition
                            element.addClass('in')
                        } else {
                            element.removeClass('fade')
                        }

                        if (element.parent('.dropdown-menu')) {
                            element.closest('li.dropdown').addClass('active')
                        }

                        callback && callback()
                    }

                    transition ?
                        $active.one($.support.transition.end, next) :
                        next();

                    $active.removeClass('in')
                }
            };


            /* TAB PLUGIN DEFINITION
             * ===================== */

            var old = $.fn.tab;

            $.fn.tab = function (option) {

                return this.each(function () {
                    var $this = $(this)
                        , data = $this.data('tab');
                    if (!data) $this.data('tab', (data = new Tab(this)));
                    if (typeof option == 'string') data[option]()
                })
            };

            $.fn.tab.Constructor = Tab;


            /* TAB NO CONFLICT
             * =============== */

            $.fn.tab.noConflict = function () {
                $.fn.tab = old;
                return this
            };


            /* TAB DATA-API
             * ============ */

            $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
                e.preventDefault();
                $(this).tab('show')
            })

        }(window.jQuery);
        Tab = function (options) {
            var _default = this._default,
                context = this,
                $contextMenu,
                $tabCtn;

            $.extend(true, context, _default, options);

            context.$ctn = $(context.ctn);
            context.$contextMenu = $contextMenu = $(context.contextMenuTemp);
            context.$ctn.prepend($contextMenu);

            context.$tabs = $(context.tabs, context.$ctn);

            context.$tabs.wrap(context.tabCtnTemp);

            context.$tabCtn = $tabCtn = context.$tabs.parent();


            context.$ctt = $(context.ctt, context.$ctn);

            context.uid = app.getUID();

            if (options._style) {
                this.style(options._style);
            }

            if (options.navbarVisable === false) {
                this.navbarVisiable(false);
            }


            context.$tabs.on({
                'click.view': function (e) {
                    var $target = $(e.target || window.event.srcElement),
                        $item = $target.closest('[data-dom-id]'),
                        domID = $item.attr('data-dom-id');

                    if (domID) {

                        context.switchView(domID);

                    }
                }
            });


            app.screen.addResizeHandler({
                uid: context.uid,
                isGlobal: true,
                timeout: 500,
                callback: function () {
                    context.focusTab(context.$tabs.children('.active'));
                }
            });
        };
        Tab.prototype = {
            version: 'AWOS 4.3.0.0_20170723',
            constructor: Tab,
            _default: {
                ctn: '[data-role=container]',
                tabs: '#tabs',
                ctt: '#spa-page-main',

                count: {},
                stack: [],

                contextMenuTemp: '<ul class="mobile-tab-content-menu hide"></ul>',
                ctnTemp: '<div/>',
                listTemp: '<ul class="nav nav-tabs mobile-tabs"/>',
                tabCtnTemp: '<div class="mobile-tabs-container"></div>',
                tabTemp: '<li class="active" data-dom-id="_domID_" data-tab-id="_id_" data-href="_href_" title="_title_"><div class="list-content"><i class="icon _icon_"></i><a>_title_</a><div data-tip-id="_id_"></div></div></li>',
                tabTempFull: '<li class="active" data-dom-id="_domID_" data-tab-id="_id_" data-href="_href_" title="_title_"><a>_title_</a><button type="button" data-role="close" class="close">&times;</button></li>',

                untitled: '新标签页',

                cttTemp: '<div id="_domID_" class ="mobile-tab-ctt-children"/>',

                isGlobal: true,
                skip: false

            },

            TYPE: {
                NEW: 'NEW'
            },

            open: function (options) {
                var TYPE = this.TYPE,

                    ret = false,
                    title = options.title || this.untitled,
                    id = options.id,
                    domID,
                    href = $.camelCase(options.sections.join('-')),

                    $tabs = this.$tabs.children(),
                    $tab, $renderTo;


                $tab = id ? $tabs.filter('[data-tab-id="' + id + '"]') : $tabs.filter('[data-href="' + href + '"]');


                //假如该页面已经存在
                if ($tab.length) {
                    domID = $tab.attr('data-dom-id');
                    // debugger;
                    if (options.type === TYPE.NEW) {
                        id = id || domID;
                        $renderTo = options.$renderTo || options.renderTo;
                        this.updateTitleAndID(options.type, id, id, title, id, href, $renderTo);
                        ret = {
                            domID: domID,
                            $renderTo: $renderTo,
                            type: TYPE.NEW
                        };

                    }


                }

                return ret;
            },
            close: function (domID) {
                var handler,
                    controller = this.controller,
                    currentViewID = this.getCurrentView();

                handler = controller.getCacheHandler(domID) || controller.getCurrentHandler();

                if (handler) {
                    if (handler.type === this.TYPE.SUB) {
                        handler.$renderTo.closest('.modal').modal('hide');
                    } else {
                        controller.unload(domID);

                        this.$tabs.children('[data-dom-id="' + domID + '"]').remove();
                        this.$ctt.children('#' + domID).remove();
                    }

                    if (domID === currentViewID) {
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
                title = title || this.untitled;

                this.$tabs
                    .children('[data-dom-id="' + oldID + '"]')
                    .attr({
                        title: title,
                        'data-dom-id': newID,
                        'data-tab-id': id,
                        'data-href': href
                    })
                    .children('a').text(title);

                $renderTo.attr('id', newID);
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
                }
            },
            getCurrentView: function () {
                return this.stack[this.stack.length - 1];
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
                }
            },
            switchView: function (domID, isLoad) {
                var lastDomID = this.getCurrentView(),
                    $tab, $ctt, $page;


                if (lastDomID !== domID) {
                    if (isLoad) {
                        this.setCurrentView(domID);
                        this.controller.pause();
                        this.removeView(domID);
                    } else {
                        this.controller.pause();

                        $tab = this.$tabs.children()
                            .removeClass('active')
                            .filter('[data-dom-id="' + domID + '"]').addClass('active');

                        $ctt = this.$ctt;

                        //记录当前页面高度
                        $page = $ctt.children('#' + lastDomID);

                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');


                        $page = $ctt.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                        this.controller.resume(domID);


                        this.setCurrentView(domID);

                        // this.focusTab($tab);
	                    $(window).trigger('resize');
                    }

                }


            },
            resumeView: function () {
                var TYPE = this.TYPE,
                    lastDomID = this.getCurrentView(),
                    handler = this.controller.getCurrentHandler(),
                    domID,
                    $tab, $ctt, $page;

                if (handler) {
                    domID = handler.domID;

                    if (handler.type !== TYPE.SUB) {
                        $tab = this.$tabs.children()
                            .removeClass('active')
                            .filter('[data-dom-id="' + domID + '"]').addClass('active');

                        $ctt = this.$ctt;

                        //记录当前页面高度
                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');

                        $page = $ctt.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

	                    $(window).trigger('resize');
                    }
                    this.controller.resume(domID);

                    this.focusTab($tab);
                }
            },
            focusTab: function ($tab) {
                var widths = 0,
                    totalWidths = 0,

                    $tabCtn = this.$tabCtn,
                    $tabs = this.$tabs,
                    $lis = $tabs.children($tab ? ':lt(' + ($tab.index() + 1) + ')' : undefined),
                    // $tabBtn = $btn || this.$left,

                    // tabsContainerWidth = $tabCtn.innerWidth() - $tabBtn.outerWidth() * 4.2,
                    tabsContainerWidth = $tabCtn.innerWidth(),

                    tabsOffsetLeft = parseInt($tabs.css('left'), 10);

                //获取tabs总长度
                $lis.each(function (index, elem) {
                    widths += $(elem).outerWidth();
                });


                if (!$tab) {
                    totalWidths = widths;

                } else {
                    $tabs.children().each(function (index, elem) {
                        totalWidths += $(elem).outerWidth();
                    });
                }


                tabsOffsetLeft = tabsContainerWidth - widths;

                if (tabsContainerWidth - widths > tabsOffsetLeft) {
                    //假如偏右超界
                    tabsOffsetLeft = tabsContainerWidth - widths;
                } else if (tabsOffsetLeft > 0) {
                    //偏左超界
                    tabsOffsetLeft = tabsOffsetLeft > 0 ? 0 : tabsOffsetLeft;
                }

                // $tabs.animate({'left': tabsOffsetLeft + 'px'}, 500);
            },


            style: function (style) {
                this.$ctn.css(style);

                this.focusTab();

                return this;
            },
            navbarVisiable: function (visable) {
                this.$tabCtn.css('display', visable ? '' : 'none');

                if (visable) {
                    this.focusTab();
                }
            },
            destroy: function () {
                var stack = this.stack,
                    i, domID;

                for (i = -1; domID = stack[++i];) {
                    this.close(domID);
                }

                app.screen.removeResizeHandler(this.uid, true);
            }
        };
        renderTab = function (tabWidget, option, eventHandler, cttWidgets) {
            var $widget = tabWidget[0].$widget.children('[data-widget-type]'),
                $tabCtn, $nav, $tabCtt, $activeTabPane,
                list = [],
                activeIndex;

            if ($widget.length) { //还没有被渲染过

                $tabCtt = $widget.addClass('tab-content');
                $tabCtt.wrap('<div class="tabbable"/>');
                $tabCtn = $tabCtt.parent();
                $nav = $(Tab.prototype._default.listTemp);

                $tabCtn.prepend($nav);


                $nav.on('click.tabCtn', function (e) {
                    var $link;

                    if (!e.isTrigger && ($link = $(e.target)).is('a')) {
                        setTimeout(function () {
                            widget($link.attr('href').substr(1)).config().refresh(undefined, undefined, undefined, {
                                type: 'sizeChange',
                                capture: true
                            });
                        }, 50);
                    }
                });
            } else {
                $tabCtn = tabWidget[0].$widget.children('.tabbable');

                $nav = $tabCtn.children('.nav-tabs');
                $tabCtt = $tabCtn.children('.tab-content');
            }

            option.name.map(function (elem, index) {
                var cttWidget = cttWidgets.filter(':eq(' + index + ')'),
                    uuid = cttWidget.id(),
                    icon = elem.icon || '';

                if (cttWidget.length) {
                    if (elem.type === 'pageFlow') {
                        cttWidget.accept(false);

                        (!elem.data) && (elem.data = {});

                        if (elem.data.active !== true) {
                            elem.data.active = true;
                            elem.data.uuid = app.getUID();
                            elem.data.code = '##_VAR##.open(##_RESPONSE_DATA##,"' + elem.data.uuid + '")';
                        }

                        if (!elem.data.name) {
                            elem.data.name = elem.name;
                        }

                    } else {
                        cttWidget.accept(true);

                        (!elem.data) && (elem.data = {});

                        if (elem.data.active !== false) {
                            elem.data.active = false;
                        }
                    }

                    $widget = cttWidget[0].$widget;
                    $widget.attr('id', uuid);


                    list.push('<li><i class="icon ' + icon + '"></i><a href="#' + uuid + '" data-toggle="tab">' + tabWidget.nsl(elem.data.name || elem.name) + '</a></li>');

                }
            });

            $nav.empty().append(list.join(''));
            $activeTabPane = $tabCtt.children().addClass('tab-pane').filter('.active');

            activeIndex = ':eq(' + ($activeTabPane.index() || 0) + ')';

            $nav.children(activeIndex).addClass('active');
            $tabCtt.children(activeIndex).addClass('active');


            tabWidget.option(option, true);
        };
        if (!widget.mobile.SoYLayout) {
            widget.mobile.SoYLayout = {};
        }


        widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE,widget.STATUS.WIDGET_APPEND].join('.mobile.SoYLayout.mobileTab,') + '.mobile.SoYLayout.mobileTab', function (type, oWidget) {
            var option, tabWidget, tabs, append, cttWidgets,updateTabDataModel;

            oWidget && oWidget.length && oWidget.each(function (index, elem) {

                tabWidget = oWidget.eq(index);


                if (oWidget.href && oWidget.href() === 'mobile.SoYLayout.mobileTab') {

                    tabWidget.drop(false);
                    option = tabWidget.option();

                    tabs = option.name || (option.name = []);

                    updateTabDataModel=function () {
                        var flag=false;

                        tabs.map(function (elem, index) {

                            var cttWidget = cttWidgets.filter(':eq(' + index + ')');

                            if (cttWidget.length) {
                                if (elem.type === 'pageFlow') {
                                    cttWidget.accept(false);

                                    (!elem.data) && (elem.data = {});

                                    if (elem.data.active !== true) {
                                        elem.data.active = true;
                                        elem.data.uuid = app.getUID();
                                        elem.data.code = '##_VAR##.open(##_RESPONSE_DATA##,"' + elem.data.uuid + '")';
                                        flag=true;
                                    }

                                    if (!elem.data.name) {
                                        elem.data.name = elem.name;
                                    }

                                } else {
                                    cttWidget.accept(true);

                                    (!elem.data) && (elem.data = {});

                                    if (elem.data.active !== false) {
                                        elem.data.active = false;
                                        flag=true;
                                    }
                                }


                            }
                        });

                        if(flag){
                            tabWidget.option(option,true);
                        }
                    };

                    switch (type) {
                        case widget.STATUS.WIDGET_INIT:

                            while (tabs.length < 2) {
                                tabs.push({
                                    name: '标签' + (tabs.length + 1),
                                    id: 'tab' + (tabs.length + 1),
                                    uuid: app.getUID()
                                });
                                tabWidget.append('divCtn', function (cttWidget) {

                                    cttWidget.del(false) && cttWidget.drag(false);

                                    cttWidgets = tabWidget.children(':active');
                                    cttWidgets.config();
                                });
                            }

                            //触发valueChange
                            tabWidget.option(option);
                            break;

                        case widget.STATUS.WIDGET_UPDATE:

                            cttWidgets = tabWidget.children(':active');

                            if (cttWidgets.length < tabs.length) {
                                append = function (cttWidget) {

                                    cttWidget.del(false) && cttWidget.drag(false);

                                    cttWidgets = tabWidget.children(':active');

                                    if (cttWidgets.length < tabs.length) {
                                        tabWidget.append('divCtn', append);
                                    }else{
                                        updateTabDataModel();
                                    }
                                };

                                tabWidget.append('divCtn', append);

                            } else if (cttWidgets.length > tabs.length) {

                                if (tabs.length < 2) {
                                    while (tabs.length < 2) {
                                        tabs.push({
                                            name: '标签' + (tabs.length + 1),
                                            id: 'tab' + (tabs.length + 1),
                                            uuid: app.getUID()
                                        });
                                    }

                                    //触发valueChange
                                    tabWidget.option(option);

                                } else {

                                    cttWidgets.filter(':gt(' + (tabs.length - 1) + ')').destroy();
                                    updateTabDataModel();
                                }
                            }else{
                                updateTabDataModel();
                            }
                            break;
                        case widget.STATUS.WIDGET_APPEND:
                            cttWidgets = tabWidget.children(':active');
                            cttWidgets.del(false) && cttWidgets.drag(false);
                            break;
                    }


                }
            })

        });

        widget.mobile.SoYLayout.mobileTab = function (obj, oOption, attr, oCss, auiCtx) {
            var TAB_TEMP = Tab.prototype._default.tabTemp,

                tabWidget, cttWidgets, tabInstance,
                eventHandler,

                $ctn, $ctt, $list, $content, $children,

                $widget, $selector,
                $ulCtn, $ul, $nav, $tabs, $tabCtt,

                option, tabs,
                i, elem, map, css,

                append, style,
                ulWidth, tabScroll,

                spaModule, tabID;

                $ctt = obj;
                option = oOption;
                css = oCss;


                if (option && (tabs = option.name)) {
                    $list = $(Tab.prototype._default.listTemp);

                    tabID = $ctt[0].id;
                    $ctt.removeAttr('id').removeAttr('class');
                    $ctt.wrap(Tab.prototype._default.ctnTemp);

                    $ctn = $ctt.parent().addClass($ctt.attr('class')).attr('id', tabID);
                    $ctn.prepend($list);

                    spaModule = new Controller({
                        View: Tab,
                        view: {
                            ctn: $ctn,
                            tabs: $list,
                            ctt: $ctt,

                            _style: oCss && oCss.style && oCss.style.ctn,
                            navbarVisable: option.navbarVisable
                        }
                    });
                    tabInstance = spaModule.tab;

                    $ctt.children().each(function (i) {
                        var $this = $(this),
                            id = $this.attr('id'),
                            tabTemp = TAB_TEMP, icon;

                        tabInstance.stack.push(id);
                        (icon = option.name[i].icon) && (tabTemp = TAB_TEMP.replace(/_icon_/, icon));
                        $list.append(tabTemp.replace(/_domID_/, id).replace(/_href_/, id).replace(/_id_/g, id).replace(/_title_/g, (tabs[i].name || id)));
                    });


                    $ctt.children(':not(:first)').addClass('hide');


                    $list.children(':not(:first)').removeClass('active');

                    tabInstance.setCurrentView($list.children(':first').attr('data-dom-id'));


                    $children = $ctt.children();

                    for (i = tabs.length, map = {}; elem = tabs[--i];) {
                        if ((elem = elem.data) && (elem = elem.uuid)) {
                            $content = $children.eq(i);

                            map[elem] = {
                                type: Tab.prototype.TYPE.NEW,
                                id: $content.attr('id'),
                                renderTo: $content,
                                title: tabs[i].name,
                                switchTo: tabs[i].switchTo
                            };


                        }
                    }


                    if (!$.isEmptyObject(css) && css.style) {
                        style = css.style;

                        $ulCtn = $ctt.prev('.mobile-tabs-container');
                        style.tabs && $AW.cssHover('.mobile-tabs', $ulCtn, style.tabs, '');
                        style.listContent && $('.mobile-tabs>li', $ulCtn).css(style.listContent);
                        style.tabNameActive && $AW.cssHover('.mobile-tabs>li.active', $ulCtn, style.tabNameActive, '');
                        style.icon && $('.mobile-tabs>li>.list-content>.icon', $ulCtn).css(style.icon);
                        style.tabName && $AW.cssHover('.mobile-tabs>li>.list-content>a', $ulCtn, style.tabName, '');

                    }

                    $ul = $('.mobile-tabs', $ctn);

                    switch (option.tabPosition) {
                        case 'top':
                            if (option.scroll) {
                                $ul.removeClass().addClass('nav nav-tabs mobile-tabs top-scroll');
                                ulWidth = 0;
                                $('li', $ul).each(function () {
                                    ulWidth += $(this).outerWidth();
                                });
                                $ul.css('width', ulWidth + 'px');
                                tabScroll = new scroll($ul.parent().get(0), {
                                    scrollX: true,
                                    scrollY: false,
                                    click: true
                                })
                            } else {

                                $('li', $ul).each(function () {
                                    $(this).removeClass('no-scroll').addClass('no-scroll');
                                });
                            }

                            break;
                        case 'bottom':
                            $ctn.removeClass('tab-bottom').addClass('tab-bottom');
                            $ul.parent().removeClass('bottom').addClass('bottom');
                            $('li', $ul).each(function () {
                                var $this = $(this);
                                $this.removeClass('no-scroll bottom').addClass('no-scroll bottom');
                                $('i', $this).removeClass('bottom').addClass('bottom')
                            });
                            break;

                        case 'left':
                            $ctn.css({
                                display: 'flex'
                            });
                            $ctn.children().eq(1).css({
                                width: $list.children().eq(1).outerWidth() + 'px'
                            });
                            $list.css({
                                display: 'flex',
                                'flex-direction': 'column'
                            });
                            if (option.scroll) {

                                tabScroll = new scroll($ul.parent().get(0), {
                                    scrollX: false,
                                    scrollY: true,
                                    click: true
                                })
                            }
                            break;

                        default:

                            break;
                    }

                    return {
                        switchTab: function (id) { //切换标签
                            spaModule.tab.switchView(id);
                        },
                        pause: function () {
                            spaModule.pause();
                        },
                        resume: function () {
                            var stack;

                            if (spaModule && (stack = spaModule.tab.stack) && stack.length) {
                                spaModule.resume(stack[stack.length - 1]);
                            }
                        },
                        open: function (response, tabUID) {

                            tabUID = map[tabUID];
                            response = $.extend(true, {
                                page: 'error#404'
                            }, response, tabUID);

                            spaModule.open(response);
                        },
                        destroy: function () {
                            spaModule.tab.destroy();
                        },
                        // 一个行为类型方法的 实现
                        display: function (result, input1, input2, condition) {
                            $ctt.css('display', result ? 'block' : 'none');
                        },

                        /*
                         *   @show   弹出框行为
                         *       @e      Event Handler   事件句柄
                         *       @size   Object
                         *           @height     String  高度
                         *           @width      String  宽度
                         *   占位符为 ##_var##.接口名(e,size);
                         * */
                        show: function () {
                            $ctt.removeClass('hide')
                        },

                        /*
                         *   @hide   隐藏行为
                         * */
                        hide: function () {
                            $ctt.addClass('hide');
                        },

                        style: function (style) {
                            spaModule.tab.style(style);
                        },
                        navbarVisiable: function (visiable) {
                            spaModule.tab.navbarVisiable(visiable);
                        },
                        setTip:function(domID,text){
                            var content,
                                $tip=$('[data-tip-id ='+domID+']',$ulCtn);

                                if(text){

                                    content = $.extend({
                                        position:'absolute',
                                        top:'0',
                                        right:'0',
                                        'min-width':'16px',
                                        // content:"'"+ number +"'",
                                        padding:'1px',
                                        background:'#f00',
                                        'border-radius':'50%',
                                        'text-align':'center',
                                        'line-height':'16px',
                                        color:'#fff'

                                    },style.numberTip);

                                    $tip.text(''+text);

                                }else{
                                    content= $.extend({
                                        position:'absolute',
                                        top:'0',
                                        right:'0',
                                        width:'8px',
                                        height:'8px',
                                        content:"''",
                                        background:'#f00',
                                        'border-radius':'50%'
                                    },style.tip);

                                    $tip.text('');
                                }

                                $tip.removeAttr('style').css(content);

                        },
                        removeTip:function(domID){

                            var $tip;

                            $tip = $('[data-tip-id ='+domID+']',$ulCtn);

                            $tip.removeAttr('style').text('');

                        },
                        getClickTabID:function(e){
                            var $target = $(e.target||window.event.srcElement),
                                id;

                                if(id = $target.attr('data-dom-id')||$target.closest('li').attr('data-dom-id')){
                                    return id
                                }

                        }

                    };
                }

            
        };

        return widget;
    });
})();