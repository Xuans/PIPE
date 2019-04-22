(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget" ,"echarts4.2", "echarts-gl"], factory);
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

            widget.monitor.MEcharts.M3Dbar = function (obj, oOption, attr, css) {
                var $div, oWidget, $widget, option, yOption = oOption, auiCtx, myChart,
                    title = yOption.title,
                    visualMap = yOption.visualMap,
                    grid3D = yOption.grid3D,
                    xAxis = yOption.xAxis,
                    yAxis = yOption.yAxis,
                    size = yOption.size,
                    data = yOption.data,
                    emphasis = yOption.emphasis;
                
                obj.css({
                    width: size.width || '400px',
                    height: size.height || '400px'
                });

                
                myChart = echarts.init(obj[0]);

                option = {
                    title: {
                        text: title.text,
                        subtext: title.subtext
                    },
                    tooltip: {},
                    visualMap: {
                        // 图列数值
                        max: visualMap.max,
                        inRange: {
                            color: visualMap.color
                        }
                    },
                    xAxis3D: {
                        type: 'category',
                        data: xAxis.data,
                        name: xAxis.name
                    },
                    yAxis3D: {
                        type: 'category',
                        data: yAxis.data,
                        name: yAxis.name
                    },
                    zAxis3D: {
                        type: 'value'
                    },
                    grid3D: {
                        boxWidth: grid3D.boxWidth,
                        boxDepth: grid3D.boxDepth,
                        viewControl: {
                            // projection: 'orthographic'
                        },
                        light: {
                            main: {
                                intensity: 1.2,
                                shadow: true
                            },
                            ambient: {
                                intensity: 0.3
                            }
                        }
                    },
                    series: [{
                        type: 'bar3D',
                        data: data.map(function (item) {
                            return {
                                value: [item[1], item[0], item[2]],
                            }
                        }),
                        shading: 'lambert',

                        label: {
                            textStyle: {
                                fontSize: 16,
                                borderWidth: 1
                            }
                        },

                        emphasis: {
                            label: {
                                textStyle: {
                                    // 选中图形顶字体
                                    fontSize: emphasis.fontSize,
                                    color: emphasis.color
                                }
                            },
                            itemStyle: {
                                // 选中图形颜色
                                color: emphasis.itemStyle
                            }
                        }
                    }]
                };


                
                myChart.setOption(option);
               // myChart.resize();

                return {
                    setOption: function (optionData) {
                        myChart.setOption({ series: [{ data: optionData }] });
                        // myChart.resize();
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