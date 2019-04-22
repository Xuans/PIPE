( /* <global> */function (undefined) {
    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery"], factory);
        }
        // global
        else {
            factory();
        }

    })(function ($) {

        var CONST = {
            TEMP: {
                SEARCH_CTN: '<div class="aui-tree-search-ctn">' +
                '<div class="aui-tree-search-ctt">' +
                '<i class="aui-search-left-icon aui aui-sousuo"></i>' +
                '<input  placeholder="请搜索" data-role="searchCtt"/>' +
                '<i class="aui-search-close hide aui aui-an-clear" data-role="searchClear"></i>' +
                '</div>' +
                '<div class="aui-search-icon-ctn">' +
                '<span title="上一个" data-role="searchPre" class="aui-search-result-icon disabled">' +
                '<i class="aui aui-an-arrowup"></i>' +
                '</span>' +
                '<span title="下一个" data-role="searchNext" class="aui-search-result-icon disabled">' +
                '<i class="aui aui-an-arrowdown"> </i>' +
                '</span>' +
                ' </div>' +
                '<div data-role="searchResult" class="aui-search-result-ctn"></div>' +
                '</div>',
                TYPE_HTML: '<div data-id="_data__id_" data-role="_type__class_OverView" data-type-id="_data__type__id_" title="_type__desp_"><span class="aui-icon-type"><i class="_type__icon_"></i></span><span >_type__desp_</span></div>',
                TREE_START: '<div class="aui-tree-ctn"><div class="aui-tree-ctt" id="auiTreeCtt"><ul class="aui-tree-list">',
                TREE_END: '</ul></div></div>',
                TREE_CTN_START: '<ul class="aui-tree-list" data-role="auiTreeList">',
                TREE_CTN_END: '</ul>',
                TREE_NODE_START: '<li data-widget-id="_data__widget__id_" data-href="_data__href_" class="aui-tree-node ">' +
                '<div class="aui-tree-block" data-role="treeItem" title="_widget__name_">' +
                '<div class="aui-tree-block-title">' +
                '<i class="_widget__icon_"></i> <span class="aui-tree-widget-name" data-event-role="treeWidgetName">_widget__name_</span><span class="aui-tree-widget-id" data-event-role="treeWidgetID">[_widget__id_]</span>' +
                '<div class="aui-config-operation-ctn">_operation__edit_' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="aui-tree-toggle _hide_" data-role="treeToggle"><i class="aui aui-jiantou-xia"></i></div>',
                TREE_NODE_END: '</li>',
                SEARCH_RESULT: '第<em data-role="resultIndex">_index_</em>结果,共<em>_result_</em>结果',
                EDIT_CONTENT_TEMP: '<i data-role="copy" class="aui aui-fuzhi" title="复制"></i>' +
                ' <i data-role="cut" class="aui aui-jianqie" title="剪切"></i>' +
                '<i data-role="paste" class="aui aui-niantie" title="粘贴"></i>' +
                '<i data-role="del" class="aui aui-shanchu" title="删除"></i>',
                EDIT_EDM_TEMP: '<i data-role="del" class="aui aui-shanchu" title="删除"></i>',
                OPERATE_ICON: '<i data-role="_role_" class="_class_" title="_title_"></i>'

            },

            LIST: ['children', 'widgetID', 'widgetName', 'pID', 'href'],
            EVENT_LIFECYCLE_LIST: ['event', 'lifecycle'],
            ACTIVE: 'active',
            TREE_HIDE: 'hide',
            TREE_CTN: 'auiTreeCtt',
            DATA_ATTR: 'data-widget-id',
            TREE_FOLD: "fold",
            DISABLED: 'disabled',
            DROP_CLASS: 'aui-widget-droppable',
            UN_ACCEPTABLE: 'aui-widget-unacceptable',
            DISTANCE: '30',
            DELAY: 100,
            Z_INDEX: 99,
            AUI_CONFIGURE_CTN: 'auiConfigureCtn',
            ATTR_GROUP_ID: 'data-group-id',
            EDM: {
                validateSelector: true,
                validateType: true,
                validateHandler: true,
                require: true,
                successCallback: true,
                errorCallback: true,
                cleanCallback: true,
                hasChineseCharacter: true,
                id: true
            },
            LIST_MAP: {
                event: "aui-event-type aui aui-shijian",
                lifecycle: {
                    load_init: 'aui-init-type aui aui-shengmingzhouqichushicaozuo',//初始
                    load_interval: 'aui-interval-type aui aui-shengmingzhouqidingshicaozuo',//定时
                    pause_init: 'aui-pause-type aui aui-shengmingzhouqiqiechucaozuo',//切出
                    resume_init: 'aui-resume-type aui aui-shengmingzhouqiqierucaozuo',//切入
                    unload_init: 'aui-unload-type aui aui-xiaohuiwenjian'//销毁
                }
            },
            ROLE: {
                TREE_ITEM: "treeItem",
                TREE_TOGGLE: "treeToggle",
                TREE_WIDGET_NAME: 'treeWidgetName',
                TREE_WIDGET_ID: 'treeWidgetID',
                TREE_VALIDATE_CTT: 'treeValidateCtt',
                EVENT_OVER_VIEW: "eventOverView",
                LIFECYCLE_OVER_VIEW: 'lifecycleOverView',
                SEARCH_CTT: 'searchCtt',
                SEARCH_CLEAR: 'searchClear',
                SEARCH_CANCEL: 'searchCancel',
                SEARCH_PRE: 'searchPre',
                SEARCH_NEXT: 'searchNext',
                SEARCH_RESULT_ITEM: 'searchResultItem',
                TOGGLE_FOLD_UP: 'toggleFoldUp',
                TREE_LIST: 'auiTreeList',
                WIDGET_NAME: 'configWidgetName',
                SEARCH_RESULT: 'searchResult',
                RESULT_INDEX: 'resultIndex',
                EVENT_LIFECYCLE_CTN: 'eventLifecycleCtn',
                FOLD: 'fold',
                SPREAD: 'spread',
                DEL: 'del',
                COPY: 'copy',
                CUT: 'cut',
                PASTE: 'paste'
            },

        };

        var TEMP = CONST.TEMP,
            ROLE = CONST.ROLE;

        function ComponentTree(option) {

            this.map = {};
            this.$view = option.$view;
            this.treeData = option.treeData || [];
            this.AUI = option.AUI;
            this.icon = option.icon;
            this.init();

            this.listen();


        }

        ComponentTree.prototype = {
            constructor: ComponentTree,
            init: function () {
                var context = this,
                    treeData = context.treeData,
                    $view = context.$view,
                    html = '';

                treeData && treeData.length && (html = context.getChildHtml(treeData));
                $view.empty().append(TEMP.SEARCH_CTN + TEMP.TREE_START + html + TEMP.TREE_END);

            },
            refresh:function(data){
                this.treeData=data;
                this.init();
            },
            getDroppableChildren: function () {
                return this.$view.find("li");
            },
            getIconHtml: function () {
                var i, item, icon, ret = '';

                if (icon = this.icon) {
                    for (i = -1; item = icon[++i];) {
                        ret += CONST.TEMP.OPERATE_ICON.replace(/_role_/, item.role || '')
                            .replace(/_class_/, item.class || '')
                            .replace(/_title_/, item.title || '');
                    }
                }
                return ret;
            },
            addChildren: function (data, pID) {
                var context = this,
                    treeData = context.treeData,
                    childrenData,
                    children,
                    ret,
                    id, i, elment, item, j;

                if (data && data.length) {
                    childrenData = data.concat([]);
                    for (i = -1; elment = childrenData[++i];) { // foreach==> for
                        if (!elment.pID) {
                            elment.pID = pID;
                            id = elment.widgetID;
                        }
                    }


                    for (j = -1; item = treeData[++j];) {  // foreach==> for
                        if (item.widgetID === pID) {
                            (children = item.chlidren || []) && children.push(id);
                            context.treeData = treeData.concat(childrenData);
                        }
                    }

                }

                // return ret;
            },
            removeChild: function (id) {
            },
            getChildHtml: function (treeData, pID) {
                var _this = this,
                    seek = [],
                    html = [],
                    propHtml = [],
                    map = {},
                    cursor,
                    i,
                    item,
                    _i,
                    cacheItem;


                if (treeData && treeData.length) {
                    for (_i = -1; cacheItem = treeData[++_i];) {  //foreach--- for
                        if (cacheItem.widgetID !== 'widgetCreator') {
                            if (pID) {
                                if (cacheItem.pID === pID) {
                                    seek.push(cacheItem);
                                }
                            } else {
                                if (!cacheItem.pID) {
                                    seek.push(cacheItem);
                                }
                            }
                            map[cacheItem.widgetID] = cacheItem;
                        }

                    }

                    i = -1;

                    while (item = seek[++i]) {
                        cursor = i;
                        propHtml = [];
                        if (item.type === 'html') {
                            html.push(item.content);
                        } else {
                            if (typeof item === 'string') {
                                item = map[item];
                            }

                            if (item) {
                                html.push(TEMP.TREE_NODE_START
                                    .replace(/_data__widget__id_/, item.widgetID)
                                    .replace(/_widget__icon_/, item.widgetIcon)
                                    .replace(/_widget__id_/, item.ID)
                                    .replace(/_widget__name_/g, item.widgetName)
                                    .replace(/_data__href_/g, item.href)

                                    .replace(/_hide_/g, item.children && item.children.length ? '' : CONST.TREE_HIDE)
                                    .replace(/_operation__edit_/g, _this.getIconHtml())
                                );

                                if (item.children && item.children.length) {

                                    seek.splice.apply(seek, [cursor + 1, 0].concat([{
                                        type: 'html',
                                        content: TEMP.TREE_CTN_START
                                    }]).concat(item.children).concat([{
                                        type: 'html',
                                        content: TEMP.TREE_CTN_END + TEMP.TREE_NODE_END
                                    }]));
                                } else {
                                    html.push(TEMP.TREE_NODE_END);
                                }
                            }
                        }
                    }

                    return html.join('');
                }
            },
            getEventLifecycle: function (widgetID) {
                var context = this,
                    LIST = CONST.EVENT_LIFECYCLE_LIST,
                    item, eventLifecycleData, i, j, eventItem, ret = [];
                if (widgetID) {
                    for (i = -1; item = LIST[++i];) {
                        eventLifecycleData = context.AUI.data[item]({
                            widgetID: widgetID,
                            active: true
                        }).get();

                        if (eventLifecycleData && eventLifecycleData.length) {
                            for (j = -1; eventItem = eventLifecycleData[++j];) {

                                ret.push(TEMP.TYPE_HTML.replace(/_data__id_/g, widgetID + '_' + item + '_' + eventItem[item + 'ID'])
                                    .replace(/_data__type__id_/, eventItem[item + 'ID'])
                                    .replace(/_type__class_/g, item)
                                    .replace(/_type__desp_/g, eventItem.desp)
                                    .replace(/_type__icon_/, typeof CONST.LIST_MAP[item] === 'string' ? CONST.LIST_MAP[item] : CONST.LIST_MAP[item][eventItem.spaAction + '_' + eventItem.pageAction])
                                )

                            }
                        }
                    }
                }
                return ret.join('');
            },

            getContext: function () {
                return this.$view;
            },
            getTreeData: function () {
                return this.treeData;
            },


            clearIconShow: function (isShow) {
                $('[data-role=' + ROLE.SEARCH_CLEAR + ']', this.$view)[!!isShow ? 'removeClass' : 'addClass'](CONST.TREE_HIDE);
            },
            getValue: function () {
                return this.value;
            },
            getCurrentSearchIndex: function () {
                return this.currentSearchIndex;
            },
            setCurrentSearchIndex: function (index) {

                this.currentSearchIndex = index;

            },
            searchResult: function () {
                var value = this.getValue(),
                    $ctn = $("#" + CONST.TREE_CTN, this.$view),
                    $searchResultCtn = $("[data-role=" + ROLE.SEARCH_RESULT + "]", this.$view),
                    globalRegex,
                    $searchResult,
                    text,
                    classType,
                    i = 0,
                    item,
                    _i,
                    structure;

                this.setCurrentSearchIndex(1);
                this.clearIconShow(!!value ? true : false);

                if (value && (value = value.trim())) {

                    value = value.toLowerCase();

                    if (~value.indexOf('\\')) {
                        value = '\\\\';
                    }

                    globalRegex = new RegExp('(' + value + ')', 'gi');
                    $ctn.html($ctn.html().replace(/<em data-event-role="searchResultItem"[^>]*>([^<]+)<\/em>/g, '$1'));
                    Array.prototype.forEach.call($ctn.find('*'), function (elem, index) {

                        if (!elem.children.length && (text = elem.innerText) && text.match(globalRegex)) {
                            i++;
                            elem.innerHTML = text.replace(globalRegex, '<em data-event-role="searchResultItem">$1</em>');
                        }
                    });

                    $searchResult = $('[data-event-role=' + ROLE.SEARCH_RESULT_ITEM + ']', this.$view);

                    $searchResultCtn.empty().append(
                        TEMP.SEARCH_RESULT.replace('_index_', $searchResult.length ? 1 : 0)
                            .replace('_result_', $searchResult.length)
                    );


                    $('[data-event-role=' + ROLE.SEARCH_RESULT_ITEM + ']', this.$view).eq(0).addClass(CONST.ACTIVE);

                } else {
                    $ctn.html($ctn.html().replace(/<em data-event-role="searchResultItem"[^>]*>([^<]+)<\/em>/g, '$1'));
                    $searchResultCtn.empty();
                }


                classType = ($searchResult && $searchResult.length) ? 'removeClass' : 'addClass';

                $('[data-role=' + ROLE.SEARCH_PRE + ']')[classType](CONST.DISABLED);
                $('[data-role=' + ROLE.SEARCH_NEXT + ']')[classType](CONST.DISABLED);

                for(_i=-1, structure=this.AUI.data.structure().get();item=structure[++_i];){
                    this.AUI.dragWidget(item.widgetID);
                }


            },
            validateTreeIconHide: function ($widget) {
                var $children;

                if ($widget && $widget.length) {
                    $children = $widget.children('ul');
                    $widget.children('[data-role=treeToggle]')[$children.length && $children.children().length ? 'removeClass' : 'addClass'](CONST.TREE_HIDE);
                }

            },
            foldUp: function ($target) {
                $target.removeClass(CONST.TREE_FOLD);
                $target.nextAll().removeClass(CONST.TREE_HIDE);
            },
            listen: function () {
                var context = this;

                this.$view.off('componentTree').on({
                    'click.componentTree': function (e) {
                        var $target = $(e.target || event.srcElement).closest('[data-role]'),
                            role = $target.attr('data-role'),
                            index = context.getCurrentSearchIndex(),
                            $searchResult = $('[data-event-role=' + ROLE.SEARCH_RESULT_ITEM + ']', this.$view),
                            classType,
                            length;
                        // arr = ['treeToggle','toggleFoldUp','searchClear','searchPre','searchNext'];
                        // if ((context.mode && ~arr.indexOf(role)) || !context.mode) {
                        switch (role) {
                            //展开折叠
                            case ROLE.TREE_TOGGLE:
                                $target.toggleClass(CONST.TREE_FOLD);
                                $target.nextAll().toggleClass(CONST.TREE_HIDE);
                                break;

                            //清除搜索
                            case ROLE.SEARCH_CLEAR:
                                context.value = '';
                                $('[data-role=' + ROLE.SEARCH_CTT + ']', context.$view).val(context.getValue());
                                context.searchResult();

                                break;

                            //搜索下一个
                            case ROLE.SEARCH_NEXT:

                                if ($searchResult && (length = $searchResult.length)) {
                                    index = index < length ? index + 1 : 1;
                                    context.setCurrentSearchIndex(index);
                                    $target = $searchResult.eq(index - 1);
                                    $searchResult.removeClass(CONST.ACTIVE);
                                    $target.addClass(CONST.ACTIVE);
                                    $('[data-role=' + ROLE.RESULT_INDEX + ']', context.$view).text(index);
                                    context.foldUp($target.parents('ul').prev());
                                    app.scrollTop($('#' + CONST.TREE_CTN, context.$view), $target, 200, 15);

                                }
                                break;

                            //搜索上一个
                            case ROLE.SEARCH_PRE:
                                if ($searchResult && (length = $searchResult.length)) {

                                    index = index > 1 ? index - 1 : length;
                                    context.setCurrentSearchIndex(index);
                                    $target = $searchResult.eq(index - 1);
                                    $searchResult.removeClass(CONST.ACTIVE);
                                    $target.addClass(CONST.ACTIVE);
                                    $('[data-role=' + ROLE.RESULT_INDEX + ']', context.$view).text(index);
                                    context.foldUp($target.parents('ul').prev());
                                    app.scrollTop($('#' + CONST.TREE_CTN, context.$view), $target, 200, 15);
                                }
                                break;

                            //全部展开/折叠
                            case  ROLE.TOGGLE_FOLD_UP:

                                $target.toggleClass(CONST.TREE_FOLD);
                                classType = $target.hasClass(CONST.TREE_FOLD) ? 'addClass' : 'removeClass';
                                $('[data-role=' + ROLE.TREE_TOGGLE + ']', context.$view)[classType](CONST.TREE_FOLD);
                                $('[data-role=' + ROLE.TREE_LIST + ']', context.$view)[classType](CONST.TREE_HIDE);
                                break;


                        }


                    },
                    'keyup.componentTree': function (e) {
                        var $target = $(e.target || event.srcElement).closest("[data-role]"),
                            role = $target.attr('data-role');

                        switch (role) {
                            case ROLE.SEARCH_CTT:
                                context.value = $target.val();
                                context.searchResult();
                                break;
                        }
                    }
                });
            }
        };

        return ComponentTree;
    })
})();