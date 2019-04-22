/**
 * Created by wubingyu on 2017/12/7.
 */
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
            var temp = '<li data-id="_id_" >_name_</li>';
            if (!widget.mobile.SoYComponent) {
                widget.mobile.SoYComponent = {};
            }
            widget.mobile.SoYComponent.SoYActionSheet = function () {
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4],
                    innerCallback, listBtns, liTemp, selectIdx, $cancle;

                $cancle = $("[data-id=cancle]", $widget);
                option && (listBtns = option.listBtn);
                if (listBtns) {
                    liTemp = listBtns.map(function (item, index) {
                        return temp.replace("_name_", item.name).replace("_id_", item.id);
                    }).join('');
                    $widget.find('ul').empty().append(liTemp);
                }
                if (option && option.displayCancle) {
                    $cancle.show();
                } else {
                    $cancle.hide();
                }

                if (css && css.cssCode && css.cssCode.className) {
                    $widget.addClass(css.cssCode.className)
                }

                $widget.off('click.camera').on('click.camera', function (e) {
                    var $target = $(e.target);
                    switch ($target.attr('data-id')) {
                        case 'cancel':
                            $widget.removeClass("show");
                            break;
                        default:
                            $widget.removeClass("show");
                            break;
                    }

                    innerCallback = null;
                });

                $("li", $widget).off('click.li').on('click.li', function (e) {
                    var $target = $(e.target);
                    selectIdx = $target.index();

                });

                //运行时代码End

                return {

                    show: function () {
                        $widget.addClass("show");

                    },

                    hide: function () {
                        $widget.removeClass("show");

                    },
                    display: function (result) {
                        $widget[result ? 'addClass' : 'removeClass']("show");
                    },
                    getValue: function () {
                        return option.listBtn[selectIdx].id;
                    },
                    setOption: function (option) {
                        $cancle.find("ul").empty();
                        option && (listBtns = option.listBtn);
                        if (listBtns) {
                            liTemp = listBtns.map(function (item, index) {
                                return temp.replace("_name_", item.name).replace("_id_", item.id);
                            }).join('');
                            $widget.find('ul').empty().append(liTemp);
                        }
                        if (option && option.displayCancle) {
                            $cancle.show();
                        } else {
                            $cancle.hide();
                        }
                    }
                };

            };
        });
})();
