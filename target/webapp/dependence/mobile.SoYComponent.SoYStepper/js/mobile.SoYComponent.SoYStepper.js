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
        var vueOption=function () {
            return{
                data:{
                    value: 1,
                    imgType:"",
                    img:"",
                    icon:"",
                    title:"",

                    stepperListStyle:{},
                    iconStyle:{},
                    imgStyle:{},
                    subtractStyle:{},
                    addStyle:{},
                    valueStyle:{},
                    titleStyle:{}
                },
                methods:{
                    calc:function(val){
                        var ret;
                        if(val===0){
                            if (this.value === this.step) return;
                            ret = this.value - this.step;
                            if (ret < this.min || ret > this.max) return;
                            this.value = ret;
                        }else{
                            ret = this.value + this.step;
                            if (ret < this.min || ret > this.max) return;
                            this.value = ret;
                        }
                    }
                }
            }
        };


        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }
        widget.mobile.SoYComponent.SoYStepper = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],ins,vueOp;

                //运行时，对标题（title）进行国际化翻译
                option.title = $AW.nsl(option.title, attr.id, auiCtx);

                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll("<div id='"+attr.id+"'></div>");
                vueOp=vueOption();
                //运行时代码Start
                ins = new Vue({
                    el: '#' + attr.id,
                    data: $.extend({}, vueOp.data, option,css.style),
                    methods: vueOp.methods
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    //生命周期部分
                    getValue:function(){
                        return ins.value;
                    },
                    setValue:function(value){
                        ins.value=value;
                    },
                    disabled: function (isDisabled) {
                        ins.disabled = isDisabled;
                    },
                    resetValue:function () {
                        ins.value=option.value;
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
                    focus:function (){
                        $("input.stepper-value",$widget).focus();
                    }

                };
            
        };
    });
})();
