(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "vue" ], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, Vue ) {
        "use strict";

        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model

            context.$view = $widget;
            context.option = $.extend(true, {}, this.setting,css.style, option);

            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;


            //View Model
            context.viewCache = {};


            //初始化
            context._init();

            //渲染样式
            context._render();


        };


        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',

            debugger: window.auiApp && window.auiApp.debugger,

            //常量表
            //constant:{},
            setting: {
               contant:{},
               btnPosition:{},
                btnWidth :{},
                clickBtn:{}
            },

            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    html = [],
                    temp, el,
                    $children;

                el = this.attr.id = 'vue' + app.getUID();

                temp = '<div id="' + el + '"></div>';//避免$widget 的id被覆盖

                if (($children = $widget.children()).length) {
                    $children.wrapAll(temp);
                } else {
                    $widget.empty().append(temp);
                }
                this.ins = this._vue(el);
            },
            _vue: function (el) {
                var context = this;

                return new Vue({
                    el: "#" + el,
                    data:context.option,
                    created: function () {

                    },
                    mounted: function () {
                    },
                    watch: {

                    },
                    methods: {
                        addActive (e) {
                            var $target = $(e.target||e.srcElement),
                                $btn = $target.closest("button");

                            $btn.siblings().removeClass("active");
                            $btn.addClass("active");
                        },
                        getter(item) {
                            if(item) this.clickBtn = item;
                            console.log(this.clickBtn);
                            return this.clickBtn;
                        }
                    },
                    computed: {
                        
                    }
                })
            },

            //渲染主题、样式（私有）
            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    cssCode,
                    className,
                    style = css.style;

                if (css) {
                    //自定义样式
                    if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                       $widget.addClass(className);
                    }
                    style.btn && $AW.cssHover(".mode button",$widget,style.btn,"");
                    style.btnHover && $AW.cssHover(".mode button",$widget,style.btnHover,":hover");
                    style.btnActive && $AW.cssHover(".mode button.active",$widget,style.btnActive,"");
                    style.ctn && $AW.cssHover(".mode",$widget,style.ctn,"");
                }


            },

            show: function () {
                this.$view.removeClass('hide');
            },

            hide: function () {
                this.$view.addClass('hide');
            },
            setBtnGroup: function  (data) {
                this.option.col = data;
        },
            getBtn: function () {
                this.ins.getter()
            }

        };
        if(!widget.monitor.MComponent){
            widget.monitor.MComponent={};
        }

        widget.monitor.MComponent.MSelectBtnGroup = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();