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

        widget.monitor.MComponent.MMessageList = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4], ins,i,j,item,
                    list = option.list,
                    data = $.extend(true, {},option, css.style),
                    style = css.style,
                    optionArr = [],
                    clickItemData={};

                // 处理数据数组
                for(i = 0;i < list.length;i++){
                    optionArr.push([list[i].title]);
                    item = list[i].item;
                    for(j = 0;j < item.length;j++){
                        optionArr[i].push([item[j].id,item[j].itemTitle,item[j].text,item[j].tiem,item[j].state])
                    }
                }
                //运行时代码Start
                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll('<div id="' + attr.id + '"></div>');
                ins = new Vue({
                    el: '#' + attr.id,
                    data: data,
                    mounted:function () {
                    },
                    methods: {
                        getItem:function (itemID) {
                            var list = data.list;

                            data.list.forEach(function (listItem) {
                                clickItemData = listItem.item.filter(item=> {return item.id === itemID})[0];
                            })

                        }
                    }
                });

                if (css && css.cssCode && css.cssCode.className) {
                    $widget.addClass(css.cssCode.className)
                }
            style.ctn && $AW.cssHover(".ml-wrap",$widget,style.ctn,"");
                style.title && $AW.cssHover(".ml-wrap .ml-list .ml-list-title",$widget,style.title,"");
                style.itemTitle && $AW.cssHover(".ml-wrap .ml-list .ml-item .ml-item-title",$widget,style.itemTitle,"");
                style.text && $AW.cssHover(".ml-wrap .ml-list .ml-item .ml-item-text",$widget,style.text,"");
                style.time && $AW.cssHover(".ml-wrap .ml-list .ml-item .ml-item-footer",$widget,style.time,"");
                style.unread && $AW.cssHover(".ml-item-unread",$widget,style.unread,"");
                style.read && $AW.cssHover(".ml-item-readed",$widget,style.read,"");

                return {
                    refresh: function (oData) {
                        data.list = oData;
                    },
                    addNews: function(oData) {
                        var i;
                        for(i = 0;i<oData.length;i++){
                            data.list.unshift(oData[i]);
                        }
                    },
                    addActiveNew: function(oData){
                        for(i = 0;i<oData.length;i++){
                            data.list[0].item.unshift(oData[i]);
                        }
                    },
                    show: function () {
                        $widget.removeClass('hide');
                    },
                    hide: function () {
                        $widget.addClass("hide");
                    },
                    getClickItem: function (e) {
                        return clickItemData;
                    },
                    getAll: function () {
                        return data.list;
                    }
                };
            
        };
    });
})();


