(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "bootstrapTable", "bootstrapTableTreegrid", "bootstrapTableTreegridJq"], factory);
        }
        // global
        else {
            factory();
        }

    })
        (function ($, widget,bootstrapTable ) {
            "use strict";

            var Component = function ($widget, option, attr, css, auiCtx) {
                var context = this;

                //Data Model
                context.$view = $widget;
                context.option = $.extend(true, {}, this.setting, option);
                context.attr = attr;
                context.css = css;
                context.pageContext = auiCtx;



                context.viewCache = {};

                //渲染表格
                context._render(context.$view, context.option, attr, css, auiCtx);
                // 渲染样式
                context._renderCss()



            };

            Component.prototype = Component.fn = {
                constructor: Component,
                version: 'AWOS 5.1 XQ',
                author: 'your name',

                debug: window.auiApp && window.auiApp.debug,

                //常量表
                //constant:{},
                setting: {
                },

                //渲染表格
                _render: function ($view, option, attr, css, auiCtx) {
                    var $widget = this.$view,
                        $oTable = $('<table></table>').attr('id',attr.id),
                        tempSetting = [],
                        tableSetting = [],
                        i,
                        j,
                        col,
                        colProgress,
                        rowProgress,
                        colElements,
                        obj = {},
                        option = this.option,
                        rowLength = option.row.length,
                        $page,

                     // 进度条
                     progress = function (value, row, index,name) {
                        setTimeout(function () {
                            for( i = 0; i<option.progressSetting.length;i++){
                                if(name === option.progressSetting[i].field){
                                    option.progressSetting[i].progressClass(value,index)
                                }
                            }
                            option.progressLoad(value,index);
                        }, 200);
                        
                        return '<div class="pt-progressbar pt-progressbar'+index +'"><div>' + value + '%</div></div>'
                    },

                    // 环形图
                    circular = function(value, row, index,name) {
                        for( i = 0; i<option.circularSetting.length;i++){
                            if(name === option.circularSetting[i].field){
                                option.circularSetting[i].circularClass(value,index)
                            }
                        }
                        return '<div class="pt-circular pt-circular'+ index +'">' + value + '</div>'
                    },

                    // 状态
                    state = function(value, row, index,name) {
                        if(value === 0){
                            return '<div class="state-danger pt-state"><span class="circle"><span></span></span>错误</div>';
                        }else if(value === 1){
                            return '<span class="state-warning pt-state"><span class="circle"><span></span></span>预警</span>';
                        }else if(value === 2){
                            return '<span class="state-success pt-state"><span class="circle"><span></span></span>正常</span>';
                        }
                    };

                    $widget.append($oTable);
                    this.option.RowData = {};
                    option.progressSetting = [];
                    option.circularSetting = [];
                    option.progressLoad = function doProgressBarLoading(progress,index) {
                        var selectClass = ".pt-progressbar"+index+" > div";
                        if (progress > 100) {
                                    progress = 100;
                        }
                        if (progress <= 100) {
                                    $oTable.find(selectClass).animate({
                                        width: progress + '%'
                                    }, 1000);
                        }
                    };
                    
                    

                    // 整理数据
                    for (i = 0; i < rowLength; i++) {
                        col = option.row[i].col;
                        colElements = col.elements;
                        if (colElements) {
                            for (j = 0; j < colElements.length; j++) {
                                switch (colElements[j].formatter) {
                                    case 'text':
                                        obj = {
                                            'field': col.keys[j],
                                            'title': col.fields[j],
                                            'colspan': colElements[j].colSpan,
                                            'rowspan': colElements[j].rowSpan,
                                            'align': colElements[j].textAlign,
                                            'valign': colElements[j].textValign,
                                            'sortable': colElements[j].isSort,
                                            'class': colElements[j].className,
                                            'width': colElements[j].width
                                        };
                                        break;
                                    case 'progress':
                                        option.progressSetting.push({
                                            field: col.keys[j],
                                            maxVal : colElements[j].progressMax,
                                            setting: colElements[j].setting,
                                            progressClass:function (value,index) {
                                                var val = value / this.maxVal * 100,
                                                    setting = this.setting || {},
                                                    selectClass = ".pt-progressbar"+index+" > div";
                                                for(i = 0;i < setting.length;i++){
                                                    if(val >= setting[i].min && val < setting[i].max){
                                                        // $oTable.find(selectClass).css({"background-color" : this.setting[i].color})
                                                        $AW.cssHover(selectClass, $oTable, {"background-color" : setting[i].color}, '')
                                                    }
                                                }
                                            },
                                        });
                                        obj = {
                                            'field': col.keys[j],
                                            'title': col.fields[j],
                                            'colspan': colElements[j].colSpan,
                                            'rowspan': colElements[j].rowSpan,
                                            'align': colElements[j].textAlign,
                                            'valign': colElements[j].textValign,
                                            'sortable': colElements[j].isSort,
                                            'class': colElements[j].className,
                                            'width': colElements[j].width,
                                            'formatter': progress,
                                        };
                                        
                                        break;
                                    case 'circular':
                                        option.circularSetting.push({
                                            field: col.keys[j],
                                            setting: colElements[j].circularSetting,
                                            circularClass: function (value,index) {
                                                var selecter = ".pt-circular"+ index,
                                                    setting = this.setting || {};
                                                for(i = 0;i < setting.length;i++){
                                                    if(value >= setting[i].min && value < setting[i].max){
                                                        $AW.cssHover(selecter, $oTable, {"color" : setting[i].color}, '');
                                                        $AW.cssHover(selecter, $oTable, {"border-color" : setting[i].color}, '');
                                                    }
                                                }
                                            }
                                        });
                                        obj = {
                                            'field': col.keys[j],
                                            'title': col.fields[j],
                                            'colspan': colElements[j].colSpan,
                                            'rowspan': colElements[j].rowSpan,
                                            'align': colElements[j].textAlign,
                                            'valign': colElements[j].textValign,
                                            'sortable': colElements[j].isSort,
                                            'class': colElements[j].className,
                                            'width': colElements[j].width,
                                            'formatter': circular,
                                        };
                                        break;
                                    case 'state':
                                        obj = {
                                            'field': col.keys[j],
                                            'title': col.fields[j],
                                            'colspan': colElements[j].colSpan,
                                            'rowspan': colElements[j].rowSpan,
                                            'align': colElements[j].textAlign,
                                            'valign': colElements[j].textValign,
                                            'sortable': colElements[j].isSort,
                                            'class': colElements[j].className,
                                            'width': colElements[j].width,
                                            'formatter': state,
                                        };
                                        break;
                                }
                                tempSetting.push(obj);
                            }
                        }

                        tableSetting.push(tempSetting);
                        tempSetting = [];
                    }   
                    // 生成表格
                    $oTable.bootstrapTable({
                        toolbar: '#toolbar',                //工具按钮用哪个容器
                        striped: option.isShowColor,                      //是否显示行间隔色
                        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                        pagination: option.isShowPage,                   //是否显示分页（*）
                        sortable: option.isSortable,                     //是否启用排序
                        sortOrder: option.sortby,                   //排序方式
                        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
                        pageNumber: 1,                       //初始化加载第一页，默认第一页
                        pageSize: option.colNum,                       //每页的记录行数（*）
                        pageList: option.pageOption,        //可供选择的每页的行数（*）
                        search: option.isShowSearch,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                        strictSearch: true,
                        buttonsClass: "pt",
                        minimumCountColumns: 2,             //最少允许的列数
                        clickToSelect: true,                //是否启用点击选中行
                        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
                        cardView: false,                    //是否显示详细视图
                        detailView: false,                   //是否显示父子表
                        columns: tableSetting,
                        treeShowField: option.colField,
                        idField: 'id',
                        parentIdField: 'pid',
                        onResetView: function (data) {
                            $oTable.treegrid({
                                initialState: 'collapsed',// 所有节点都折叠
                                // initialState: 'expanded',// 所有节点都展开，默认展开
                                treeColumn: option.treeColumn,
                                // expanderExpandedClass: 'glyphicon glyphicon-minus',  //图标样式
                                // expanderCollapsedClass: 'glyphicon glyphicon-plus',
                                onChange: function () {
                                    $oTable.bootstrapTable('resetWidth');
                                }

                            });
                            // $oTable.treegrid('getRootNodes').treegrid('expand');

                        },
                        onClickRow: function (row, $element, field) {
                            option.RowData = { row, $element, field }
                        }
                    });
                   
                   
                   this.$oTable = $oTable;
                },
                //渲染样式
                _renderCss: function () {
                    var $widget = this.$view,
                        css = this.css,
                        style = css.style,
                        cssCode,
                        className,
                        $cssTable = $widget.find('.fixed-table-container');


                    style.table && $AW.cssHover('.fixed-table-container', $widget, style.table, '');
                    style.progressCSS && $AW.cssHover('.pt-progressbar div', $cssTable, style.progressCSS, '');
                    style.tableHead && $AW.cssHover('th', $cssTable, style.tableHead, '');
                    style.tableHeadText && $AW.cssHover('th .th-inner', $cssTable, style.tableHeadText, '');
                    style.circular && $AW.cssHover('.pt-circular', $cssTable, style.circular, '');
                    style.tableBody && $AW.cssHover('td', $cssTable, style.tableBody, '');
                    style.pagination && $AW.cssHover('.pagination .active > a', $widget, style.pagination, '');
                    style.pagination && $AW.cssHover('.pagination .active > a', $widget, style.pagination, ':hover');
                    style.pagination && $AW.cssHover('.dropdown-menu>.active>a', $widget, style.pagination, '');
                    style.pagination && $AW.cssHover('.dropdown-menu>.active>a', $widget, style.pagination, ':hover');
                    style.pagination && $AW.cssHover('.dropdown-menu>li>a', $widget, style.pagination, ':hover');
                    style.dangerClass && $AW.cssHover('.state-danger', $widget, {color: style.dangerClass["color"],"font-size":style.dangerClass["font-size"]},"");
                    style.dangerClass && $AW.cssHover('.state-danger>.circle ,.bootstrap-table .state-danger>.circle>span', $widget, style.dangerClass,"");
                    style.successClass && $AW.cssHover('.state-success', $widget, {color: style.successClass["color"],"font-size":style.successClass["font-size"]},"");
                    style.successClass && $AW.cssHover('.state-success>.circle ,.bootstrap-table .state-success>.circle>span', $widget, style.successClass,"");
                    style.warningClass && $AW.cssHover('.state-warning', $widget, {color: style.warningClass["color"],"font-size":style.warningClass["font-size"]},"");
                    style.warningClass && $AW.cssHover('.state-warning>.circle ,.bootstrap-table .state-warning>.circle>span', $widget, style.warningClass,"");

                    if (css) {
                        //自定义样式
                        if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                           $widget.addClass(className);
                        }
                    }

                },
                // 加载数据
                refresh: function (obj) {
                    var v1 = JSON.stringify(obj).toString(),
                        data = JSON.parse(v1);
                    this.$oTable.bootstrapTable('load', data);
                },
                //获得点击行数据
                getClickRowData: function () {
                    return this.option.RowData.row;
                },
                //获得当前页数据
                getPageData: function () {
                    return this.$oTable.bootstrapTable('getData', true);
                },
                //后端分页
                refreshFromServer: function (ajaxOption) {
                    console.log(this);
                    var validateResult,
                        $oTable = this.$oTable,
                        _success = ajaxOption.success;

                    if ((validateResult = app.validate(ajaxOption.data,
                            ajaxOption.validateSuccessCallback,
                            ajaxOption.validateErrorCallback,
                            ajaxOption.validateCleanCallback,
                            ajaxOption.validateContinue,
                            ajaxOption.validate)) && validateResult.result) {

                        $oTable.bootstrapTable('refreshOptions', {
                            url: ajaxOption.url,                        //请求后台的URL（*）
                            method: ajaxOption.method,                  //请求方式（*）
                            contentType: "application/x-www-form-urlencoded", //post请求头
                            responseHandler: responseHandler,           //请求数据成功后，渲染表格前的方法
                            queryParams: queryParams,                   //请求服务器时所传的参数
                            dataField: "data",              //这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
                            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*） })
                            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
                            cardView: false,                    //是否显示详细视图
                            detailView: false,                   //是否显示父子表

                            treeShowField: "obj",
                            idField: 'id',
                            parentIdField: 'pid',
                            onResetView: function (data) {
                                $oTable.treegrid({
                                    initialState: 'collapsed',// 所有节点都折叠
                                    // initialState: 'expanded',// 所有节点都展开，默认展开
                                    treeColumn: 0,
                                    // expanderExpandedClass: 'glyphicon glyphicon-minus',  //图标样式
                                    // expanderCollapsedClass: 'glyphicon glyphicon-plus',
                                    onChange: function () {
                                        $oTable.bootstrapTable('resetWidth');
                                    }

                                });


                            },
                        });
                    }

                    // 传递参数方法
                    function queryParams(params) {
                        return {
                            pageSize: params.limit,   //每一页的数据行数，默认是上面设置的10(pageSize)
                            pageOffset: params.offset, //当前页面,默认是上面设置的1(pageNumber)
                            search: params.search,      //搜索栏输入字符
                            order: params.order,        //排序方式
                            sort: params.sort,         //排序的目标
                            data: ajaxOption.data       //自定义参数
                        }
                    }

                    // 请求成功方法
                    function responseHandler(response) {
                        _success(response);
                        if (!response.status) {

                        }else{
                            return {
                                total: response.content &&  response.content.result && response.content.result.total,
                                data: response.content &&  response.content.result &&  response.content.result.data,
                                result:response.content && response.content.result
                            }
                        }

                    }
                },

                show: function () {
                    this.$view.removeClass('hide');
                },

                hide: function () {
                    this.$view.addClass('hide');
                }

            };
            if (!widget.monitor.MComponent) {
                widget.monitor.MComponent = {};
            }
            //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
            widget.monitor.MComponent.MPolymorphicTable = function ($widget, option, attr, css, auiCtx) {
                return new Component($widget, option, attr, css, auiCtx);
            };
        });
})();