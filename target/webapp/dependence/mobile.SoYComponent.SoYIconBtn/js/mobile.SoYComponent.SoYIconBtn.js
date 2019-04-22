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
				var defaultStyle = {
					box: {
						display:"inline-block",
						verticalAlign:"middle"
					},
					iconBoxStyle: {
						"width": "100px",
						"height": "100px",
						"borderRadius": "50%",
						"backgroundColor":"#eee",
						"textAlign":"center",
						"line-height":"100px",
						"overflow":"hidden"

					},
					iconStyle:{
						"fontSize":"40px",
						"margin":"0 auto",
						"display":"inline-block",
						"verticalAlign":"middle"
					},
					imageStyle:{
						"width":"100%",
						"height": "100%",
						"verticalAlign": "top"
					},
					textStyle:{
						fontSize:"14px",
						color:"#4d4d4d",
						textAlign:"center",
						margin:"10px 0"
					},
				
				};
				if(!widget.mobile.SoYComponent){
					
					widget.mobile.SoYComponent={};
				}
                widget.mobile.SoYComponent.SoYIconBtn = function () {
                        var $widget = arguments[0],
                            option = arguments[1],
                            attr = arguments[2],
                            css = arguments[3],
							auiCtx = arguments[4],ins,style;

                        //运行时，对标题（title）进行国际化翻译
                        option.text = $AW.nsl(option.text, attr.id, auiCtx);

						style = $.extend(true, {}, defaultStyle, css.style);
                        attr.id = 'vue' + app.getUID();
                        $widget.children().wrapAll('<div id="'+attr.id+'"></div>');
                        //运行时代码Start
						ins = new Vue({
							el: '#' + attr.id,
							data: $.extend({}, option, style)
						});
                        if(css && css.cssCode && css.cssCode.className){
                            $widget.addClass(css.cssCode.className)
                        }
                        //运行时代码End

                        return {
                            show:function () {
                                $widget.removeClass('hide');
                            },
                            hide:function () {
                                $widget.addClass("hide");
                            },
                            display:function (result) {
                                $widget[result?'removeClass':'addClass']('hide');
                            },
							getValue:function () {
								return ins;
                            },
							setValue:function (data) {
								var k, item;
                                for ( k in data) {
                                	if(data.hasOwnProperty(k)){
                                        ins[k] = data[k];

                                    }
                                }

                            },
							disable:function (result) {
                                $widget[result?'addClass':'removeClass']('disabled');
                                
                            }
                        };
                    
                };
            });
        })();
