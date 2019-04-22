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
        var GRIDCOUNT=42,
            vueOp={
                data:{
                    flag:0,//
                    allchecked:false,
                    show:false,
                    currentDay: 1,
                    currentMonth: 1,
                    currentMonthName: 'January',
                    currentYear: 2017,
                    currentWeek: 1,
                    days: [],
                    language: 'zh-CN',
                    weeks:['一','二','三','四','五','六','日'],
                    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    calendarList: [{
                        icon: "fa fa-question-circle", //fa fa- check - circle
                        img:"",
                        content:'all',
                        color:'#00a4ae',
                        text: '全选',
                        btnOp:[{
                            name:"填报",
                            id:"href1#href2"
                        }]
                    }
                    ]

                },
                created: function () {
                    this.initData(null);
                },
                methods: {
                    initData: function (cur) {
                        var date,nextMonthDays,i,d;
                        if (cur) {
                            date = new Date(cur);
                        } else {
                            date = new Date();
                        }
                        this.currentDay = date.getDate();
                        this.currentYear = date.getFullYear();
                        this.currentMonth = date.getMonth() + 1;
                        this.currentWeek = date.getDay(); // 1...6,0
                        this.days.length = 0;

                        if (this.currentWeek == 0) {
                            this.currentWeek = 7;
                        }

                        var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);

                        var monthDays=this.getThisMonthDays(this.currentYear,this.currentMonth);

                        var firstDayWeek=this.getFirstDayOfWeek(this.currentYear,this.currentMonth);

                        if (firstDayWeek == 0) {
                            firstDayWeek = 7;
                        }



                        //上个月的最后几天
                        for(i=firstDayWeek-2;i>=0;i--){
                            d = new Date(str);
                            d.setDate(-i);
                            this.days.push({ 'day': d, 'checked': true });
                        }

                        //当月
                        for (i = 1; i <= monthDays; i++) {
                            d = new Date(str);
                            d.setDate(i);
                            // this.days.push(d);
                            this.days.push({ 'day': d, 'checked': false });
                        }

                        //下个月
                        if(this.currentMonth==12){
                            str = this.formatDate(this.currentYear+1, 1, this.currentDay);
                        }else{
                            str = this.formatDate(this.currentYear, this.currentMonth+1, this.currentDay);
                        }
                        nextMonthDays=GRIDCOUNT-(this.days.length);
                        for(i=1; i<=nextMonthDays;i++){
                            d = new Date(str);
                            d.setDate(i);
                            this.days.push({ 'day': d, 'checked': true });
                        }

                        //判断环境所使用的语言来决定模板使用哪个渲染顺序渲染年月名称
                        this.language = $AW.getLanguage && $AW.getLanguage();



                    },

                    //得到这个月的总天数
                    getThisMonthDays:function(year, month) {
                        return new Date(year, month, 0).getDate();
                    },

                    //得到这个月的第一天对应的星期数
                    getFirstDayOfWeek:function(year, month) {
                        return new Date(year, month-1, 1).getDay();
                    },

                    pickPre: function(year, month) {
                        var d = new Date(this.formatDate(year, month, 1));
                        d.setDate(0);

                        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
                    },

                    pickNext: function (year, month) {
                        var d = new Date(this.formatDate(year, month, 1));
                        d.setDate(GRIDCOUNT);
                        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
                    },

                    // 返回 类似 2016-01-02 格式的字符串
                    formatDate: function (year, month, day) {
                        var y = year;
                        var m = month;
                        if (m < 10) m = "0" + m;
                        var d = day;
                        if (d < 10) d = "0" + d;
                        return y + "-" + m + "-" + d
                    },
                    //判断是否在数组
                    isInArray:function(arr,value){
                        if (typeof arr=='string'){
                            arr=arr.split(",");
                        }
                        for(var i = 0; i < arr.length; i++){
                            if(value === arr[i]){
                                return true;
                            }
                        }
                        return false;
                    },

                    //点击日期切换类
                    activeCheck:function(index){
                        var that = this, thisYearDays, content = this.calendarList[this.flag].content;

                        this.days[index].checked =!this.days[index].checked;
                        thisYearDays = (content == 'all') ? this.getThisYear() :content;
                        that.allchecked = true;
                        that.days.forEach(function(item,i){
                            thisYearDays && thisYearDays.forEach(function(val,index){
                                if (item.day.getDate() === val) {
                                    if (that.days[i].checked === false) {
                                        that.allchecked = false
                                    }
                                }

                            })


                        });

                        for (var i = 0; i < that.days.length;i++){
                            if (that.days[i].day.getMonth() + 1 == that.currentMonth){
                                if (that.days[i].checked === true) {
                                    that.calendarList[that.flag].disabled = true;
                                    break;
                                }else{
                                    that.calendarList[that.flag].disabled = false;

                                }
                            }


                        }

                    },

                    //点击同类型的全选
                    allcheckMethod:function(){
                        var thisYearDays = [], that = this, content = this.calendarList[this.flag].content;

                        thisYearDays = (content == 'all') ? this.getThisYear() : content;

                        if (thisYearDays.length) {
                            this.allchecked = !this.allchecked;
                            this.days.forEach(function(item,i){
                                thisYearDays.forEach(function (val, index) {
                                    if (item.day.getDate() == val) {
                                        that.days[i].checked = that.allchecked
                                    }

                                })
                            })

                        }
                        for (var i = 0; i < that.days.length; i++) {
                            if (that.days[i].day.getMonth() + 1 == that.currentMonth) {
                                if (that.days[i].checked === true) {
                                    that.calendarList[that.flag].disabled = true;
                                    break;
                                } else {
                                    that.calendarList[that.flag].disabled = false;

                                }
                            }


                        }

                    },

                    //获取当前月的数组
                    getThisYear:function(){
                        var monthDays = this.getThisMonthDays(this.currentYear, this.currentMonth),days=[],d;
                        for (var i = 1; i <= monthDays; i++) {
                            days.push(i);
                        }
                        return days;

                    },

                    //选择同类型的
                    choiceText:function(index){
                        var that = this;

                        this.days.forEach(function(item,idx){
                            if (item.day.getMonth() + 1 ==that.currentMonth){
                                item.checked = false;
                            }
                        });

                        this.allchecked=false;
                        this.flag=index;
                        this.show=false;
                    }

                }
            };
        if(!widget.mobile.SoYComponent){

            widget.mobile.SoYComponent={}
        }

        widget.mobile.SoYComponent.SoYCalendar = function () {

            // 对日期月份名称进行国际化翻译
            var translateDate = function(date,widgetIns,attr,auiCtx){
                var i,item,id,dataList = date;
                    auiCtx && (id = attr.id);
                   for (i = dataList.length;item = dataList[--i];) {

                       if(auiCtx){
                           item = $AW.nsl(item,id,auiCtx);
                           dataList[i] = item;
                       }else{
                           item = widgetIns.nsl(item);
                           dataList[i] = item;
                       }
                   }
                   return dataList;
            };

                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],ins,i,item,j,btn,widgetIns;

                // 运行时，对 calendarList{ btnOp {name} , text,} 进行国际化翻译

                if (option.calendarList) {

                    for ( i = -1; item = option.calendarList[++i];) {
                        item.text = $AW.nsl(item.text, attr.id, auiCtx);

                        if (item.btnOp) {

                            for( j = -1; btn = item.btnOp[++j];) {
                                btn.name = $AW.nsl(btn.name, attr.id, auiCtx);
                            }
                        }
                    }
                }
                vueOp.data.weeks = translateDate(vueOp.data.weeks, widgetIns, attr, auiCtx);
                vueOp.data.months = translateDate(vueOp.data.months, widgetIns, attr, auiCtx);

                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll('<div id="'+attr.id+'"></div>');

                //运行时代码Start
                ins = new Vue({
                    el: "#" + attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    computed: vueOp.computed,
                    created:vueOp.created,
                    methods:vueOp.methods

                });

                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    setDaysState:function(data){
                        ins.calendarList=data;
                    },
                    getYearAndMonth:function(){
                        return ins.currentYear+'-'+ins.currentMonth;
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
