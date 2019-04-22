(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget" ], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget ) {
        "use strict";

        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model
            context.$view = $widget;
            context.option = option;
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;

            //View Model
            context.viewCache = {};

            //初始化
            context._init();


        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',

            debug: window.auiApp && window.auiApp.debug,

            //常量表
            //constant:{},
            setting: {
                normal:'flex-layout-normal',
                percent:'flex-layout-percent',
                flow:'flex-layout-flow',
                'holy-grail':'flex-layout-holy-grail',
                fixed:'flex-layout-fixed-foot',
                media:'flex-layout-media'
            },


            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    option = this.option,
                    setting = this.setting;

                $widget.removeClass().addClass('flex-layout '+setting[option.type]);

                if(option.type ==='percent' && option.subCtn && option.subCtn.length){
                    option.subCtn.forEach(function (item) {
                        $(':nth-child('+item.index+')',$widget).addClass(item.percent);
                    })
                }
            },
            //渲染主题、样式（私有）
            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    cssCode,
                    className,
                    style;

                if (css) {
                    //自定义样式
                    if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                        $widget.addClass(className);
                    }
                }


            },

            destroy: function () {
                this.$view.off().empty();
            },


            show: function () {
                this.$view.removeClass('hide');
            },


            hide: function () {
                this.$view.addClass('hide');
            }
        };
        if(!widget.monitor.MLayout){
            widget.monitor.MLayout={};
        }

        widget.monitor.MLayout.MFlexRowCtn = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();