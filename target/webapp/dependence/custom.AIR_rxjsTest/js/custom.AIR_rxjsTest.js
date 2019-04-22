( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget",'rxjs'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,rxjs) {
        "use strict";

        //关于组件配置说明，请见"开发者中心"，搜索"388.组件设计"
        //关于代码调试工具的使用说明，请见"开发者中心"，搜索"397.开发者工具使用文档"
        //以下代码均可以删除，不用的功能，都删掉，减少代码冗余
        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model
            context.$view = $widget;
            context.option = $.extend(true, {}, this.setting, option);
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;


            //View Model
            context.viewCache = {};

            //cache
            //context.cache={};

            //初始化
            //context._init();

            //渲染样式
            //context._render();

            //绑定事件
            //context._listen();
        };


        //在代码中声明的接口，必须在"接口"配置中配置好，详情见各个接口的注释
        //一定要配置某个组件接口，才能在"前端逻辑引擎"和"开发者中心"中，引用或查看该接口
        //**关于组件接口是否配置正确，可以保存组件配置后，打开"开发者中心"-->"组件"-->打开当前组件，查看组件接口是否配置正确**
        //打开调试工具，选择"virtualizer"-->输入"auiCtx.variables.组件实例ID.接口名"，可以调试接口是否可行(397.开发者工具使用文档)
        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',

            debug: window.auiApp && window.auiApp.debug,

            //常量表
            //constant:{},
            setting: {},


            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    html = [];

                //解析option、attr、css

                //使用$.fn.off().empty().append(html)可以避免调用$.fn.html(html)时导致的内存泄漏。
                $widget
                //使用empty方法释放DOM对象的内存
                    .empty()
                    //安全添加html元素
                    .append(html.join(''));


                if (this.debug) {
                    //如果在开发阶段，填充假数据
                    this._renderFakeData();
                }
            },

            //事件绑定（私有）
            _listen: function () {
                var $widget = this.$view;
                //绑定事件，推荐使用事件冒泡
                //这里绑定的事件一定不能与业务逻辑有关的，否则应该在“事件配置”中定义

                $widget
                //解绑上次的事件
                    .off('.namespace')
                    //绑定事件
                    .on({
                        'eventType1.namespace': function (e) {
                            //使用兼容IE8事件兼容的用法
                            var $target = $(e.target || window.event.srcElement);

                            //判断$target是什么
                            if (
                                //判断target是否为a标签
                            $target.is('a') ||

                            //判断target是不是$widget
                            $target.is($widget) || $target.is(this) ||

                            //或者target是否有某个样式
                            $target.hasClass('.dataTables') ||

                            //触发的元素开始找，父辈是否有a标签
                            $target.closest('a').length
                            //其他选择器，请搜索“jQuery选择器”
                            ) {
                                //do something
                            }
                        },
                        'eventType2.namespace': function (e) {

                        },
                        //example,获取点击a标签的id
                        //事件-->触发范围 ###_ID## a，接口-->查看接口getter配置
                        'click.namespace': function (e) {
                            var $target = $(e.target || event.srcElement);

                            if ($target.is('a')) {
                                //例如 a标签的html为 <a data-href="bbb">Hello world</a>
                                cache.href = $target.attr('[data-href]');
                            }
                        }
                    });
            },

            //渲染主题、样式（私有）
            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    cssCode,
                    className,
                    style;

                if (css) {
                    //css样式配置渲染
                    if (css.theme) {
                        /**
                         *
                         * 如果组件配置了类名主题，则要同时将类名加到组件相应位置上去
                         * 例如：
                         * if(css.theme['function']){
                         *  $button.removeClass().addClass('btn ' + css.theme['function']);
                         * }
                         *
                         **/
                    }

                    //样式解析机制
                    if (style = css.style) {

                        /**
                         *
                         * 1.直接拿到样式内容和选择器，利用jq的css()渲染配置样式
                         * 2.利用 $AW.cssHover(select,$selector,content,pseudo)方法生成虚拟渲染样式，他将在组件dom结构后面插入内联样式，直接覆盖外联样式表里面的样式。
                         *
                         * 例如：
                         * $AW.cssHover('input.input-group-field',$selector,style.inputActive,':active');
                         *
                         * 说明：
                         * select：样式对应的选择器，如‘input.input-group-field’
                         * $selector:组件操纵对象或组件选择器
                         * content:css样式配置的内容
                         * pseudo:伪类、伪元素,动态类名，如‘:hover:focus.btn-hover’.如果只想添加虚拟样式，可以直接传入 ‘’ 空字符串。
                         *
                         * */
                    }


                    //自定义样式
                    if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                        /**
                         *
                         * 如果$selector不是组件最外层的选择器[data-widget-type]元素,
                         * 则要添加自定义样式,例如：
                         * $selector.addClass(className);
                         * 说明：
                         * $selector:组件的任意选择器
                         *
                         **/
                    }
                }


            },

            _renderFakeData: function () {
            },

            /*
            *   @pause 页面切出接口
            *
            *   配置：
            *       接口-->
            *           中文名：暂停
            *           英文名：pause
            *           类型：无参数接口
            *           详情：当由当前页面切换到其他页面时，组件提供的可调用接口，该接口组件用于停止组件实例某些消耗性能的监听或轮询
            *           调用接口可以在：切出操作
            * */
            //pause:function(){},

            /*
            *   @resume 页面切入接口
            *
            *   配置：
            *       组件接口-->
            *           中文名：恢复
            *           英文名：resume
            *           类型：无参数接口
            *           详情：当由其他页面到当前页面切换时，组件提供的可调用接口，该接口组件用于恢复组件实例某些消耗性能的监听或轮询
            *           调用接口可以在：切入操作
            * */
            //resume:function(){},

            /*
            *   @destroy 销毁组件实例
            *
            *   配置：
            *       组件接口-->
            *           中文名：销毁
            *           英文名：destroy
            *           类型：无参数接口
            *           详情：当关闭当前页面时，组件提供的销毁组件实例接口，一旦在"接口"配置中配置，页面关闭时，将自动调用
            *           调用接口可以在：销毁操作
            * */
            destroy: function () {
                this.$view.off().empty();
            },

            /*
            *   @getter 获取组件实例的某些数据
            *
            *   配置：
            *       组件接口-->
            *           中文名：获取XX的XX
            *           英文名：getValue
            *           类型：取值器
            *           详情：当点击组件a标签时，获取当前选中href值
            *           是否有出参：是
            *           出参：
            *              中文名：a标签href值
            *              英文名：href
            *              类型：字符串（根据实际情况而定）
            * */
            getValue: function () {
                //return value;
            },

            /*
            *   @setter 赋值器
            *       @value      Object      输入值
            *   配置：
            *       组件接口-->
            *           中文名：设置组件链接列表
            *           英文名：setLinkList
            *           类型：赋值器
            *           详情：该接口用于设置组件链接列表
            *           调用接口可能需要发起异步请求：可能需要
            *           入参：
            *              中文名：链接列表
            *              英文名：linkList
            *              类型：数组（根据实际情况而定）
            *                  子元素1：
            *                      中文名：链接项
            *                      类型：对象
            *                      子元素1：
            *                          中文名：链接项名称
            *                          英文名：name
            *                          类型：字符串
            *                          示例值：链接项1
            *                      子元素2：
            *                          中文名1：链接项href
            *                          英文名：href
            *                          类型：字符串
            *                          示例值：id1
            * */
            setValue: function (linkList) {
                /*
                *   linkList=[{
                *       name:'链接项1',
                *       href:'id1
                *   }]
                * */
                var //模板
                    TEMPLATE = '<a data-href="_value_">_name_</a>',
                    //填充数据
                    html = [],
                    //中间变量
                    i, item,

                    $widget = this.$view;

                //清空上次的内容
                $widget.empty();

                if (linkList === 'auiAjaxTest') {
                    //此处为 AWEB IDE 下 异步传输数据测试信号
                } else if (linkList && linkList.length) {//校验输入数据
                    for (i = -1; item = linkList[++i];) {
                        html.push(
                            TEMPLATE
                                .replace(/_name_/ig, item.name)
                                .replace(/_value_/ig, item.href)
                        );
                    }
                    //填充内容
                    $widget.append(html.join(''));
                }
            },


            /*
            *   @success    校验成功
            *       @$widget    jQuery Object
            *   配置：
            *       组件接口-->
            *           中文名：校验成功
            *           英文名：success
            *           类型：校验成功
            *           详情：当校验成功时，组件提供的接口
            *           入参：
            *              中文名：组件实例输入元素的jQuery
            *              英文名：$selector
            *              类型：jQuery对象
            * */
            success: function ($selector) {
            },

            /*
            *   @error      校验失败
            *       @$widget    jQuery Object
            *       @errorMsg   String          错误提示
            *   配置：
            *       组件接口-->
            *           中文名：校验失败
            *           英文名：error
            *           类型：校验失败
            *           详情：当校验失败时，组件提供的接口
            *           入参：
            *              中文名：组件实例输入元素的jQuery
            *              英文名：$selector
            *              类型：jQuery对象
            *
            *              中文名：错误提示
            *              英文名：errorMsg
            *              类型：字符串
            * */
            error: function ($selector, errorMsg) {
            },

            /*
            *   @clean      清空校验
            *       @e      Event Handler   事件句柄
            *   配置：
            *       组件接口-->
            *           中文名：清空校验
            *           英文名：clean
            *           类型：清空校验
            *           详情：当清空校验时，组件提供的接口
            *           入参：
            *              中文名：事件句柄
            *              英文名：e
            *              类型：事件句柄
            * */
            clean: function (e) {
            },

            /*
            *
            *  @validateHandler    自定义校验方法
            *  @value              输入值
            *
            *  return {
            *      result: true,        //校验结果
            *      value: value,        //传输的格式
            *      errorMsg: ''         //校验失败的结果
            *  }
            *   配置：
            *       组件接口-->
            *           中文名：自定义校验方法
            *           英文名：validateHandler
            *           类型：自定义校验方法
            *           详情：组件提供的特殊格式的自定义校验方法
            *           入参：
            *              中文名：输入值
            *              英文名：value
            *              类型：字符串
            *           是否有出参：是
            *           出参：
            *              中文名：返回值
            *              英文名：ret
            *              类型：对象
            *                 子元素1：
            *                      中文名：校验结果
            *                      英文名：result
            *                      类型：布尔值
            *                 子元素2：
            *                      中文名：正确的传输格式
            *                      英文名：value
            *                      类型：字符串（根据实际情况而定）
            *                 子元素3：
            *                      中文名：校验失败的错误提示，校验正确时，该项为空
            *                      英文名：errorMsg
            *                      类型：字符串
            * */
            validateHandler: function (value) {
                return {
                    result: true, //校验结果
                    value: value, //传输的格式
                    errorMsg: '' //校验失败的错误提示
                }
            },

            //组件行为部分
            /*
            *   @behavior  行为接口，通过比较结果对 $widget 进行操作
            *       @result     Boolean     比较结果
            *       @input1     Object      输入值
            *       @input2     Object      比较值
            *       @condition  enum        条件
            *                   lt          小于
            *                   eq          等于
            *                   gt          大于
            *                   not         不等于
            *                   includes    包含
            *                   notIncludes 不包含
            *                   startsWith  以…开始
            *   配置：
            *       组件接口-->
            *           中文名：显示隐藏行为
            *           英文名：display
            *           类型：行为接口
            *           详情：根据结果进行显示或者隐藏
            *           入参：
            *              中文名：比较结果
            *              英文名：result
            *              类型：布尔值
            *
            *              中文名：输入值
            *              英文名：input1
            *              类型：字符串（根据实际情况而定）
            *
            *              中文名：比较值
            *              英文名：input2
            *              类型：字符串（根据实际情况而定）
            *
            *              中文名：比较条件
            *              英文名：condition
            *              类型：枚举值
            *
            * */
            behavior: function (result, input1, input2, condition) {
                this[result ? 'hide' : 'show']();
            },

            /*
            *   @show   显示
            *   配置：
            *       组件接口-->
            *           中文名：显示
            *           英文名：show
            *           类型：无参数接口
            * */
            show: function () {
                this.$view.removeClass('hide');
            },

            /*
            *   @show   隐藏
            *   配置：
            *       组件接口-->
            *           中文名：隐藏
            *           英文名：hide
            *           类型：无参数接口
            * */
            hide: function () {
                this.$view.addClass('hide');
            },

            /*使用复制的getter、setter*/
            getter: function (key) {
                var ret = this.dataModule[key];

                return ret && typeof ret === 'object' ? JSON.parse(JSON.stringify(ret)) : ret;
            },
            setter: function (key, value) {
                var inner = value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;

                this.dataModule[key] = inner;
            },

            /*
            *   设置组件是否可用
            * */
            disable: function (flag) {

            },

            //使用同一的缓存对象
            getCacheView: function (key, refresh) {
                var ret = this.viewCache[key];

                if (!ret || refresh) {
                    ret = this.viewCache[key] = $('[data-role="' + key + '"]', this.$view);
                }

                return ret;
            }
        };

        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        widget.custom.AIR_rxjsTest= function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();