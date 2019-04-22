(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "vue"  ], factory);
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
            setting: {
              allKey: false,
              turnKey: false,
              titleClass: {},
              allClass: {},
              itemClass: {},
              ctnClass: {},
              filterHoverClass: {},
              filterClass: {},
              checkValue:[],
              allValue:[]
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
                        // 全选
                        clickAll() {
                            var option = context.option;

                            option.checkValue === option.allValue ? option.checkValue = [] : option.checkValue = option.allValue;
                            
                        },
                        turnOpen() {
                            context.option.turnKey === true ? context.option.turnKey = false : context.option.turnKey = true;
                        },

                    },
                    computed: {
                    }
                })
            },
            //绑定事件  
            _listen: function() {
                
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
                        $widget.addClass(className)
                    }
                    style.filterClass && $AW.cssHover(".df-icon",$widget,style.filterClass,"");
                    style.filterHoverClass && $AW.cssHover(".df-show",$widget,style.filterHoverClass,"");
                }


            },
   
            show: function () {
                this.$view.removeClass('hide');
            },

            hide: function () {
                this.$view.addClass('hide');
            },
            
            // 设置数据
            refresh: function (data) {
                var i,dataLength=data.length,arr=[];

                for(i = 0;i < dataLength;i++){
                    arr.push({itemName:data[i]})
                }
                this.option.allValue = data;
                this.option.data = arr;
            },
            // 获得勾选项数据
            getChecked: function () {
                return this.ins.checkValue;
            },

        };
        if(!widget.monitor.MComponent){
            widget.monitor.MComponent={};
        }
        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        widget.monitor.MComponent.MDropDownFilter = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();