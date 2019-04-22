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
                    checkItemStyle: {},
                    checkBoxStyle: {},
                    checkBoxTextStyle: {},
                    isCheckedBoxStyle: {},
                    isCheckBoxTextStyle: {},
                    allChecked: false,
                    checkBoxPosition: "left",
                    checkBoxTitleStyle:{},
                    title:""
                },
                created: function () {
                    this.isAllChecked();
                    this.$nextTick(function () {
                        $AW.cssHover(".list-checkbox-icon.checked", $widget, css.style.isCheckBoxStyle, "");
                        $AW.cssHover(".list-checkbox-icon.checked + span ", $widget, css.style.isCheckBoxTextStyle, "");
                    })
                },
                watch: {},
                methods: {
                    checkClick: function (item) {
                        var context = this;
                        if (!item.disabled) {
                            item.isChecked = !item.isChecked;
                            this.isAllChecked();
                        }


                    },
                    allCheckChange: function () {
                        var context = this;
                        context.allChecked = !context.allChecked;
                        context.checkListData.forEach(function (val, i) {
                            if (context.allChecked) {
                                val.isChecked = true;
                            } else {
                                val.isChecked = false;
                            }
                        })


                    },
                    isAllChecked: function () {

                        this.allChecked = this.checkListData.every(function (item, i) {
                            return item.isChecked === true;
                        })
                    }
                }
            }
        };
        if (!widget.mobile.SoYComponent) {
            widget.mobile.SoYComponent = {};
        }
        widget.mobile.SoYComponent.SoYCheckList = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4], i, item, ins, vueOp;

                //运行时，对 全选文本allCheckText，checkListData 中每个选项的 label、value 进行国际化翻译4
                option.allCheckText = $AW.nsl(option.allCheckText, attr.id, auiCtx);

                if (option.checkListData) {

                    for (i = -1; item = option.checkListData[++i];) {
                        item.label = $AW.nsl(item.label, attr.id, auiCtx);
                        item.value = $AW.nsl(item.value, attr.id, auiCtx);
                    }
                }

                attr.id = 'vue' + app.getUID();

                $widget.children().wrapAll('<div></div>');
                $widget.children().attr('id', attr.id);
                vueOp = vueOption($widget, css);
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
                        ins.checkListData = data;
                    },

                    //获取选中的值
                    getValue: function () {
                        var valueData = [];
                        ins.checkListData.map(function (item, index) {
                            if (item.isChecked === true) {
                                valueData.push(item);
                            }
                        });
                        return valueData;
                    },
                    setSelectValue: function (data) {
                        if (data && data.length) {
                            ins.checkListData.forEach(function (item, index) {
                                ins.$set(item, 'isChecked', false);
                                data.forEach(function (_item) {
                                    if (item.value === _item) {
                                        ins.$set(item, 'isChecked', true);
                                    }
                                })
                            });
                            ins.isAllChecked();
                        }
                    },

                    resetValue: function () {
                        var data = ins.checkListData,
                            i, item;

                        for (i = -1; item = data[++i];) {
                            ins.$set(item, 'isChecked', false);
                        }

                    },
                    setDisabled: function (options) {
                        var data = ins.checkListData,
                            i, item,
                            _i, _item,
                            map = {};

                        if (options && options.length) {

                            for(i=-1;item=options[++i];){
                                map[item.value]=item.disabled;
                            }
                            for (_i = -1; _item = data[++_i];) {
                                if (map.hasOwnProperty(_item.value)) {
                                    ins.$set(_item, 'disabled', map[_item.value])
                                }
                            }
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
                    }
                };
            
        };
    });
})();
