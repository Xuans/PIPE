(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget" ,"echarts"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget ,echarts) {
        "use strict";


        var render = function (widgetIns, $widget, option, attr, css, auiCtx) {
            var html = [],
                style,
                theme,
                myChart,
                cache = {},
                xAxisType,
                index,
                value,
                series,
                width = option.size && option.size.width,
                height = option.size && option.size.height,
                resizeHandler,
                i,item,j,temp,
                date = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],

                data = ['3050','500','1000','560','604','800','986','503','992','4420','590','902'],

                addResizeHandler = function () {
                    resizeHandler = app.getUID();
                    app.screen.addResizeHandler({
                        uid: resizeHandler,
                        isGlobal: true,
                        timeout: 220,
                        callback: function () {
                            myChart.resize();
                        }
                    })};


            option.legend = option.legend || {data: []};
            option.legend.data = option.legend.data || [];

            if (option && option.xAxis) {
                xAxisType = option.xAxis[0].type;
                option.xAxis[0].type = 'category';
                option.xAxis[0].boundaryGap = false;
                option.xAxis[0].splitArea = {
                    show: false
                };
                option.xAxis[0].splitLine = {
                    show: false
                };
                    option.xAxis[0].data = date;

                series = $.isArray(option.series) ? option.series : (option.series.elements || []);

                for(index=-1;value=series[++index];) {
                    value.smooth = true;
                    value.symbol = 'none';
                    value.sampling = 'average';
                    value.itemStyle = {
                        normal: {
                            color: value.color
                        }
                    };

                    value.areaStyle ={
                        normal:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: value.areaStartColor}, {offset: 1,color: value.areaEndColor}])
                        }
                    };
                    value.data = data;
                    delete value.edmItemId;
                    delete value.edmKey;

                    option.legend.data.push(value.name);

                }
                option.series = series;

            }
            if(option && option.yAxis){
                option.yAxis[0].splitArea = {
                    show: true
                };
            }
            if (xAxisType === 'time' || xAxisType === 'categoryDynamic') {
                if (!option.xAxis[0].data || ($.isArray(option.xAxis[0].data) && option.xAxis[0].data.length === 0)) {
                    option.xAxis[0].data = [0];
                }
                for ( i = 0; i < option.xAxis[0].data.length; i++) {
                    $.each(option.series, function (index, value) {
                        value.data = [0];
                    });
                }
            }

            $widget.css({
                height: (option.size && option.size.height) || '260px',
                width: (option.size && option.size.width) ||'auto'
            });

            myChart = echarts.init($widget[0],option.theme);

            if (widgetIns) {
                option.title.text = widgetIns.nsl(option.title.text);

                for ( i = -1; item = option.legend.data[++i];) {
                    item = widgetIns.nsl(item);
                    option.legend.data[i] = item;
                }

                for ( i = -1; item = option.series[++i];) {
                    item.name = widgetIns.nsl(item.name);
                }

                if (option.yAxis) {

                    for ( i = -1; item = option.yAxis[++i];) {
                        item.name = widgetIns.nsl(item.name);

                        if (item.data) {

                            for ( j = -1; temp = item.data[++j];) {

                                if (typeof temp === 'string') {
                                    temp = widgetIns.nsl(temp);
                                    item.data[j] = temp;
                                }
                            }
                        }
                    }
                }
                
                if (option.xAxis) {

                    for ( i = -1; item = option.xAxis[++i];) {
                        item.name = widgetIns.nsl(item.name);

                        if (item.data) {

                            for ( j = -1; temp = item.data[++j];) {

                                if (typeof temp === 'string') {
                                    temp = widgetIns.nsl(temp);
                                    item.data[j] = temp;
                                }
                            }
                        }
                        
                    }
                }
            } else {
                option.title.text = $AW.nsl(option.title.text, attr.id, auiCtx);

                for ( i = -1; item = option.legend.data[++i];) {
                    item = $AW.nsl(item, attr.id, auiCtx);
                    option.legend.data[i] = item;
                }

                for ( i = -1; item = option.series[++i];) {
                    item.name = $AW.nsl(item.name, attr.id, auiCtx);
                }

                if (option.yAxis) {

                    for ( i = -1; item = option.yAxis[++i];) {
                        item.name = $AW.nsl(item.name, attr.id, auiCtx);

                        if (item.data) {

                            for ( j = -1; temp = item.data[++j];) {

                                if (typeof temp === 'string') {
                                    temp = $AW.nsl(temp, attr.id, auiCtx);
                                    item.data[j] = temp;
                                }
                            }
                        }
                        
                    }
                }
                
                if (option.xAxis) {

                    for ( i = -1; item = option.xAxis[++i];) {
                        item.name = $AW.nsl(item.name, attr.id, auiCtx);

                        if (item.data) {

                            for ( j = -1; temp = item.data[++j];) {

                                if (typeof temp === 'string') {
                                    temp = $AW.nsl(temp, attr.id, auiCtx);
                                    item.data[j] = temp;
                                }
                            }
                        }
                        
                    }
                }
                
            }



            myChart.setOption(option);
            myChart.resize();
            addResizeHandler();
            $widget.append(html);

            
            return {
                myChart: myChart,
                echart: myChart,

                pause:function(){
                    app.screen.removeResizeHandler(resizeHandler, true);
                },
                resume:function(){
                    addResizeHandler();
                    myChart.resize();
                },

                refresh:function(xdate,ydata){
                  data = ydata;
                  date = xdate;
                },
                setOption: function (option,notMerge) {
                    myChart.setOption(option,notMerge);
                    myChart.resize();
                    return myChart;
                },
                resize: function () {
                    myChart.resize();
                },

                destroy: function () {
                    app.screen.removeResizeHandler(resizeHandler, true);

                    myChart.dispose();
                },

                display: function (result, input1, input2, condition) {
                    this[result ? 'show' : 'hide']();
                },

                show: function () {
                    $widget.removeClass('hide');

                    myChart.resize();
                },
                hide: function () {
                    $widget.addClass('hide');
                }
            }
        };

        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }

        widget.mobile.SoYComponent.SoYLineChart = function () {
            var widgetIns, eventHandler,
                $widget, option, attr, css, auiCtx;

                $widget = arguments[0];
                option = arguments[1];
                attr = arguments[2];
                css = arguments[3];
                auiCtx = arguments[4];

                //运行时代码Start
                return render(null, $widget, option, attr, css, auiCtx);
                //运行时代码End
            
        };
    });
})();
