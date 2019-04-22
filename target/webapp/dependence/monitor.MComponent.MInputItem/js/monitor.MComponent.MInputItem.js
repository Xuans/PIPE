(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "vue"], factory);
        }
        // global
        else {
            factory();
        }
    })
    (function ($, widget, Vue) {
        "use strict";

        if (!widget.monitor.MComponent) {
            widget.monitor.MComponent = {};
        }

        widget.monitor.MComponent.MInputItem = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4], ins,i,item,
                    data = $.extend(true, {},option, css.style),
                    style = css.style,
                    clickData;

                //运行时代码Start
                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll('<div id="' + attr.id + '"></div>');
                ins = new Vue({
                    el: '#' + attr.id,
                    data: data,
                    mounted:function () {
                    },
                    methods: {
                        getItem(item){
                            clickData = item;
                        }
                    }
                });

                if (css && css.cssCode && css.cssCode.className) {
                    $widget.addClass(css.cssCode.className)
                }
            style.title && $AW.cssHover(".it-wrap .it-item .it-item-normal .it-item-title",$widget,style.title,"");
                style.text && $AW.cssHover(".it-item-content",$widget,style.text,"");
                style.row && $AW.cssHover(".it-item-ctn",$widget,style.row,"");
                style.success && $AW.cssHover(".it-item-success",$widget,style.success,"");
                style.warn && $AW.cssHover(".it-item-warn",$widget,style.warn,"");
                style.danger && $AW.cssHover(".it-item-danger",$widget,style.danger,"");
                style.ctn && $AW.cssHover(".it-wrap",$widget,style.ctn,"");
                style.icon && $AW.cssHover(".it-item-icon",$widget,style.icon,"");

                return {
                    setValue: function (oData) {
                        var i,j,
                            itemDataLength = data.itemData.length,
                            item =  data.itemData;

                        for(i = 0;i < oData.length;i++){
                            for(j = 0;j<itemDataLength;j++){
                                if(oData[i].id===item[j].id){
                                    item[j].value =  oData[i].value;
                                }
                            }
                            
                        }
                    },
                    show: function () {
                        $widget.removeClass('hide');
                    },
                    hide: function () {
                        $widget.addClass("hide");
                    },
                    getClickItem: function () {
                        return clickData;
                    }
                };
            
        };
    });
})();
