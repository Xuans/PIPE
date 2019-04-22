(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget" ,"template","taffy"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget ,artTemplate,taffy) {
        "use strict";

        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model
            context.$view = $widget;
            context.option = $.extend(true, {}, this.setting, option);
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;
            context.widgets = {};
            context.wDatas = [];
            context.CONST = {
                DROP_OPTION: {
                    appendTo: option.appendTo,
                    cursor: 'move',
                    scroll: false,
                    helper: function (e) {
                        var $e = $(e.target).closest('[data-type]'),
                            widget = context.widgets[$e.attr('data-href')];

                        if (widget) {
                            return $('<div data-href="' + widget.href + '" class="aui-widget-block"><i class="fa aui-widget-block-icon ' + widget.icon + '"></i><div class="aui-widget-block-ttl">' + widget.name + '</div>').get(0);
                        }
                    }
                }
               
            };


            //View Model
            context.viewCache = {};

            //cache
            //context.cache={};

            //初始化
            context._init();

            //渲染样式
            //context._render();

            //绑定事件
            context._listen();
        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',

            debug: window.auiApp && window.auiApp.debug,

            //常量表
            //constant:{},
            setting: {},


            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    temp = 
                        '<div class="card-search-bar"><i class="iconfont icon-topbar-search"></i>'+
                        '<input  type = "text" class="card-search-input" placeholder = "搜索组件"/></div>'+
                        '<ul class="card-list">'+
                        '{{each list as item index}}'+
                        '<li class="card-list-item " data-href="{{item.href}}" data-type="{{item.type}}" data-accept="{{item.accept}}"  data-icon="{{item.icon}}" data-name = "{{item.name}}" >' +
                        '<span class="card-list-item-name" title="{{item.name}}"><i class="card-list-item-icon {{item.icon?item.icon:"fa fa-file-text"}}"></i>{{item.name}}</span>' +
                        '{{if item.children && item.children.length}} {{ include "ulTemp" item}}{{/if}}' +
                        '</li>'+
                        '{{/each}}</ul>';

                this.template = temp;

                if (this.debug) {
                    //如果在开发阶段，填充假数据
                    this._renderFakeData();
                }
            },

            bulidTree:function(data){

                data.forEach(function(ele){
                    var pType = ele.pType;
                    if (pType === 'mainPanel') {
                        
                    } else {
                      
                        data.forEach(function (d) {
                            var childArray;
                            if (d.type === pType) {
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

                           return ele.pType === 'mainPanel'

                        });


                return data;

            },

            render:function(widgetJson){
         
                var template = this.template, data = [], item,
                    cards = taffy.taffy([]), treeData;

                for(item in widgetJson){
                    if(widgetJson.hasOwnProperty(item)){
                        data.push(widgetJson[item]);
                    }
                }

                cards.insert(data);
        
                cards.sort('index');
                 data =  cards().get();
                  
                 treeData = this.bulidTree(data);
                 

                this.$view.empty().append(artTemplate.compile(template)({
                    list: treeData
                }));

                // this.dropWidget(data)
                this.widgets = widgetJson;
                this.wDatas = data;

            },
            dropWidget: function (amdCtnId) {
                var CONST = this.CONST, 
                    widgetArr = this.wDatas,
                    len, item,
                    $widgetItem,
                    $menus = this.$view;

                    CONST.DROP_OPTION.appendTo = amdCtnId;
           
                if (!$.isArray(widgetArr)) {
                    widgetArr = [widgetArr];
                }

                for (len = -1; item = widgetArr[++len];) {
                    if (!item.hidden) {
                                         
                        $widgetItem = $('[data-type = '+item.type+']',$menus);

                        $widgetItem.draggable(CONST.DROP_OPTION);
                
                    }
                }
            },

            //事件绑定（私有）
            _listen: function () {
                var $widget = this.$view;

                $widget.off('.card').on({
                    'click.card': function (e) {
                        //使用兼容IE8事件兼容的用法
                        var $target = $(e.target || window.event.srcElement),
                            $click = $target.closest('li');

                        //判断$target是什么
                        if ($click && $click.length && $click.hasClass('card-list-item')) {
                            if ($click.hasClass('active')) {
                                $click.removeClass('active');
                            } else if ($click.parent('ul').parent('li').hasClass('active')) {
                                $click.addClass('active');
                            } else {
                                  $('li.card-list-item', $widget).removeClass('active');
                                  $click.addClass("active");
                            }
                          
                        }
                    }
                });
            },


            _renderFakeData: function () {
                var data = [{
                    name:'折线图',
                    icon:'iconfont icon-line-line',
                    type:'line',
                    accept:'mainPanel divCtn',
                    href:'component.echarts.line'
                },{
                    name:'柱状图',
                    icon:'iconfont icon-line-bar',
                    type:'bar',
                    accept:'mainPanel divCtn',
                    href:'component.echarts.bar'
                }];

                this.render(data);
            },

            destroy: function () {
                this.$view.off().empty();
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
        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        widget.monitor.MComponent.MComponentCard = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();
