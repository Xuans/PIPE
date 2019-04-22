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

        var vueOption = function ($widget, css) {
            return {
                data: {
                    radioBoxPosition: "left",
                    radioStyle: {},
                    radioItemStyle: {},
                    radioCheckedStyle: {},
                    radioTextStyle: {},
                    radioCheckedTextStyle: {},
                    radioTitleStyle:{},
                    title:""
                },
                created: function () {
                    var checkedIndex = -1;
                    this.radioListData.forEach(function (val, i) {
                        if (val.isChecked === true) {
                            checkedIndex = i;
                            val.isChecked = false;
                        }
                    });
                    if (checkedIndex >= 0) this.radioListData[checkedIndex].isChecked = true;
                    // checked.isChecked=true;

                    this.$nextTick(function () {

                        $AW.cssHover(".radio-list.checked .list-radiobox-icon", $widget, css.radioCheckedStyle, "");
                        $AW.cssHover(".radio-list.checked .list-radiobox-icon + span ", $widget, css.radioCheckedTextStyle, "");
                    })
                },
                watch: {},
                methods: {
                    checkClick: function (item) {
                        var context = this;
                        if (!item.disabled) {
                            context.radioListData.forEach(function (val, index) {
                                val.isChecked = false;
                                item.isChecked = true;
                            })
                        }

                    }
                }
            }
        };
        if (!widget.mobile.SoYComponent) {
            widget.mobile.SoYComponent = {};
        }
        widget.mobile.SoYComponent.SoYRadioList = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4], ins,i,item,vueOp;

                //运行时，对 radioListData 中每个选项的 label、value 进行国际化翻译
                if (option.radioListData) {

                    for (i = -1; item = option.radioListData[++i];) {
                        item.label = $AW.nsl(item.label, attr.id, auiCtx);
                        item.value = $AW.nsl(item.value, attr.id, auiCtx);
                    }
                }


                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll("<div id='" + attr.id + "'></div>");
                vueOp = vueOption($widget, css.style);
                //运行时代码Start
                ins = new Vue({
                    el: "#" + attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    created: vueOp.created,
                    watch: vueOp.watch,
                    methods: vueOp.methods
                });
                if (css && css.cssCode && css.cssCode.className) {
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    //设置的值
                    setValue: function (data) {
                        ins.radioListData = data;
                    },
                    //获取选中的值
                    getValue: function () {
                        var value = {};
                        ins.radioListData.forEach(function (item, index) {
                            if (item.isChecked === true) {
                                value = item;
                            }
                        });
                        return value;

                    },

                    setSelectValue: function (value) {
                        if (value !== undefined) {
                            ins.radioListData.forEach(function (item, index) {
                                ins.$set(item, 'isChecked', false);
                                if (item.value === value) {
                                    ins.$set(item, 'isChecked', true)
                                }
                            });
                        }
                    },
                    setDisabled: function (options) {
                        var data = ins.radioListData,
                            i, item,
                            _i, _item,
                            map = {};

                        if (options && options.length) {

                            for (i = -1; item = options[++i];) {
                                map[item.value] = item.disabled;
                            }


                            for (_i = -1; _item = data[++_i];) {
                                if (map.hasOwnProperty(_item.value)) {
                                    ins.$set(_item, 'disabled', map[_item.value])
                                }
                            }
                        }
                    },
                    resetValue: function () {

                        ins.radioListData.forEach(function (item, index) {
                            ins.$set(item, 'isChecked', false);
                        });
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
                    disabled: function(data) {
                        this.setDisabled(data);
                    }
                }
            
        };
    });
})();
