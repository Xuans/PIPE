/**
 * Created by wubingyu on 2017/12/6.
 */
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
                    imgData: [],
                    isDisabled:false
                },
                created:function() {
                    // var uploadImg=window.localStorage.getItem("uploadImg");
                    // if (uploadImg){
                    // 	this.imgData=uploadImg;
                    // }
                },
                watch:{
                },
                methods:{
                    removePicture:function(index){
                       
                        var imgs;
                        this.imgData.splice(index,1);
                        imgs=JSON.parse(app.getData("upLoadImg"));
                        imgs && imgs.splice(index,1);
                        app.setData("upLoadImg",imgs);
                    }

                }
            }
        };

        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }
        
        widget.mobile.SoYComponent.SoYPictureUpload = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],ins,vueOp;

                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll("<div id='"+attr.id+"'></div>");
                vueOp=vueOption($widget,css);
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

                    setImgSrc:function(data){
                        ins.imgData=data;
                    },
                    getImgSrc:function(){
                        return ins.imgData;
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
                    disabled: function (value) {
                        ins.isDisabled = value;
                    }
                };
            
        };
    });
})();

