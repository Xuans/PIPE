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
        var vueOption = function ($widget, css) {
            return{
                data:{
                    titleStyle:{},
                    imgStyle:{},
                    iconStyle:{},
                    switchListStyle:{},
                    switchStyle:{},
                    switchNotChecked:{},
                    switchChecked:{},
                    swtichInnerStyle:{},

                    disabled:false,
                    value:true,
                    title:"",
                    icon:"",
                    img:""
                },
                mounted:function(){
                    this.$nextTick(function(){
                        $AW.cssHover(".aweb-m-switch .aweb-m-switch-core",$widget,css.switchNotChecked,"");
                        $AW.cssHover(".aweb-m-switch .aweb-m-switch-input:checked+.aweb-m-switch-core",$widget,css.switchChecked,"");
                        $AW.cssHover(".aweb-m-switch-core",$widget,css.swtichInnerStyle,"::after");
                    });
                },
                computed: {
                    currentValue: {
                        get:function() {
                            return this.value;
                        },
                        set: function(val) {
                            this.value=val;
                        }
                    }
                }
            }
        };

        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }
        widget.mobile.SoYComponent.SoYSwitch = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],ins,vueOp;

                //运行时，对标题（title）进行国际化翻译
                option.title = $AW.nsl(option.title, attr.id, auiCtx);

                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll("<div id='"+attr.id+"'></div>");
                vueOp = vueOption($widget, css.style);
                //运行时代码Start
                ins=new Vue({
                    el:"#"+attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    mounted:vueOp.mounted,
                    computed:vueOp.computed
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    getValue:function(){
                        return ins.value;
                    },
                    setValue:function(value){
                        ins.value=value;
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
                    disabled:function (data) {
                        ins.disabled=data;
                    }
                };
            
        };
    });
})();
