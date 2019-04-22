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
    (function ($, widget /*,其他脚本文件对外暴露接口请在这里填写，如'charts'*/) {
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

            //初始化
            context._init();
            //渲染样式
            context._render();

        };


        //在代码中声明的接口，必须在"接口"配置中配置好，详情见各个接口的注释
        //一定要配置某个组件接口，才能在"前端逻辑引擎"和"开发者中心"中，引用或查看该接口
        //**关于组件接口是否配置正确，可以保存组件配置后，打开"开发者中心"-->"组件"-->打开当前组件，查看组件接口是否配置正确**
        //打开调试工具，输入"auiCtx.variables.组件实例ID.接口名"，可以调试接口是否可行
        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 4.4 YuQ',
            author: 'zhanghaixian@agree.com',

            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    widgetIns = this.widgetIns,
                    option = this.option,
                    attr = this.attr,
                    auiCtx = this.pageContext,
                    html = [],htmlTemplate,valueStr,
                    income,output,currencySymbol,inWidth,outWidth;


                currencySymbol = (widgetIns && widgetIns.nsl('￥')) || $AW.nsl('￥', attr.id, auiCtx);
                htmlTemplate = '<div class="budget-warp">' +
                    '<div class="budget-header">' +
                    '<div class="budget-income"><div>_INNAME_</div><div>' + currencySymbol + 
                    '_INVALUE_</div></div>' +
                    '<div class="budget-output"><div>_OUTNAME_</div><div>' + currencySymbol + 
                    '_OUTVALUE_</div></div>' +
                    '</div>' +
                    '<div class="budget-body">' +
                    '<div class="budget-income-bar" style="width:_INWIDTH_"></div>' +
                    '<div class="budget-output-bar" style="width:_OUTWIDTH_"></div>' +
                    '</div>' +
                    '</div>';

                income = option.income||0;
                output = option.output||0;

                inWidth =income/(income+output)*100+'%';
                outWidth = output/(income+output)*100+'%';

                valueStr = option.income.toString();
                if(valueStr.indexOf(".")<0){
                    //没有小数点
                    option.income=valueStr+'.00';
                }

                valueStr = option.output.toString();
                if(valueStr.indexOf(".")<0){
                    //没有小数点
                    option.output=valueStr+'.00';
                }


                htmlTemplate = htmlTemplate.replace('_INNAME_',(widgetIns && widgetIns.nsl(option.incomeName)) || $AW.nsl(option.incomeName, attr.id, auiCtx))
                        .replace('_INVALUE_',option.income)
                        .replace('_OUTNAME_',(widgetIns && widgetIns.nsl(option.outputName)) || $AW.nsl(option.outputName, attr.id, auiCtx))
                        .replace('_OUTVALUE_',option.output)
                        .replace('_INWIDTH_',inWidth)
                        .replace('_OUTWIDTH_',outWidth);

                html.push(htmlTemplate);


                $widget
                    .empty()
                    .append(html.join(''));
            },


            //渲染主题、样式（私有）
            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    style;

                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }

            },

            getBudgetData: function () {
                return {
                    income: this.income,
                    output:this.output,
                    incomeName:this.incomeName,
                    outputName:this.outputName
                };
            },

           setBudgetData:function (data) {
               this.option.income = data.income;
               this.option.output = data.output;
               this.option.incomeName = data.incomeName;
               this.option.outputName =data.outputName;
               this._init();
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

        widget.mobile.SoYComponent.SoYBudget = function () {
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
