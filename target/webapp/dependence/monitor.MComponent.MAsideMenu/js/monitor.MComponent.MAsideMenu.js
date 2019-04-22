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
        var left_catalog = [
                {
                    id: "63",
                    pid: "",
                    name: "用户管理",
                    value: "",
                    state: "1",
                    remark: "1",
                    seq: "0",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "66",
                    pid: "63",
                    name: "角色列表",
                    value: "rolemgr#rolelist",
                    state: "1",
                    remark: "1",
                    seq: "0",
                    icon: "fa fa-user",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "69",
                    pid: "63",
                    name: "用户列表",
                    vale: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-user",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "631",
                    pid: "69",
                    name: "用户列表",
                    value: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-user",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "632",
                    pid: "69",
                    name: "用户用户列表",
                    value: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-user",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "6311",
                    pid: "631",
                    name: "用户用户列表列表",
                    value: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "6312",
                    pid: "631",
                    name: "用户列用户列表表",
                    value: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "63121",
                    pid: "6311",
                    name: "用户户列表列表",
                    value: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "63121",
                    pid: "6312",
                    name: "第五第五级级",
                    value: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "63122",
                    pid: "6312",
                    name: "用户列表",
                    value: "usermgr#userlist",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "146",
                    pid: "",
                    name: "自由布局",
                    value: "",
                    state: "1",
                    remark: "1",
                    seq: "1",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }, {
                    id: "179",
                    pid: "146",
                    name: "布局",
                    value: "handsome#freelayout",
                    state: "1",
                    remark: "1",
                    seq: "0",
                    icon: "fa fa-laptop",
                    lang: "zh_cn",
                    type: "left_catalog"
                }],

            renderCatalog = function (left_catalog) {
                var menu_container = '<div class="left-menu left-catalog-bootstrap">_LEFT_MENU_</div>',
                    first_ul = '<ul class="first-grade" data-CataId="-1">_CHILD_</ul>',
                    ul_tem = '<div id="_CHILD_ID_" class="collapse child-wrap"><ul class="_GRADE_">_CHILD_LI_</ul></div>',
                    ul_tem_fourth = '<div class="ul-fourth"><ul class="_GRADE_"><i class="arrow-left"></i>_CHILD_LI_</ul></div>',
                    li_template = '' +
                        '<li>' +
                        '<a href="_HREF_VALUE_" id="_MENU_ID_" data-toggle="collapse" aria-expanded="false">' +
                        '_FIRST_ICON_TEM_' +
                        '<span>_CATA_NAME_</span>' +
                        '_ASIGE_ICON_TEM_' +
                        '</a>' +
                        '_CHILD_' +
                        '</li>',
                    first_icon_tem = '<i class="fa _CATA_ICON_  first-grade-icon"></i>',
                    aside_ange_icon_tem = '<i class="fa _ASIGE_ICON_  aside-angle"></i>',
                    grade_class = ['first-grade', 'second-grade', 'third-grade', 'fourth-grade', 'fifth-grade'];

                // 根据目录数据(数组对象)生成 以目录为节点的树结构
                function createData(left_catalog) {

                    if (left_catalog == null || Object.prototype.toString.call(left_catalog) !== '[object Array]') return;
                    var cataData = [];
                    var initData = [].slice.call(left_catalog);
                    var grade = 0;


                    function creTree(node) {
                        var curNode = {
                            self: '',
                            child: []
                        };
                        grade += 1;
                        var self = li_template,
                            first_icon = '',
                            aside_icon = '';


                        self = self.replace(/_CATA_NAME_/, node.name);
                        self = self.replace(/_GRADE_/, grade_class[grade]);
                        self = self.replace(/_MENU_ID_/, node.id);

                        if (grade <= 3) {

                            first_icon = first_icon_tem.replace(/_CATA_ICON_/, node.icon);

                        } else {
                            first_icon = '<i class="first-grade-icon"></i>';
                        }

                        self = self.replace(/_FIRST_ICON_TEM_/, first_icon);

                        var cruId = node.id;
                        for (var i = 0; i < initData.length; i++) {

                            if (initData[i].pid === cruId) {
                                curNode.child.push(creTree(initData[i]));
                            }
                        }


                        if (curNode.child.length == 0) {
                            self = self.replace(/_HREF_VALUE_/, "#");
                            aside_icon = '';

                        } else if (grade <= 2) {
                            aside_icon = aside_ange_icon_tem.replace(/_ASIGE_ICON_/, 'fa-angle-down');


                        } else {
                            aside_icon = aside_ange_icon_tem.replace(/_ASIGE_ICON_/, 'fa-ellipsis-v');


                        }
                        self = self.replace(/_ASIGE_ICON_TEM_/, aside_icon);
                        curNode.self = self;
                        grade -= 1;
                        return curNode;
                    }

                    var data = [];
                    $.each(left_catalog, function (index, ele) {
                        if (!ele.pid) {
                            data.push(creTree(ele, left_catalog));
                        }
                    });

                    return data;
                }


                //根据树节点生成 html
                function creHtml(tree) {
                    var initHtml = first_ul,
                        result = '',
                        grade = 0; // 记录目录树层级


                    function getChildHtml(node) {

                        var child = '';
                        var childID = Math.random().toString(36).substr(2);
                        grade += 1;
                        if (node.child.length) {
                            $.each(node.child, function (index, e) {
                                child += getChildHtml(e);
                            });

                            // ul_tem 占位符转换
                            var ul = grade >= 3 ? ul_tem_fourth : ul_tem;

                            child = ul.replace(/_CHILD_LI_/, child);
                            child = child.replace(/_CHILD_ID_/, childID);
                            child = child.replace(/_GRADE_/, grade_class[grade]);


                            node.self = node.self.replace(/_HREF_VALUE_/, '#' + childID);
                        }

                        grade -= 1;
                        return node.self.replace(/_CHILD_/, child);

                    }


                    $.each(tree, function (index, e) {
                        result += getChildHtml(e);

                    });

                    return initHtml.replace(/_CHILD_/, result);
                }

                left_catalog = left_catalog.sort(function (a, b) {
                    var ret, aItem = a, bItem = b;
                    a = a.pid;
                    b = b.pid;
                    if (!a && !b) {
                        ret = 0;
                    } else if (!a) {
                        ret = -1;
                    } else if (!b) {
                        ret = 1;
                    } else {
                        ret = parseInt(a, 10) - parseInt(b, 10);
                    }
                    if (!ret) {
                        ret = parseInt(aItem.seq, 10) - parseInt(bItem.seq, 10);
                    }
                    return ret;
                });
                var tree = createData(left_catalog);

                var html = creHtml(tree);

                html = menu_container.replace(/_LEFT_MENU_/, html);

                return html;
            },
            renderCss = function ($widget, cssObj) {

                //美化左边菜单栏滚动条
                $('.left-menu', $widget).slimScroll({
                    height: '100%',
                    color: '#fff',
                    opacity: .8 //滚动条透明度
                });
                var layoutObj;
                // $('.left-menu',$widget).css('overflow','visible');
                $('.left-menu', $widget).parent().css('overflow', 'visible');
                var style, bubbleMenuObj, $selector = $widget.parent();
                if (cssObj && (style = cssObj.style)) {
                    if (style.leftCatologLayout) {
                        layoutObj = style.leftCatologLayout;
                        $widget.css(style.leftCatologLayout);
                        layoutObj['width'] && $('.left-menu', $widget).css({'width': layoutObj['width']});
                    }
                    if (style.menu) {
                        $('.left-menu', $widget).css(style.menu);

                    }
                    style.menuHover && $AW.cssHover('.left-menu a', $selector, style.menuHover, ':hover');
                    style.selectedMenu && $AW.cssHover('.left-menu a.select-on.collapsed', $selector, style.selectedMenu, '');
                    style.showMenu && $AW.cssHover('.left-menu a.select-on', $selector, style.showMenu, '');
                    if (style.bubbleMenu) {
                        bubbleMenuObj = style.bubbleMenu['background-color'];
                        $('.left-menu .fourth-grade a', $widget).css(style.bubbleMenu);
                        $('.left-menu .fourth-grade li', $widget).css({'background-color': style.bubbleMenu['background-color']})
                    }
                    style.bubbleMenuHover && $AW.cssHover('.fifth-grade a:hover', $selector, style.bubbleMenuHover, '');
                    style.bubbleMenuHover && $AW.cssHover('.fourth-grade a:hover', $selector, style.bubbleMenuHover, '');
                    style.selectBubbleMenu && $AW.cssHover('.left-menu .fourth-grade a.select-on', $selector, style.selectBubbleMenu, '');
                }
                $('.first-grade a', $widget).css({
                    color: '#a6a6a6'
                });
            },
            render = function ($selector, option, attr, css, auiCtx) {
                // fakeData
                var ret = {},
                    clickMenuId = null,
                    clickMenuValue = null,
                    clickMenuNode = null,
                    catalogSourceData = left_catalog;

                // 绑定事件
                $selector.off('.MAsidMenu').on('click.MAsidMenu', 'a', function (e) {
                    var $target = $(e.target),
                        $curTarget = $(e.currentTarget),
                        $angle = $curTarget.find('.aside-angle'),
                        $select_on;

                    // 转换angle方向 若没有angle就不用执行
                    $angle.hasClass('fa-angle-down') ?
                        $angle.removeClass('fa-angle-down').addClass('fa-angle-up') :
                        $angle.hasClass('fa-angle-up') && $angle.removeClass('fa-angle-up').addClass('fa-angle-down');


                    // 选中目录
                    if ($select_on = $('.select-on', $selector)) {
                        $select_on.removeClass('select-on');
                        $select_on = null;
                    }
                    $curTarget.addClass('select-on');

                    clickMenuId = $curTarget.attr('id');

                    // 设置clickMenuNode
                    $.each(catalogSourceData, function (index, value) {
                        if (value.id === clickMenuId) {
                            clickMenuNode = value;
                        }
                    });

                    clickMenuValue = clickMenuNode ? clickMenuNode.value : '';
                });


                // 四级菜单 hover
                $selector.off('.Mclick').on('click.Mclick', '.third-grade>li ', function (e) {
                    var $curTarget = $(e.currentTarget),
                        $list = $curTarget.closest('li').find('ul').filter(':first').addClass('show'),
                        style = app.position(e, $curTarget, $list);

                    style.top = style.top + 40;
                    style.left = 200;
                    $list.css(style);


                });
                // 五级菜单 hover
                $selector.off('.Menter').on('mouseenter.Menter', '.fourth-grade li ', function (e) {
                    var $curTarget = $(e.currentTarget);
                    $curTarget.closest('li').find('ul').filter(':first').addClass('show');

                });
                // 四级菜单离开
                $selector.off('.Mleave').on('mouseleave.Mleave', '.third-grade>li', function (e) {


                    $('.fourth-grade', $selector).removeClass('show');
                });

                // 五级菜单离开
                $selector.off('.Mleave2').on('mouseleave.Mleave2', '.fourth-grade>li', function (e) {

                    $('.fifth-grade', $selector).removeClass('show');

                });


                // 刷新组件
                ret.refresh = function (data) {

                    if (data === 'auiAjaxTest' || window.auiApp) {
                        data = left_catalog;
                    }

                    if (data) {
                        catalogSourceData = data;

                        $selector.empty().html(renderCatalog(data));

                        renderCss($selector, css);
                    }
                };

                // 获取点击menu元素id
                ret.getClickId = function () {
                    var id = clickMenuId;
                    // clickMenuId = null;
                    return id;
                };

                ret.getClickNode = function () {
                    var node = clickMenuNode;
                    // clickMenuNode = null;
                    return node;
                };
                ret.getClickValue = function () {
                    var value = clickMenuValue;
                    // clickMenuValue = null;
                    return value;
                };
                ret.choose = function (id) {
                    var $select_on;
                    if ($select_on = $('.select-on', $selector)) {
                        $select_on.removeClass('select-on');
                        $select_on = null;
                    }
                    $('#' + id).addClass('select-on');
                };
                ret.setMenuContainerCss = function (cssObj) {
                    $selector.css(cssObj);
                };


                return ret;
            };

        if (!widget.monitor.MComponent) {
            widget.monitor.MComponent = {};
        }
        widget.monitor.MComponent.MAsideMenu = function ($selector, option, attr, css, auiCtx) {

            var ret = render($selector, option, attr, css, auiCtx);

            return {
                choose: ret.choose,
                refresh: ret.refresh,
                getClickValue: ret.getClickValue,
                getClickNode: ret.getClickNode,
                getClickId: ret.getClickId,
                setMenuContainerCss: ret.setMenuContainerCss
            }

        };
    });
})();
