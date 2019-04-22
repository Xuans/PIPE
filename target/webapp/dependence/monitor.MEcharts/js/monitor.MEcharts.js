(/* <global> */function (undefined) {

    "use strict";
    (function (factory) {

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "echarts"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, _echarts) {
        "use strict";

        var echarts = _echarts || window.echarts;

        if (!widget.monitor.MEcharts) {
            widget.monitor.MEcharts = {};
        }

        return {
            getRawConfig: function (option, type) {
                delete option.theme;
                delete option.size;
                switch (type) {
                    case 'bar':
                    case 'line':
                        $.each(option.series, function (index, value) {
                            value.itemStyle = {
                                normal: {
                                    color: value.color,
                                    opacity: value.opacity
                                }
                            };

                            delete value.color;
                            delete value.opacity;
                        });
                        break;

                    case 'pie':
                        option.series = [];
                        option.series.push({
                            data: option.data,
                            center: option.location && option.location.center,
                            radius: option.location && option.location.radius,
                            type: 'pie'
                        });

                        $.each(option.data, function (index, value) {
                            option.legend.data.push(value.name);
                        });

                        delete option.data;
                        delete option.location;

                        break;
                }
                return option;
            },
            renderCharts: function ($selector, oOption, type, auiCtx) {
                var option, yOption = oOption, myChart,
                    title = yOption.title,
                    tooltip = yOption.tooltip,
                    xAxis = yOption.xAxis,
                    yAxis = yOption.yAxis,
                    series = yOption.series,
                    size = yOption.size,
                    visualMap = yOption.visualMap,
                    label = yOption.label,
                    resizeHandler = app.getUID(),
                    legendArr = [],
                    timeline = yOption.timeline,
                    table = yOption.table,
                    theme = yOption.theme,
                    optionTable = [],
                    i, j, arr = [],
                    labelRight = {
                        normal: {
                            position: 'right'
                        }
                    },
                    grid = yOption.grid,
                    axisTip = yOption.axisTip;



                $selector.css({
                    width: size.width || 'auto',
                    height: size.height || '400px'
                });
                myChart = echarts.init($selector[0], yOption.theme);

                switch (type) {
                    case "customizedPie":
                        option = {
                            backgroundColor: yOption.backgroundColor,

                            title: {
                                text: title.text,
                                subtext: title.subtext,
                                left: 'center',
                                top: 20,
                                textStyle: {
                                    color: title.textStyle
                                }
                            },

                            tooltip: {
                                trigger: 'item',
                                show: tooltip.show,
                                formatter: tooltip.formatter
                            },

                            visualMap: {
                                show: false,
                                min: visualMap.min,
                                max: visualMap.max,
                                inRange: {
                                    colorLightness: [0, 1]
                                }
                            },
                            series: [
                                {
                                    name: series.name,
                                    type: 'pie',
                                    radius: series.radius,
                                    center: ['50%', '50%'],
                                    data: series.data.sort(function (a, b) {
                                        return a.value - b.value;
                                    }),
                                    roseType: 'radius',
                                    label: {
                                        normal: {
                                            textStyle: {

                                                color: label.textStyle
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            lineStyle: {

                                                color: label.lineStyle
                                            },
                                            smooth: 0.2,
                                            length: 10,
                                            length2: 20
                                        }
                                    },
                                    itemStyle: {
                                        normal: {

                                            color: '#c23531',
                                            shadowBlur: 200,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    },

                                    animationType: 'scale',
                                    animationEasing: 'elasticOut',
                                    animationDelay: function (idx) {
                                        return Math.random() * 200;
                                    }
                                }
                            ]
                        };
                        break;
                    case "mixedColumnChart":
                        // 数据处理
                        for (i = 0; i < series.length; i++) {
                            legendArr.push(series[i].name);
                        }
                        // 处理表格
                        for (i = 0; i < table.length; i++) {
                            optionTable.push({
                                title: { text: table[i].title },
                                series: [{ data: [123, 23, 51, 23] }]
                            })
                        }
                        option = {
                            baseOption: {
                                timeline: {
                                    // y: 0,
                                    axisType: 'category',
                                    // realtime: false,
                                    // loop: false,
                                    autoPlay: timeline.autoPlay,
                                    // currentIndex: 2,
                                    playInterval: timeline.playInterval,
                                    // controlStyle: {
                                    //     position: 'left'
                                    // },
                                    data: timeline.data,
                                    label: {
                                        formatter: function (s) {
                                            return (new Date(s)).getFullYear();
                                        }
                                    }
                                },
                                title: {
                                    subtext: yOption.subtext
                                },
                                tooltip: {
                                },
                                legend: {
                                    x: 'right',
                                    show: yOption.isShowLegend,
                                    data: legendArr,

                                },
                                calculable: true,
                                grid: {
                                    top: 80,
                                    bottom: 100,
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow',
                                            label: {
                                                show: true,
                                                formatter: function (params) {
                                                    return params.value.replace('\n', '');
                                                }
                                            }
                                        }
                                    }
                                },
                                xAxis: [
                                    {
                                        'type': 'category',
                                        'axisLabel': { 'interval': 0 },
                                        name: xAxis.name,
                                        'data': xAxis.data,
                                        splitLine: { show: false }
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        name: yAxis.name
                                    }
                                ],
                                series: series
                            },
                            options: optionTable
                        };
                        break;
                    case "plusMinusColumn":
                        option = {
                            title: {
                                text: title.text,
                                subtext: title.subtext,
                                x: title.x,
                                y: title.y
                            },
                            grid:{
                                top: 80,
                                bottom: 30
                            },
                            tooltip : {
                                trigger: tooltip.trigger,
                                formatter: tooltip.formatter,
                                show: tooltip.show,

                            },
                            xAxis: {
                                type : xAxis.type,
                                name: xAxis.name,
                                nameLocation: xAxis.nameLocation,
                                position: xAxis.position,
                                splitLine: {lineStyle:{type:'solid'}},
                            },
                            yAxis: {
                                type : yAxis.type,
                                name: yAxis.name,
                                nameLocation: yAxis.nameLocation,
                                position: yAxis.position,
                                axisLine: {show: false},
                                axisLabel: {show: false},
                                axisTick: {show: false},
                                splitLine: {show: false},
                                data : yAxis.data
                            },
                            series : [
                                {
                                    name: axisTip.name,
                                    type:'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: axisTip.show,
                                            formatter: axisTip.formatter
                                        }
                                    },
                                    data:[
                                        {value: -0.07, label: labelRight},
                                        {value: -0.09, label: labelRight},
                                        0.2, 0.44,
                                        {value: -0.23, label: labelRight},
                                        0.08,
                                        {value: -0.17, label: labelRight},
                                        0.47,
                                        {value: -0.36, label: labelRight},
                                        0.18
                                    ]
                                }
                            ]
                        };
                        break;
                    default:
                        break;
                }


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
                    setOption: function (optionData) {
                        switch (type) {
                            case "customizedPie":
                                myChart.setOption({
                                    series: [
                                        {
                                            name: series.name,
                                            type: 'pie',
                                            radius: series.radius,
                                            center: ['50%', '50%'],
                                            data: optionData.sort(function (a, b) {
                                                return a.value - b.value;
                                            }),
                                            roseType: 'radius',
                                            label: {
                                                normal: {
                                                    textStyle: {

                                                        color: label.textStyle
                                                    }
                                                }
                                            },
                                            labelLine: {
                                                normal: {
                                                    lineStyle: {

                                                        color: label.lineStyle
                                                    },
                                                    smooth: 0.2,
                                                    length: 10,
                                                    length2: 20
                                                }
                                            },
                                            itemStyle: {
                                                normal: {

                                                    color: '#c23531',
                                                    shadowBlur: 200,
                                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                }
                                            },

                                            animationType: 'scale',
                                            animationEasing: 'elasticOut',
                                            animationDelay: function (idx) {
                                                return Math.random() * 200;
                                            }
                                        }
                                    ]
                                });
                                break;
                            case "mixedColumnChart":
                                optionTable=[];
                                    // 处理表格
                                    for (i = 0; i < table.length; i++) {
                                        optionTable.push({
                                            title: { text: table[i].title },
                                            series: optionData[i]
                                        })
                                    }
                                    myChart.setOption({  options: optionTable });
                                    break;
                            case "plusMinusColumn":
                                myChart.setOption({series:[{data:optionData}]});
                                break;
                            default:
                                break;
                        }

                        myChart.resize();
                    },
                    destroy: function () {
                        app.screen.removeResizeHandler(resizeHandler, true);
                    },
                    resize: function () {
                        myChart.resize();
                    },
                    show: function () {
                        $selector.removeClass('hide');
                    },
                    hide: function () {
                        $selector.addClass('hide');
                    },
                    echart: myChart,
                }


            }
        }
    });
})();
