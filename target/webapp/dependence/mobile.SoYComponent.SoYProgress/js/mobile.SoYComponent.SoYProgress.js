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

        var vueOption=function ($widget,css) {
            return{
                data:{
                    awebProgress:{},
                    progressTextStyle:{},
                    progressContentStyle:{},
                    progressCtnStyle:{},
                    displayValueStyle:{}
                },
                created:function() {


                },
                watch:{

                },
                methods:{

                }
            }
        };
        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }
        widget.mobile.SoYComponent.SoYProgress = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],ins,vueOp;

                // 对配置中的 标题（title） 进行国际化翻译
                option.title = $AW.nsl(option.title, attr.id, auiCtx);
                
                attr.id = 'vue' + app.getUID();

                $widget.children().wrapAll("<div id='"+attr.id+"'></div>");

                
                


                vueOp=vueOption($widget,css.style);
                //运行时代码Start
                ins=new Vue({
                    el:"#"+attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    created: vueOp.created,
                    watch: vueOp.watch,
                    methods: vueOp.methods
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    //设置的值
                    setValue: function (value){
                        ins.value = value;
                    },
                    //获取选中的值
                    getValue:function(){
                        return ins.value;
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
