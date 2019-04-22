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
        var vueOp={
            data:{
                cardComponentStyle:{},
                cardListStyle:{},
                headBoxStyle:{},
                iconStyle:{},
                imgStyle:{},
                headTitleStyle:{},
                headExtraStyle:{},
                cardBodyStyle:{},
                footTextStyle:{},
                footExtraStyle:{},
                footStyle:{},
                cardlist:[],
                index:0
            },
            methods:{
                linkPage:function(index){
                    this.index=index;
                }
            }
        };

        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }
        widget.mobile.SoYComponent.SoYCard = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],ins,i,item;

                // 运行时，对 cardlist { content, headtitle, headextra, foottext, footextra } 进行国际化翻译
                if (option.cardlist) {

                    for ( i = -1; item = option.cardlist[++i];) {
                        item.content = $AW.nsl(item.content, attr.id, auiCtx);
                        item.headtitle = $AW.nsl(item.headtitle, attr.id, auiCtx);
                        item.headextra = $AW.nsl(item.headextra, attr.id, auiCtx);
                        item.foottext = $AW.nsl(item.foottext, attr.id, auiCtx);
                        item.footextra = $AW.nsl(item.footextra, attr.id, auiCtx);
                    }
                }


                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll('<div id="'+attr.id+'"></div>');
                //运行时代码Start
                ins=new Vue({
                    el:"#"+attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    methods:vueOp.methods
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    refresh:function(data){
                        ins.cardlist = data;
                    },
                    getCardInfo:function(e){
                        return ins.cardlist[ins.index]||{};
                    },
                    show:function () {
                        $widget.removeClass('hide');
                    },
                    hide:function () {
                        $widget.addClass("hide");
                    },
                    display:function (result) {
                        $widget[result?'removeClass':'addClass']('hide');
                    }
                };
            
        };
    });
})();
