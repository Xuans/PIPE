/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget"], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		var classRegExp = /medium-\d+/;

		function render($widget, $selector, option, attr, css,formOption, auiCtx) {
			var template = "<div class='verticalSplitLine'></div>";

		    	$selector.attr("id", attr.id || '');

				$selector.append(template);
				renderContainerSpan($selector, option.span);

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }
		}

		//设置容器的span，编辑期和运行的容器不同
		function renderContainerSpan($target, span) {
			var classname = $target.attr("class");

			if (classRegExp.test(classname)) {
				$target.attr("class", classname.replace(classRegExp, "medium-" + span));
			} else {
				$target.addClass("medium-" + span);
			}

			$target.addClass("columns");
		}

		if (!widget.component.other) {
			widget.component.other = {};
		}
		widget.component.other.verticalSplitLine = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};


				render($selector, oOption, oAttr, oCss,formOption, auiCtx);

				return {
					display: function (result, input1, input2, condition) {
						this[result ? 'hide' : 'show']();
					},
					show: function () {
						$selector.removeClass('hide');
					},
					hide: function () {
						$selector.addClass('hide');
					}
				};
			};


		return widget;
	});
})();