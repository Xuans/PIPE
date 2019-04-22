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

        if(!widget.mobile.SoYCtn) {
            widget.mobile.SoYCtn = {};
        }

        widget.mobile.SoYCtn.mobileCtn = function () {

            var widgetIns, $widget, css,

                render = function ($widget, css) {
                    if(css && css.cssCode && css.cssCode.className){
                        $widget.addClass(css.cssCode.className)
                    }
                    if ((css = css.style) && css.ctnLayout) {
                        $widget.css(css.ctnLayout)
                    }
                };

                $widget = arguments[0];
                css = arguments[3];

                render($widget, css);

                $(window).off('resize.mobileCtn').on('resize.mobileCtn', function () {
                    render($widget, css)
                });
                return{
                    display: function (result, input1, input2, condition) {
                        $widget[result?'removeClass':'addClass']('hide');
                    },
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
