(function (undefined) {

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
                    auiCtx = this.pageContext,
                    html = [],i,item,width,
                    htmlItem,$item,valueStr,currencySymbol,
                    BarColor,IconColor,cssContent;

                //解析option、attr、css
                if(option.barContent){
                    for(i=-1;item=option.barContent[++i];){
                        valueStr = item.value.toString();
                        if(valueStr.indexOf(".")<0){
                            //没有小数点
                            item.value=valueStr+'.00';
                        }

                        //对货币符号和标题(item.title) 进行国际化翻译
                        currencySymbol = (widgetIns && widgetIns.nsl('￥')) || $AW.nsl('￥', attr.id, auiCtx);
                        htmlItem ="<div class='value-line-warp'><div class='value-line-heard'><i class=' _ICLASS_'></i><span class='value-line-title'>_TITLE_</span><span class='value-line-value'>_CURRENCY__VALUE_</span></div><div class='value-bar'></div></div>"
                            .replace('_ICLASS_',item.barIcon||'iconfont icon-plane-pie')
                            .replace('_TITLE_',(widgetIns && widgetIns.nsl(item.title)) || $AW.nsl(item.title, attr.id, auiCtx)||'标题')
                            .replace('_CURRENCY_',currencySymbol)
                            .replace('_VALUE_',item.value||'1008.22');
                        $item = $(htmlItem);

                        if(item.maxValue){
                            width= (parseFloat(item.value)/parseFloat(item.maxValue)*100 ||'');
                            width = width > 100 ? (100+'%') : (width+'%');
                            BarColor = item.barColor.split('|')||'#35b5c2|#6dedc2';
                            IconColor = item.IconColor.split('|')||'#35b5c2|#6dedc2';
                            cssContent={
                                'width':width,
                                'background-image':'linear-gradient(to right,'+BarColor[0] +' 1%, '+BarColor[1]+')'
                            };
                            $AW.cssHover('.value-bar',$item,cssContent,'::after');
                            $AW.cssHover('.value-line-heard>i',$item,{'background-image':'linear-gradient(to right,'+IconColor[0] +' 1%, '+IconColor[1]+')'},'')

                        }

                        html.push($item.get(0).outerHTML);

                    }
                }


                $widget

                    .empty()

                    .append(html.join(''));
            },

            setOption:function(option){
                this._init(option);
            },


            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    style;

                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }

                if (css && (style = css.style)) {

                    style.titleIcon && $('.value-line-heard>i',$widget).css(style.titleIcon);
                    style.title &&  $('.value-line-heard>.value-line-title',$widget).css(style.title);
                    style.value && $('.value-line-heard>.value-line-value',$widget).css(style.value);
                    style.bar && $('.value-bar',$widget).css(style.bar);

                }

            },

            getOption: function () {

                return this.option;
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

        widget.mobile.SoYComponent.SoYValLine = function () {
            var widgetIns, eventHandler,
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
