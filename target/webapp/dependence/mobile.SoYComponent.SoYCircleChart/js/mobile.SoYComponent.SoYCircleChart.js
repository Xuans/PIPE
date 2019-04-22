(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget" /*,其他脚本文件名称请在这里填写，如'echarts'*/], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        //关于组件配置说明，请见"开发者中心"，搜索"388.组件设计"

        //关于代码调试工具的使用说明，请见"开发者中心"，搜索"397.开发者工具使用文档"

        var Component = function (widgetIns, $widget, option, attr, css, auiCtx) {
            var context = this;


            context.widgetIns = widgetIns;
            context.$view = $widget;
            context.option = option;
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;

            context._init();

            context._render();

        };


        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 4.4 YuQ',
            author: 'zhanghaixian@agree.com.cn',

            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    widgetIns = this.widgetIns,
                    option = this.option,
                    attr = this.attr,
                    html = [],htmlItem,i,
                    item,$item,circleColor,
                    cssContent1,cssContent2,


                    showChart = function($select,num){
                        var aEle = $select.children(),
                            Rdeg = num > 50 ? 50 : num,
                            Ldeg = num > 50 ? num - 50 : 0;


                        $(aEle[1].children[0]).css("transform" ,"rotateZ("+ (360/(2*50)*Rdeg-180) +"deg)");
                        $(aEle[1].children[1]).css({
                            "transform":"rotateZ("+ (360/(2*50)*Rdeg)+"deg)",
                            "backgroundImage": "linear-gradient(to left, #e5e5e5, #e5e5e5)"
                        });
                        $(aEle[0].children[0]).css("transform" , "rotateZ("+ (360/(2*50)*Ldeg-180) +"deg)");
                        $(aEle[0].children[1]).css({
                            "transform":"rotateZ("+ (360/(2*50)*Ldeg) +"deg)",
                            "backgroundImage":"linear-gradient(to left, #e5e5e5, #e5e5e5)"
                        });

                    };

                if(option.circleContent){
                    for(i=-1;item=option.circleContent[++i];){
                        htmlItem = '<div class="circle-wrapper">' +
                            '<div class="circle-warp">' +
                            '<div class="left-circle"><div></div><div class="left-bg"></div></div>' +
                            '<div class="right-circle"><div></div><div class="right-bg"></div></div>' +
                            '<div class="progress"><div class="circle-value">_VALUE_</div><span class="circle-title">_TITLE_</span></div>'+
                            '</div>' +
                            '</div>';

                        htmlItem = htmlItem.replace('_VALUE_',item.value+'%').replace('_TITLE_', item.title);

                        $item = $(htmlItem);

                        if(item.value){

                            showChart($('.circle-warp',$item),item.value)

                        }

                        if(item.circleColor){

                            circleColor = item.circleColor.split('|') || '#35b5c2|#6dedc2';

                            cssContent1 = {
                                'background-image': 'linear-gradient(to bottom,' + circleColor[1] + ',' + circleColor[1] + ')'
                            };
                            cssContent2 = {
                                'background-image': 'linear-gradient(to bottom,' + circleColor[0] + ',' + circleColor[1] + ')'
                            };
                            $item.css('backgroundColor',circleColor[1]);
                            $AW.cssHover('.circle-warp:nth-child(1) .left-circle div', $item, cssContent1, '');
                            $AW.cssHover('.circle-warp:nth-child(1) .right-circle div', $item, cssContent2, '');

                            $('.progress .circle-value', $item).css('color', item.valueColor);

                        }

                        html.push($item.get(0).outerHTML);
                    }
                }



                $widget
                    .empty()
                    .append(html.join(''));
            },


            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    style;

                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }


                if (css && (style = css.style)) {
                    style.position && $widget.find('.circle-wrapper').css(style.position);
                    style.percent && $widget.find('.circle-wrapper .progress .circle-value').css(style.percent);
                    style.title && $widget.find('.circle-wrapper .progress .circle-title').css(style.title);
                    $AW.cssHover('.circle-warp:nth-child(1) .left-circle div', $widget,style.circle , '');
                    $AW.cssHover('.circle-warp:nth-child(1) .right-circle div', $widget,style.circle, '');

                }

            },

            setOption:function(circleContent){
                this.option.circleContent = circleContent;
                this._init();
            },

            getOption: function () {
                return this.option.circleContent;
            },
            display: function (result, input1, input2, condition) {
                this[result ? 'show' : 'hide']();
            },


            show: function () {
                this.$view.removeClass('hide');
            },
            hide: function () {
                this.$view.addClass('hide');
            }
        };

        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }

        widget.mobile.SoYComponent.SoYCircleChart = function () {
            var widgetIns, eventHandler,
                $widget, option, attr, css, auiCtx;

                $widget = arguments[0];
                option = arguments[1];
                attr = arguments[2];
                css = arguments[3];
                auiCtx = arguments[4];

                return new Component(null, $widget, option, attr, css, auiCtx);

            
        };
    });
})();
