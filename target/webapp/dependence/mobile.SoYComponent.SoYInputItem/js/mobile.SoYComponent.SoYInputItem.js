(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "vue"], factory);
        }
        // global
        else {
            factory();
        }
    })
    (function ($, widget, Vue) {
        "use strict";
        var vueOp = {
            data: {
                inputStyle: {},
                textareaStyle: {},
                iconStyle: {},
                imgStyle: {},
                titleStyle: {},
                angleRightStyle: {},
                itemData: [],
                errorState: false
            },
            methods: {
                handleClear: function (index) {
                    if (this.itemData[index].readonly) return;
                    this.itemData[index].value = '';
                },


                inputType: function (index) {

                    var item = this.itemData[index],
                        v = item.value, 
                        vlength;
                    switch (item.type) {
                        case 'phone':
                            v = v.replace(/\D/g, '').substring(0, 11);
                            vlength = v.length;
                            if (vlength > 3 && vlength < 8) {
                                item.value = v.replace(/^(...)/g, "$1 ");
                            } else if (vlength >= 8) {
                                item.value = v.replace(/^(...)(....)/g, "$1 $2 ");
                            }
                            // item.value = v.replace(/^(\d{3})(\d{4})$/g, '$1 $2 ');
                            break;
                        case 'bankcard':
                            if (/\S{5}/.test(v)) {
                                item.value = v.replace(/[(a-zA-Z)(\s)(\+)(\*)(\#)]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
                            }
                            break;

                    }
                },
                disableClearIcon: function (item) {
                    
                    if (item.value && item.type !== 'textarea' && item.type !== 'select') item.disableClearIcon = true;
                    else item.disableClearIcon = false;

                }
            },
            computed: {
                regTest: function () {
                    var reg = '';
                    switch (this.type) {
                        case 'phone':
                            reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
                            break;
                        case 'bankcard':
                            reg = /^(\d{16}|\d{19})$/;
                        case 'email':
                            reg = /^\w + ([-+.]\w +)*@\w + ([-.]\w +)*\.\w + ([-.]\w +)*$/;

                        default:
                            reg;
                    }
                    return reg;
                }
            }
        };

        if (!widget.mobile.SoYComponent) {
            widget.mobile.SoYComponent = {};
        }

        widget.mobile.SoYComponent.SoYInputItem = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4], ins,i,item,
                    calcDate = function (dateType) {
                        var now = new Date(),
                            year = now.getFullYear(),
                            month = ((now.getMonth() + 1) > 9) ? (now.getMonth() + 1) : ("0" + (now.getMonth() + 1)),
                            date = translate(now.getDate()),
                            hour = translate(now.getHours()),
                            minute = translate(now.getMinutes()),
                            second = translate(now.getSeconds()),
                            dateString;

                        function translate(prop) {
                            if (prop <= 9) {
                                return "0" + prop;
                            } else {
                                return prop
                            }
                        }

                        switch (dateType) {
                            case 'datetime-local':
                                dateString = year + "-" + month + "-" + date + "T" + hour + ":" + minute;
                                break;
                            case 'date':
                                dateString = year + "-" + month + "-" + date;
                                break;
                            case 'time':
                                dateString = hour + ":" + minute;
                                break;
                            case 'month':
                                dateString = year + "-" + month;
                                break;
                        }

                        return dateString;
                    };

                //运行时，对 itemData 中 title、 placeholder、value 进行国际化翻译
                if (option.itemData) {

                    for (i = -1; item = option.itemData[++i];) {
                        //国际化翻译
                        item.title = $AW.nsl(item.title, attr.id, auiCtx);
                        item.placeholder = $AW.nsl(item.placeholder, attr.id, auiCtx);
                        item.value = $AW.nsl(item.value, attr.id, auiCtx);
                        
                        //对手机号码、银行卡号的默认值进行处理
                        var v = item.value + '',
                            vlength;
                        switch (item.type) {
                            case 'phone':
                                v = v.replace(/\D/g, '').substring(0, 11);
                                vlength = v.length;
                                if (vlength > 3 && vlength < 8) {
                                    item.value = v.replace(/^(...)/g, "$1 ");
                                } else if (vlength >= 8) {
                                    item.value = v.replace(/^(...)(....)/g, "$1 $2 ");
                                }
                                // item.value = v.replace(/^(\d{3})(\d{4})$/g, '$1 $2 ');
                                break;
                            case 'bankcard':
                                if (/\S{5}/.test(v)) {
                                    item.value = v.replace(/[(a-zA-Z)(\s)(\+)(\*)(\#)]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
                                }
                                break;
                        }
 
                        //时间日期初始值处理
                        if (item.type !== 'date') {
                            break;
                        }
                        item.value = item.value || calcDate(item.dateType);
                    }

                }

                //运行时代码Start
                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll('<div id="' + attr.id + '"></div>');
                ins = new Vue({
                    el: '#' + attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    mounted:function () {
                        this.$nextTick(function(){

                            $AW.cssHover(".component-list-text",$widget,css.style.isRequireStyle,"::after");
                        });
                    },
                    methods: vueOp.methods
                });

                var winHeight = $(window).height(); //获取当前页面高度
                app.screen.addResizeHandler({
                    uid: app.getUID(),
                    isGlobal: true,
                    timeout: 500,
                    callback: function () {
                        var thisHeight = $(this).height();
                        if (winHeight - thisHeight > 50) {
                            //当软键盘弹出，在这里面操作
                            //alert('aaa');
                            $('body').css('height', winHeight + 'px');
                        } else {
                            //alert('bbb');
                            //当软键盘收起，在此处操作
                            $('body').css('height', '100%');

                        }
                    }
                });
                if (css && css.cssCode && css.cssCode.className) {
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    getValue: function () {
                        var data=ins.itemData,i,item,ret=[];
                        for(i=-1;item=data[++i];){
                            ret.push({id:item.id,value:item.value});
                        }
                        return ret;
                    },
                    setValue: function (data) {
                        ins.itemData = data;
                    },
                    getItemsValue: function (ids) {
                        var data = ins.itemData,
                            ret = {},
                            i, item,
                            _i, _item;

                        if (ids && ids.length) {
                            for (i = -1; item = data[++i];) {
                                for (_i = -1; _item = ids[++_i];) {
                                    if (item.id === _item) {
                                        ret[_item] = item.value;
                                    }
                                }
                            }
                        }
                        return ret;

                    },
                    getUnformattedItemsValue: function (ids) {
                        var data = ins.itemData,
                            ret = {},
                            i, item,
                            _i, _item;
                        if (ids && ids.length) {
                            for (i = -1; item = data[++i];) {
                                for (_i = -1; _item = ids[++_i];) {
                                    if (item.id === _item) {
                                        // if (item.type !== 'phone' && item.type !== 'bankcard') {
                                        //     return false;
                                        // }0
                                        ret[_item] =item.value && item.value.replace(/\D/g, '');
                                    }
                                }
                            }
                        }
                        return ret;
                    },
                    setItemsValue: function (options) {
                        var data = ins.itemData,
                            map = {},
                            i, item,
                            elem, value, vlength;

                        if (options && options.length) {
                            for (i = -1; item = options[++i];) {
                                map[item.id] = item;
                            }
                            data && data.forEach(function (item) {
                                elem = map[item.id];
                                if (elem && item.id === elem.id) {
                                    switch (item.type) {
                                        case 'phone':
                                            value = elem.value + '';
                                            value = value.replace(/\D/g, '').substring(0, 11);
                                            vlength = value.length;
                                            if (vlength > 3 && vlength < 8) {
                                                value = value.replace(/^(...)/g, "$1 ");
                                            } else if (vlength >= 8) {
                                                value = value.replace(/^(...)(....)/g, "$1 $2 ");
                                            }
                                            ins.$set(item, 'value', value);
                                            break;
                                        case 'bankcard':
                                            value = elem.value + '';
                                            if (/\S{5}/.test(value)) {
                                                ins.$set(item, 'value', value.replace(/[(a-zA-Z)(\s)(\+)(\*)(\#)]/g, '').replace(/(\d{4})(?=\d)/g, "$1 "));
                                            }
                                            break;
                                        default:
                                            ins.$set(item, 'value', elem.value);
                                    }

                                }
                            })
                        }

                    },

                    resetValue: function () {
                        var data = ins.itemData,
                            originData = option.itemData,
                            i, item, j, originItem,
                            value;


                        for (i = -1; item = data[++i];) {

                            for (j = -1; originItem = originData[++j];) {
                                if (item.id === originItem.id) {
                                    value = originItem.value;
                                }
                            }

                            if (item.type === 'date') {
                                value = value || calcDate(item.dateType);
                            }

                            ins.$set(item, 'value', value);
                        }

                    },
                    disabled: function (id, isDisabled) {
                        var data = ins.itemData;
                        if (id) {
                            data && data.forEach(function (item) {
                                if (id === item.id) {
                                    item.disabled = isDisabled;
                                }
                            });
                        } else {
                            data && data.forEach(function (item) {
                                item.disabled = isDisabled;
                            });
                        }
                    },
                    show: function () {
                        $widget.removeClass('hide');
                    },
                    hide: function () {
                        $widget.addClass("hide");
                    },
                    display: function (result) {
                        $widget[result ? 'removeClass' : 'addClass']('hide');
                    },
                    error: function ($input, errorMsg) {
                        ins.errorState = true;
                        errorMsg && app.alert(errorMsg, app.alert.ERROR, 'inputError');
                    },
                    success: function () {
                        ins.errorState = false;
                    },
                    clean: function () {
                        ins.errorState = false;
                    },
                    validateHandler: function (value) {

                        return {
                            result: true,        //校验结果
                            value: value,        //传输的格式
                            errorMsg: ''         //校验失败的结果
                        }
                    },
                    destroy: function () {
                        app.screen.removeResizeHandler(resizeHandler, true);
                    }
                };
            
        };
    });
})();
