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

        var VueOption=function (option) {
                return {
                    data:{
                        listTitleStyle:{},
                        auiListStyle:{},
                        titleStyle:{},
                        lableStyle:{},
                        lableExtraStyle:{},
                        valueStyle:{},
                        imgStyle:{},
                        iconStyle:{},
                        processStyle:{},
                        processActive:{},
                        linkStyle:{},
                        statusStyle:{},
                        btnStyle:{},
                        extraValueStyle:{},


                        index:0,
                        listTitle:"",
                        startX:0,
                        startY:0,
                        endX:0,
                        endY:0,
                        maskShow:false,
                        list:[],
                        mapStatus:[],

                        downLeft:0,
                        downTime:0,
                        hasRefresh:false,
                        maxDistance:0,
                        topDistance:70,
                        bottomDistance:70,
                        distanceIndex:2,
                        bottomAllLoaded:false,
                        wrapperHeight:{},
                        translate: 0,
                        scrollEventTarget: null,

                        topText: '',
                        topDropped: false,
                        bottomText: '',
                        bottomDropped: false,
                        bottomReached: false,
                        direction: '',
                        refreshStartY: 0,
                        startScrollTop: 0,
                        currentY: 0,
                        topStatus: '',
                        bottomStatus: '',
                        refreshType:0
                    },
                    computed:{
                        mapStatusMe: function() {
                            var data = {};
                            $.each(this.mapStatus, function (i, item) {
                                if (item['key']) {
                                    data[item['key']] = { value: item['value'], bgcolor: item['bgcolor'], color: item['color'] }
                                }
                            });
                            return data;
                        }
                    },
                    watch: {
                        topStatus:function(val) {
                            // this.$emit('top-status-change', val);
                            this.topStatusChange(val);
                            switch (val) {
                                case 'pull':
                                    this.topText = "this.topPullText";
                                    break;
                                case 'drop':
                                    this.topText = "松开立即刷新";
                                    break;
                                case 'loading':
                                    this.topText = "this.topLoadingText";
                                    break;
                            }
                        },

                        bottomStatus: function(val) {
                            this.bottomStatusChange(val);
                            // this.$emit('bottom-status-change', val);
                            switch (val) {
                                case 'pull':
                                    this.bottomText = "this.bottomPullText";
                                    break;
                                case 'drop':
                                    this.bottomText = "松开立即刷新";
                                    break;
                                case 'loading':
                                    this.bottomText = "this.bottomLoadingText";
                                    break;
                            }
                        }
                    },
                    created:function(){

                    },

                    mounted:function(){
                        var that=this;
                        this.list.forEach(function(item,index){
                            that.$set(item,'show',false);
                        });
                        if(this.hasRefresh){
                            this.wrapperHeight ={height: document.documentElement.clientHeight - this.$refs.listWrap.getBoundingClientRect().top+"px",
                                overflowY:"scroll"
                            };
                            setTimeout(function(){
                                that.init();
                            },20)

                        }


                        this.$nextTick(function(){
                            var ref = this.$refs, componentList = ref.componentList, btnSpan, componentListW, btnsW,j;
                            if(ref.btns && ref.btns.length){
                                componentList.map(function(item,i){
                                    btnsW = 0;
                                    componentListW =parseFloat(getComputedStyle(ref.componentList[i], false)['width']);
                                    if(ref.btns[i].children){
                                        for (j = ref.btns[i].children.length; btnSpan=ref.btns[i].children[--j];){
                                            btnsW = btnsW+ parseFloat(getComputedStyle(btnSpan, false)['width']);
                                        }
                                        ref.ctn[i].style.width = componentListW+"px";
                                        ref.btns[i].style.width = btnsW+"px" ;
                                        ref.wrapper[i].style.width =componentListW + btnsW+"px";
                                    }
                                })
                            }
                        })
                    },
                    methods:{
                        getValue: function (index) {
                            this.index = index;
                        },
                        init:function() {
                            this.topStatus = 'pull';
                            this.bottomStatus = 'pull';
                            this.scrollEventTarget = this.getScrollEventTarget(this.$el);
                            this.bindTouchEvents();

                        },

                        translateChange:function(translate) {
                            var translateNum = +translate;
                            this.translate = translateNum.toFixed(2);
                            // this.moveTranslate = (1 + translateNum / 70).toFixed(2);
                        },
                        topStatusChange:function(status) {
                            // this.moveTranslate = 1;
                            this.topStatus = status;
                        },
                        bottomStatusChange: function (status) {
                            this.bottomStatus = status;
                        },

                        //下拉刷新的数据
                        bottomMethod:function(){
                            var that=this;
                            /* 此处编写*/
                            if(option && option.dropdownCallback){
                                try{
                                    option.dropdownCallback(function(){
                                        that.onTopLoad();
                                    });
                                }catch (e){
                                }
                            }else{
                                that.onTopLoad();
                            }
                            /*加载数据*/
                        },
                        onTopLoad:function () {
                            var that=this;
                            that.translate = 0;
                            setTimeout(function() {
                                that.topStatus = 'pull';
                            }, 1500);
                        },


                        //上拉刷新的数据
                        topMethod:function(){
                            /* 此次编写加载数据
                             *
                             *
                             **/
                            var that=this;
                            /* 此处编写*/
                            if(option && option.pullUpCallback){
                                try{
                                    setTimeout(function () {
                                        option.pullUpCallback(function(){
                                            that.onBottomLoaded();
                                        });

                                    },1500);
                                }catch (e){
                                }
                            }else{
                                setTimeout(function () {
                                    that.onBottomLoaded();
                                },1500);
                            }



                        },
                        //底部加载的数据
                        onBottomLoaded:function(){
                            var that=this;
                            that.bottomStatus = 'pull';
                            that.bottomDropped = false;
                            this.$nextTick(function() {
                                if (this.scrollEventTarget === window) {
                                    document.body.scrollTop += 50;
                                } else {
                                    this.scrollEventTarget.scrollTop += 50;
                                }
                                this.translate = 0;
                            });
                        },

                        bindTouchEvents:function() {
                            this.$el.addEventListener('touchstart', this.handleTouchStart,false);
                            this.$el.addEventListener('touchmove', this.handleTouchMove,false);
                            this.$el.addEventListener('touchend', this.handleTouchEnd,false);
                        },
                        getScrollEventTarget:function(element) {
                            var currentNode = element;
                            while (currentNode && currentNode.tagName !== 'HTML' &&
                            currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
                                var overflowY = document.defaultView.getComputedStyle(currentNode).overflowY;
                                if (overflowY === 'scroll' || overflowY === 'auto') {
                                    return currentNode;
                                }
                                currentNode = currentNode.parentNode;
                            }
                            return window;
                        },

                        checkBottomReached:function() {
                            if (this.scrollEventTarget === window) {
                                return document.body.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight;
                            } else {
                                return this.$el.getBoundingClientRect().bottom >= this.$el.children[0].getBoundingClientRect().bottom;
                            }
                        },

                        getScrollTop:function(element) {
                            if (element === window) {
                                return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
                            } else {
                                return element.scrollTop;
                            }
                        },

                        handleTouchStart:function(event) {
                            this.refreshStartY = event.touches[0].clientY;
                            this.startScrollTop = this.getScrollTop(this.scrollEventTarget);
                            this.bottomReached = false;
                            if (this.topStatus !== 'loading') {
                                this.topStatus = 'pull';
                                this.topDropped = false;
                            }
                            if (this.bottomStatus !== 'loading') {
                                this.bottomStatus = 'pull';
                                this.bottomDropped = false;
                            }

                        },


                        handleTouchMove:function(event) {

                            if (this.refreshStartY < this.$el.getBoundingClientRect().top && this.refreshStartY > this.$el.getBoundingClientRect().bottom) {
                                return;
                            }

                            this.currentY = event.touches[0].clientY;
                            var distance = (this.currentY - this.refreshStartY) / this.distanceIndex;

                            this.direction = distance > 0 ? 'down' : 'up';
                            if ( this.refreshType==="bottom"  &&  typeof this.topMethod === 'function' && this.direction === 'down' &&
                                this.getScrollTop(this.scrollEventTarget) === 0 && this.topStatus !== 'loading') {
                                event.preventDefault();
                                event.stopPropagation();
                                if (this.maxDistance > 0) {
                                    this.translate = distance <= this.maxDistance ? distance - this.startScrollTop : this.translate;
                                } else {
                                    this.translate = distance - this.startScrollTop;
                                }
                                if (this.translate < 0) {
                                    this.translate = 0;
                                }
                                this.topStatus = this.translate >= this.topDistance ? 'drop' : 'pull';
                                this.translateChange(this.translate);
                            }

                            //数据不满屏
                            if(this.$el.getBoundingClientRect().bottom >this.$el.children[0].getBoundingClientRect().bottom){
                                this.translate=0;
                                return;
                            }


                            if (this.direction === 'up') {
                                this.bottomReached = this.bottomReached || this.checkBottomReached();
                            }

                            if ( this.refreshType==="top" && typeof this.bottomMethod === 'function' && this.direction === 'up' &&
                                this.bottomReached && this.bottomStatus !== 'loading' && !this.bottomAllLoaded) {
                                event.preventDefault();
                                event.stopPropagation();
                                if (this.maxDistance > 0) {
                                    this.translate = Math.abs(distance) <= this.maxDistance ? this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance : this.translate;
                                } else {
                                    this.translate = this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance;
                                }
                                if (this.translate > 0) {
                                    this.translate = 0;
                                }
                                this.bottomStatus = -this.translate >= this.bottomDistance ? 'drop' : 'pull';
                            }

                        },

                        handleTouchEnd:function() {

                            if (this.direction === 'down' && this.getScrollTop(this.scrollEventTarget) === 0 && this.translate > 0) {
                                this.topDropped = true;
                                if (this.topStatus === 'drop') {
                                    this.translate = '50';
                                    this.topStatus = 'loading';
                                    this.bottomMethod();

                                } else {
                                    this.translate = '0';
                                    this.topStatus = 'pull';
                                }
                                this.translateChange(this.translate);
                                event.stopPropagation();
                            }

                            //数据不满屏
                            if(this.$el.getBoundingClientRect().bottom >this.$el.children[0].getBoundingClientRect().bottom){
                                this.translate=0;
                                return;
                            }

                            if (this.direction === 'up' && this.bottomReached && this.translate < 0) {
                                this.bottomDropped = true;
                                this.bottomReached = false;
                                if (this.bottomStatus === 'drop') {
                                    this.translate = '-50';
                                    this.bottomStatus = 'loading';
                                    this.topMethod();
                                } else {
                                    this.translate = '0';
                                    this.bottomStatus = 'pull';
                                }
                                event.stopPropagation();
                            }
                            this.direction = '';

                        },

                        listTouchStart: function (e,item,index){
                            this.startX = e.changedTouches[0].clientX;
                            this.startY = e.changedTouches[0].clientY;
                            this.downTime=Date.now();
                            if (item.btns && this.maskShow){
                                e.stopPropagation();
                            }

                            e.preventDefault;
                        },

                        listTouchMove:function(e,item,index){
                            if (!item.btns){
                                return;
                            }
                            var btnsWidth= parseFloat(this.$refs.btns[index].style.width),marginLeft,disY,disX;
                            this.endX=e.changedTouches[0].clientX;
                            this.endY=e.changedTouches[0].clientY;
                            disY=Math.abs(this.endY-this.startY);
                            disX=Math.abs(this.endX-this.startX);

                            if(this.endX-this.startX<0 && disX>disY ){
                                if(disX>=btnsWidth){
                                    marginLeft=-btnsWidth;
                                }else{
                                    marginLeft=this.endX-this.startX;
                                }
                                this.$refs.wrapper[index].style.marginLeft=marginLeft+"px";
                                if (item.btns){
                                    e.stopPropagation();
                                }
                            }
                            // if (item.btns && this.maskShow){
                            //     e.stopPropagation();
                            //     this.$refs.wrapper[0].style.marginLeft=this.endX-this.startX+"px";
                            // }
                        },
                        listTouchEnd: function (e, item, index){
                            this.$refs.wrapper[index].style.marginLeft=0;
                            var X= this.endX - this.startX;
                            var Y= this.endY - this.startY;
                            if (!item.btns){
                                return;
                            }
                            if(this.maskShow){
                                e.preventDefault;
                                e.stopPropagation();
                            }
                            if (Math.abs(X) > Math.abs(Y)&& X>0 && (Math.abs(X)>50 ||Date.now() -this.downTime<300) ){
                                item.show = false;
                                this.maskShow=false;
                                this.$refs.wrapper[index].style.transform = "translateX(0)";

                            }
                            else if (Math.abs(X) > Math.abs(Y) && X<0 && (Math.abs(X)>50 ||Date.now() -this.downTime<300)) {
                                if(this.maskShow) return;
                                item.show=true;
                                this.maskShow=true;
                                this.$refs.wrapper[index].style.transform = "translateX(-" + this.$refs.btns[index].style.width +")";
                            }

                        },
                        maskBgTouch:function(e,item,index){
                            var that=this;
                            item.show = false;
                            setTimeout(function(){
                                that.maskShow = false;
                            },300);

                            this.$refs.wrapper[index].style.transform = "translateX(0)";
                            if(item.btns){
                                e.stopPropagation();
                            }

                        }
                    }
                };
            };

        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }
        widget.mobile.SoYComponent.SoYList = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],i,item,btn,j,

                    dropdownCallback,pullUpCallback,
                    ins,
                    vueOp=VueOption({
                        dropdownCallback:function(callback){
                            if(dropdownCallback){
                                dropdownCallback(callback());
                            }else{
                                callback();
                            }
                        },
                        pullUpCallback:function (callback) {
                            if(pullUpCallback){
                                pullUpCallback(callback());
                            }else{
                                callback();
                            }
                        }
                    });

                     // 运行时，对listTitle、list{title, labeltitle, extratitle, value,btns{name} }、mapStatus{value}国际化翻译

                    option.listTitle = $AW.nsl(option.listTitle, attr.id, auiCtx);

                    if (option.list) {

                        for( i = -1; item = option.list[++i];) {
                            item.title = $AW.nsl(item.title, attr.id, auiCtx);
                            item.labeltitle = $AW.nsl(item.labeltitle, attr.id, auiCtx);
                            item.extratitle = $AW.nsl(item.extratitle, attr.id, auiCtx);
                            item.value = $AW.nsl(item.value, attr.id, auiCtx);

                            if (item.btns) {

                                for( j = -1; btn = item.btns[++j];) {
                                    btn.name =  $AW.nsl(btn.name, attr.id, auiCtx);
                                }
                            }

                        }
                    }

                    if (option.mapStatus) {


                        for( i = -1; item = option.mapStatus[++i];) {
                            item.value = $AW.nsl(item.value, attr.id, auiCtx);
                        }
                    }



                //运行时代码Start
                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll('<div id="'+attr.id+'"></div>');
                ins = new Vue({
                    el: '#' + attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    computed: vueOp.computed,
                    watch: vueOp.watch,
                    created: vueOp.created,
                    mounted: vueOp.mounted,
                    methods: vueOp.methods
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End


                return {
                    //生命周期部分
                    //初始化数据
                    refresh:function(data){
                        ins.list=data;
                        ins.list.forEach(function(item,index){
                            ins.$set(item,'show',false);
                        })
                    },
                    refreshMapStatus:function(data){
                        ins.mapStatus = data;
                    },

                    getListInfo:function(e){
                        return ins.list[ins.index]||{};
                    },

                    //获取底部刷新完成
                    bottomAllLoaded:function () {
                        ins.bottomAllLoaded=true;
                    },
                    //下拉刷新callback
                    setDropDownCallback:function (callback) {
                        dropdownCallback = callback;
                    },
                    //上拉刷新的callback
                    setPullUpCallback:function (callback) {
                        pullUpCallback=callback;
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
