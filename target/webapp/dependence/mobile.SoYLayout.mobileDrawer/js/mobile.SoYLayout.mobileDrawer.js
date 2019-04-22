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


        if (!widget.mobile.SoYLayout) {
            widget.mobile.SoYLayout = {};
        }
        widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE].join('.mobile.SoYLayout.mobileDrawer,') + '.mobile.SoYLayout.mobileLayout', function (type, oWidget) {
            var option, div;

            oWidget && oWidget.length && oWidget.each(function (index, elem) {
                oWidget = oWidget.eq(index);

                if (oWidget.href() && oWidget.href() === 'mobile.SoYLayout.mobileDrawer') {

                    option = oWidget.option();
                    oWidget.drop(false);


                    for (var i = oWidget.children().length;i<2;i++) {

                        (function(i){
                            oWidget.append('divCtn', function (newCtn) {
                                i===0?newCtn.attr({
                                    widgetName:'主容器',
                                    desp:'主容器'
                                    }):newCtn.attr({
                                    widgetName:'侧边栏',
                                    desp:'侧边栏'
                                });
                                newCtn.del(false) && newCtn.drag(false);
                                oWidget.option(option,true);
                            });
                        })(i)

                    }


                }
            })

        });

        var Drawer = function($widget,option,attr,css,auiCtx){
	        var context = this;

	        context.$view=$widget;
	        context.option=option;
	        context.attr=attr;
	        context.css=css;


	        context.render();

	        context.init();
        };

	    Drawer.prototype = {
		    constructor:Drawer,
            defaultWidth:'200px',
            init:function(){
		        var context=this,
                    $widget=context.$view,
                    children,
			        $ctn,$sidebar,

			        css=this.css && this.css.style||{};

	            $widget && (children = $widget.children());

                context.asideWidth = this.defaultWidth;

	            if(children && children.length){
		            ($ctn = context.$ctn = children.first()) && $ctn.addClass('mobile-drawer-main');

		            ($sidebar = context.$sidebar = children.last()) && $sidebar.addClass('mobile-drawer-aside');

		            css.ctn && $ctn && $ctn.css(css.ctn);



		            css.aside && $sidebar && $sidebar.css(css.aside)&&css.aside.width && (context.asideWidth =css.aside.width)  ;

	            }

	            if(context.option.isRunInIE8){
                    $sidebar.css({
                        left:'-'+context.asideWidth
                    });
                }





            },
            render:function() {
	            var css = this.css;
	            if (css && css.cssCode && css.cssCode.className) {
		            this.$view.addClass(css.cssCode.className);
	            }
            },
		    showSidebar:function(){
			    var $sidebar = this.$sidebar;

			    if(this.option.isRunInIE8){
                    $sidebar.animate({
                        left:0
                    });

                    this.isSidebarShow = true;
                }else{
                    this.$ctn.css({
                       transform:'translate3d('+$sidebar.outerWidth()+'px 0px 0px)'
                    });

                     $sidebar.addClass('show');
                }





		    },

		    setSidebarWidth:function(width){
			    if(width){



                    if(this.option.isRunInIE8){
                        if(this.isSidebarShow){
                            this.$sidebar.css({
                                left:0,
                                width: width
                            });
                        }else{
                            this.$sidebar.css({
                                width: width
                            });
                        }
                        this.asideWidth =width;
                    }else{
                        this.$sidebar.css({
                            width: width
                        });
                    }





			    }
		    },
		    hideSidebar:function(){


                if(this.option.isRunInIE8){
                    this.$sidebar.animate({
                        left:'-'+this.asideWidth
                    });
                    this.isSidebarShow = false;
                }else{

                     this.$ctn.css({
				       transform: 'translate3d(0 0 0)'
                     });

                     this.$sidebar.removeClass('show')
                }



		    },
		    resetSidebarWidth:function(){


                if(this.option.isRunInIE8){
                    if(this.isSidebarShow){
                        this.$sidebar.css({
                            width: '',
                            left:0
                        });
                    }else{
                        this.$sidebar.css({
                            width: '',
                        });
                    }

                    this.asideWidth = this.defaultWidth;
                }else{
                     this.$sidebar.css({
                        width: ''
                     });
                }

		    },
		    show: function () {
			    this.$view.removeClass('hide');
		    },
		    hide: function () {
			    this.$view.addClass('hide');
		    }
	    };


        widget.mobile.SoYLayout.mobileDrawer = function ($widget,option,attr,css,auiCtx) {
                return new Drawer($widget,option,attr,css,auiCtx);
        };
    });
})();
