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

        if(!widget.monitor.MComponent){
            widget.monitor.MComponent = {};
        }
        widget.monitor.MComponent.MProductMgr = function () {

            var render = function ($sel, option) {

                var PM_CONST = {
                        STATUS_CLASS: {
                            0: 'pm-status-undeployed',
                            1: 'pm-status-stop',
                            2: 'pm-status-run',
                            3: 'pm-status-suspend',
                            4: 'pm-status-wait-del',
                            5: 'pm-status-del',
                            6: 'pm-status-review'
                        },
                        SYS_TYPE:["无","供应者","消费者","发布者","订阅者"],
                        APP_PLT: {0: "afe", 1: "aesb", 2: "afa4j",4:"agreebus"},
                        APP_TYPE: {0: "非标准", 1: "标准"},
                        APP_TYPE_CLASS: {0: "product-unstandard", 1: "product-standard"},
                        APP_ROLE: {0: "消费者", 1: "提供者", 2: "消费者    提供者"},
                        APP_STATUS: {0: "未部署", 1: "已部署"},
                        APP_STATUS_CLASS: {0: "product-undeployed-app", 1: "product-deployed-app"},
                        APP_TEXTS: [{desp: 'ID', key: 'id'}, {desp: '创建时间', key: 'createTime'}, {desp: '描述', key: 'des'}],
                        TYPE_CTN: '<div class="product-type-ctn" data-ctn-type="_TYPE_"><div class="product-type-bar" title="_DES_">_NAME_</div><div class="product-type-ctt"></div></div>',
                        WIDGET: '<div class="product-widget  _PLTCLASS_ _TYPECLASS_" data-product-id="_ID_" data-type="_TYPE_" title="_TITLE_"><div class="product-widget-ctt"><div class="product-icon"><i class="_ICON_"></i></div><div class="product-widget-name" title="_NAME_">_NAME_</div><div class="product-widget-code" title="_CODE_"><i class="icon icon-uo-poc-card"></i>_CODE_</div><div class="product-widget-assicoted" title="_ASSICOTED_"><span>注册集群: </span><span>_ASSICOTED_</span></div><div class="product-widget-id">ID:&nbsp;&nbsp;_ID_</div><div class="product-widget-collection _COLLECTED_"><i class="icon icon-uo-star"></i></div><div class="product-widget-menu"><i class="fa fa-bars"></i></div></div></div>',
                        ADD_WIDGET:'<div class="product-widget product-widget-plus hide"><div class="pp-plus-ctt"><span class="fa fa-plus icon icon-uo-poc-circleplus"></span><br><br><span class="pp-plus-text">添加</span></div></div>',
                        APP_CTN: '<div class="product-apps-ctn"><div class="product-apps-hd"><div class="product-hd-title">_PRONAME_</div><div class="operateSystem"><button class="btn btn-normal"> <span>系统操作</span><i class="fa fa-angle-down"></i></button> <ul class="opr-menu"> <li class="pp-btn edit-system"><span class=""></span>修改系统</li><li class="pp-btn register-system"><span class=""></span>注册系统</li> <li class="pp-btn delete-system"><span class=""></span>删除系统</li> </ul> </div><button class="btn btn-normal btn-sys-scene-list">查看系统场景</button><div class="product-hd-collected"><span>收藏系统：</span><i class="prod-clt-ctn icon icon-uo-star  _COLLECTED_"></i></div>_TYPECTN_<div class="product-apps-ctt">_CTN_</div></div>',
                        TYPE:"<div class='product-type-_TYPE_'>_TYPEHTML_</div>",
                        APP: '<div class="product-app _TYPECLASS_"  data-app-id="_ID_" title="_DES_"><div class="product-app-bar "><div class="app-name">_TYPE_</div><div class="app-status"></div></div><div class="product-app-ctt"><div class="product-app-content"><div class="product-app-title" title="title="_NAME_"">_NAME_</div><div class="product-app-role">_TEXT_</div><div class="product-app-code" title="_CODE_">_CODE_</div><div class="product-app-desp">_DESP_</div><div class="product-app-status _STATUSCLASS_">_STATUS_</div></div><div class="product-app-opr" >_OPR_</div></div></div>',
                        APP_OPR: {
                            0: '<div class="product-opr-ctn col-1" data-id="depolyBtn">部署</div>',
                            1: '<div class="product-opr-ctn col-2" data-id="depolyBtn">部署</div><div class="product-opr-ctn col-2" data-id="depolyRecord">部署记录</div>',
                        },
                        ADD_TEMP: '<div class="product-app pp-ctn pp-add" ><div class="pp-plus-ctt"><span class="fa fa-plus"></span><br><br><span class="pp-plus-text">添加</span></div></div>'

                    },

                    initData,
                    vData = new Array(20),
                    eventId = {},
                    eventName = {},
                    eventCollected,

                    $bar = $sel.children('.product-bar'),
                    $ctn = $sel.children('.product-ctn'),
                    $products,

                    _render = function (data) {
                        var i, item,
                            barHtml = '',
                            appHtml,
                            typeHtml = "",
                            textHtml = '',
                            types = {},
                            domainData,
                            typesId = [],
                            application,

                            $active,
                            $widgetTemp;

                        //render ctn
                        $ctn.empty();
                        for (i = -1; item = data[++i];) {

                            $widgetTemp = $(PM_CONST.WIDGET
                                .replace(/_TYPECLASS_/, item.type?("product-type-" + item.type.replace(/\,/g, " product-type-")):"")
                                .replace(/_ID_/g, item.id)
                                .replace(/_TYPE_/, item.systemClass.id)
                                .replace(/_TITLE_/, item.des || '')
                                .replace(/_COLLECTED_/, item.collected ? 'product-collected' : '')
                                .replace(/_ICON_/, item.icon || 'fa fa-desktop icon icon-uo-poc-computer')
                                /*.replace(/_PLTCLASS_/, "product-plt-" + PM_CONST.APP_PLT[item.platformVersion.platform.type])*/
                                .replace(/_NAME_/g, item.name)
                                .replace(/_ASSICOTED_/g, item.assicoted || "无")
                                .replace(/_CODE_/g, item.code)).appendTo($ctn);


                            appHtml = '';


                            if (option.isSwitchAddBtn) {
                                appHtml += PM_CONST.ADD_TEMP;
                            }

                            //0为无类型, 不显示
                            if(item.type){
                                if(item.type === "0"){

                                    typeHtml = "";
                                }else{

                                    typeHtml = "<div class=\"product-type-ctn\">"+item.type.split(",").map(function(type){return PM_CONST.TYPE.replace(/_TYPE_/,type).replace(/_TYPEHTML_/,PM_CONST.SYS_TYPE[type])}).join("")+"</div>"
                                }
                            }else{
                                typeHtml = "";
                            }


                            $widgetTemp.data('app', PM_CONST.APP_CTN.replace(/_PRONAME_/, item.name)
                                .replace(/_TYPECTN_/,typeHtml)
                                .replace(/_COLLECTED_/, item.collected ? 'product-collected' : '')
                                .replace(/_CTN_/, appHtml));

                        }

                        $ctn.append(PM_CONST.ADD_WIDGET);

                        $products = $ctn.find('.product-widget:not(.product-widget-plus)');


                            if((domainData = app.domain.get($sel.prop('id'))) && ($active = $('[data-product-id="' + domainData.cProductID + '"]:visible', $ctn)).length){

                                $active.trigger("click");
                            }else{

                                option.activeFirst && $products.first().trigger("click");
                            }

                    },

                    _stopPropagation = function (e) {

                        if (e.stopPropagation) {
                            e.stopPropagation();
                        } else {
                            e.cancelBubble();
                        }
                    };

                $.each(vData, function (index, item) {
                    var type = parseInt(Math.random() * 3, 10);

                    vData[index] = {

                        id: 'sys_id_' + index,
                        name: '系统' + index,
                        des: '系统' + index + '的详情描述',
                        collected: Math.random() * 10 > 8,
                        systemClass: {
                            id: 1
                        },
                        platformVersion: {
                            platform: {
                                type: 0
                            }
                        },
                        application: [
                            {
                                id: 'app_id_' + index,
                                name: '应用' + index,
                                des: '应用' + index + '的详情描述',
                                transStatus: '为转换',
                                status: 1,
                                type: '类型1'
                            },
                            {
                                id: 'app_id_' + (index++),
                                name: '应用' + (index),
                                des: '应用' + index + '的详情描述',
                                transStatus: '为转换',
                                status: 0,
                                type: '类型1'
                            },
                            {
                                id: 'app_id_' + (index++),
                                name: '应用' + (index),
                                des: '应用' + index + '的详情描述',
                                transStatus: '为转换',
                                status: 1,
                                type: '类型1'
                            },
                            {
                                id: 'app_id_' + (index++),
                                name: '应用' + (index),
                                des: '应用' + index + '的详情描述',
                                transStatus: '为转换',
                                status: 2,
                                type: '类型1'
                            }
                        ],
                        type: "typeId"
                    }
                });

                //listen
                $ctn.off('.pm').on({
                    'click.pm': function (e) {
                        var $e = $(e.target || window.event.srcElement),
                            $target;

                 if(($target = $e.closest('[data-product-id]')).length){

                            $products.removeClass('product-active');
                            $target.addClass('product-active');

                            eventId.productId = $target.attr('data-product-id');
                            eventName.productName = $target.find(".product-widget-name").text();

                            app.domain.exports($sel.prop('id'), {cProductID: eventId.productId});
                        }
                    },
                    'mouseover.pm': function (e) {
                        var $e = $(e.target || window.event.srcElement),
                            $target;
                    }
                });

                return {

                        load: function (data) {
                            console.log(vData);
                            _render(initData = (data === 'auiAjaxTest' ? vData : data));
                        },
                        // updateCollected: function (isCollected) {
                        //     var $pro = $('[data-product-id="' + eventId.productId + '"]', $ctn);
                        //
                        //     if (typeof isCollected === 'boolean') {
                        //
                        //         $pro.find('.product-widget-collection')[isCollected ? 'addClass' : 'removeClass']('product-collected');
                        //         $pro.children(".easy-popover").find(".product-hd-collected").children("i")[isCollected ? 'addClass' : 'removeClass']('product-collected');
                        //         $pro.data("app", $pro.data("app").replace("product-collected", isCollected ? "product-collected" : ""));
                        //     } else {
                        //
                        //         isCollected = $pro.find('.product-widget-collection').toggleClass('product-collected').hasClass('product-collected');
                        //         $pro.children(".easy-popover").find(".product-hd-collected").children("i")[isCollected ? 'addClass' : 'removeClass']('product-collected');
                        //
                        //         if (isCollected) {
                        //
                        //             $pro.data("app", $pro.data("app").replace("icon-uo-star", "icon-uo-star product-collected"));
                        //         } else {
                        //
                        //             $pro.data("app", $pro.data("app").replace("product-collected", ""));
                        //         }
                        //
                        //     }
                        // },
                        getProductId: function () {

                            return eventId.productId;
                        },
                        // getAppId: function () {
                        //
                        //     return eventId.appId;
                        // },
                        // getCollected: function () {
                        //
                        //     return eventCollected;
                        // },
                        getProductName: function () {

                            return eventName.productName;
                        },
                        // getAppName: function () {
                        //
                        //     return eventName.appName;
                        // },
                    //     getProductData: function () {
                    //
                    //         return JSON.stringify(initData.filter(function (pro) {
                    //
                    //             return pro.id === eventId.productId;
                    //         })[0]);
                    //     },
                    //     getAppData: function () {
                    //
                    //         return JSON.stringify(JSON.parse(this.getProductData()).applications.filter(function (app) {
                    //
                    //             return app.id === eventId.appId;
                    //         })[0]);
                    //     }
                    // };


            };
           
                var $widget = arguments[0],
                    option = arguments[1],
                    attr = arguments[2],
                    css = arguments[3],
                    auiCtx = arguments[4];
                    
                return render($widget, option);
        };

        return widget;
    };);
})();
