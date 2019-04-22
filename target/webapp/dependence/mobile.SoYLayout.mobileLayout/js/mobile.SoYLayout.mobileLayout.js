   (function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        if (!widget.mobile.SoYLayout) {
            widget.mobile.SoYLayout = {};
        }

        widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE].join('.mobile.SoYLayout.mobileLayout,') + '.mobile.SoYLayout.mobileLayout', function (type, oWidget) {
            var option, childrenIns;

            oWidget && oWidget.length && oWidget.each(function (index, elem) {

                oWidget = oWidget.eq(index);

                if (oWidget.href && oWidget.href() === 'mobile.SoYLayout.mobileLayout') {
                    option = oWidget.option();

                    oWidget.drop(false);

                    for (var i = oWidget.children().length;i<3;i++) {

                        (function(i){
                            oWidget.append('divCtn', function (newCtn) {

                                switch(i){
                                    case 0:
                                        newCtn.attr({
                                            widgetName:'顶部导航栏',
                                            desp:'顶部导航栏'
                                        });
                                        break;

                                    case 1:
                                        newCtn.attr({
                                            widgetName:'主容器',
                                            desp:'主容器'
                                        });
                                        break;

                                    case 2:
                                        newCtn.attr({
                                            widgetName:'底部导航栏',
                                            desp:'底部导航栏'
                                        });
                                        break;

                                    default:
                                        break;
                                }

                                newCtn.del(false) && newCtn.drag(false);
                                oWidget.option(option,true);
                            });

                        })(i)
                    }

                    childrenIns = oWidget.children();

                    if(childrenIns.length === 3){
                        childrenIns.first().accept(option.hasHeader);
                        childrenIns.last().accept(option.hasFooter);
                    }

                }
            })

        });


            widget.mobile.SoYLayout.mobileLayout = function () {
                    var $widget = arguments[0],
                        option = arguments[1],
                        attr = arguments[2],
                        css = arguments[3],
                        auiCtx = arguments[4],
                        $top, $ctt, $title,$bottom,$main,$children,MobileLayout,
                        scrollHeight, cttOpacity, style;

                    if(css && css.cssCode && css.cssCode.className){
                        $widget.addClass(css.cssCode.className)
                    }



                    $children = $widget.children();

                    $top = $children.first();
                    $main = $children.eq(1);
                    $bottom = $children.last();

                    css && (css = css.style);

                    option.hasHeader?$top.addClass('mobileLayout-top'):$top.addClass('hide');
                    option.hasFooter?$bottom.addClass('mobileLayout-bottom'):$bottom.addClass('hide');

                    $main.addClass('mobileLayout-main');

                    $main.css({
                        height:$(window).outerHeight()-$top.outerHeight()-$bottom.outerHeight()
                    });


                    css.main && $main.css(css.main);



                    if(option.hasHeader && option.isDynamic) {
                        $widget.addClass('mobileLayout-dynamic');

                        $main.css({
                            height:$(window).outerHeight()-$bottom.outerHeight()
                        });


                        $main.off('scroll.mobileLayout').on('scroll.mobileLayout', function () {

                            scrollHeight = $(this).scrollTop();

                            if (scrollHeight >= option.scrollHeight) {

                                cttOpacity = 1
                            } else {
                                cttOpacity = scrollHeight / option.scrollHeight;
                            }
                            $top.css({
                                opacity: cttOpacity
                            });
                        })
                    }

                    $(window).off('resize.mobileLayout').on('resize.mobileLayout', function () {
                    	if(option.hasHeader && option.isDynamic){
                            $main.css({
                                height:$(window).outerHeight()-$bottom.outerHeight()
                            });
                        }else{
                            $main.css({
                                height:$(window).outerHeight()-$top.outerHeight()-$bottom.outerHeight()
                            });
                        }
                    });


                    return {

                        show: function () {
                            $widget.removeClass('hide');
                        },
                        hide: function () {
                            $widget.addClass('hide');
                        }



                    }

            };
        });
    })();
