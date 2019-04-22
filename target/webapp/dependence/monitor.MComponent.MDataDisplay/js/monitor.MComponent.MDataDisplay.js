(function (undefined) {

    (function (factory) {
        "use strict";
        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget","vue"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,Vue) {
        "use strict";

        var clickItem,
             VueOption=function (option) {
                return {
                    data:{
                        listTitleStyle:{},
                        auiListStyle:{},
                        titleStyle:{},
                        lableStyle:{},
                        lableExtraStyle:{},
                        valueStyle:{},
                        imgStyle:{},
                        iconStyle:{},
                        processStyle:{},
                        processActive:{},
                        statusStyle:{},
                        extraValueStyle:{},
                        nameStyle:{},
                        iconImg:{},
                        btnStyle:{},



                        index:0,
                        listTitle:"",
                        startX:0,
                        startY:0,
                        endX:0,
                        endY:0,
                        maskShow:false,
                        list:[],
                        mapStatus:[],

                        downLeft:0,
                        downTime:0,
                        hasRefresh:false,
                        maxDistance:0,
                        topDistance:70,
                        bottomDistance:70,
                        distanceIndex:2,
                        bottomAllLoaded:false,
                        wrapperHeight:{},
                        translate: 0,
                        scrollEventTarget: null,

                        topText: '',
                        topDropped: false,
                        bottomText: '',
                        bottomDropped: false,
                        bottomReached: false,
                        direction: '',
                        refreshStartY: 0,
                        startScrollTop: 0,
                        currentY: 0,
                        topStatus: '',
                        bottomStatus: '',
                        refreshType:0
                    },
                    computed:{
                    },
                    watch: {
                    },
                    created:function(){

                    },
                    mounted:function(){
                        
                    },
                    methods:{
                      getItem(item){
                          clickItem = item;
                      }

                        
                    }
                };
            };

        if(!widget.monitor.MComponent){
            widget.monitor.MComponent={};
        }
        widget.monitor.MComponent.MDataDisplay = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],i,item,
                    reOption,
                    dropdownCallback,pullUpCallback,
                    ins,
                    style = css.style,
                    vueOp=VueOption({
                        dropdownCallback:function(callback){
                            if(dropdownCallback){
                                dropdownCallback(callback());
                            }else{
                                callback();
                            }
                        },
                        pullUpCallback:function (callback) {
                            if(pullUpCallback){
                                pullUpCallback(callback());
                            }else{
                                callback();
                            }
                        }
                    });


                    option.listTitle = $AW.nsl(option.listTitle, attr.id, auiCtx);

                    if (option.list) {

                        for( i = -1; item = option.list[++i];) {
                            item.title = $AW.nsl(item.title, attr.id, auiCtx);
                            item.labeltitle = $AW.nsl(item.labeltitle, attr.id, auiCtx);
                        }
                    }

                    reOption = $.extend(true, {}, vueOp.data, option, css.style);
                //运行时代码Start
                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll('<div id="'+attr.id+'"></div>');
                ins = new Vue({
                    el: '#' + attr.id,
                    data: reOption,
                    computed: vueOp.computed,
                    watch: vueOp.watch,
                    created: vueOp.created,
                    mounted: vueOp.mounted,
                    methods: vueOp.methods
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
               

                return {
                    refresh:function(data){
                        reOption.list = data;
                    },
                    show:function () {
                        $widget.removeClass('hide');
                    },
                    hide:function () {
                        $widget.addClass("hide");
                    },
                    display:function (result) {
                        $widget[result?'removeClass':'addClass']('hide');
                    },
                    getClickItem:function() {
                        return clickItem;
                    }
                };
            
        };
    });
})();
