(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "echarts"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, echarts) {
        "use strict";

        var Component = function (widgetIns, $widget, option, attr, css, auiCtx) {
            var context = this;


            context.widgetIns = widgetIns;
            context.$view = $widget;
            context.option = option;
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;
            context.resizeHandler = app.getUID();


            //初始化
            context._init();
            //渲染样式
            context._render();
        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 4.4 YuQ',
            author: 'zhanghaixian@agree.com',

            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    widgetIns = this.widgetIns,
                    option = this.option,
                    attr = this.attr,
                    auiCtx = this.pageContext,
                    context = this,
                    myChart,
                    newData = [],
                    i, item,
                    blankItem,
                    data,
                    html = [],

                    addResizeHandler = function () {
                        app.screen.addResizeHandler({
                            uid: context.resizeHandler,
                            isGlobal: true,
                            timeout: 220,
                            callback: function () {
                                context.chart.resize();
                            }
                        })
                    };



                option.legend = option.legend || {data: []};
                option.legend.data = option.legend.data || [];

                blankItem = {
                    value: option.blank, name: '',
                    itemStyle: {
                        normal: {
                            color: '#fff'
                        }
                    }
                };
                option.series.type = 'pie';
                option.series.radius = ['30%', '50%'];
                option.series.avoidLabelOverlap = false;
                data = $.isArray(option.series.data) ? option.series.data : (option.series.data.elements || []);
                for (i = -1; item = data[++i];) {

                    // 对 item.name 进行国际化翻译
                    // 暂不对 item.edmKey 进行国际化翻译
                    item.name = (widgetIns && widgetIns.nsl(item.name)) || $AW.nsl(item.name, attr.id, auiCtx);
                    newData.push(blankItem);
                    newData.push(item);
                    option.legend.data.push('');
                    option.legend.data.push(item.name);
                }
                option.series.data = newData;



                $widget.css({
                    height: (option.size && option.size.height) || '260px',
                    width: (option.size && option.size.width) ||'auto',
                    'background-color':'#fff'
                });

                myChart = echarts.init($widget[0], option.theme);
                myChart.setOption(option);

                this.chart = myChart;

                addResizeHandler();
                myChart.resize();
                $widget.append(html);

            },


            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    style;
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }

                if (css && (style = css.style)) {
                    style.canvasStyle && ($widget.children('div')||$widget).css(style.canvasStyle);
                }

            },

            pause: function () {
                app.screen.removeResizeHandler(this.resizeHandler, true);
            },

            resume: function () {
                this.chart.resize();
            },
            setOption: function (option) {
                this.chart.setOption(option);
                this.chart.resize();
                return this.chart;
            },
            resize: function () {
                this.chart.resize();
            },

            destroy: function () {
                app.screen.removeResizeHandler(this.resizeHandler, true);
                this.chart.dispose();
            },

            setter: function (linkList) {

                var //模板
                    TEMPLATE = '<a data-href="_value_">_name_</a>',
                    //填充数据
                    html = [],
                    //中间变量
                    i, item,

                    $widget = this.$view;

                //清空上次的内容
                $widget.empty();

                if (linkList && linkList.length) {//校验输入数据
                    for (i = -1; item = linkList[++i];) {
                        html.push(
                            TEMPLATE
                                .replace(/_name_/ig, item.name)
                                .replace(/_value_/ig, item.href)
                        );
                    }
                    //填充内容
                    $widget.append(html.join(''));
                }
            },

            validateHandler: function (value) {
                return {
                    result: true, //校验结果
                    value: value, //传输的格式
                    errorMsg: '' //校验失败的错误提示
                }
            },

            behavior: function (result, input1, input2, condition) {
                this[result ? 'show' : 'hide']();
            },

            show: function () {
                this.$view.removeClass('hide');
            },

            hide: function () {
                this.$view.addClass('hide');
            }
        };

        if (!widget.mobile.SoYComponent) {
            widget.mobile.SoYComponent = {};
        }

        widget.mobile.SoYComponent.SoYPieChart = function () {
            var
                $widget, option, attr, css, auiCtx;

                $widget = arguments[0];
                option = arguments[1];
                attr = arguments[2];
                css = arguments[3];
                auiCtx = arguments[4];

                //运行时代码Start
                return new Component(null, $widget, option, attr, css, auiCtx);
                //运行时代码End
            
        };
    });
})();
