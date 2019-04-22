(function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", 'template'], factory);
		}
		// global
		else {
			factory();
		}

	})
		(function ($, widget, artTemplate) {
			"use strict";

			var timer = null,
				Component = function ($widget, option, attr, css, auiCtx) {
					var context = this;

					//Data Model
					context.$view = $widget;
					context.option = $.extend(true, {}, this.setting, option);
					context.attr = attr;
					context.css = css;
					context.pageContext = auiCtx;


					//View Model
					context.viewCache = {};


					context._init();

					context._render();
					context._listen();


				};

			// 匹配当前id的位置
			function mathDataPos(list, id) {
				var i, item;
				for (i = -1; item = list[++i];) {
					if (item._id === id) {
						return i;
					}
				}
				return -1;
			}

			function delayFn(fn) {
				clearTimeout(timer);
				timer = setTimeout(function () {
					fn();
				}, 300);
			}

			Component.prototype = Component.fn = {
				constructor: Component,
				version: 'AWOS 5.1 XQ',
				author: 'your name',
				debug: window.auiApp && window.auiApp.debug,
				// 被选中列表
				checkedDataList: [],
				// 所有数据
				dataList: [],
				//常量表
				constant: {
					TEMP:
						`
					<div class="checkIpt__box checkIpt__box--{{iptLocation}} checkIpt__mode--{{mode}}">
						<div class="checkIpt__check--wrapper">
							{{if showHeader}}
							<div class="cheader">
								{{if showSearch && searchLocation == 'top'}}
								<span class="search__box"><input type="search" class="search" placeholder="请输入关键字搜索"><i id="search" class="fa fa-search" aria-hidden="true"></i></span>
								{{/if}}
								{{if showTotal}}
								<span class="total__box">{{name}}总数:&nbsp;<span class="total">0</span></span>
								{{/if}}
							</div>
							{{/if}}
							<div class="cbody"></div>
							{{if showSearch && searchLocation == 'bottom'}}
							<div class="bottom">
								<span class="search__box"><input type="search" class="search" placeholder="请输入关键字搜索"><i id="search" class="fa fa-search" aria-hidden="true"></i></span>
							</div>
							{{/if}}
						</div>
						{{if showSelBlock}}
						<div class="checkIpt__checked--wrapper">
							<div class="sheader">
								<span class="stotal__box">已选{{name}}:&nbsp;<span class="stotal">0</span></span>
							</div>
							<div class="sbody"></div>
						</div>
						{{/if}}
					</div>
					`,
					TEMPITEM:
						`
					<div class="item fa fa-check __checked__" data-id="__id__">
						<div class="item__box {{if iconLocation == 'right'}}reverse{{/if}}">
							{{if icon != ''}}
							<div class="icon"><span><i class="{{icon}}"></i></span></div>
							{{/if}}
							<div class="text">
								__text__
							</div>
						</div>
					</div>
					`,
					ACTIVE: 'active'
				},
				setting: {
					showHeader: true,
					showSearch: true,
					showTotal: true,
					showSelBlock: true,
					icon: "",
					iconLocation: "left",
					searchLocation: "top",
					iptLocation: "bottom",
					mode: "2"
				},

				//初始化（私有）
				_init: function () {
					var $widget = this.$view,
						TEMPITEM = `
						<div class="item fa fa-check __checked__" data-id="__id__">
							<div class="item__box {{if iconLocation == 'right'}}reverse{{/if}}">
								{{if icon != ''}}
								<div class="icon"><span><i class="{{icon}}"></i></span></div>
								{{/if}}
								<div class="text">
									__text__
								</div>
							</div>
						</div>
						`,
						html = [];
					//解析option、attr、css
					if (!this.option.showSearch && !this.option.showTotal) {
						this.option.showHeader = false;
					}
					$widget.empty().append(artTemplate.compile(this.constant.TEMP)(this.option));
					this.constant.TEMPITEM = artTemplate.compile(TEMPITEM)(this.option);
					if (this.debug) {
						//如果在开发阶段，填充假数据
						this._renderFakeData();
					}
				},

				//事件绑定（私有）
				_listen: function () {
					var $widget = this.$view,
						$this = this,
						checkedDataList, dataList, $target, _id, index, item, checkedIndex;

					$('.cbody', $widget).off('.cbody').on('click.cbody', '.item', function (e) {
						checkedDataList = $this.checkedDataList;
						dataList = $this.dataList;
						$target = $(this);
						_id = $target.attr('data-id');
						index = mathDataPos(dataList, _id);
						item = dataList[index];

						if (item.checked === '1') {
							item.checked = '0';
							checkedIndex = mathDataPos(checkedDataList, _id);
								checkedDataList.splice(checkedIndex, 1);
							$target.removeClass('active');
						} else {
							item.checked = '1';
							checkedDataList.push(item);
							$target.addClass('active');
						}
						$this.changeItem();
					});
					if (this.option.showSearch) {
						$widget.find('.checkIpt__box .search').off('.ipt').on('input.ipt', function (e) {
							var fVal = $.trim($(this).val()),
								TEMPLATE = $this.constant.TEMPITEM,
								i, item, filterData, text, j;
							if (fVal === '') {
								clearTimeout(timer);
								$widget.find('.cbody [data-id]').removeClass('sActive');
								return false;
							}
							delayFn(function () {
								$widget.find('.cbody [data-id]').removeClass('sActive');
								filterData = $this.dataList.filter(function (item, index) {
									text = item.text;
									if (typeof text === 'object') {
										for (j = 0; j < text.length; j++) {
											if (text[j].indexOf(fVal) > -1) {
												return true;
											}
										}
									} else {
										if (text.indexOf(fVal) > -1) {
											return true;
										}
									}
								});
								for (i = -1; item = filterData[++i];) {
									$widget.find('.cbody [data-id="' + item._id + '"]').addClass('sActive');
								}
							});
						});
					}
				},
				// 选中展示
				changeItem: function () {
					var TEMPLATE = this.constant.TEMPITEM,
						checkIcon = this.option.checkIcon,
						$widget = this.$view,
						checkedDataList,
						checkedHTML = [],
						citem, j, text;

					if (this.option.showSelBlock) {
						checkedDataList = this.checkedDataList;
						for (j = -1; citem = checkedDataList[++j];) {
							text = citem.text;
							if (typeof text === 'object') {
								text = citem.text.reduce(function (total, currentValue, currentIndex, arr) {
									return total + '<p>' + currentValue + '</p>';
								}, '');
							}
							checkedHTML.push(
								TEMPLATE
									.replace(/__checked__/ig, 'active')
									.replace(/__id__/ig, citem._id)
									.replace(/__text__/ig, text)
							);
						}
						$widget.find('.sbody').empty().html(checkedHTML.join(''));
						$widget.find('.stotal').text(checkedDataList.length);

					}
					$widget.find(".check-icon").remove();
					$widget.find('.active').append($('<i class="check-icon ' + checkIcon + '" ></i>'));
				},
				// 全选
				allChecked: function () {
					var dataList = this.dataList,
						$widget = this.$view,
						checkIcon = this.option.checkIcon;

					$.each(dataList, function (index, item) {
						item.checked = '1';
					});
					this.checkedDataList = JSON.parse(JSON.stringify(dataList));
					$widget.find('.cbody .item').each(function () {
						$(this).addClass('active');

					});
					this.changeItem();

				},

				// 获取选中队列
				getCheckedList: function () {
					return this.checkedDataList;
				},
				// 获取未选中队列
				getNonList: function () {
					return this.dataList.filter(function (item, index) {
						return item.checked !== '1';
					});
				},
				// 显示
				show: function () {
					this.$view.removeClass('hide');
				},
				// 隐藏
				hide: function () {
					this.$view.addClass('hide');
				},
				// 销毁
				destroy: function () {
					this.$view.off().empty();
				},

				// 假数据渲染
				_renderFakeData: function () {
					var data = [];
					if (this.option.mode === '1') {
						data = [
							{ _id: "000", checked: 1, text: ["host 5", "IP:172.20.31.38"] },
							{ _id: "001", checked: 0, text: ["host 1", "IP:172.20.32.38"] },
							{ _id: "002", checked: 0, text: ["host 11", "IP:172.20.33.38"] },
							{ _id: "003", checked: 0, text: ["host 52", "IP:172.20.34.38"] }
						];
					} else if (this.option.mode === '2') {
						data = [
							{ _id: "000", checked: 1, text: "大数据平台" },
							{ _id: "001", checked: 0, text: "外围应用应用二组" },
							{ _id: "002", checked: 0, text: '网上银行项目组' },
							{ _id: "003", checked: 0, text: '外围应用一组' },
							{ _id: "004", checked: 0, text: '运行操作组' },
							{ _id: "005", checked: 0, text: '综合管理组' },
							{ _id: "006", checked: 0, text: '核心业务组' },
							{ _id: "007", checked: 0, text: '风险管理组' },
							{ _id: "008", checked: 0, text: '网络设备组' },
							{ _id: "009", checked: 0, text: '网络安全组' },
							{ _id: "010", checked: 0, text: '办公与业务支持组' },
							{ _id: "011", checked: 0, text: '南海机房建设' },
							{ _id: "012", checked: 0, text: '分行筹建IT支持及制度建设' },
							{ _id: "013", checked: 0, text: '系统管理二组' },
							{ _id: "014", checked: 0, text: '环境动力组' },
							{ _id: "015", checked: 0, text: '后台集中业务项目组' },
							{ _id: "016", checked: 0, text: '中间业务平台项目组' },
							{ _id: "017", checked: 0, text: '信贷管理项目组' },
							{ _id: "018", checked: 0, text: '质量管理组' },
							{ _id: "019", checked: 0, text: '系统管理组' },
							{ _id: "020", checked: 0, text: '后xxxxxx中业务项目组' }
						];
					}
					this.setValue(data);
				},

				//渲染主题、样式（私有）
				_render: function () {
					var $widget = this.$view,
						css = this.css,
						cssCode,
						className,
						style;

					if (css) {

						//样式解析机制
						if (style = css.style) {
							$.each(style, function (attr, item) {
								switch (attr) {
									case 'scrollHeight':
										$AW.cssHover('.checkIpt__box .checkIpt__check--wrapper .cbody', $widget, style[attr], '');
										$AW.cssHover('.checkIpt__box .checkIpt__checked--wrapper .sbody', $widget, style[attr], '');
										break;
									case 'wrapper':
										$AW.cssHover('.checkIpt__box', $widget, style[attr], '');
										break;
									case 'selectIpt':
										$AW.cssHover('.checkIpt__box .checkIpt__check--wrapper', $widget, style[attr], '');
										break;
									case 'selectedIpt':
										$AW.cssHover('.checkIpt__box .checkIpt__checked--wrapper', $widget, style[attr], '');
										break;
									case 'selectItem':
										$AW.cssHover('.checkIpt__box.checkIpt__mode--2 .item', $widget, style[attr], '');
										$AW.cssHover('.checkIpt__box.checkIpt__mode--1 .item', $widget, style[attr], '');
										break;
									case 'itemBefore':
										$AW.cssHover('.checkIpt__box .item.active', $widget, style[attr], ':before');
										break;
									case 'itemAfter':
										$AW.cssHover('.checkIpt__box .item.active', $widget, style[attr], ':after');
										break;
									case 'search':
										$AW.cssHover('.checkIpt__box .checkIpt__check--wrapper .search__box .search', $widget, style[attr], ':after');
										break;
									default: break;
								}
							});

						}

						//自定义样式
						if ((cssCode = css.cssCode) && (className = cssCode.className)) {
							$widget.addClass(className);
						}
					}

				},

				setValue: function (linkList) {

					var //模板
						TEMPLATE = this.constant.TEMPITEM,
						//填充数据
						html = [],
						//中间变量
						i, item,
						checkIcon = this.option.checkIcon,
						$widget = this.$view,
						checkedDataList,
						checkedHTML = [],
						citem, j, text;

					if (linkList === 'auiAjaxTest') {
						this._renderFakeData();
					} else if (linkList && linkList.length) {
						this.dataList = linkList;
						for (i = -1; item = linkList[++i];) {
							text = item.text;
							if (typeof text == 'object') {
								text = item.text.reduce(function (total, currentValue, currentIndex, arr) {
									return total + '<p>' + currentValue + '</p>';
								}, '');
							}
							html.push(
								TEMPLATE
									.replace(/__checked__/ig, item.checked === '1' ? 'active' : '')
									.replace(/__id__/ig, item._id)
									.replace(/__text__/ig, text)
							);
						}
						$widget.find('.cbody').empty().html(html.join(''));
						$widget.find('.total').text(linkList.length);
						this.checkedDataList = linkList.filter(function (item, index) {
							return item.checked === '1';
						});
						if (this.option.showSelBlock) {
							checkedDataList = this.checkedDataList;
							for (j = -1; citem = checkedDataList[++j];) {
								text = citem.text;
								if (typeof text === 'object') {
									text = citem.text.reduce(function (total, currentValue, currentIndex, arr) {
										return total + '<p>' + currentValue + '</p>';
									}, '');
								}
								checkedHTML.push(
									TEMPLATE
										.replace(/__checked__/ig, 'active')
										.replace(/__id__/ig, citem._id)
										.replace(/__text__/ig, text)
								);
							}
							$widget.find('.sbody').empty().html(checkedHTML.join(''));
							$widget.find('.stotal').text(checkedDataList.length);
						}
					}
					$widget.find(".check-icon").remove();
					$widget.find('.active').append($('<i class="check-icon ' + checkIcon + '" ></i>'));
				},


				getter: function (key) {
					var ret = this.dataModule[key];

					return ret && typeof ret === 'object' ? JSON.parse(JSON.stringify(ret)) : ret;
				},
				setter: function (key, value) {
					var inner = value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;

					this.dataModule[key] = inner;
				},


			};

			if (!widget.monitor.MComponent) {
				widget.monitor.MComponent = {};
			}

			//下面的代码，如无必要，无需修改，但需要查看每个入参的意义
			widget.monitor.MComponent.MCheckIpt = function ($widget, option, attr, css, auiCtx) {
				return new Component($widget, option, attr, css, auiCtx);
			};
		});
})();
