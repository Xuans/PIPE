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
                context.option = $.extend(true, {}, this.setting, css.style, option);

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

                debugger: window.auiApp && window.auiApp.debugger,

                //常量表

                setting: {
                    bgColor: {},
                    number: 0,
                    state: "状态设置",
                    color: {},
                    picture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACECAYAAADiDKu9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjZEOUFBMDNDMkZFMTFFOEI4QjBDNTBBNzU4Nzg4RDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjZEOUFBMDRDMkZFMTFFOEI4QjBDNTBBNzU4Nzg4RDciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNkQ5QUEwMUMyRkUxMUU4QjhCMEM1MEE3NTg3ODhENyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNkQ5QUEwMkMyRkUxMUU4QjhCMEM1MEE3NTg3ODhENyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PifahtYAAB2TSURBVHja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"
                },


                //初始化（私有）
                _init: function () {
                    var $widget = this.$view,
                        html = [],
                        temp, el,
                        $children,
                        style = this.css.style;

                    el = this.attr.id = 'vue' + app.getUID();
                    temp = '<div id="' + el + '"></div>';//避免$widget 的id被覆盖

                    if (($children = $widget.children()).length) {
                        $children.wrapAll(temp);
                    } else {
                        $widget.empty().append(temp);
                    }
                    this.ins = this._vue(el);

                    style.positions && $AW.cssHover('div.sd-frame', $widget, style.positions, "")
                },
                _vue: function (el) {
                    var context = this
                        ;

                    return new Vue({
                        el: "#" + el,
                        data: context.option,
                        created: function () {

                        },
                        mounted: function () {
                            if (this.dashPicture) {
                                this.picture = this.dashPicture;
                            }
                        },
                        watch: {

                        },
                        methods: {

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
                        style;

                    if (css) {
                        //自定义样式
                        if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                            $widget.addClass(className)
                        }
                    }


                },

                show: function () {
                    this.$view.removeClass('hide');
                },

                hide: function () {
                    this.$view.addClass('hide');
                },

                // 输入值
                refresh: function (data) {
                    var self = this.ins,
                        $widget = this.$view,
                        $pointer1 = $widget.find(".sd-pointer1"),
                        $pointer2 = $widget.find(".sd-pointer2"),
                        $pointer3 = $widget.find(".sd-pointer3"),
                        $pointer4 = $widget.find(".sd-pointer4"),
                        $textNum = $widget.find(".sd-state-num"),
                        showPoint = function () {
                            var sbs = self.number,
                                buchang = 5,
                                deg = 242 * buchang / 100,
                                degs = sbs / buchang * deg, du = -31,
                                num = 0,
                                sb = setInterval(function () {

                                    $textNum.text(num);
                                    if (du <= 42) {
                                        $pointer3.css("transform", "rotate(" + du + "deg)");
                                    } else if (du > 42 && du <= 114) {
                                        $pointer3.css("transform", "rotate(42deg)");
                                        $pointer1.css("transform", "rotate(" + (-48 + (du - 42)) + "deg)");
                                    } else if (du > 114 && du <= 187) {
                                        $pointer3.css("transform", "rotate(42deg)");
                                        $pointer1.css("transform", "rotate(24deg)");
                                        // $(".clip4").css("transform", "rotate(-58deg)");
                                        $pointer2.css("transform", "rotate(" + (-66 + (du - 114)) + "deg)");
                                    } else if (du > 187 && du <= 336) {

                                        $pointer2.css("transform", "rotate(6.8deg)");
                                        $pointer4.css("transform", "rotate(" + (-91 + (du - 177)) + "deg)");

                                    }

                                    if (du >= degs || num >= sbs) {
                                        clearInterval(sb)
                                    }

                                    du += deg;

                                    num += buchang;
                                }, 100);


                        };

                    $pointer1.css("transform","rotate(-130deg)");
                    $pointer2.css("transform","rotate(130deg)");
                    $pointer3.css("transform","rotate(-31deg)");
                    $pointer4.css("transform","rotate(44deg)");
                    this.ins.number = data.number;
                    this.ins.state = data.state;

                    if (self.isPointer) {

                        showPoint()
                    }
                },
                //设置背景色和文字颜色
                setColor: function (backgroundColorObj, fontStyle) {

                    if (!$.isEmptyObject(backgroundColorObj)) {
                        this.ins.bgColor = backgroundColorObj;
                    }
                    if (!$.isEmptyObject(fontStyle)) {
                        this.ins.color = fontStyle;
                    }


                },


            };
            if (!widget.monitor.MComponent) {
                widget.monitor.MComponent = {};
            }

            widget.monitor.MComponent.MStatusDashBoard = function ($widget, option, attr, css, auiCtx) {
                return new Component($widget, option, attr, css, auiCtx);
            };
        });
})();