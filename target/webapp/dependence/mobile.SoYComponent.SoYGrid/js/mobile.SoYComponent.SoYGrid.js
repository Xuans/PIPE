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
                        aTitleStyle:{},
                        gridStyle:{},
                        liStyle:{},
                        imgtextStyle:{},
                        gridWrapperStyle:{},
                        iconStyle:{},
                        valueStyle:{},
                        imgStyle:{},
                        textStyle:{},
                        gridList: [],
                        index:0
                    },
                    methods: {
                        getValue: function (index) {
                            this.index = index;
                        }
                    }
                };
				if(!widget.mobile.SoYComponent){
					widget.mobile.SoYComponent={};
				}

				widget.mobile.SoYComponent.SoYGrid = function () {
                        var $widget = arguments[0],
                            option = arguments[1],
                            attr = arguments[2],
                            css = arguments[3],
                            auiCtx = arguments[4],ins,i,item;

                        //运行时，对栅格总标题、栅格数据的标题和值进行国际化翻译
                        option.aTitle = $AW.nsl(option.aTitle, attr.id, auiCtx);

                        if (option.gridList) {
                            for(i = -1; item = option.gridList[++i];) {
                                item.title = $AW.nsl(item.title, attr.id, auiCtx);
                                item.value = $AW.nsl(item.value, attr.id, auiCtx);
                            }
                        }

                        //运行时代码Start
                        attr.id = 'vue' + app.getUID();
                        $widget.children().wrapAll('<div id="'+ attr.id+'"></div>');
                        ins = new Vue({
                            el: "#" + attr.id,
                            data: $.extend(true, {}, vueOp.data, option, css.style),
                            methods:vueOp.methods
                        });
                        if(css && css.cssCode && css.cssCode.className){
                            $widget.addClass(css.cssCode.className)
                        }
                        //运行时代码End

                        return {
                            refresh:function(data){
                                ins.gridList = data;
                            },
                            getGridInfo:function(){
                                return ins.gridList[ins.index]||{};
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
