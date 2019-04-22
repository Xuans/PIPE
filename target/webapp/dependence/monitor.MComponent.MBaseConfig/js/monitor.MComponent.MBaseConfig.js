(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget" ,"baseConfig"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget ,base) {
        "use strict";

        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model
            context.$view = $widget;
            context.option = $.extend(true, {}, this.setting, option);
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;

            context._init();

        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',

            debug: window.auiApp && window.auiApp.debug,

            //常量表
            setting: {},

            _init: function () {
                var $widget = this.$view,
                    attr = this.attr,
                    html = [],
                    fakeOption =[{   
                        name: 'url',
                        type: 'string_select',
                        desp: '后台URL',
                        valueArray: [],
                        despArray: [],
                        defaultValue: ''
                    },
                  
                    {
                        name: 'type',
                        type: 'string_select',
                        desp: '展示类型(图表类组件)',
                        valueArray: ['','bar', 'line','pie'],
                        despArray: ['默认','柱状图', '折线图', '饼图'],
                        defaultValue: ''
                    },
                    {
                        name: 'api',
                        type: 'string_select',
                        desp: '组件API',
                        valueArray: [],
                        despArray: [],
                        defaultValue: ''
                    },
                    {
                        name: 'event',
                        type: 'string_select',
                        valueArray: [],
                        despArray: [],
                        desp: '事件范围'
                    }, {
                        name: 'eventType',
                        type: 'string_select',
                        desp: '事件类型',
                        valueArray: ['click', 'change'],
                        despArray: ['点击', '值变化'],
                        defaultValue: 'click'
                    }];

                 $widget.attr('id',attr.id);
                if (window.auiApp) {
                      base.baseConfig(attr.id, {}, fakeOption);
                }

            },
            
            baseConfig: function (configObj,configArr,callback) {
                var attr = this.attr,
                    baseIns;
                baseIns = base.baseConfig(attr.id, configObj, configArr, function (arg) {
                
                    if (arg.newObj) {
                        
                        callback && callback(arg.newObj, arg);
                        
                    }
                });
                
            },

            show: function () {
                this.$view.removeClass('hide');
            },

            hide: function () {
                this.$view.addClass('hide');
            },

        };
        if(!widget.monitor.MComponent){
            widget.monitor.MComponent={};
        }

        widget.monitor.MComponent.MBaseConfig = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();