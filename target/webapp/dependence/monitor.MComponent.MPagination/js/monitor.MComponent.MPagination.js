(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";
        //信息总条数listCount，每页显示条数eachPageListNumber，显示处理的方法showContent
        var listOption = { listCount: 20, pageCount: 4},
            pageNum;

        var render = function ($widget,listOption){
            $widget.pagination({
                coping: true,
                pageCount: Math.ceil(listOption.listCount / listOption.pageCount),
                prevContent: '上页',
                nextContent: '下页',
                callback: function (api) {

                    pageNum = api.getCurrent();
                }

            });
        
        };
        if(!widget.monitor.MComponent){
            widget.monitor.MComponent = {};
        }
        widget.monitor.MComponent.MPagination = function () {

                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4];

                return {

                    render: function (listOption){
                        render($widget, listOption);
                    },

                    getPageNum:function(){
                        return pageNum;
                    }
                }

        };
    });
})();
