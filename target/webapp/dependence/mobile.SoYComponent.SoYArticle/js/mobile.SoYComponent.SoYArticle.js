(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget",'marked', 'prettify', 'Raphael', 'sequenceDiagram', 'flowchart', 'jQueryFlowchart', 'editormd'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,marked, preffify, Raphael, sequenceDiagram, flowchart, jQueryFlowchart, editormd) {
        "use strict";

        if(!widget.mobile.SoYComponent) {
            widget.mobile.SoYComponent = {};
        }

        widget.mobile.SoYComponent.SoYArticle = function () {
            var widgetIns, $widget, css,
                resizeUID,
                resizeOption,
                render = function ($widget, css,isRender,resizeUID,content) {
                    if(css && css.cssCode && css.cssCode.className){
                        $widget.addClass(css.cssCode.className)
                    }
                    if ((css = css.style) && css.ctn) {
                        $widget.css(css.ctn)
                    }
                    if (isRender) {
                        var testEditormdView;
                        testEditormdView = editormd.markdownToHTML(resizeUID, {
                            markdown        :content,//+ "\r\n" + $("#append-test").text(),
                            //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
                            htmlDecode      : "style,script,iframe",  // you can filter tags decode
                            //toc             : false,
                            // tocm            : true,    // Using [TOCM]
                            // tocContainer    : "#"+tocContainerID, // 自定义 ToC 容器层
                            //gfm             : false,
                            //tocDropdown     : true,
                            // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
                            emoji           : true,
                            taskList        : true,
                            tex             : true,  // 默认不解析
                            flowChart       : true,  // 默认不解析
                            sequenceDiagram : true  // 默认不解析
                        });

                    }else{
                        $widget.css({
                            "min-height":"200px"
                        })
                    }
                };

                $widget = arguments[0];
                css = arguments[3];
                resizeUID=app.getUID();
                $widget.attr("id",resizeUID);

                render($widget,css,true,resizeUID);

                resizeOption={
                    uid:resizeUID,
                    isGlobal:true,
                    timeout:100,
                    callback:function(){
                        render($widget,css,true,resizeUID)
                    }

                };

                app.screen.addResizeHandler(resizeOption);

                return{
                    display: function (result) {
                        $widget[result?'removeClass':'addClass']('hide');
                    },
                    show: function () {
                        $widget.removeClass('hide');
                    },
                    hide: function () {
                        $widget.addClass('hide');
                    },
                    resize:function(){
                        render($widget,css,true,resizeUID);
                    },
                    setContent:function(contentString){
                        render($widget,css,true,resizeUID,contentString);
                    },
                    resume:function(){
                        app.screen.addResizeHandler(resizeOption);
                    },
                    pause:function(){
                        app.screen.removeResizeHandler(resizeUID,true);
                    },
                    destroy:function(){
                        app.screen.removeResizeHandler(resizeUID,true);
                    }

                }



            
        };
    });
})();
