(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget","echarts", "monitor.MEcharts" ], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,echarts, MEcharts) {
        "use strict";

        if(!widget.monitor.MEcharts){
            widget.monitor.MEcharts = {};
        }
        
        widget.monitor.MEcharts.MCustomizedPie = function (obj, oOption,attr,css) {
            return MEcharts.renderCharts(obj,oOption,"customizedPie");
        };

        return widget;
    });
})();