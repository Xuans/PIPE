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
                    input:"unfocus",
                    inputValue:'',
                    selectType:'',
                    nslString: {
                            'searchText': '搜索',
                            'cancleText': '取消'
                        },
                    disabled:false
                },
                watch: {

                },
                methods: {
                    _removeFocus :function(){
                        $widget.find('.m-search-input').val("");
                        this.input = 'blur';
                    },
                    focusSearch :function(){
                        if(this.disabled===false){
                            this.input = 'focus';
                            $widget.find('.m-search-input').focus();
                        }
                    },
                    blurSearch :function(){
                        $widget.find('.m-search-input').val().length || this._removeFocus();
                    },
                    clear :function(){
                        $widget.find('.m-search-input').val("");
                        $widget.find('.m-search-input').focus();
                    },
                    cancle :function(){
                        this._removeFocus();
                        $widget.find('.m-search-input').blur();
                    }
                },
                directive:{

                }
            }
        };
        if(!widget.mobile.SoYComponent){
            widget.mobile.SoYComponent={};
        }
        widget.mobile.SoYComponent.SoYSearch = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4], ins, vueOp, originId,i,item, nslString,key;


                if (option.list) {

                    for( i = -1; item = option.list[++i];) {
                        item.name = $AW.nsl(item.name, attr.id, auiCtx);
                    }
                }

                originId = attr.id;
                attr.id = 'vue' + app.getUID();
                $widget.children().wrapAll("<div id='" + attr.id + "'></div>");
                vueOp = vueOption($widget, css.style);
                nslString = vueOp.data.nslString;


                for ( key in nslString) {
                    if (nslString.hasOwnProperty(key)) {
                        nslString[key] = $AW.nsl(nslString[key], originId, auiCtx);
                    }
                }

                //运行时代码Start
                ins = new Vue({
                    el: "#" + attr.id,
                    data: $.extend(true, {}, vueOp.data, option, css.style),
                    created: vueOp.created,
                    watch: vueOp.watch,
                    methods: vueOp.methods
                });
                if(css && css.cssCode && css.cssCode.className){
                    $widget.addClass(css.cssCode.className)
                }
                //运行时代码End

                return {
                    //设置搜索框的值
                    setSearchValue: function (value) {
                        $(ins.$el).find('.m-search-label').click();
                        ins.inputValue = value;
                    },
                    //获取搜索框的值
                    getSearchValue: function () {
                        return ins.inputValue;
                    },
                    display: function (result, input1, input2, condition) {
                        this[result ? 'show' : 'hide']();
                    },
                    show: function () {
                        $widget.removeClass('hide');
                    },
                    hide: function () {
                        $widget.addClass('hide');
                    },
                    disabled: function(data) {
                        ins.disabled = data;
                    },
                    focus: function() {
                        ins.input = 'focus';
                        $widget.find('.m-search-input').focus();
                    },
                    resetValue: function() {
                        ins.inputValue = "";
                    }
                };
            
        };
    });
})();
