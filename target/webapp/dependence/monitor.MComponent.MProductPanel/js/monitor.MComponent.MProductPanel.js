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
        
        widget.monitor.MComponent.MProductPanel = function () {
            var eventData = {},
                $widget = arguments[0],
                option = arguments[1],
                attr = arguments[2],
                dataOption = [],i,

                render = function ($ctn, opt) {
                    console.log(this);
                    var PP_CONST = {
						TEMP: '<div class="pp-ctn _CLASS_" data-id="_ID_"><div class="pp-header" title="_NAME_"><h4>_NAME_</h4></div><div class="pp-opr"><span class="fa fa-th-list icon icon-uo-poc-list"></span><div class="pp-opr-point"></div><ul class="pp-opr-menu">_OPR_</ul></div><div class="pp-status-btn">_BTN_</div><div class="pp-ctt"><div class="pp-status-ctn">_STATUS_</div><div class="pp-list">_LIST_</div></div></div>',
                            ADD_TEMP: '<div class="pp-ctn pp-add " ><div class="pp-plus-ctt"><span class="icon icon-uo-poc-circleplus"></span><br><span class="pp-plus-text">添加节点</span></div></div>',
                            STATUS: '<div class="pp-status-ctt _CLASS_"><div class="pp-status-ball"></div><div class="pp-status-btn"></div></div>',
                            LIST: '<div class="pp-list-row"><div class="pp-row-title" data-value="_VALUE_" title="_TITLE_">_TITLE_</div><div class="pp-row-text" title="_TEXT_">_TEXT_</div></div>',
                            OPR: '<li id="_ID_" class="pp-btn _DISABLE_"><span class="_ICON_"></span>_OPR_</li>',
                            BTN:'<button class="btn btn-normal" id="_STATUSBTN_">_BTN_</button>',
                            STATUS_CLASS: {
                                0: 'pp-status-unlink',
                                1: 'pp-status-run',
                                2: 'pp-status-stop',
                                3: 'pp-status-error',
                                4: 'pp-status-init',// 初始化中

                                5: 'pp-status-starting',// 启动中
                                6: 'pp-status-stopping',//停止中
                                7: 'pp-status-restarting',//重启中
                                8: 'pp-status-synchronizing',//同步中
                                10: 'pp-status-deleting',//删除中
                            }
                        },

                        vData = new Array(9),
                        opr = opt.opr,

                        _stopPropagation = function (e) {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            } else {
                                e.cancelBubble();
                            }
                        },

                        _render = function (data) {
                            var i, item, j,l, oprItem, index,btnName,isDisable,dataopr,
                                htmlStr = '', listStr = '', oprStr, oprTopStr, oprDownStr;
                            for (i = -1; item = data[++i];) {

                                // 节点信息，地址、端口、部署号...
                                $.isArray(item.list) && (listStr = item.list.map(function (listItem) {
                                    return PP_CONST.LIST.replace(/_TITLE_/g, listItem.title).replace(/_TEXT_/g, listItem.text).replace(/_VALUE_/g, listItem.value);
                                }).join(''));

                                oprTopStr = '';
                                oprDownStr = '';
                                for (j = -1; oprItem = opr[++j];) {
                                    isDisable = true;
                                    for(l=-1;dataopr = item.opr[++l];){
                                        if(dataopr === oprItem.id.toString()){
                                            isDisable = false;
                                        }
                                    }

                                    if (oprItem.oprPosition) {
                                        // 按钮位置在下
                                        oprDownStr += PP_CONST.OPR.replace(/_ID_/, isDisable ? '':oprItem.id).replace(/_ICON_/,oprItem.icon).replace(/_DISABLE_/, isDisable ? 'pp-btn-disabled' : '').replace(/_OPR_/, oprItem.name);
                                    } else {
                                        // 按钮位置在上
                                        oprTopStr += PP_CONST.OPR.replace(/_ID_/, isDisable ? '':oprItem.id).replace(/_ICON_/,oprItem.icon).replace(/_DISABLE_/, isDisable ? 'pp-btn-disabled' : '').replace(/_OPR_/, oprItem.name);
                                    }
                                }
                                // 任意一个为空，就没有分割线<hr/>
                                oprStr = (!oprTopStr || !oprDownStr) ? (oprTopStr+oprDownStr) :(oprTopStr +'<hr/>' + oprDownStr);
                                
                                
                                btnName = "";

                                // 快捷按钮，直接显示在节点上的
                                item.btn && (btnName = opr.filter(function(oprItem){return oprItem.id === item.btn;})[0]) && (btnName = btnName.name);

                                htmlStr += PP_CONST.TEMP
                                    .replace(/_CLASS_/, PP_CONST.STATUS_CLASS[item.status])
                                    .replace(/_NAME_/g, item.name)//去掉节点名称
                                    .replace(/_ID_/, item.id)
                                    .replace(/_STATUSBTN_/,item.btn)
                                    .replace(/_BTN_/,btnName?PP_CONST.BTN.replace(/_BTN_/,btnName).replace(/_STATUSBTN_/,item.btn):"")
                                    .replace(/_STATUS_/, PP_CONST.STATUS.replace(/_CLASS_/, PP_CONST.STATUS_CLASS[item.status]))
                                    .replace(/_LIST_/, listStr)
                                    .replace(/_OPR_/, oprStr);
                            }

                            $ctn.empty().append(htmlStr + PP_CONST.ADD_TEMP);

                            $ctn.off('.productPanel').on({
                                'click.productPanel': function (e) {
                                    // 保存点击的节点数据
                                    var $e = $(e.target || window.event.srcElement), $target;
                                    
                                    
                                    if (($target = $e.closest('.pp-ctn')).length) {

                                        eventData.id = $target.attr('data-id');
                                        
                                        if(~$(".pp-ctn",$widget).index($target)){
                                        	
                                        	eventData.data = data[$(".pp-ctn",$widget).index($target)];
                                        }else{
                                        	
                                        	eventData.data = null;
                                        }
                                        
                                    }

                                    if ($e.closest('.pp-opr-menu').length) {

                                        $e.closest('.pp-btn-disabled').length && _stopPropagation(e);


                                    }


                                   
                                }
                            });


                        };

                    $.each(vData, function (index, item) {

                        vData[index] = {
                            name: '节点名称-' + index,
                            status: index,
                            id: app.getUID(),
                            list: [
                                {
                                    title: 'ID: ',
                                    text: app.getUID().substring(0,7),
                                    value: 'id'
                                },
                                {
                                    title: '地址: ',
                                    text: '192.168.0.' + (10 + index),
                                    value: 'address'
                                },
                                {
                                    title: '端口: ',
                                    text: parseInt(Math.random() * 100,10),
                                    value: 'port'
                                }
                            ],
                            opr: ['runNode', 'deleteNode'],
                            btn:"runNode"

                        };
                    });



                        return {
                            load: function (data) {
                                dataOption = data;
                                _render(data === 'auiAjaxText' ? vData : dataOption);
                            },
                            getId: function () {

                                return eventData.id;
                            },
                            getData:function(){
                            	
                            	return eventData.data;
                            },
                            disableAddBtn: function (bool) {
                                $ctn.find('.pp-add')[bool ? 'show' : 'hide']();
                            },
                            show: function () {
                                this.$view.removeClass('hide');
                            },
                            hide: function () {
                                this.$view.addClass('hide');
                            },
                            addItem: function (data) {
                                dataOption.push(data);
                                _render(dataOption);
                            },
                            deleteItem:function (id) {
                                for(i=0;i<dataOption.length;i++){
                                    if(dataOption[i].id === id){
                                        dataOption.splice(i,1);
                                    }
                                }
                                _render(dataOption);
                            }
                        };

                        if(window.auiApp){
                            _render(vData);
                        }

                };

                //运行时代码Start
                return render($widget, option);
                //运行时代码End

            return widget;
        };

        return widget;
    });
})
();
