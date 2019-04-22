(function (undefined) {

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
    (function ($, widget, BScroll) {
        "use strict";

        var render = function ($widget, option, css, autoplay, loop, auiCtx) {
            var imgs, imgHtml, i, img, css,
                slideGroup, slideWrapper,
                $slideWrapper, $dot,
                imgSize, imgWidth, imgHeight,
                imgCtnCss, dotHtml,
                dotWrapper, dotWrapperCss, dotCss,
                dotActiveCss, scroll,
                pageIndex, currentIndex,
                timerHandler, resizeHandler,
                play, touch, setSlideWidth,
                selectorIndex,
                setIntervalHandler,
                timeStamp = '?version='+app.getUID(),
                _render = function () {

                    css = css.style;

                    slideGroup = '<ul class="carousel-group" data-role="slideGroup" >';
                    slideWrapper = '<div class="carousel-wrapper" data-role="slideWrapper">';
                    dotWrapper = '<div class="carousel-dot-wrapper" data-role="dotWrapper">';

                    imgSize = option.imgSize;
                    imgWidth = imgSize.width;
                    imgHeight = imgSize.height;


                    imgCtnCss = {
                        'padding-bottom': imgHeight / imgWidth * 100 + '%'
                    };

                    css.dotActive ? (dotActiveCss = css.dotActive) : (dotActiveCss = {});

                    $widget.empty().off();

                    if ((imgs = option.img) && imgs.length) {

                        imgHtml = [];
                        dotHtml = [];

                        imgHtml.push(slideWrapper);
                        imgHtml.push(slideGroup);
                        dotHtml.push(dotWrapper);


                        for (i = -1; img = imgs[++i];) {
                            imgHtml.push('<li class="carousel-item"><div class="carousel-img-ctn" data-role="imgCtn" ><img src="' + img.src+timeStamp + '"></div></li>');
                            dotHtml.push('<span class="carousel-dot" data-role="dot" data-index=' + i + '></span>');
                        }

                        imgHtml.push('</ul></div>');
                        dotHtml.push('</div>');

                        $widget.append(imgHtml.join(""));

                        $slideWrapper = $('[data-role=slideWrapper]', $widget);
                        $slideWrapper.append(dotHtml.join(''));

                        setSlideWidth = function () {
                            var width = 0,
                                slideWidth = $slideWrapper.get(0).clientWidth;
                            $('li', $widget).each(function () {
                                $(this).css({
                                    width: slideWidth + 'px'
                                });
                                width += slideWidth
                            });
                            if (loop) {
                                width += 2 * slideWidth
                            }
                            $("[data-role=slideGroup]", $widget).css({
                                width: width
                            })

                        };

                        setSlideWidth();

                        (dotWrapperCss = css.dotWrapper) && $("[data-role=dotWrapper]", $widget).css(dotWrapperCss);

                        $dot = $('[data-role=dot]', $widget);
                        (dotCss = css.dot) && $dot.css(dotCss);
                        dotActiveCss = (css.dotActive ? css.dotActive : {});

                        $dot.eq(0).addClass('carousel-dot-active').css(dotActiveCss);

                        $("[data-role=imgCtn]", $widget).css(imgCtnCss);


                        scroll = new BScroll($slideWrapper[0], {
                            scrollX: true,
                            scrollY: false,
                            momentum: true,
                            snap: {
                                loop: loop,
                                threshold: 0.2,
                                speed: 400
                            },
                            click: true
                        });

                        pageIndex = 0;


                        play = function () {

                            currentIndex = scroll.getCurrentPage().pageX;
                            touch = false;
                            pageIndex = currentIndex + 1;
                            clearTimeout(timerHandler);

                            timerHandler = setTimeout(function () {

                                $dot.eq(currentIndex - 1).removeClass("carousel-dot-active").css('background-color', '').css(dotCss);
                                if (pageIndex > imgs.length) {
                                    $dot.eq(0).addClass("carousel-dot-active").css(dotActiveCss);
                                } else {
                                    $dot.eq(pageIndex - 1).addClass("carousel-dot-active").css(dotActiveCss);
                                }

                                scroll.goToPage(pageIndex, 0, 400);
                            }, 2000);
                        };


                        scroll.on('touchEnd', function () {
                            currentIndex = this.getCurrentPage().pageX;
                            if (loop) {
                                touch = true;
                            }
                        });

                        scroll.on('scrollEnd', function () {
                            pageIndex = this.getCurrentPage().pageX;

                            if (touch === true) {
                                $dot.eq(currentIndex - 1).removeClass("carousel-dot-active").css('background-color', '').css(dotCss);
                                $dot.eq(pageIndex - 1).addClass("carousel-dot-active").css(dotActiveCss);
                            }
                            if (touch === undefined) {
                                $dot.eq(currentIndex).removeClass("carousel-dot-active").css('background-color', '').css(dotCss);
                                $dot.eq(pageIndex).addClass("carousel-dot-active").css(dotActiveCss);
                                scroll.goToPage(pageIndex, 0, 400);
                            }

                            if (this.loop) {
                                pageIndex -= 1
                            }

                            if (autoplay) {
                                play();
                            }

                        });

                        scroll.on('beforeScrollStart', function () {
                            if (autoplay) {
                                clearTimeout(timerHandler)
                            }
                        });

                        $widget.off('click.carouselFigure').on('click.carouselFigure', function (e) {
                            var $target = $(e.target || event.srcElement).closest('li'),
                                length = option.img.length || 1;

                            selectorIndex = ($target.index() + length - 1 ) % length;

                            $widget.removeAttr('data-aweb-event');
                        });

                        if (autoplay) {
                            play();
                            setInterval(function () {

                                if (!$widget.height()) {

                                    scroll.trigger('scrollEnd');
                                }
                            }, 2000);
                        }
                    }
                };


            setIntervalHandler = setInterval(function () {
                if ($widget.height()) {
                    clearInterval(setIntervalHandler);


                    _render();

                }
            }, 200);


            if (auiCtx) {
                return {
                    display: function (result) {
                        $widget[result ?'removeClass': 'addClass' ]('hide');
                    },
                    show: function () {
                        $widget.removeClass('hide');
                    },
                    hide: function () {
                        $widget.addClass('hide');
                    },
                    getClickImgInfo: function () {
                        return option.img[selectorIndex] || {};
                    },
                    refresh: function (responseData) {
                        option.img = responseData;
                        scroll && scroll.destroy();
                        _render($widget, option, css, autoplay, loop);
                        if (autoplay) {
                            play();
                        }
                    }

                }
            }
        };


        if (!widget.mobile.SoYComponent) {
            widget.mobile.SoYComponent = {};
        }

        widget.mobile.SoYComponent.SoYCarouselFigure = function () {
            var widgetIns,
                $widget,
                option, css, setIntervalHandler, option, attr, css, auiCtx;

                $widget = arguments[0];
                option = arguments[1];
                attr = arguments[2];
                css = arguments[3];
                auiCtx = arguments[4];

                $widget.css({
                    'min-height': '1px'
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className);
                }

                return render($widget, option, css, true, true, auiCtx);
            

        };
    });
})();