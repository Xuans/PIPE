(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget" ,"echarts4.2"], factory);
        }
        // global
        else {
            factory();
        }

    })
        (function ($, widget, echarts) {
            "use strict";

            if (!widget.monitor.MEcharts) {
                widget.monitor.MEcharts = {};
            }

            widget.monitor.MEcharts.MStackedArea = function (obj, oOption, attr, css) {
                var $div, oWidget, $widget, option, yOption = oOption, auiCtx, myChart,
                    title = yOption.title,
                    legend = yOption.legend,
                    theme = yOption.theme,
                    xAxis = yOption.xAxis,
                    yAxis = yOption.yAxis,
                    size = yOption.size,
                    label = yOption.label,
                    series = yOption.series,
                    resizeHandler = app.getUID(),
                    tempdata=[],tempLegend=[],i;
                
                obj.css({
                    width: size.width || '400px',
                    height: size.height || '400px'
                });

                for(i = 0;i < series.length;i++){
                    tempdata.push({ 
                        name: series[i].name,
                        type:'line',
                        stack: series[i].stack,
                        areaStyle: {},
                        data: series[i].data,
                        itemStyle:{
                            normal: {
                                color: series[i].color || ""
                            }
                        }
                    });
                    tempLegend.push(series[i].name)
                }
                
                myChart = echarts.init(obj[0],theme);

                option = {
                    title: {
                        text: title.text,
                        subtext: title.subtext,
                        x: title.x,
                        y: title.y 
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: label.backgroundColor,
                                color: label.color
                            }
                        }
                    },
                    legend: {
                        orient: legend.orient,
                        align: legend.align,
                        x: legend.x,
                        y: legend.y,
                        data: tempLegend
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            name: xAxis.name,
                            data : xAxis.data
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name: yAxis.name
                        }
                    ],
                    series :tempdata
                };

                myChart.setOption(option);
                myChart.resize();

                app.screen.addResizeHandler({
                    uid: resizeHandler,
                    isGlobal: true,
                    timeout: 220,
                    callback: function () {
                        myChart.resize();
                    }
                });

                return {
                    setOption: function (mydata) {
                        var tempLegend = [],
                            tempdata = [],
                            i;
                            
                        for(i = 0;i < series.length;i++){
                            tempdata.push({ 
                                name: series[i].name,
                                type:'line',
                                stack: series[i].stack,
                                areaStyle: {},
                                data: mydata[i],
                                itemStyle:{
                                    normal: {
                                        color: series[i].color || ""
                                    }
                                }
                            });
                            tempLegend.push(series[i].name)
                        }
                        myChart.setOption({ 
                            series: tempdata,
                            legend: {
                                orient: legend.orient,
                                align: legend.align,
                                x: legend.x,
                                y: legend.y,
                                data: tempLegend
                            }
                        });
                        myChart.resize();
                        tempLegend = [];
                        tempdata = [];
                    },
                    destroy: function () {
                        app.screen.removeResizeHandler(resizeHandler, true);
                    },
                    resize: function () {
                        myChart.resize();
                    },
                    echart: myChart,
                }
            };

            return widget;
        });
})();