(function (undefined) {

			(function (factory) {
				"use strict";

				// amd module
				if (typeof define === "function" && define.amd) {
					define(["jquery", "widget","bscroll"], factory);
				}
				// global
				else {
					factory();
				}

			})
			(function ($, widget,BScroll) {
				"use strict";
				
				if(!widget.mobile.SoYComponent) {
                    widget.mobile.SoYComponent = {};
                }

				widget.mobile.SoYComponent.SoYSlider = function () {
					var widgetIns, eventHandler,
						$widget, attr,
						option, css, auiCtx,render,
						imgs,imgHtml,i,img,
						slideGroup, slideWrapper,
						$slideWrapper,$dot,
						imgWidth,imgHeight,
						slideWrapperCss, slideGroupCss, imgCtnCss,dotHtml,
						dotWrapper,dot,
						dotWrapperCss,dotCss,
						dotActiveCss,scroll,
						pageIndex,
						currentIndex,
						$parent, slideWidth, resizeHandler,
                        timeStamp ='?version='+app.getUID();

						pageIndex = 0;
						
					render = function ($widget,option,css){
						css = css.style;

						slideGroup = '<div data-role="slideGroup">';
						slideWrapper = '<div data-role="slideWrapper">';

						dotWrapper ='<div data-role="dotWrapper">';
						dot = '<span data-role="dot"></span>';
						
						if (css.imgSize&&css.imgSize.width && css.imgSize.height){
							
							
							imgWidth = css.imgSize.width;
							imgHeight = css.imgSize.height;
							
							$parent = $widget;
							

							if(~imgWidth.indexOf("%")) {
							
								while($parent.length && !$parent.width()){
									$parent=$parent.parent();
								}
								imgWidth = ($parent.width() || $(window).width())*parseInt(imgWidth,10)*0.01+'px';
							}


							if (~imgHeight.indexOf("%")) {

								while ($parent.length && !$parent.height()) {
									$parent = $parent.parent();
								}			
								imgHeight = ($parent.height() || $(window).height()) * parseInt(imgHeight,10)*0.01+ 'px';

							}

						
							

						}else{
							imgWidth='300px';
						
							imgHeight="241px"
						}

						imgCtnCss={
							float:'left',
							width:imgWidth,
							height:imgHeight,
							backgroundPosition:'center bottom',
							backgroundSize:'cover',
							backgroundRepeat:'no-repeat'
						};
						
						slideWrapperCss = {
							position:'relative',
							width:imgWidth,
							height:imgHeight,
							"min-height": '1px',
							overflow: "hidden"
						};

						slideGroupCss = {
							position: "relative"
							
							
						};

						css.dotWrapper ? (dotWrapperCss = css.dotWrapper):(dotWrapperCss={});

						css.dot ? (dotCss = css.dot): (dotCss={});

						css.dotActive ? (dotActiveCss = css.dotActive):(dotActiveCss={});


						

						if((imgs=option.img)&&imgs.length&&imgs[0].src){

							imgHtml=[];
							dotHtml=[];

							imgHtml.push(slideWrapper);
							imgHtml.push(slideGroup);

							dotHtml.push(dotWrapper);
							

							for(i=-1;img=imgs[++i];){
								imgHtml.push('<div data-role="imgCtn" style="background-image: url(' + img.src+timeStamp + ')"></div>');

								dotHtml.push('<span data-role="dot" data-index='+i+'></span>');
							}
							
							imgHtml.push('</div></div>');
							dotHtml.push('</div>');

							$widget.empty().html(imgHtml.join(""));

							slideWidth=parseInt(imgWidth,10)*imgs.length+'px';

							$slideWrapper = $widget.find('[data-role=slideWrapper]');

							$slideWrapper.css(slideWrapperCss).append(dotHtml.join(''));

							$widget.find("[data-role=slideGroup]").css({
								width:slideWidth
							}).css(slideGroupCss);

							

							
							$widget.find("[data-role=dotWrapper]").css(dotWrapperCss);

							$dot = $widget.find('[data-role=dot]');
							
							$dot.css(dotCss);

							$dot.eq(pageIndex).css(dotActiveCss);


							$widget.find("[data-role=imgCtn]").css(imgCtnCss);

							scroll = new BScroll($slideWrapper[0],{
								scrollX:true,
								scrollY: false,
								momentum:false,
								snap: {
									loop: false,
									threshold: 0.2,
									speed: 200
								},
								 click: true
							});

							scroll.goToPage(pageIndex, 0, 0);


							scroll.on('touchEnd',function(){
								 currentIndex = this.getCurrentPage().pageX;
							});

							scroll.on('scrollEnd', function () {
								 pageIndex = this.getCurrentPage().pageX;
								

								$dot.eq(currentIndex).css(dotCss);

								$dot.eq(pageIndex).css(dotActiveCss);

								this.goToPage(pageIndex, 0, 200);
							})			
							
							
						}
					};

					if (arguments[0].version) {
						
							widgetIns = arguments[0],
							eventHandler = arguments[1],//事件句柄
							$widget = widgetIns[0].$widget.children('[data-widget-type]'),//组件template的jQuery对象
							attr = widgetIns.attr(),//组件基本属性
							option = widgetIns.option(),//组件基本配置
							css = widgetIns.css();

						widgetIns.change();//将组件由图标界面转成html界面

						//配置时代码Start
							render($widget,option,css);
						//配置时代码End

						return widget;
					} else {
					
						    $widget = arguments[0];
							option = arguments[1];
							attr = arguments[2];
							css = arguments[3];
							auiCtx = arguments[4];

                        if(css && css.cssCode && css.cssCode.className){
                            $widget.addClass(css.cssCode.className)
                        }
						//运行时代码Start
							render($widget, option, css);


							return{
                                display: function (result, input1, input2, condition) {
                                    $widget[result?'addClass':'removeClass']('hide');
                                },
                                show: function (e, size) {
                                    $widget.removeClass('hide');
                                },
                                hide: function () {
                                    $widget.addClass('hide');
                                }
							}



							
						//运行时代码End

						
					}
				};
			});
		})();
