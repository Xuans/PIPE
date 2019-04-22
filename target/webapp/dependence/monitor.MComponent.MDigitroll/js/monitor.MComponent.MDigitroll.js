(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "vue" , "digitroll" ], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, Vue) {
        "use strict";

        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model

            context.$view = $widget;
            context.option = $.extend(true, {}, this.setting,css.style, option);

            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;


            //View Model
            context.viewCache = {};



            //初始化
            context._init();

            //渲染样式
            context._render();


        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',

            debugger: window.auiApp && window.auiApp.debugger,

            //常量表
            
            setting: {
                digitRoll: {}
            },


            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    $ctn = $widget.find("#dr-ctn"),
                    option = this.option,
                    self,
                    i,
                    pictureArr = [],
                    digitRoll;

                $ctn.css({height:option.height});
                function DigitRoll(opts) {
                    // this.container=document.querySelector(opts.container); //容器
                    this.container = opts.container;
                    this.width=opts.width || 1;
                    this.isPic = opts.isPic;
                    this.pic = opts.pic;
                    this.pictureArr = opts.pictureArr;
                    this.height = opts.height;

                    if (!this.container) {
                        throw Error('no container');
                    }
                    this.container.style.overflow='hidden';
                    this.rollHeight=parseInt(getComputedStyle(this.container).height); //容器高度 也用于滚动间隔距离
                    if(this.rollHeight + "" ==="NaN"){
                        this.container.style.height='20px';
                        this.rollHeight = 20;
                    }
                    if (this.rollHeight<1) {//只有容器的高度是必选样式  如果没有设置 那就给一个默认的
                        this.container.style.height='20px';
                        this.rollHeight=20;
                    }
                    this.setWidth();
                }
                DigitRoll.prototype={
                    roll:function (n) {
                        self=this;
                        this.number=parseInt(n)+'';

                        // 处理长度
                        if (this.number.length<this.width) {
                            this.number=new Array(this.width - this.number.length + 1).join('0') + this.number;
                        }else if (this.number.length>this.width) {
                            this.width=this.number.length;
                            this.setWidth();
                        }
                        Array.prototype.forEach.call(this.container.querySelectorAll('.dr-num'), function (item,i) {
                            var currentNum=parseInt(item.querySelector('div:last-child').innerHTML),//当前数字
                            goalNum=parseInt(self.number[i],10),//目标数字
                            gapNum=0, //数字滚动的间隔个数
                            gapStr='',
                            str='',j;
                            
                            if (currentNum===goalNum) { //数字没变 不处理
                                if(self.isPic){
                                    gapStr+='<div><img src = "'+self.pic.picture0+'" class="dr-picture"></div>'
                                }else{
                                    gapStr+='<div style="line-height:'+self.height+'px">0</div>'
                                }
                            }else if(currentNum<goalNum) { // 比如数字从1到3   
                                gapNum=goalNum-currentNum;
                                for ( j=currentNum; j<goalNum+1; j++) {
                                    if(self.isPic){
                                        gapStr+='<div><img src = "'+self.pic[self.pictureArr[j]]+'" class="dr-picture"></div>'
                                    }else{
                                        gapStr+='<div style="line-height:'+self.height+'px">'+j+'</div>'
                                    }
                                }
                            }else {// 比如 数字从6到5  因为所有情况都是从下往上滚动 所以如果是6到5的话 要滚动9个数字
                                gapNum=10-currentNum+goalNum;
                                for ( j=currentNum; j<10; j++) {
                                    if(self.isPic){
                                        gapStr+='<div><img src = "'+self.pic[self.pictureArr[j]]+'" class="dr-picture"></div>'
                                    }else{
                                        gapStr+='<div style="line-height:'+self.height+'px">'+j+'</div>'
                                    }
                                }
                                for ( j=0; j<goalNum+1; j++) {
                                    if(self.isPic){
                                        gapStr+='<div><img src = "'+self.pic[self.pictureArr[j]]+'" class="dr-picture"></div>'
                                    }else{
                                        gapStr+='<div style="line-height:'+self.height+'px">'+j+'</div>'
                                    }
                                }
                            }
                            
                            item.style.cssText += '-webkit-transition-duration:0s;-webkit-transform:translateY(0)';//重置位置
                            item.innerHTML = gapStr;
                            setTimeout(function () {
                                item.style.cssText+='-webkit-transition-duration:1s;-webkit-transform:translateY(-'+self.rollHeight*gapNum+'px)';
                            },50)
                        })
                    },
                    setWidth:function (n) {
                        n=n||this.width;
                        var str='',i;
                        for ( i=0; i<n; i++) {
                            str+='<div class="dr-num" style="line-height:'+this.rollHeight+'px"><div>0</div></div>';
                            // 处理逗号
                            if(n%3 === 0 && (i+1)%3 === 0 && (i+1) != n){
                                str+='<div class="dr-comma" style="line-height:'+this.rollHeight+'px">,</div>' 
                            }else if(n >= 3){
                                if((i+1) === n%3){
                                    str+='<div class="dr-comma" style="line-height:'+this.rollHeight+'px">,</div>'
                                }else if((i+1-(n%3))%3 === 0 && (i+1-(n%3)) != (n-n%3)){
                                    str+='<div class="dr-comma" style="line-height:'+this.rollHeight+'px">,</div>'
                                }
                                
                            }
                        }
                        this.container.innerHTML=str;
                    }
                };
                
                if(option.isPic){
                    $AW.cssHover("#dr-ctn>.dr-num",$widget,{"color":"rgba(0,0,0,0)"},"");
                    for(i = 0;i < 10;i++){
                        pictureArr.push("picture"+i)
                    }
                }

                digitRoll=new DigitRoll({
                    container: $ctn[0],
                    width:option.numWidth,
                    isPic: option.isPic,
                    pic: option.pic,
                    pictureArr: pictureArr,
                    height: option.height
                });
                digitRoll.roll(option.number);
                this.digitRoll = digitRoll
            },

            //渲染主题、样式（私有）
            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    cssCode,
                    className,
                    style = css.style;
                if (css) {
                //自定义样式
                    if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                        $widget.addClass(className)
                    }
                        style.digitRoll && $AW.cssHover("#dr-ctn",$widget,style.digitRoll,"");
                        style.number && $AW.cssHover("#dr-ctn>.dr-num",$widget,style.number,"");
                        style.commaClass && $AW.cssHover("#dr-ctn>.dr-comma",$widget,style.commaClass,"");
                }
            },

            show: function () {
                this.$view.removeClass('hide');
            },
   
            hide: function () {
                this.$view.addClass('hide');
            },

            refresh: function(number) {
                this.digitRoll.roll(number)
            },

            setNumWidth: function(numWidth) {
                this.digitRoll.setWidth(numWidth)
            }
        };


        if(!widget.monitor.MComponent){
            widget.monitor.MComponent = {};
        }
        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        widget.monitor.MComponent.MDigitroll = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();