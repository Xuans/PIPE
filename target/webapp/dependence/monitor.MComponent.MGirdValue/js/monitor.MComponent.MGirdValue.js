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

            context.$view = $widget;
            context.option = $.extend(true, {}, this.setting,css.style, option);

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
                boxWidth:{},
                boxPadding:{},
                rowIcon:{},
                rowTitle:{},
                colBgcolor:{},
                colTitle:{},
                colDetail:{},
                colIcon:{},
                colPicture: {},
                text:{},
                colUtitle:{},
                data:{},
                viewData:{},
                className:{},
                padding:{},
                paddingTop:{},
                paddingRight:{},
                paddingBottom:{},
                paddingLeft:{},
                renderData:[]

            },


            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    html = [],
                    temp, el,
                    $children,
                    row = this.option.row,i,j,
                    renderData = this.option.renderData,
                    colElement;

                el = this.attr.id = 'vue' + app.getUID();

                temp = '<div id="' + el + '"></div>';//避免$widget 的id被覆盖
                
                if (($children = $widget.children()).length) {
                    $children.wrapAll(temp);
                } else {
                    $widget.empty().append(temp);
                }

                for(i = 0;i<row.length;i++){
                    if(row[i].col.elements){
                        colElement = row[i].col.elements;
                        for(j = 0;j<colElement.length;j++){
                            colElement[j].bgColorCss = {"background-color":"#f7f7f7"};
                            colElement[j].titleColorCss = {};
                            colElement[j].textColorCss = {};
                            if(colElement[j].bgColor){
                                renderData.push({
                                        name: row[i].col.keys[j],
                                        bgColor: colElement[j].bgColor,
                                        value:0,
                                        row: i,
                                        col: j
                                    })
                            }
                        }
                    }
                }

                this.ins = this._vue(el);
            },
            _vue: function (el) {
                var context = this;

                return new Vue({
                    el: "#" + el,
                    data:context.option,
                    created: function () {
                        var i,col;

                        for(i  = 0; i<this.row.length;i++){
                            col = this.row[i].col;
                            this.row[i].elements = col.elements;
                            this.row[i].colFields = col.fields;
                            this.row[i].colKeys = col.keys;
                        }

                    },
                    mounted: function () {


                    },
                    watch: {

                    },
                    methods: {
                        getItem (item,v,index2) {
                            this.data = {item:item.edmKey,
                                content:this.viewData[v.colKeys[index2]]
                            };
                        },
                    },
                    computed: {
                        test: function () {

                        }
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

            // 设置数据
            refresh: function (data) {
                var renderData = this.option.renderData,
                    colElement,
                    renderItem,
                    elementsItem,
                    bgItem,
                    i,j;

                this.ins.viewData = data;

                for(i = 0;i<renderData.length;i++){
                    renderItem = renderData[i];

                    for(j = 0;j<renderItem.bgColor.length;j++){
                        colElement =  this.option.row[renderItem.row].col.elements;
                        elementsItem = colElement[renderItem.col];
                        bgItem = renderItem.bgColor[j];

                        if(data[renderItem.name]>renderItem.bgColor[j].max){
                           elementsItem.bgColorCss = {"background-color": bgItem.bgColor};
                           elementsItem.titleColorCss = {"color": bgItem.titleColor};
                           elementsItem.textColorCss = {"color": bgItem.textColor}
                        }else{
                            elementsItem.bgColorCss = {};
                            elementsItem.titleColorCss = {};
                            elementsItem.textColorCss = {}
                        }
                    }
                }


            },
            // 获得点击项数据
            getClickItem: function () {

                return this.ins.data;
            },

        };
        if(!widget.monitor.MComponent){
            widget.monitor.MComponent={};
        }

        widget.monitor.MComponent.MGirdValue= function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();