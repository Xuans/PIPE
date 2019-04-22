(function (factory) {
    "use strict";
    if (typeof exports === 'object') {
        module.exports = factory(window.jQuery);
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery && !window.jQuery.fn.colorpicker) {
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

//popover
    var Popover = function (opt) {

        /*
         *
         * @opt.type               使用的Popover类型（popover|contextmenu）
         * @opt.selecter           触发popover范围(字符串选择器，dom对象，$对象均可)
         * @opt.not                禁止触发popover范围
         * @opt.position           默认popover位置
         * @opt.template           默认popover内容，支持html
         * @opt.templateData       为每个不同的$selector定制化popover内容，内容需实现储存在$.fn.data(opt.templateData)中
         * @opt.delegateEvents     自定义popover内触发范围和触发事件，可用于定义自定义菜单事件
         * @opt.$area              popover的有效范围的元素的$对象,defaultValue = $('body')
         * @opt.$ctn               popover的容器，默认值为opt.$area，popover会相对容器的边缘做自动布局调整
         * @opt.hideWhileScroll    滚动时隐藏popover，默认true，不隐藏性能消耗较大
         * @opt.autoLocation       popover超出$ctn时自动定位的方式，可选'tip|direction',defaultValue = 'direction',当$ctn设置为false时不做任何超界处理
         *
         */

        if (!(this instanceof Popover)) {
            return new Popover(opt);
        } else {

            var CONTEXT_MENU = '<div id="_ID_" class="easy-popover"><div class="easy-popover-ctn"></div><div class="easy-popover-tip"></div><div class="easy-popover-hover"></div></div>',
                POS_ARRAY = ['left', 'right', 'top', 'bottom'],

                i,
                offsetParent,
                pLeft = 0,
                pTop = 0,
                selStr = opt.selector,
                notSelStr = opt.not,
                menuTemp = opt.template || '',
                delegateEvents = opt.delegateEvents || {},
                position = opt.position,
                templateData = opt.templateData,
                hideWhileScroll = opt.hideWhileScroll !== undefined ? opt.hideWhileScroll : true,
                autoLocation = opt.autoLocation || 'direction',
                maxWidth = opt.maxWidth,
                minWidth = opt.minWidth,
                width = opt.width,
                maxHeight = opt.maxHeight,
                minHeight = opt.minHeight,
                height = opt.height,
                radius = opt.radius,
                dele, deleEvent, deleSel,
                uid,
                uclass,
                virStyle = "",
                ctnLeft,
                ctnRight,
                ctnTop,
                ctnBottom,
                initLeft,
                initTipLeft,

                $area = opt.$area || $('body'),
                $scroll = opt.$scroll || $area,
                $ctn = (opt.$ctn === undefined) ? $area : opt.$ctn,
                $cancelCtn = opt.$cancelCtn,
                $menu,
                $menuCtn,
                $menuTip,

                getPosition = function ($target, pos, scrolling, posIndex) {
                    var ret = {},
                        m, mLeft, mRight, mTop, mBottom;

                    !$.isNumeric(posIndex) && (posIndex = 0);

                    !scrolling && $menuTip.removeClass('easy-popover-tip-top easy-popover-tip-right easy-popover-tip-bottom easy-popover-tip-left');

                    switch (pos) {

                        case 'top':

                            ret.x = $target.offset().left - ($menu.width() - $target.width()) / 2;
                            ret.y = $target.offset().top - $menu.outerHeight() - 10;
                            break;
                        case 'bottom':

                            ret.x = $target.position().left - ($menu.width() - $target.width()) / 2;
                            ret.y = $target.offset().top + $target.outerHeight() + 10;
                            break;
                        case 'right':

                            ret.x = $target.offset().left + $target.outerWidth() + 10;
                            ret.y = $target.offset().top + ($target.outerHeight() / 2 - $menu.outerHeight() / 2);
                            break;
                        case 'left':

                            ret.x = $target.offset().left - $menu.outerWidth(true) - 10;
                            ret.y = $target.offset().top + ($target.outerHeight() / 2 - $menu.outerHeight() / 2);
                            break;
                    }

                    if (!scrolling) {

                        $menuTip.addClass('easy-popover-tip-' + pos);

                        if ($ctn && $ctn.length) {

                            ctnLeft = $ctn.position().left;
                            ctnRight = ctnLeft + $ctn.outerWidth();
                            ctnTop = $ctn.position().top;
                            ctnBottom = ctnTop + $ctn.outerHeight();
                            mLeft = ret.x < ctnLeft;
                            mRight = (ret.x + $menu.outerWidth()) > ctnRight;
                            mTop = ret.y < ctnTop;
                            mBottom = (ret.y + $menu.outerHeight()) > ctnBottom;
                            m = mLeft || mRight || mTop || mBottom;
                        }
                    }

                    //超界处理
                    if ($ctn) {

                        switch (autoLocation) {
                            case 'tip':
                                //超界自动调整popover位置

                                if (pos === 'top' || pos === 'bottom') {

                                    if (mLeft) {

                                        $menuTip.css({'left': $target.outerWidth() / 2 + ($target.position().left - ctnLeft)});
                                    } else if (mRight) {

                                        $menuTip.css({'left': $target.position().left - $ctn.position().left - $ctn.outerWidth(true) + $menu.outerWidth() + $target.outerWidth() / 2});
                                    } else {

                                        $menuTip.css({'left': 'calc(50% - 4px)'});
                                    }

                                    ret.x = Math.min(Math.max(ret.x, ctnLeft), ctnRight - $menu.outerWidth());
                                } else if (pos === 'left' || pos === 'right') {

                                    if (mTop) {

                                        $menuTip.css({'top': $target.outerHeight() / 2 + ($target.offset().top - ctnTop) - 4});
                                    } else if (mBottom) {

                                        $menuTip.css({'top': $target.position().top - $ctn.position().top - $ctn.outerHeight(true) + $menu.outerHeight() + $target.outerHeight() / 2});
                                    } else {

                                        $menuTip.css({'top': 'calc(50% - 4px)'});
                                    }
                                    ret.y = Math.min(Math.max(ret.y, ctnTop), ctnBottom - $menu.outerHeight());
                                }
                                break;
                            case 'direction':
                                //超界自动切换popover方向

                                if (posIndex > 3) {

                                    return ret;
                                }

                                if (m) {

                                    if (pos === 'left') {

                                        return getPosition($target, 'bottom', null, ++posIndex);
                                    } else if (pos === 'right') {

                                        return getPosition($target, 'top', null, ++posIndex);
                                    } else if (pos === 'top') {

                                        return getPosition($target, 'left', null, ++posIndex);
                                    } else if (pos === 'bottom') {

                                        return getPosition($target, 'right', null, ++posIndex);
                                    }
                                }

                                break;
                        }

                    }

                    return ret;
                },

                setPosition = function (e, $target, left, top) {
                    var pos;

                    left = left||0;
                    top = top||0;

                    $menu.show();

                    /*if (position) {

                        pos = getPosition($target, position);

                        $menu.hide().show(100).css({
                            left: pos.x,
                            top: pos.y + $scroll.scrollTop() - top
                        });
                    } else {

                        $menu.hide().show(100).css({
                            left: e.pageX,
                            top: e.pageY + top
                        });
                    }*/
                },

                getUID = function () {

                    var sId = "",

                        i = 10;
                    for (; i--;) {
                        sId += Math.floor(Math.random() * 16.0).toString(16).toUpperCase();
                        if (i == 3) {
                            sId += "-";
                        }
                    }
                    return sId;
                },

                stopPropagation = function (e) {

                    if (e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble();
                    }
                };


            //append and cal contextmenu position
            uid = getUID();
            uclass = uid + '-active';
            virStyle = "<style>\r\n"+ selStr + ":hover > .e"+uid+"{\r\n display:inline-block; \r\n }\r\n</style>";

            $('head').append(virStyle);

            $(CONTEXT_MENU.replace(/_ID_/, uid)).insertAfter($(selStr,$area).last());

            $menu = $area.find('#' + uid).addClass("e"+uid);
            $menuCtn = $menu.children('.easy-popover-ctn').append(menuTemp);
            $menuTip = $menu.children('.easy-popover-tip');

            $menu.css({
                width: width,
                maxWidth: maxWidth,
                minHeight: minHeight,
                maxHeight: maxHeight,
                minWidth: minWidth,
                height: height,
                borderRadius: radius
            });

            var $hoverObj;

            initLeft = parseInt($menu.css("left"));
            initTipLeft = parseInt($menuTip.css("left"));

            delegateEvents['mouseover.' + uid] = function (e) {

                var dis,
                    left,

                    $e = $(e.target || window.event.srcElement),
                    $target;

                if ($e.closest('#' + uid).length) {
                    return
                }

                if (($target = $e.closest(selStr)).length && $menu.length) {

                    if(!$target.children(".easy-popover").length){

                        $target.append($menu).addClass(uclass);

                        dis = $area.offset().left + $area.width() - $menu.offset().left - $menu.width();

                        if(dis < 0){

                            $menu.css("left",initLeft + dis);
                            $menuTip.css("left",initTipLeft - dis);
                        }else{

                            $menu.css("left",initLeft);
                            $menuTip.css("left",initTipLeft);
                        }
                    }

                    //render
                    if (templateData) {

                        $menuCtn.empty().append($target.data(templateData) || '');
                    }
                }
            }


            for (i in delegateEvents) {

                if ((dele = i.split(' ')).length > 1) {

                    deleSel = dele[1];
                } else {
                    deleSel = '';
                }
                deleEvent = dele[0].split(".")[0];

                $area.off(deleEvent).on(deleEvent, deleSel, delegateEvents[i]);
            }

            this.$ctn = $area;
            this.$menu = $menu;
            this.$cancelCtn = $cancelCtn;
            this.version = 'p0.1';
        }
    };

    Popover.prototype = {

        constructor: Popover,
        hide: function () {
            this.$menu.hide();
        }
    };

    $.fn.easyPopover = function (opt) {
        var p;

        if ((p = this.easypopover) && p.version && p.version.indexOf('p0.1') !== -1) {

            p.set(opt);
        } else {
            p = Popover($.extend(true, {selector: this}, opt));

            $.extend(this, {'esaypopover': p});
        }

        return this;
    };
}));



