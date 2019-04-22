(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "componentTreeV2", "taffy"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, ComponentTree, taffy) {
        "use strict";

        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model
            context.$view = $widget;
            context.option = $.extend(true, {}, this.setting, option);
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;


            //View Model
            context.viewCache = {};


            //初始化
            context._init();


            //绑定事件
            context._listen();
        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',
            contentTreeIns: {},
            insdb: undefined,
            callback: undefined,
            widgets: undefined,
            widgetConfig: {},
            currentNodeID:{},
            CONST: {
                DATA_ATTR: 'data-widget-id',
                MAIN_PANEL_ID:'MonitorComponentPage'
            },

            debug: window.auiApp && window.auiApp.debug,

            //常量表
            //constant:{},
            setting: {},


            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    widgetId = this.CONST.MAIN_PANEL_ID,
                   
                    mainPanel = [{
                        children: [],
                        widgetID: widgetId,
                        widgetName: '页面',
                        widgetIcon: 'fa fa-file',
                        ID: widgetId,
                        href: 'page.mainPanel',
                        type: 'mainPanel'
                    }];

                this.contentTreeIns = new ComponentTree({
                    $view: $widget,
                    treeData: mainPanel,
                    icon: [{
                        role: "del",
                        class: "fa fa-trash-o",
                        title: "删除"
                    }]
                });
                this.insdb = taffy.taffy(mainPanel);
                this.widgets = taffy.taffy([]);

                this.dragWidget(widgetId);
            },
            structureToContentTree: function (data) {
                var
                    i, item, widget,
                    _i, _item,
                    treeData = [];

                if (data && data.length) {
                    for (i = -1; item = data[++i];) {

                        treeData.push({
                            ID: item.ID,
                            href: item.href,
                            widgetIcon: item.widgetIcon,
                            widgetID: item.widgetID,
                            widgetName: item.widgetName,
                            pID: item.pID,
                            children: item.children ? item.children : []
                        });


                    }

                    return treeData;

                }



            },
            render: function () {
                var treeData, _i, _item, data;

                data = this.insdb().get();


                treeData = this.structureToContentTree(data);

                this.contentTreeIns.refresh(treeData);


                for (_i = -1; _item = data[++_i];) {
                    this.dragWidget(_item.widgetID);

                }


            },
            dragWidget: function (widgetID) {

                var $elem,
                    CONST = this.CONST,
                    insdb = this.insdb,
                    $view = this.$view,
                    widgetsdb = this.widgets,
                    that = this;

                if (widgetID && ($elem = $('[data-widget-id=' + widgetID + ']', $view)) && $elem.length) {
                    $elem
                        .droppable({
                            accept: function ($widget) {

                                return true;
                            },
                            greedy: true,
                            addClasses: false,
                            hoverClass: 'aui-widget-droppable',
                            tolerance: 'pointer',
                            distance: '30',
                            drop: function (_, ui) {
                                var $this = $(this),
                                    pId = $this.attr(CONST.DATA_ATTR),
                                    $widget = $(ui.draggable),
                                    $target = $widget.closest('[data-href]'),
                                    href = $target.attr("data-href"),
                                    type = $target.attr("data-type"),
                                    title = $widget.attr("data-name"),
                                    accept = $widget.attr('data-accept'),
                                    thisWidget, newIns = {},
                                    uid,
                                    icon = $target.attr("data-icon"),
                                    newWConfig, wConfigItem,
                                    widgetConfig = that.widgetConfig,
                                    pChild = [], treeData;
                                 
                                thisWidget = insdb({ widgetID: pId }).first();
                                
                                if (accept.indexOf(thisWidget.type) !== -1) {
                                    uid = app.getUID();
                                    wConfigItem =JSON.parse(JSON.stringify(widgetConfig[href]));
                               

                                    //创建新组件实例
                                    newIns = {
                                        ID: uid,
                                        href: href,
                                        widgetIcon: icon,
                                        widgetID: uid,
                                        widgetName: title,
                                        pID: pId,
                                        type:type,
                                        accept:accept,
                                        children: [],
                                        option: wConfigItem.option
                                    };

                                     newWConfig = {
                                         id: uid,
                                         href: href,
                                         option: wConfigItem.option,
                                         css: {},
                                         pid: pId
                                    };
                                    
                                     widgetsdb.insert(newWConfig);
                                    
                                    //更新父组件的children
                                    pChild = JSON.parse(JSON.stringify(thisWidget.children));
                                    pChild.push(uid);
                                    
                                    insdb.insert(newIns);

                                    insdb({
                                        widgetID: pId
                                    }).update({
                                        children: pChild
                                        });

                                      that.render();

                                      treeData = that.bulidTree(JSON.parse(JSON.stringify(widgetsdb().get())));

                                      that.callback && that.callback(treeData);
                                

                                }
                               
                               

                                return false;
                            }

                        })
                }


            },
            bulidTree: function (data) {
                var mainPanelID = this.CONST.MAIN_PANEL_ID;

                    data.forEach(function (ele) {
                        var pid = ele.pid;
                        if (pid === mainPanelID) {

                        } else {

                            data.forEach(function (d) {
                                var childArray;
                                if (d.id === pid) {
                                    childArray = d.children;
                                    if (!childArray) {
                                        childArray = []
                                    }
                                    childArray.push(ele);
                                    d.children = childArray;
                                }
                            })
                        }
                    });

                    data = data.filter(function (ele) {

                        return ele.pid === mainPanelID

                    });


                    return data;

                },

            dropWidgetCallback: function (widgetConfig, callback) {
                this.widgetConfig = widgetConfig;
                this.callback = callback;
            },
            updatetWidgetDB:function(newOption){
                 var currentNodeData = this.getCurrentNode(),treeData,
                 widgetsdb = this.widgets;
                 widgetsdb({
                        id:currentNodeData.ID
                 }).update({
                         option:newOption
                 });
        
        
                 treeData = this.bulidTree(JSON.parse(JSON.stringify(widgetsdb().get())));

                 this.callback && this.callback(treeData);    
            },
            getInsHrefAndId: function () {
                var widgetsdb = this.insdb,
                    widgets, hrefMap = {},IDArr = [], i, item, hrefList;

                widgets = widgetsdb().get();
                for (i = -1; item = widgets[++i];){
                    hrefMap[item.ID] = item.href;
                }
               
                return hrefMap;
                
            },
            //事件绑定（私有）
            _listen: function () {
                var $widget = this.$view,
                    insdb = this.insdb,
                    widgetsdb = this.widgets,
                    that = this, treeData;
                $widget.off('.treeClick')
                    .on('click.treeClick', function (e) {
                        var $target = $(e.target || e.srcElememt),
                            insId;
                        if ($target.is('i.fa-trash-o') || $target.is('div.aui-config-operation-ctn')){
                            insId = $target.closest('li').attr('data-widget-id');
                            insdb({
                                ID: insId
                            }).remove();

                            widgetsdb({
                                id: insId
                            }).remove();

                            that.render();

                            treeData = that.bulidTree(JSON.parse(JSON.stringify(widgetsdb().get())));

                            that.callback && that.callback(treeData);
                        
                        } else if ($target.closest('[data-widget-id]').length) {
                           
                            that.currentNodeID = $target.closest('[data-widget-id]').attr('data-widget-id');
                        }
                    
                })

            },
            getCurrentNode: function () {
                var currentNodeID = this.currentNodeID;
                return this.insdb({
                    ID: currentNodeID
                }).first();
            },

            destroy: function () {
                this.$view.off().empty();
            },

            show: function () {
                this.$view.removeClass('hide');
            },

            hide: function () {
                this.$view.addClass('hide');
            }
        };
        if (!widget.monitor.MComponent) {
            widget.monitor.MComponent = {};
        }
        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        widget.monitor.MComponent.MComponentTree = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();