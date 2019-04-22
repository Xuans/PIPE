(function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget" ], factory);
		}
		// global
		else {
			factory();
		}

	})
		(function ($, widget ) {
			"use strict";
			var Component = function (widgetIns, $widget, option, attr, css, auiCtx) {
				var context = this;


				context.widgetIns = widgetIns;
				context.$view = $widget;
				context.option = option;
				context.attr = attr;
				context.css = css;
				context.pageContext = auiCtx;

				//初始化
				context._init();
				//渲染主题、样式（私有）
				context._render();
			};

			Component.prototype = Component.fn = {
				constructor: Component,
				version: 'AWOS 4.4 YuQ',
				author: 'your name',

				//初始化（私有）
				_init: function () {

					var $widget = this.$view,
						context = this,
						TEMPLATE = "<label class='title'>_title_</label><div class='select-ctn'><div class='input-ctt'><input type='text' value placeholder='请选择资源属性' class='type-input' readonly /><i class='bottom-arrow fa fa-angle-down'></i><span class='reset-btn'>&times;</span></div>"
							+ "<div class='list-ctn'></div></div>",
						option = context.option,
						html = [],data;

					if (context.option.label) {
						TEMPLATE = TEMPLATE.replace(/_title_/, context.option.label);
					}
					$widget.empty().append(TEMPLATE);
					context.ids = '';
					context.value = '';
					context.stack = [];
					context.pIdx = 0;
					context.$input = $('.type-input', $widget);
					context.$listCtn = $(".list-ctn", $widget);
					context.$inputCtt = $(".input-ctt", $widget);
					context.$resetBtn = $(".reset-btn", $widget);
					context.option.isDisabled && context.$input.attr('disabled', context.option.isDisabled);
					context.$input.off("click.cascaderToggle").on("click.cascaderToggle", function (e) {
						window.event ? window.event.cancelBubble = true : e.stopPropagation();
						if(context.$listCtn.html()===""){
							return;
						}
						if (context.$input.val()) {

							data = context.getValue();
							context.$listCtn.toggle();
						} else {
							context.clearValue();
							context.$listCtn.toggle();
						}

					});
					$('body').off("click.cascaderBlur").on("click.cascaderBlur", function (e) {
						var $target = $(e.target || window.event.srcElement);
						if (!$target.closest($widget).length) {
							context.$listCtn.hide();
						}

					});

					context.$inputCtt.on("mouseenter", function () {

						if (context.$input.val() && !context.$input.attr('disabled')) {

							context.$resetBtn.show();
						}
					}).on("mouseleave", function () {
						context.$resetBtn.hide();
					});

					context.$resetBtn.off('click.cascaderReset').on("click.cascaderReset", function () {
						context.clearValue();
						context.$listCtn.hide();
					});
					
					context.$input.attr("placeholder",option.placeholder);
				},
				//渲染数据
				render: function (data) {
				
					var context = this;
					context.data = data;
					if (data && data.length) {
						context.stack[0] = data;
						context.renderHtml(data);
					}
				},
				renderHtml: function (data) {
					var FCTT = "<ul class='cascader-list'>_item_</ul>",
						FITEM = "<li class='cascader-item' data-id='_id_'>_name_<i class='right-arrow fa fa-angle-right'></i></li>",
						data = data,
						$widget = this.$view,
						firstStr = "",
						context = this,
						i,item;
					context.stack[context.pIdx + 1] = data;
					if (data && data.length) {
						for (i = 0; i < data.length; i++) {
							item = data[i];
							if(item.child&&item.child.length){
								FITEM = "<li class='cascader-item' data-id='_id_'>_name_<i class='right-arrow fa fa-angle-right'></i></li>";
							}else{
								FITEM = "<li class='cascader-item' data-id='_id_'>_name_</li>";
							}
							firstStr += FITEM.replace(/_id_/, item.id).replace(/_name_/, item.name);
						}
						firstStr = FCTT.replace(/_item_/, firstStr);
						context.$listCtn.append(firstStr);
					}
					$(".cascader-list .cascader-item", $widget).off('.cascader').on("click.cascader", function (e) {
						//	window.event? window.event.cancelBubble = true : e.stopPropagation();
						var $this = $(this),
							pIdx = $this.parent('.cascader-list').index(),
							idx = $this.index(),
							id = $this.attr('data-id'),
							value = $this.text().trim(),
							i;

						context.idx = idx;
						context.pIdx = pIdx;
						$this.parent('.cascader-list').nextAll().remove();
						$this.siblings('li.cascader-item').removeClass("actived-cascader-item");
						$this.addClass('actived-cascader-item');
						context.$aItem = $('li.actived-cascader-item', $widget);
						if (context.stack[pIdx][idx].child && context.stack[pIdx][idx].child.length) {

							context.renderHtml(context.stack[pIdx][idx].child);

						} else {

							for (i = 0; i < context.$aItem.length - 1; i++) {
								context.value += context.$aItem.eq(i).text().trim() + '/';
								context.ids += context.$aItem.eq(i).attr('data-id') + '/';
                            }
                            context.value += value;
							context.ids += id;
							context.$input.val(context.value);
							context.$input.attr('data-id', context.ids);
							context.value = '';
							context.ids = '';
							context.$listCtn.hide();

						}
					})
				},

				//获取数据
				getValue: function () {
					var $widget = this.$view,
						//	id;
						data = {};
					data.id = $('.type-input', $widget).attr("data-id");
					data.value = $('.type-input', $widget).val();
					return data;
				},
				//设置输入框的值
				setValue: function (data) {
					var $widget = this.$view,
						$input = $('.type-input', $widget);
					data && $input.val(data.desp||'');
					data && $input.attr('data-id', data.id||'');
				},
				
				//清楚数据
				clearValue: function () {
					var $widget = this.$view,
						context = this;
					context.$input.val("").attr('data-id', '');
					$('li', $widget).removeClass("actived-cascader-item");
					context.$resetBtn.hide();
					context.$listCtn.html('');
					context.renderHtml(context.stack[0]);
				},

				//渲染主题、样式（私有）
				_render: function () {
					var $widget = this.$view,
						css = this.css,
						cssCode,className,
						style;
					if (css.cssCode) {
						//自定义样式
						if ((cssCode = css.cssCode) && (className = cssCode.className)) {
							$widget.addClass(className);
						}
					}

				},
			
				show: function () {
					this.$view.removeClass('hide');
				},

			
				hide: function () {
					this.$view.addClass('hide');
				}
			};

			if(!widget.monitor.MComponent){
				widget.monitor.MComponent={};
			}

			widget.monitor.MComponent.MCascader = function () {
				var
					$widget, option, attr, css, auiCtx;

				
					$widget = arguments[0];
					option = arguments[1];
					attr = arguments[2];
					css = arguments[3];
					auiCtx = arguments[4];

					//运行时代码Start
					return new Component(null, $widget, option, attr, css, auiCtx);
					//运行时代码End
				
			};
		});
})();
