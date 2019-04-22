/*!
 * Javascript library v3.0
 *
 * Date: 2017.09.01 重写
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */ function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["template",'bundle', 'vue'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function (artTemplate, bundle, Vue) {
        "use strict";

        var vueManage = {},
            domManage = {},
            requirePanelList = [],
            eventAccumulatorMap = {},
            baseEventAccumulator = 0,
            BASE_CONST = {
                CONFIG_BLOCK: 'aui-config-block',
                TEXT_TAG_ITEM: 'text-tag-item',
                EDM_LIST: 'ul[data-role="edmList"]',
                REAL_REGULAR: /^[-+]?\d+(\.\d+)?/g
            },
            REGEX =  {
                URL: /##[^#_]+_URL(?:_([^#]+))?##/gi,
                OVERVIEW_URL_SINGLE: /##(\d+)-OVERVIEW_URL##/,
                URL_REDUNDANCY: /(##|_URL(?:_(?:[^#]+))?##)/gi,
                URL_INDEX: /_URL_([^#]+)##$/,
                URL_ID: /^##([^#_]+)_URL/,
                WIDGET: {
                    NAME: /%%_NAME%%/gi,
                    INDEX: /%%_INDEX%%/gi,
                    ID: /%%_WID%%/gi,
                    PLACEHOLDER: /##(_(?:ID|ATTR|OPTION|CSS|URL|VAR)+)?##/gi
                },
                FOREIGN_WIDGET: {
                    URL_MATCH: /%%_URL%%/ig,
                    FOREIGN_WIDGET_MATCH: /%%_WID(_[^%]+)?%%/ig,
                    FOREIGN_WIDGET_REDUNDANCY: /(%%|_WID(?:_[^%]+)?%%)/g,
                    FOREIGN_WIDGET_SPILT: /%%_WID(_[^%]+)?%%/,
                    FOREIGN_WIDGET_MATCH_PASTE: /##(?:[^#_]+)_WID(?:_[^#]+)?##/ig,
                    FOREIGN_WIDGET_SPILT_PASTE: /##([^#_]+)_WID(?:_([^#]+))?##/
                },
                TYPE: {
                    ID: 'id',
                    OPTION: 'option',
                    ATTR: 'attr',
                    CSS: 'css',
                    URL: 'url',
                    VAR: 'var'
                },
                EVENT_FUNCTION_REPLACEMENT: '_parseFunction_function (##_EVENT##){_code_}',
                EVENT_FUNCTION_REGEX: /_code_/
            },
            vscode = function () {
            var editors = {},
                hasRegister = false,
                dtd = $.Deferred(),
                done = function (callback) {
                    if (dtd.state() !== 'resolved') {
                        $.when(dtd.promise()).done(callback);
                    } else {
                        callback();
                    }
                },
                createDependencyProposals = function (model, position) {
                    // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
                    // here you could do a server side lookup
                    var text = model.getValueInRange({
                        startLineNumber: position.lineNumber,
                        startColumn: 1,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    }), code = text.trim().match(/[\w\.]+(?:$|\))/);

                    code = text && text.length && code ? code[0] : text;


                    if (code.startsWith('app')) {
                        return [{
                            label: 'alert',
                            kind: monaco.languages.CompletionItemKind.Method,
                            detail: "提示,app.alert(string:tips，enum:alertType)",
                            insertText: "alert('提示语句',app.alert.ERROR);"
                        }, {
                            label: 'alert.WARNING',
                            kind: monaco.languages.CompletionItemKind.Enum,
                            detail: "警告提示",
                            insertText: "alert.WARNING"
                        }, {
                            label: 'alert._DEFAULT',
                            kind: monaco.languages.CompletionItemKind.Enum,
                            detail: "默认提示",
                            insertText: "alert._DEFAULT"
                        }, {
                            label: 'alert.SUCCESS',
                            kind: monaco.languages.CompletionItemKind.Enum,
                            detail: "成功提示",
                            insertText: "alert.SUCCESS"
                        }, {
                            label: 'alert.ERROR',
                            kind: monaco.languages.CompletionItemKind.Enum,
                            detail: "错误提示",
                            insertText: "alert.ERROR"
                        }, {
                            label: 'shelter.show',
                            kind: monaco.languages.CompletionItemKind.Method,
                            detail: "遮罩,app.shelter.show(string:tips,boolean:immediately)",
                            insertText: "shelter.show('请稍候…');"
                        }, {
                            label: 'shelter.hide',
                            kind: monaco.languages.CompletionItemKind.Method,
                            detail: "关闭遮罩,app.shelter.hide()",
                            insertText: "shelter.hide();"
                        }, {
                            label: 'shelter.hideAll',
                            kind: monaco.languages.CompletionItemKind.Method,
                            detail: "关闭所有遮罩,app.shelter.hideAll()",
                            insertText: "shelter.hideAll();"
                        }];
                    } else {
                        return [
                            {
                                label: '$AW',
                                kind: monaco.languages.CompletionItemKind.Function,
                                detail: "组件操作对象",
                                insertText: '$AW(widgetID)'
                            }
                            , {
                                label: 'app',
                                kind: monaco.languages.CompletionItemKind.Interface,
                                detail: "提示,app.alert(提示语句，提示类型)",
                                insertText: 'app'
                            }
                        ];
                    }
                },
                createThemeVariablesProposals = function (model, position) {
                    var themeVariables, i, item, ret = [], variablesName,
                        text = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        }), code = text.trim().match(/[\w\:]+(?:$|\))/);

                    code = text && text.length && code ? code[0] : text;


                    if (/[:@]/.test(code)) {
                        themeVariables = $AW.fresher && $AW.fresher.variables;
                        for (i = -1; item = themeVariables[++i];) {
                            variablesName = item.name.replace(/[(\@)(\#)(\$)(\%)(\&)]+/g, '');
                            ret.push({
                                label: '@' + variablesName,
                                detail: item.defaultValue + item.desp,
                                insertText: '@' + variablesName
                            })
                        }

                    }

                    return ret;
                };

            return {

                layout: function ($ctn) {
                    var i, elem, editor, $editor, elems = $ctn.find('[data-vscode-id]');
                    for (i = -1; elem = elems[++i];) {
                        $editor = $(elem);
                        editor = editors[$editor.attr('data-vscode-id')];
                        editor && editor.layout();
                    }

                },

                create: function ($editor, options) {
                    var uid = app.getUID(), myEditor,
                        requiredCallback = function () {
                            if (!hasRegister) {
                                monaco.languages.registerCompletionItemProvider('javascript', {
                                    triggerCharacters: ["."],
                                    provideCompletionItems: createDependencyProposals
                                });

                                monaco.languages.registerCompletionItemProvider('less', {
                                    triggerCharacters: [":"],
                                    provideCompletionItems: createThemeVariablesProposals
                                });
                                hasRegister = true;
                            }

                            myEditor = editors[uid] = monaco.editor.create($editor[0], options);
                        };


                    if ($editor.length) {
                        $editor.attr('data-vscode-id', uid);

                        options.fixedOverflowWidgets = true;
                        options.folding = true;
                        options.formatOnPaste = true;
                        options.mouseWheelZoom = true;
                        options.parameterHints = true;
                        options.renderIndentGuides = true;
                        options.tabCompletion = true;
                        options.autoIndent = true;

                        if (!window.monaco) {
                            require(['vs/loader', 'vs/editor/editor.main'], function () {
                                requiredCallback();
                                dtd.resolve();

                            });
                        } else {
                            requiredCallback();
                        }
                    }


                    return {
                        setValue: function (str) {
                            done(function () {
                                myEditor && myEditor.setValue(str);
                            })
                        },
                        getValue: function () {

                            return myEditor && myEditor.getValue();
                        },
                        dispose: function () {
                            delete editors[uid];
                            myEditor && myEditor.dispose();
                        },
                        getInstance: function () {
                            return myEditor;
                        },
                        onBlur: function (callback) {
                            //currentEditor = null;
                            done(function () {
                                myEditor && myEditor.onDidBlurEditorText(callback);
                            })
                        },
                        layout: function () {
                            myEditor && myEditor.layout();
                        },
                        setModel: function (data, mode) {
                            done(function () {
                                myEditor && myEditor.setModel(new monaco.editor.createModel(data, mode));
                            });
                            return myEditor;
                        },
                        done: function (callback) {
                            done(function () {
                                callback(myEditor);
                            })
                        }
                    }
                }
            }
        }();


        bundle.install(Vue);


        window.vueManage = vueManage;
        window.domManage = domManage;
        window.requirePanelList = requirePanelList;

        Vue.directive('div', {
            inserted: function (el, binding) {
                var $div = $(el),
                    editor, cache,
                    bindingValue = binding.value,
                    optionItem = bindingValue.option,
                    itemValue = bindingValue.value,
                    instanceObj = bindingValue.obj,
                    optionName = bindingValue.name,
                    modelSelector = bindingValue.modelSelector;

                switch (optionItem.divType) {
                    case 'string_simpleHtml':
                    case 'string_html':
                    case 'template_html':
                        $div.text('');
                        break;

                    default:
                        // css[optionItem.divType](el, binding);
                        break;
                }
            },

            update: function (el, binding) {
                var $div = $(el),
                    editor, cache,
                    bindingValue = binding.value,

                    optionItem = bindingValue.option,
                    instanceObj = bindingValue.obj,
                    itemValue = bindingValue.value,
                    optionName = bindingValue.name,
                    modelSelector = bindingValue.modelSelector;
                switch (optionItem.divType) {
                    case 'string_simpleHtml':

                    case 'string_html':
                    case 'template_html':
                        $div.text('');
                        // domManage[modelSelector].$txt.html(itemValue);
                        break;

                }
            }
        });

        Vue.directive('span', function (el, binding) {
                var $span = $(el),
                    editor, cache,
                    bindingValue = binding.value,

                    optionItem = bindingValue.option || bindingValue.optionItem,
                    itemValue = bindingValue.value,
                    instanceObj = bindingValue.obj,
                    optionName = bindingValue.name,
                    modelSelector = bindingValue.modelSelector;

                switch (optionItem.spanType) {
                    case 'icon':

                        $span.html('<i class="fa ' + itemValue + '"></i>');

                        break;

                    case 'file':
                        $span.text(itemValue);
                        break;
                    case 'string_simpleHtml':
                    case 'string_html':
                    case 'template_html':
                        $span.text('');
                        break;
                    default:
                        $span.text(itemValue);
                        break;
                }
            });

        // Vue.directive('tooltip', function (el, binding) {
        //     var bindingValue = binding.value;
        //     if (bindingValue && bindingValue.name) {
        //         $(el).tooltips({
        //
        //             animation: false,
        //             html: true,
        //             placement: function (ui) {
        //                 var event = window.event,
        //                     $ui = $(ui);
        //
        //                 $ui.addClass('hidden');
        //                 requestAnimationFrame(function () {
        //                     var $body = $('body');
        //
        //                     $body.children('.tooltip').not($ui).remove();
        //
        //                     $ui.css(app.position(event, $body, $ui, -10, -20)).removeClass('hidden');
        //
        //                 }, 16);
        //
        //                 return 'bottom';
        //             },
        //             title: function () {
        //                 return artTemplate('baseTooltip', binding.value);
        //             },
        //             trigger: 'hover',
        //             container: 'body',
        //             size: 'small'
        //         })
        //     }
        // });

        Vue.directive('tab', function (el, binding) {

            var data = binding.value,
                uid = 'tabContent' + app.getUID();
            $(el).attr("id", uid);

            // <!--<base-config fromTabPanes :array="[tabItem]" :arraySelector="arraySelector + '-&#45;&#45;tabPanes-&#45;&#45;' + index " :objSelector="objSelector" :handler="handler" :obj="obj"></base-config>
            new Vue({
                el: "#" + uid,
                data:function () {
                    return{
                        data:data
                    }
                },
                template: [

                    '<base-config fromTabPanes :array="data.array" :arraySelector="data.arraySelector " :objSelector="data.objSelector" :handler="data.handler" :obj="data.obj"></base-config>'

                ].join(''),
            })
        });

        function isResponseData(item) {
            if (item.name === 'responseData' && item.direction === 'response') {
                return true;
            }
        }


        function getRequireAttrFormVueArgs(args) {
            var contextID,
                modelSelectorArr, widgetSelectorArr,
                modelSelector, widgetSelector,
                vueArrSelector,
                currentItemName,
                vueItemSelector;

            modelSelectorArr = args.modelSelector.split('---');
            // widgetSelectorArr = args.arraySelector.split('---');
            contextID = modelSelectorArr.shift();

            modelSelectorArr.unshift('obj');
            modelSelectorArr.pop();
            modelSelectorArr = modelSelectorArr.map(function (item, index) {
                return "['" + item + "']";
            });
            vueItemSelector = 'vueManage.' + contextID + modelSelectorArr.join('');
            currentItemName = eval(vueItemSelector).name;

            modelSelectorArr.pop();
            vueArrSelector = 'vueManage.' + contextID + modelSelectorArr.join('');


            /* widgetSelectorArr.pop();
             widgetSelectorArr.pop();
             widgetSelectorArr = widgetSelectorArr.map(function(item, index) {
             return "['" + item + "']";
             });
             widgetSelector = 'vueManage.' + contextID + widgetSelectorArr.join(''); */

            return getRequireAttr(JSON.parse(JSON.stringify(eval(vueArrSelector))), eval(vueItemSelector), currentItemName);
        }

        function getRequireAttr(arr, item, currentItemName) {
            var result = [],
                requireObj = item.require,

                i, len, cache;

            if (arr) {
                for (i = 0, len = arr.length; i < len; i++) {
                    if (cache = requireObj[arr[i].name]) {
                        requireObj[arr[i].name] = cache;
                    }
                    if (arr[i].desp && (arr[i].name !== currentItemName)) {
                        switch (arr[i].type) {
                            case 'string_select':
                                arr[i].despArray = arr[i].despArray || [];
                                arr[i].valueArray = arr[i].valueArray || [];
                                result.push({
                                    name: arr[i].name,
                                    desp: arr[i].desp,
                                    type: 'multiple_select',
                                    despArray: (typeof arr[i].despArray === 'string' ? JSON.parse(arr[i].despArray) : arr[i].despArray),
                                    valueArray: (typeof arr[i].valueArray === 'string' ? JSON.parse(arr[i].valueArray) : arr[i].valueArray)
                                });
                                break;

                            case 'boolean':
                                result.push({
                                    name: arr[i].name,
                                    desp: arr[i].desp,
                                    type: 'string_select',
                                    despArray: ['无', '是', '否'],
                                    valueArray: ['', 'true', 'false']
                                });
                                break;
                        }

                    }
                }
            }
            return result;
        }

        //selector 实际的值是一个对象
        //dataType: obj或array
        function updateResponsiveData(arg) {
            var i, len,

                arraySelector = 'vueManage.' + arg.contextID + '.array' + arg.arraySelector,
                arrayTarget = eval(arraySelector),

                target = eval('vueManage.' + arg.contextID + '.' + arg.dataType + arg.selector),
                targetCopy = JSON.parse(JSON.stringify(target)),

                newValue, arraySelector,
                arraySelectorArr;

            arg.values = $.extend(true, [], arg.values);

            for (i = 0, len = arg.keys.length; i < len; i++) {
                targetCopy[arg.keys[i]] = arg.values[i] || '';
            }

            if (arg.arraySelector) {
                baseConfigInitInstance(targetCopy, arrayTarget, {});
            }

            for (i = 0, len = arg.keys.length; i < len; i++) {
                if (!arg.values[i] && arg.values[i] !== false) {
                    targetCopy[arg.keys[i]] = '';
                } else {
                    targetCopy[arg.keys[i]] = arg.values[i];
                }
                Vue.set(target, arg.keys[i], targetCopy[arg.keys[i]]);
            }
        }


        function getDefaultValue(instance, item) {
            var defaultValue = item.defaultValue;
            if (typeof instance[item.name] === 'number') {
                return instance[item.name];
            } else {
                if (defaultValue) {
                    if (typeof defaultValue === 'object') {
                        return JSON.stringify(defaultValue);
                    } else {
                        return defaultValue.toString();
                    }
                } else {
                    return '';
                }
            }
        }


        function refreshWidget(oWidget, modelSelector, widgetSelector, valueChangeKey, newValue) {

            if (modelSelector) {
                modelSelector = modelSelector.replace(/instanceObj/, 'widgetInstance');
                widgetSelector = widgetSelector && widgetSelector.replace(/array/, 'widget');

                var event = {
                    type: 'valueChange',
                    target: 'option',
                    modelSelector: modelSelector,
                    widgetSelector: widgetSelector,
                    valueChangeKey: valueChangeKey,
                    newVal: newValue
                };

                // $AW.trigger($AW.STATUS.WIDGET_UPDATE, oWidget, event);

                oWidget.refresh(true, undefined, undefined, event);
            }
        }

        function normalizeObjV2(obj, objArray, withTemplate) {
            var name, i, cursor = -1,
                cache, objCache, objArrayCache,
                caches = [{
                    obj: obj,
                    objArray: objArray
                }];

            while (cache = caches[++cursor]) {
                objCache = cache.obj;
                objArrayCache = cache.objArray;

                if (objCache && objCache.active) {
                    delete objCache.active;
                }
                if (objArrayCache && objCache) {
                    $.each(objArrayCache, function (index, item) {
                        var temp;
                        name = item.name;
                        if (!name && item.type !== 'tab') {

                            delete objCache[name];
                        } else {
                            switch (item.type) {
                                case 'tab':
                                    caches.push({
                                        obj: objCache,
                                        objArray: item.tabPanes
                                    });
                                    break;

                                case 'object':
                                    if ($.isEmptyObject(objCache[name]) && !item.reserve) {
                                        delete objCache[name];
                                    } else {
                                        objCache[name] && caches.push({
                                            obj: objCache[name],
                                            objArray: item.attr
                                        });
                                    }
                                    break;

                                case 'array':

                                    if ($.isArray(objCache[name])) {
                                        !withTemplate && objCache[name].shift();
                                        if (objCache[name].length === 0 && !item.reserve) {
                                            !withTemplate && (delete objCache[name]);
                                        } else {

                                            if (item.attrInEachElement === 'self') {
                                                item.attrInEachElement = JSON.parse(JSON.stringify(objArrayCache));
                                            }

                                            for (i = objCache[name].length; i > 0;) {
                                                temp = objCache[name][--i];
                                                if ((temp && temp.active === false) || (item.mustHave && !temp[item.mustHave])) {
                                                    objCache[name].splice(i, 1);
                                                    if (objCache[name].length === 0 && !item.reserve) {

                                                        delete objCache[name];
                                                    }
                                                } else {
                                                    caches.push({
                                                        obj: objCache[name][i],
                                                        objArray: item.attrInEachElement
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    break;

                                case 'edmCollection':
                                    !withTemplate && objCache[name].elements.shift();
                                    if (objCache[name].elements.length === 0 && !item.reserve) {
                                        !withTemplate && (delete objCache[name].elements);
                                    } else {
                                        for (i = objCache[name].elements.length; i > 0;) {
                                            temp = objCache[name].elements[--i];
                                            if ((temp && temp.active === false) || (item.mustHave && !temp[item.mustHave])) {
                                                objCache[name].elements.splice(i, 1);
                                                if (objCache[name].elements.length === 0 && !item.reserve) {
                                                    delete objCache[name].elements;
                                                }
                                            } else {
                                                caches.push({
                                                    obj: objCache[name].elements[i],
                                                    objArray: item.attrInEachElement
                                                });
                                            }
                                        }
                                    }
                                    objCache[name] = {
                                        edmID: objCache[name].edmID,
                                        edmKey: objCache[name].edmKey,
                                        elements: objCache[name].elements,
                                        fields: objCache[name].fields,
                                        keys: objCache[name].keys
                                    };
                                    break;

                                case 'multiple_select':
                                    if (item.separator) {
                                        objCache[name] = objCache[name].join(item.separator);
                                    }
                                    break;

                                case 'tags_input':
                                    try {
                                        objCache[name] = JSON.parse(objCache[name].replace(/\'/g, "\""));
                                    } catch (e) {

                                    }

                                    break;

                                default:
                                    if (objCache && objCache[name]) {
                                        if (typeof objCache[name] === 'undefined' && typeof item.reserve === 'undefined') {
                                            delete objCache[name];
                                        }
                                    }


                                    break;
                            }
                        }
                    });
                }
            }

            return obj;
        }

        //instance可以是normalize处理过的或未处理过的，返回的肯定是optionCopy形式的option
        function baseConfigInitInstance(instance, array, extras, notSendEdm) {
            var cache, instanceCache, arrayCache, extrasCache, cursor = -1,
                eventAccumulator = baseEventAccumulator,
                key,
                children,
                defaultValue,
                caches = [{
                    instance: instance,
                    array: array,
                    extras: extras
                }];

            if (extras && AUI) {
                extras.widgetID = extras.widgetID || AUI.currentWidgetID;
            }

            while (cache = caches[++cursor]) {
                instanceCache = cache.instance;
                arrayCache = cache.array;
                extrasCache = cache.extras;


                if ($.isArray(arrayCache)) {

                    $.each(arrayCache, function (i, item) {
                        var name = item.name,
                            stringifyTemp,
                            temp;

                        switch (item.type) {
                            case 'tab':
                                caches.push({
                                    instance: instanceCache,
                                    array: item.tabPanes,
                                    extras: extrasCache
                                });
                                break;

                            case 'object':

                                if (item.isRequire && extrasCache && extrasCache.instanceParentArr) {
                                    //set attr manually
                                    //at this situation, name is equal to string require
                                    item.attr = getRequireAttr(extrasCache.instanceParentArr, instanceCache);
                                } else {
                                    if (item.attr) {
                                        if(children=item.children){
                                            for(key in children){
                                                if(children.hasOwnProperty(key) && (defaultValue=children[key].defaultValue) && !(/null/i.test(defaultValue))){
                                                    item.attr[key].defaultValue=defaultValue;
                                                }

                                            }
                                        }

                                        if (typeof instanceCache[name] !== 'object') {
                                            instanceCache[name] = {};
                                        }
                                        caches.push({
                                            instance: instanceCache[name],
                                            array: item['attr'],
                                            extras: extrasCache
                                        });
                                    } else {
                                        instanceCache[name] = {};
                                    }
                                }
                                break;

                            case 'array':
                                if (item['attrInEachElement']) {
                                    if ((!instanceCache[name] || ($.isArray(instanceCache[name]) && instanceCache[name].length === 0)) && item['attrInEachElement'] !== 'self') {
                                        instanceCache[name] = [];
                                        instanceCache[name].push(baseConfigInitInstance({
                                            active: 'true'
                                        }, item['attrInEachElement'], {
                                            noreplace: true,
                                            name: item.desp,
                                            widgetID: extrasCache && extrasCache.widgetID
                                        }));

                                        if (item.append || item.appendNumber) {
                                            if (item.appendNumber && !item.append) {
                                                for (i = 0; i < item.appendNumber; i++) {
                                                    item.append = item.append || [];
                                                    item.append.push({});
                                                }
                                            }
                                            $.each(JSON.parse(JSON.stringify(item.append)), function (index, value) {
                                                value.active = true;
                                                instanceCache[name].push(baseConfigInitInstance(value, item['attrInEachElement'], {
                                                    name: item.desp,
                                                    widgetID: extrasCache && extrasCache.widgetID,
                                                    order: index + 1,
                                                    instanceParentArr: instanceCache[name]
                                                }));
                                            });
                                        }

                                    } else if ($.isArray(instanceCache[name]) && instanceCache[name].length > 0) {

                                        if (item['attrInEachElement'] === 'self') {
                                            item['attrInEachElement'] = JSON.parse(JSON.stringify(arrayCache));
                                        }

                                        if (!instanceCache[name][0].active) {
                                            //第一个元素的active不存在，说明已做过normalize处理
                                            instanceCache[name].unshift(baseConfigInitInstance({
                                                active: true
                                            }, item['attrInEachElement'], {
                                                noreplace: true,
                                                name: item.desp,
                                                widgetID: extrasCache && extrasCache.widgetID
                                            }));
                                        }

                                        //对数组的每个元素进行init处理
                                        $.each(instanceCache[name], function (index, value) {
                                            value.active = (typeof value.active === 'string') ? JSON.parse(value.active) : value.active;
                                            if (value.active === undefined) {
                                                value.active = true;
                                            }
                                            if (index > 0) {

                                                baseConfigInitInstance(value, item['attrInEachElement'], {
                                                    name: item.desp,
                                                    widgetID: extrasCache && extrasCache.widgetID,
                                                    order: index,
                                                    instanceParentArr: instanceCache[name],
                                                    arrayValue: value
                                                });
                                            }
                                        })
                                    }
                                } else {
                                    instanceCache[name] = instanceCache[name] || [];
                                }
                                if (item.hasEvent) {
                                    if (extrasCache) {
                                        AUI.eventSelectorUpdate(extrasCache.widgetID, instanceCache[name]);
                                    } else {
                                        AUI.eventSelectorUpdate(AUI.currentWidgetID, instanceCache[name]);
                                    }
                                }
                                break;

                            case 'edmCollection':

                                if (item['attrInEachElement']) {
                                    instanceCache[name] = instanceCache[name] || {};
                                    if (!instanceCache[name].elements || instanceCache[name].elements.length === 0) {
                                        instanceCache[name].elements = [];
                                        instanceCache[name].elements.push(baseConfigInitInstance({
                                            active: true
                                        }, item['attrInEachElement'], {
                                            name: item.desp,
                                            widgetID: extrasCache && extrasCache.widgetID
                                        }));

                                        if (item.append) {
                                            if (item.appendNumber) {
                                                for (i = 0; i < item.appendNumber; i++) {
                                                    item.append = item.append || [];
                                                    item.append.push({});
                                                }
                                            }
                                            $.each(item.append, function (index, value) {
                                                value.active = true;
                                                instanceCache[name].elements.push($.extend(
                                                    true, {},
                                                    baseConfigInitInstance({}, item['attrInEachElement'], {
                                                        name: item.desp,
                                                        widgetID: extrasCache && extrasCache.widgetID,
                                                        order: index + 1
                                                    }),
                                                    value));
                                            });
                                        }

                                    } else {
                                        if (!instanceCache[name].elements[0].active) {
                                            //第一个元素的active不存在，说明已做过normalize处理
                                            instanceCache[name].elements.unshift(baseConfigInitInstance({
                                                active: true
                                            }, item['attrInEachElement'], {
                                                noreplace: true,
                                                name: item.desp,
                                                widgetID: extrasCache && extrasCache.widgetID
                                            }));
                                        }
                                        //对数组的每个元素进行init处理
                                        $.each(instanceCache[name].elements, function (index, value) {
                                            value.active = (typeof value.active === 'string') ? JSON.parse(value.active) : value.active;
                                            if (value.active === undefined) {
                                                value.active = true;
                                            }
                                            if (index > 0) {

                                                caches.push({
                                                    instance: value,
                                                    array: item['attrInEachElement'],
                                                    extras: {
                                                        name: item.desp,
                                                        widgetID: extrasCache && extrasCache.widgetID,
                                                        order: index
                                                    }
                                                });

                                            }
                                        });
                                    }
                                } else {
                                    instanceCache[name] = {};
                                    instanceCache[name].elements = [];
                                }

                                instanceCache[name].edmKey = item['edmKey'];

                                   break;

                            case 'string_select':
                                stringifyTemp = instanceCache[name] && instanceCache[name].toString();

                                if (item.group) {
                                    temp = item.group[0].valueArray ? item.group[0].valueArray[0] : '';
                                } else {
                                    temp = item.valueArray ? item.valueArray[0] : '';
                                }

                                if (typeof stringifyTemp !== 'undefined') {
                                    instanceCache[name] = stringifyTemp
                                } else {
                                    instanceCache[name] = ((typeof item.defaultValue !== 'undefined') && item.defaultValue.toString()) || temp;
                                }

                                if (name === 'data-authority') {
                                    instanceCache[name] = instanceCache[name] || '10';
                                }
                                break;

                            case 'number':
                                if (typeof instanceCache[name] !== 'number') {
                                    if (instanceCache[name] === undefined) {
                                        switch (typeof item.defaultValue) {
                                            case 'undefined':
                                                item.defaultValue = '';
                                                break;

                                            case 'string':
                                                if (item.defaultValue !== '') {
                                                    item.defaultValue = Number(item.defaultValue);
                                                }
                                                break;
                                        }
                                        instanceCache[name] = item.defaultValue;
                                    } else {
                                        if (instanceCache[name] !== '') {
                                            instanceCache[name] = (instanceCache[name] !== undefined) && (instanceCache[name] !== '') && JSON.parse(instanceCache[name]);
                                        }
                                    }
                                }
                                break;

                            case 'boolean':
                                instanceCache[name] = ((typeof instanceCache[name] !== 'undefined') && instanceCache[name].toString()) || ((typeof item.defaultValue !== 'undefined') && item.defaultValue.toString()) || 'true';
                                if (typeof instanceCache[name] !== 'boolean') {
                                    instanceCache[name] = (instanceCache[name] !== undefined) && JSON.parse(instanceCache[name]);
                                }
                                break;

                            case 'tags_input':
                                instanceCache[name] = instanceCache[name] || item.defaultValue || '';

                                if (typeof instanceCache[name] !== 'string') {
                                    instanceCache[name] = JSON.stringify(instanceCache[name]);
                                }
                                break;

                            case 'multiple_select':
                                //转化成数组

                                instanceCache[name] = instanceCache[name] || item.defaultValue;
                                if (!$.isArray(instanceCache[name])) {
                                    instanceCache[name] = (instanceCache[name] && instanceCache[name].split(item.separator || ' ')) || [];
                                }
                                break;
                            case 'comboTree':

                                if((item.dataType==='handler'||item.dataType==='function')&& item.defaultValue && !(/null/i.test(item.defaultValue))){
                                       instanceCache['jsValue_'+name]=instanceCache['jsValue_'+name]||item.defaultValue||'function(){}';
                                       instanceCache[name]=(instanceCache[name]==='')? '':(instanceCache[name]||'jsEditor');
                                }
                                break;
                            default:
                                if (item.direction === 'request' || isResponseData(item)) {
                                    instanceCache[name] = instanceCache[name] || {};
                                    instanceCache[name].id = instanceCache[name].id || ++baseEventAccumulator;
                                    instanceCache[name].name = instanceCache[name].name || ('传输字段' + (++baseEventAccumulator));
                                    instanceCache[name].url = instanceCache[name].url || (extrasCache && '##' + extrasCache.widgetID + '_URL_' + instanceCache[name].id + '##');
                                } else {
                                    if (!item['switch']) {

                                        // debugger;
                                        switch (item.formatter) {
                                            case 'replace':

                                                // ++AUI.data.eventAccumulator;
                                                //;
                                                if ((extrasCache && !extrasCache.noreplace) || !extrasCache) {
                                                    if (instanceCache[name]!==undefined) {
                                                        switch (item.idUniqueSpace) {
                                                            case 'widget':
                                                                if (extrasCache && extrasCache.widgetID) {
                                                                    eventAccumulatorMap[extrasCache.widgetID][instanceCache[name]] = true;
                                                                    eventAccumulatorMap[instanceCache[name]] = true;
                                                                }
                                                                break;

                                                            default:
                                                                eventAccumulatorMap[instanceCache[name]] = true;
                                                                break;
                                                        }
                                                        instanceCache[name] = instanceCache[name];
                                                        if (typeof instanceCache[name] === 'string') {
                                                            if (instanceCache[name].indexOf(item.desp) !== -1) {
                                                                extrasCache && extrasCache.arrayValue && (extrasCache.arrayValue.active = false);
                                                            }
                                                        }
                                                    } else {

                                                        switch (item.idUniqueSpace) {

                                                            case 'widget':
                                                                if (extrasCache && extrasCache.widgetID) {
                                                                    while (eventAccumulator in eventAccumulatorMap[extrasCache.widgetID]) {
                                                                        eventAccumulator++;
                                                                    }
                                                                }
                                                                break;

                                                            default:
                                                                while (eventAccumulator in eventAccumulatorMap) {
                                                                    eventAccumulator++;
                                                                }
                                                                break;
                                                        }
                                                        instanceCache[name] = item.defaultValue
                                                            .replace(REGEX.WIDGET.NAME, item.desp)
                                                            .replace(REGEX.WIDGET.INDEX, eventAccumulator + 1)
                                                            .replace(REGEX.FOREIGN_WIDGET.FOREIGN_WIDGET_SPILT, item.name);
                                                        baseEventAccumulator = eventAccumulator + 2;
                                                    }


                                                } else {
                                                    instanceCache[name] = instanceCache[name] || '';
                                                }

                                                break;

                                            case 'replaceWithFunction':
                                                instanceCache[name] = instanceCache[name] || AUI.transformForeignKey(item.defaultValue, extrasCache.widgetID);
                                                break;

                                            case 'selector':
                                                if (extrasCache) {
                                                    instanceCache[name] = item.defaultValue
                                                        .replace(REGEX.WIDGET.NAME, extrasCache.name)
                                                        .replace(REGEX.WIDGET.INDEX, extrasCache.order || '');
                                                } else {
                                                    instanceCache[name] = '';
                                                }
                                                break;

                                            default:
                                                if (name === 'appJsCode') {
                                                    //对appJsCode进行特殊处理
                                                    instanceCache[name] = instanceCache[name] && instanceCache[name].toString();
                                                    if (instanceCache[name]) {
                                                        if (instanceCache[name].indexOf('app.') !== 0) {
                                                            instanceCache[name] = 'app.' + instanceCache.name + '=' + instanceCache[name];
                                                        }

                                                        if ((instanceCache.belongTo === 'class' || instanceCache.belongTo === 'closure')
                                                            && instanceCache[name].substr(-2, 2) !== '()' && instanceCache[name].substr(-3, 3) !== '();') {
                                                            instanceCache[name] = instanceCache[name] + '()';
                                                        }
                                                    }
                                                } else {
                                                    if (!(typeof instanceCache[name] in {
                                                            'undefined': true,
                                                            'string': true
                                                        }) && !item.keepFormat) {
                                                        temp = JSON.stringify(instanceCache[name]);
                                                    } else {
                                                        temp = instanceCache[name] || getDefaultValue(instanceCache, item);
                                                    }
                                                    instanceCache[name] = (instanceCache[name] === '' ? '' : temp);


                                                }

                                                break;
                                        }


                                    }
                                }

                                if (typeof instanceCache[name] === 'string') {
                                    instanceCache[name] = instanceCache[name].replace(REGEX.WIDGET.ID, instanceCache.id || '');
                                }
                                break;
                        }
                    });
                }
            }

            return instance;
        } //end initInstance



        function initWidget(objArray) {
            var cache, cursor = -1,
                item, valueArrayCache = [],
                despArrayCache = [],
                caches = $.extend([], objArray),
                ifCache, name, type, desp,
                i, len,
                //handler 专用变量
                validateList;
                // validateListRequire = {
                //     code: [CONST.EVENT.HANDLER.AJAX]
                // },
                // responseDataRequire = {
                //     code: [CONST.EVENT.HANDLER.AJAX]
                // }

            function getOptionsFromRoleDB(db) {
                var valueArray = [],
                    despArray = [];
                db().each(function (obj, index) {
                    valueArray.push(obj["data-authority"]);
                    despArray.push(obj.name);
                });
                return {
                    valueArray: valueArray,
                    despArray: despArray
                };
            }

            function getCodeGroup() {
                var group = [{
                    label: '组件内部接口',
                    valueArray: [],
                    despArray: []
                }, {
                    label: '组件外部接口',
                    valueArray: [],
                    despArray: []
                }];

                $.each(AUI.data.eventHandlerList, function (index, value) {
                    if (value.code) {
                        if (value.widgetID === AUI.currentWidgetID) {
                            group[0].despArray.push(value.desp);
                            group[0].valueArray.push(value.code);
                        } else {
                            group[1].despArray.push(value.desp);
                            group[1].valueArray.push(value.code);
                        }
                    }

                    // if (value.code && value.deps === 'ajax') {
                    //     validateListRequire.code.push(value.code);
                    // }

                    // if (value.code && value.code === CONST.EVENT.HANDLER.AJAX) {
                    //     responseDataRequire.code.push(value.code);
                    // }
                });
                return group;
            }

            while (cache = caches[++cursor]) {
                item = cache;

                // item.name = item.name && item.name.replace(/#/g, '');

                name = item.name;
                type = item.type;
                desp = item.desp;

                switch (type) {
                    case 'tab':
                        caches = caches.concat(item.tabPanes);
                        break;

                    case 'object':
                        if ($.isArray(item.attr)) {
                            caches = caches.concat(item.attr);
                        }

                        break;

                    case 'edmCollection':
                    case 'array':
                        if ($.isArray(item.attrInEachElement)) {
                            caches = caches.concat(item.attrInEachElement);
                        }
                        break;

                    case 'string_select_editable':
                    case 'tags_input':
                        item.type = 'string_input';
                        break;

                    case 'string_select':
                        item.defaultValue = item.defaultValue && item.defaultValue.toString();
                        if (item.valueArray) {
                            for (i = 0, len = item.valueArray.length; i < len; i++) {
                                item.valueArray[i] = item.valueArray[i] !== undefined && item.valueArray[i].toString();
                            }
                        }
                        if (item.despArray) {
                            for (i = 0, len = item.despArray.length; i < len; i++) {
                                item.despArray[i] = item.despArray[i] !== undefined && item.despArray[i].toString();
                            }
                        }

                        break;

                    case 'pageFlow':
                    case 'icon':
                    case 'string_with_placeholder':
                    case 'string_simpleHtml':
                    case 'string_html':
                    case 'template_html':

                        item.type = 'configure_modal';
                        item.spanType = type;
                        break;

                    case 'configure_modal':
                        if (!item.spanType) {//第二次配置时，类型被覆盖
                            item.spanType = 'modalType';
                        }

                        break;
                    case 'file':
                        item.spanType = type;
                        break;

                    // case 'string_simpleHtml':
                    case 'string_html':
                    case 'template_html':
                        item.type = 'directive_div';
                        item.divType = type;
                        break;

                    case 'comboTree':
                        item.type = 'directive_input';
                        item.inputType = type;

                        break;

                    default:

                        if (name === 'data-authority') {
                            item.valueArray = getOptionsFromRoleDB(AUI.data.role).valueArray;
                            item.despArray = getOptionsFromRoleDB(AUI.data.role).despArray;
                        }

                        if (item.showComponentHref) {
                            AUI.data.menu().each(function (value, index) {
                                valueArrayCache.push(value.href);
                                despArrayCache.push(value.name + '(' + value.href + ')');
                            });

                            item.valueArray = valueArrayCache;
                            item.despArray = despArrayCache;
                        }

                        if (item.componentType) {
                            $.each(AUI.data.menu([{
                                category: item.componentType
                            }, {
                                pType: item.componentType
                            }]).get(), function (index, value) {
                                valueArrayCache.push(value.type);
                                despArrayCache.push(value.name);
                            });

                            item.valueArray = valueArrayCache;
                            item.despArray = despArrayCache;
                        }

                        if (item.getInterface) {
                            (function () {
                                var group = [],
                                    oWidget = $AW(AUI.currentWidgetID),
                                    widget = oWidget.option();

                                function getStandardCode(code) {
                                    return code.match(/([^.]+)$/)[0];
                                }

                                function addGroup(type) {
                                    var temp = {
                                        label: '',
                                        valueArray: [],
                                        despArray: []
                                    };


                                    switch (type) {
                                        case 'action':
                                            if ($.isArray(widget.action)) {
                                                temp.label = '生命周期';
                                                $.each(widget.action, function (index, value) {
                                                    temp.valueArray.push(getStandardCode(value.code));
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'handler':
                                            if (widget.event && $.isArray(widget.event.handler)) {
                                                temp.label = '事件句柄';
                                                $.each(widget.event.handler, function (index, value) {
                                                    temp.valueArray.push(value.value);
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'getter':
                                            if (widget.edm && $.isArray(widget.edm.get)) {
                                                temp.label = 'getter';
                                                $.each(widget.edm.get, function (index, value) {
                                                    temp.valueArray.push(getStandardCode(value.value));
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'setter':
                                            if (widget.edm && $.isArray(widget.edm.set)) {
                                                temp.label = 'setter';
                                                $.each(widget.edm.set, function (index, value) {
                                                    temp.valueArray.push(getStandardCode(value.value));
                                                    temp.despArray.push(value.desp);
                                                });
                                            }
                                            break;

                                        case 'callback':
                                            if (widget.callback) {
                                                temp.label = '组件接口';
                                                /*if (widget.callback.config) {
                                                 temp.valueArray.push(widget.callback.config.toString());
                                                 temp.despArray.push('组件编辑阶段接口');
                                                 }*/
                                                if (widget.callback.render) {
                                                    temp.valueArray.push(widget.callback.render.toString());
                                                    temp.despArray.push('组件预览阶段接口');
                                                }
                                            }
                                            break;
                                    }
                                    temp.valueArray.length > 0 && group.push(temp);
                                }

                                addGroup('action');
                                addGroup('handler');
                                addGroup('getter');
                                addGroup('setter');
                                addGroup('callback');

                                item.group = group;

                                item.valueArray = [''];
                                item.despArray = ['无'];
                            })()
                        }
                        break;
                }

            }
            return objArray;
        }

        function updateWidgetOption(oWidget, widgetInstance, newOption, modelSelector, widgetSelector, valueChangeKey, newValue) {

            oWidget.update({
                optionCopy: widgetInstance.optionCopy,
                option: newOption
            });

            refreshWidget(oWidget, modelSelector, widgetSelector, valueChangeKey, newValue);

            // if (oWidget[0].widget.jsEditor === 'option') {
            //     getJsEditor().setValue(AUI.getParsedString(UglifyJS.parse('(' + JSON.stringify(oWidget.option()) + ')')));
            // }


        }

        function updateObj(instanceObj, modelSelector, newValue, updateCallback, baseArray) {
            var modelSelectorArr = modelSelector.split('---'),
                widgetSelectorArr, widgetSelector,
                key = modelSelectorArr[modelSelectorArr.length - 1];

            modelSelectorArr[0] = 'instanceObj';
            modelSelectorArr = modelSelectorArr.map(function (item, index) {
                return (index === 0) ? item : "['" + item + "']";
            });

            if (typeof newValue === 'string') {
                newValue = newValue.trim();
            }

            if (typeof baseArray === 'string') {
                //baseArray is widgetSelector

                widgetSelector = baseArray;
                widgetSelectorArr = widgetSelector.split('---');
                widgetSelectorArr[0] = 'array';
                widgetSelectorArr = widgetSelectorArr.map(function (item, index) {
                    return (index === 0) ? item : "['" + item + "']";
                });
            }

            eval(modelSelectorArr.join('') + '=newValue');

            // worker.postMessage(JSON.stringify({
            //     obj: instanceObj,
            //     objArray: (updateCallback && updateCallback.baseArray) || baseArray
            // }));


            updateCallback && updateCallback({
                newObjCopy: instanceObj,
                newObj: getCleanedOption(instanceObj, (updateCallback && updateCallback.baseArray) || baseArray),
                key: key,
                newValue: newValue,
                oldValue: updateCallback.oldValue,
                modelSelector: modelSelectorArr.join(''),
                widgetSelector: widgetSelectorArr && widgetSelectorArr.join('')
            });
            // worker.onmessage = function(e) {
            //     var data = e.data;

            //     updateCallback && updateCallback({
            //         newObjCopy: instanceObj,
            //         newObj: JSON.parse(data),
            //         key: key,
            //         newValue: newValue,
            //         oldValue: updateCallback.oldValue,
            //         modelSelector: modelSelectorArr.join(''),
            //         widgetSelector: widgetSelectorArr && widgetSelectorArr.join('')
            //     });
            // }
        }

        function baseConfig(contextID, baseObj, baseArray, updateCallback, isCopy) {
            var contextMainID = contextID + 'Main';

            baseArray = baseArray || [];

            //add another div to avoid unexpected dom render failure
            $('#' + contextID).empty().append('<div id="' + contextMainID + '"></div>');

            //destroy previous exisisting vue instance
            vueManage[contextID] && vueManage[contextID].$destroy();

            //pre processing array and obj
            !isCopy && baseConfigInitInstance(baseObj, baseArray);

            //attach baseArray in updateCallback
            updateCallback && (updateCallback.baseArray = JSON.parse(JSON.stringify(baseArray)));

            initWidget(baseArray);

            vueManage[contextID] = new Vue({
                el: '#' + contextMainID,
                template: [
                    '<div>',
                    // '<spin fix v-if="spinShow"></spin>',
                    '<base-config  v-if="showOption" class="aui-config-ctn" :arraySelector="arraySelector" :objSelector="objSelector" :handler="handler" :array="array" :obj="obj"></base-config>',
                    '</div>'
                ].join(''),

                //hook
                mounted: function () {
                    this.showOption = true;
                },

                data: function () {
                    return {
                        //model responsive data
                        array: JSON.parse(JSON.stringify(baseArray)),
                        obj: JSON.parse(JSON.stringify(baseObj)),

                        //model selector
                        objSelector: contextID,
                        arraySelector: 'array',

                        //model display control
                        spinShow: true,
                        showOption: false,

                        //handlers
                        handler: {
                            showNextLevel: false,

                            handleValidate: function ($event, item) {
                                var validateObj = item.validate,
                                    $el = $($event.target);
                                if (validateObj.errorMessage) {
                                    $el.tooltips({

                                        animation: false,
                                        html: true,
                                        placement: function (ui) {
                                            var event = window.event,
                                                $ui = $(ui);

                                            $ui.addClass('hidden');
                                            requestAnimationFrame(function () {
                                                var $body = $('body');
                                                //console.log($ui);
                                                $body.children('.tooltip').not($ui).remove();
                                                $ui.css(app.position(event, $body, $ui, -10, -20)).removeClass('hidden');

                                            }, 16);

                                            return 'bottom';
                                        },
                                        title: function () {
                                            return '<p style="color:red;padding-left:8px;margin-top:6px;">错误提示:' + validateObj.errorMessage + '</p>';
                                        },
                                        trigger: 'hover',
                                        container: 'body',
                                        size: 'small'
                                    })
                                }

                            },

                            validate: function (context) {
                                var type;
                                if (context.currentValue && context.validateObj && context.validateObj.type) {

                                    AUI.validateInput(context.currentValue, {
                                        type: context.validateObj.type,
                                        errorMessage: context.validateObj.errorMessage
                                    }, function () {
                                        context.validateDanger = true;
                                    }, function () {
                                        context.validateDanger = false;
                                    });
                                }
                            },

                            getHeaderValue: function (value) {
                                if (typeof value === 'string') {
                                    return value;
                                } else {
                                    return false;
                                }
                            }
                            ,

                            getHeader: function (item, instanceItem, index, emdObj) {
                                var getHeaderValue = vueManage[contextID].handler.getHeaderValue,
                                    keys, name = '';

                                if (emdObj && (keys = emdObj.keys)) {
                                    name=keys[index-1]?'('+keys[index-1]+')':'';
                                }


                                return ((item.edmKey && instanceItem[item.edmKey]) ||
                                    (item.titleKey && instanceItem[item.titleKey]) || getHeaderValue(instanceItem.desp)
                                    || getHeaderValue(instanceItem.name)
                                    || getHeaderValue(instanceItem[item.attrInEachElement[0].name])
                                    || getHeaderValue(item.desp + index) ) + name;
                            },

                            tabClicked: function (name, id) {

                            }
                            ,

                            panelCreated: function (panelInstance, optionItem) {
                                if (optionItem && optionItem.expand) {
                                    Vue.set(vueManage[contextID].handler, panelInstance.name, true);
                                } else {
                                    Vue.set(vueManage[contextID].handler, panelInstance.name, false);
                                    // vueManage[contextID].handler[name] = false;

                                    if (optionItem && optionItem.isRequire) {
                                        requirePanelList.push(panelInstance);
                                    }
                                }
                            }
                            ,


                            panelChange: function () {

                            },

                            handleChange: function (args) {
                                var item = args.item,
                                    obj = args.obj,
                                    val = args.val,
                                    oldVal = args.oldVal;

                                switch (args.type) {
                                    /* 	case 'edm':

                                     break; */

                                    default:
                                        if (item && item.formatter === 'replace') {
                                            switch (item.idUniqueSpace) {
                                                case 'widget':
                                                    if (AUI && AUI.currentWidgetID) {
                                                        eventAccumulatorMap[AUI.currentWidgetID][oldVal] = false;
                                                        eventAccumulatorMap[oldVal] = false;

                                                        eventAccumulatorMap[AUI.currentWidgetID][val] = true;
                                                        eventAccumulatorMap[val] = true;
                                                    }

                                                    break;

                                                default:
                                                    eventAccumulatorMap[oldVal] = false;
                                                    eventAccumulatorMap[val] = true;

                                                    break;
                                            }
                                        }

                                        updateCallback && (updateCallback.oldValue = oldVal);
                                        updateObj(baseObj, args.modelSelector, (val === undefined ? val : JSON.parse(JSON.stringify(val))), updateCallback, args.arraySelector);

                                        //处理可以配置事件的配置项
                                        if (args.arraySelector) {
                                            (function () {
                                                var arraySelector = args.arraySelector.split('---'),
                                                    fatherConfig,
                                                    modelSelector = args.modelSelector.split('---');

                                                try {
                                                    arraySelector.pop();
                                                    arraySelector.pop();

                                                    arraySelector = arraySelector.map(function (item) {
                                                        return '["' + item + '"]';
                                                    });

                                                    fatherConfig = eval('vueManage[contextID]' + arraySelector.join(''));

                                                    if (fatherConfig.hasEvent) {
                                                        modelSelector.pop();
                                                        modelSelector.pop();
                                                        modelSelector.shift();

                                                        modelSelector = modelSelector.map(function (item) {
                                                            return '["' + item + '"]';
                                                        });

                                                        AUI.eventSelectorUpdate(AUI.currentWidgetID, JSON.parse(JSON.stringify(eval('vueManage[contextID].obj' + modelSelector.join('')))));
                                                    }

                                                } catch (e) {

                                                }
                                            })();
                                        }
                                        break;
                                }
                            },

                            handleFileChange: function (event, args) {
                                var el = event.target,
                                    file = el.files[0],
                                    reader = new FileReader();

                                reader.onload = function (event) {
                                    external.getImageUrl(event.target.result, function (url) {

                                        // external.copyFile({
                                        //     source: url,
                                        //     target: url.replace('WebContent', 'WebRoot')
                                        // }, function () {
                                        //
                                        // }, function () {
                                        //     // debugger
                                        // });

                                        args.obj[args.name] = url;
                                    });
                                };
                                try {
                                    reader.readAsDataURL(file);
                                } catch (e) {
                                }
                            },

                            edmSorted: function (edmObj, modelSelector) {
                                var obj = JSON.parse(JSON.stringify(edmObj));
                                obj.elements.shift();

                                AUI.edmUpdateOrderNew(obj);

                            },

                            panelOpen: function (event, args) {
                                var args = args || {},
                                    keys = event.keys,
                                    panelInstance = event.panelInstance,
                                    optionItem = args.optionItem,
                                    i, len,
                                    newRequireAttr,
                                    newRequireObj,
                                    newItemValue;

                                Vue.set(vueManage[contextID].handler, keys[0], true);
                                //add require attr
                                if (optionItem && optionItem.isRequire) {
                                    //toggle all require panel instance
                                    for (i = 0, len = requirePanelList.length; i < len; i++) {
                                        if (requirePanelList[i].name !== keys[0]) {
                                            if (requirePanelList[i].isActive) {
                                                requirePanelList[i].close();
                                            }
                                        }
                                    }

                                    //add require attr
                                    newRequireAttr = getRequireAttrFormVueArgs(args);
                                    newRequireObj = baseConfigInitInstance(JSON.parse(JSON.stringify(args.obj.require)), newRequireAttr, {});

                                    for (i in newRequireObj) {
                                        if (Array.isArray(args.obj.require[i]) &&
                                            Array.isArray(newRequireObj[i]) &&
                                            !args.obj.require[i].length &&
                                            !newRequireObj[i].length
                                        ) {

                                        } else {
                                            args.obj.require[i] = newRequireObj[i];
                                        }
                                    }
                                    // args.obj.require = newRequireObj;
                                    // console.log(optionItem)
                                    setTimeout(function () {
                                        Vue.set(optionItem, 'attr', newRequireAttr);
                                    }, 0)
                                }
                            },

                            addBlock: function (event, args) {
                                var array = args.array,
                                    obj = args.obj,
                                    item = args.item,
                                    instanceArr = args.instanceArr,
                                    instanceArrCopy,
                                    arrLength;

                                if (item.attrInEachElement === 'self') {
                                    item.attrInEachElement = JSON.parse(JSON.stringify(array));
                                }


                                if (($.isArray(instanceArr) && !instanceArr.length) || !instanceArr) {
                                    // obj[item.name] = [{}];
                                //    instanceArr = [{active: true}];
                                    instanceArr = [{
                                        active: true
                                    }];
                                    vueManage[contextID].$set(obj, item.name, instanceArr);
                                    updateObj(baseObj, args.modelSelector, [{
                                        active: true
                                    }], updateCallback);
                                }

                                instanceArr.push(baseConfigInitInstance({
                                    active: true
                                }, JSON.parse(JSON.stringify(item.attrInEachElement || [])), {
                                    name: instanceArr[0].name,
                                    order: instanceArr.length
                                }));

                                if (item.hasEvent) {
                                    instanceArr[instanceArr.length - 1].uuid = app.getUID();
                                    AUI.eventSelectorUpdate(AUI.currentWidgetID, JSON.parse(JSON.stringify(instanceArr)));
                                    updateObj(baseObj, args.modelSelector, JSON.parse(JSON.stringify(instanceArr)), updateCallback);
                                } else {
                                    arrLength = instanceArr.length;
                                    updateObj(baseObj, args.modelSelector + '---' + (arrLength - 1), JSON.parse(JSON.stringify(instanceArr[arrLength - 1])), updateCallback);
                                }
                            },

                            delBlock: function (event, item, modelSelector, edmCollectionObj) {
                                item.active = false;

                                if (edmCollectionObj) {
                                    AUI.edmDelete(edmCollectionObj.edmID, item.edmItemId);
                                }

                                updateObj(baseObj, modelSelector + '---active', false, updateCallback);
                            },

                            showModal: function (event, args) {
                                var $el = $(event.target || event.srcElement),
                                    obj = args.obj,
                                    option = JSON.parse(JSON.stringify(args.option)),
                                    name = args.name,

                                    oldValue, newValue, iconList = [];

                                function getIconListHtml(iconList) {
                                    var result = ['<div class="aui-iconList-icons-wrapper"><ul class="aui-iconList-icon-list md clearfix">'];
                                    $.each(iconList, function (index, iconItem) {
                                        var i, len, namespace = iconItem.namespace,
                                            iconArr = iconItem.iconArr;
                                        if (iconArr) {
                                            for (i = 0, len = iconArr.length; i < len; i++) {

                                                result.push('<li class="icon-wrapper" data-value="_value_" title="_value_"><i class="_namespace_ _value_" aria-hidden="true"></i><span class="icon-name"><span>_name_</span></span></li>'.replace(/_value_/g, iconArr[i].value).replace(/_name_/g, iconArr[i].name).replace(/_namespace_/g, namespace));
                                            }
                                        }

                                    });
                                    result.push('</ul></div>');
                                    return result.join('');
                                }

                                switch (option.spanType) {
                                    case 'icon':
                                        app.popover({
                                            $elem: $el,
                                            title: '配置' + option.desp,
                                            content: '',
                                            width: '60%',
                                            height: '80%',
                                            init: function (popInstance) {

                                                var $popoverBody = $(this).find('.aweb-popover-body'),
                                                    i, len, iconArr = AUI.data.viewer.iconArr;

                                                // iconList = Icon.concat(JSON.parse(UglifyJS.parse(AUI.data.viewer.iconArr).print_to_string().replace(/\b(name|value)\b/g,'"$1"').replace(';', '')))

                                                if (iconArr && iconArr.length > 0) {
                                                    for (i = 0, len = iconArr.length; i < len; i++) {
                                                        iconList.push({
                                                            namespace: iconArr[i].namespace,
                                                            iconArr: iconArr[i].code && JSON.parse(iconArr[i].code.replace(/\b(name|value)\b/g, '"$1"').replace(';', ''))
                                                        })
                                                    }
                                                }

                                                $popoverBody.addClass('aui-iconList-ctn').append('<div class="aui-iconList-header clearfix"><div class="aui-aside-search-bar-ctt"><i class="aui aui-sousuo"></i><input type="text" class="aui-search-query aui-iconList-searcher" placeholder="搜索图标"></div><div class="aui-iconList-sizeToggler"><button id="bigSize" class="toggle-btn ">大</button><button id="mediumSize" class="toggle-btn active">中</button><button id="smallSize" class="toggle-btn  ">小</button></div></div>').append(getIconListHtml(iconList));

                                                $popoverBody.on({
                                                    'click.auiConfigure': function (e) {
                                                        var el = e.target || e.srcElement,
                                                            $el = $(el),
                                                            $iconWrapper = $el.closest('.icon-wrapper');

                                                        newValue = $iconWrapper.find('[aria-hidden="true"]').attr('class');

                                                        if ($iconWrapper.length) {

                                                            popInstance.close();
                                                        }
                                                    }
                                                });

                                                $popoverBody.find('.aui-iconList-searcher').off('keyup.auiConfigure').on({
                                                    'keyup.auiConfigure': function (e) {
                                                        var el = e.target || e.srcElement,
                                                            $el = $(el),
                                                            value = $el.val();

                                                        $popoverBody.find('.icon-wrapper').each(function () {
                                                            var $this = $(this);

                                                            if ($this.attr('data-value').toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                                                                $this.show();
                                                            } else {
                                                                $this.hide();
                                                            }
                                                        });
                                                    }
                                                });

                                                $popoverBody.find('.aui-iconList-sizeToggler')
                                                    .on('click.auiConfigure', function (e) {
                                                        var el = e.target || e.srcElement,
                                                            $el = $(el),
                                                            $iconList = $popoverBody.find('.aui-iconList-icon-list');
                                                        $el.addClass('active');
                                                        $el.siblings().removeClass('active');

                                                        switch ($el.attr('id')) {
                                                            case 'smallSize':
                                                                $iconList.addClass('sm');
                                                                $iconList.removeClass('md');
                                                                break;
                                                            case 'mediumSize':
                                                                $iconList.addClass('md');
                                                                $iconList.removeClass('sm');
                                                                break;
                                                            default:
                                                                $iconList.removeClass('md').removeClass('sm');
                                                        }

                                                    });
                                            },
                                            confirmHandler: function (popInstance) {
                                                if (newValue) {
                                                    obj[name] = newValue;
                                                }
                                            }
                                        });

                                        break;

                                    case 'pageFlow':
                                        (function () {
                                            var $tree = $('<div><ul class="ztree" id="tree"><li>ABC</li></ul></div>'),
                                                treeObj,
                                                newValue;

                                            require(['zTree'], function () {
                                                app.popover({
                                                    $elem: $el,
                                                    title: '配置' + option.desp,
                                                    content: $tree.html(),
                                                    width: '60%',
                                                    height: '80%',
                                                    init: function (popInstance) {
                                                        treeObj = $.fn.zTree.init(
                                                            $(this).find('#tree'), {
                                                                check: {
                                                                    enable: true,
                                                                    radioType: 'all',
                                                                    chkStyle: 'radio'
                                                                },
                                                                callback: {
                                                                    onCheck: function () {
                                                                        popInstance.close()
                                                                    }
                                                                },
                                                                data: {
                                                                    simpleData: {
                                                                        enable: true
                                                                    }
                                                                }
                                                            }, AUI.data.pageFlow);


                                                    },
                                                    confirmHandler: function (popInstance) {
                                                        if (treeObj && treeObj.getCheckedNodes().length) {
                                                            newValue = treeObj.getCheckedNodes()[0].path;
                                                            obj[name] = newValue;
                                                        }
                                                    }
                                                });
                                            })
                                        })();
                                        break;

                                    case 'string_with_placeholder':
                                        (function () {
                                            var newValue, oldValue, $input;
                                            app.popover({
                                                $elem: $el,
                                                title: '配置' + option.desp,
                                                content: '',
                                                init: function () {
                                                    var $popoverBody = $(this).find('.aweb-popover-body');
                                                    $popoverBody.css({'padding': '5px'});
                                                    option.value = obj[name];


                                                    $popoverBody.append(artTemplate('string_with_placeholder', option));

                                                    $input = $popoverBody.find('input');
                                                    $popoverBody.on({
                                                        'click.auiConfigure': function (e) {
                                                            var el = e.target || e.srcElement,
                                                                $el = $(el);

                                                            if ($el.hasClass(BASE_CONST.TEXT_TAG_ITEM)) {
                                                                $input.val($input.val() + $el.attr('data-tag-value'));
                                                            }
                                                        }
                                                    });

                                                    $input.on({
                                                        'keyup.auiConfigure': function (e) {
                                                            var el = e.target || e.srcElement,
                                                                $el = $(el),
                                                                value = $el.val();

                                                            $input.append(AUI.transformForeignKey())
                                                        }
                                                    })
                                                },
                                                confirmHandler: function () {
                                                    newValue = $input.val();

                                                    if (newValue !== oldValue) {
                                                        obj[name] = newValue;
                                                    }
                                                },
                                                height: '80%',
                                                width: '50%'
                                            });
                                        })();
                                        break;
                                    case 'string_simpleHtml':

                                        (function () {
                                            var editor,
                                                name = args.name,
                                                popoverOption = {
                                                    $elem: $el,
                                                    title: option.desp + (option.info ? '(' + option.info + ')' : ''),
                                                    content: '',
                                                    width: '50%',
                                                    height: '100%',
                                                    focusable: (typeof option.focusable !== 'undefined') ? option.focusable : 'true',
                                                    init: function () {
                                                        var $popoverBody = $(this).find('.aweb-popover-body').empty();
                                                        $popoverBody.css({'padding': '0'});
                                                        editor = vscode.create(
                                                            $popoverBody, {
                                                                value: obj[name],
                                                                language: option.language || 'html'
                                                            });

                                                        $(this).on('screenChange', function () {
                                                            editor.layout();
                                                        })

                                                    },
                                                    confirmHandler: function () {
                                                        var value = editor.getValue();
                                                        if (value !== undefined) {
                                                            obj[name] = value;
                                                        }

                                                    }
                                                };

                                            if (name === 'cssCode') {
                                                popoverOption['on'] = {
                                                    preview: {
                                                        btnName: 'preview',
                                                        icon: 'aui aui-yunhang',
                                                        title: '预览',
                                                        callback: function (e, context) {
                                                            obj[name] = editor.getValue();

                                                            $AW.trigger($AW.STATUS.CSS_CODE_UPDATE);

                                                        }
                                                    }
                                                };
                                            }

                                            app.popover(popoverOption);
                                        })();
                                        break;
                                    case 'string_html':

                                        (function () {
                                            var editor,
                                                name = args.name;

                                            app.popover({
                                                $elem: $el,
                                                title: option.desp,
                                                content: '',
                                                width: '50%',
                                                height: '80%',
                                                init: function (popInstance) {
                                                    var $popoverBody, $div, that = this;

                                                    popInstance.options.focusable = false;

                                                    $(document).on('click.wangEditorInPop', function (e) {
                                                        if ($(e.target).closest('.aweb-popover').length === 0) {
                                                            if (!$(e.target).is($el)) {
                                                                popInstance.close();
                                                            }
                                                        }
                                                    });

                                                    $popoverBody = $(this).find('.aweb-popover-content').append('<div id="popover4wangEditor"></div>'),
                                                        $div = $popoverBody.find('#popover4wangEditor');

                                                    app.shelter.show('正在加载,请稍候...', true);

                                                    require(['wangEditor', 'requireCss'], function (wang, requireCss) {
                                                        require(['requireCss!./dependence/wangEditor/css/wangEditor.css']);
                                                        var popoverContainer, editorMaxHeight, editorMinHeight,
                                                            editorCss, editorTextHeight;

                                                        editor = new wangEditor($div);
                                                        // 移除『全屏』fullscreen 菜单项：
                                                        editor.config.menus = $.map(wangEditor.config.menus, function (item, key) {

                                                            if (item === 'fullscreen') {
                                                                return null;
                                                            }
                                                            return item;
                                                        });

                                                        editor.create();
                                                        $('#popover4wangEditor', $popoverBody).attr('style', 'height:100%;');

                                                        function _fixEditorHeight() {

                                                            popoverContainer = editor.$parent.parent(),
                                                                editorMaxHeight = popoverContainer.css('maxHeight'),
                                                                editorMinHeight = popoverContainer.css('minHeight'),

                                                                editorCss = {
                                                                    maxHeight: editorMaxHeight,
                                                                    minHeight: editorMinHeight,
                                                                    borderColor: 'transparent'
                                                                };

                                                            $('.wangEditor-container', $popoverBody).css(editorCss);
                                                        }

                                                        function _fixEditorTextHeight() {
                                                            editorTextHeight = (parseFloat(editorMaxHeight) - $('.wangEditor-menu-container', $popoverBody).height() - 7);

                                                            $('.wangEditor-txt', $popoverBody).css({'height': editorTextHeight + "px"});
                                                        }

                                                        _fixEditorHeight();

                                                        editor.$txt.html(obj[name]);
                                                        app.shelter.hide();

                                                        _fixEditorTextHeight();

                                                        // 监听 screenChange 事件，让全屏的时候尺寸自动变化。
                                                        // screenChange 事件需要解绑
                                                        $(that).on('screenChange', function () {
                                                            _fixEditorHeight();
                                                            _fixEditorTextHeight();
                                                        })

                                                    });


                                                },
                                                confirmHandler: function () {
                                                    $(document).off('click.wangEditorInPop');
                                                    if (editor && editor.$txt) {
                                                        obj[name] = editor.$txt.html();
                                                    }

                                                    // app.alert('保存文本成功',app.alert.SUCCESS);
                                                },

                                            });
                                        })();

                                        break;

                                    case 'template_html':
                                        (function () {
                                            var editor,
                                                name = args.name;

                                            app.popover({
                                                $elem: $el,
                                                title: option.desp,
                                                content: '',
                                                width: '50%',
                                                height: '80%',
                                                init: function (popInstance) {
                                                    var $popoverBody = $(this).find('.aweb-popover-body').empty();


                                                    editor = vscode.create(
                                                        $popoverBody, {
                                                            value: obj[name],
                                                            language: 'html'
                                                        });

                                                    $(this).on('screenChange', function () {
                                                        editor.layout();
                                                    })


                                                },
                                                confirmHandler: function () {
                                                    var value = editor.getValue();
                                                    if (value !== undefined) {
                                                        obj[name] = value;
                                                    }
                                                }

                                            });
                                        })();
                                        break;
                                }
                            } //end show modal/popover
                        } // end handler definition
                    };
                }
            });

            return vueManage[contextID];

        }

        function baseConfigInitConfigPage($context, widgetInstance, widget, setTabVisible, noRefresh) {
            var contextID = $context.attr('id'),
                widgetID = widgetInstance.widgetID,
                oWidget = $AW(widgetID),
                widget = oWidget[0].widget,
                attrID = contextID + 'Attr',
                optionID = contextID + 'Option',
                attrVueInstance,
                $contextMain = $('<div id="' + attrID + '"></div>' +
                    '<div id="' + optionID + '"></div>');


            $context.prepend($contextMain);


            setTabVisible && setTabVisible($context.index(), true);


            if (widget.option && widget.option.length > 0) {
                baseConfig(optionID, widgetInstance.optionCopy, widget.option, function (args) {
                    if (!noRefresh) {
                        updateWidgetOption(oWidget, widgetInstance, args.newObj, args.modelSelector || 'first', args.widgetSelector, args.key, args.newValue);
                    }
                }, true);
            }
        } //end init page

        //将JSON对象转化为JavaScript的合法对象
        function parseJSObject(obj) {
            var name, value, cache, cursor = -1,
                caches = [obj];

            while (cache = caches[++cursor]) {
                for (name in cache) {
                    if (typeof (cache[name]) === 'string') {
                        if (cache[name].indexOf('_parseObject_') === 0) {
                            cache[name] = JSON.parse(cache[name].replace(/_parseObject_/, ''));
                        } else {
                            try {
                                value = cache[name].replace(/'/g, '"');
                                // value = cache[name];
                                value = JSON.parse(value);

                                if (typeof value !== 'string') {
                                    cache[name] = value;
                                }
                            } catch (e) {/*
                             } catch (e) {
                             /*
                             if (e.message === "Unexpected token '") {

                             value=cache[name];

                             if(value.startsWith("'{") &&  value.endsWith("}'")){
                             value=value.substr(1,value.length-2);
                             }else{
                             value = value.replace(/'/g, '"');
                             }


                             value = JSON.parse(value);

                             if (typeof value !== 'string') {
                             cache[name] = value;
                             }
                             } */

                            }
                        }
                    } else if (typeof (cache[name]) === 'object') {
                        caches.push(cache[name]);
                    }
                }
            }
            return obj;
        }

        //将option的无用信息清除，返回真实可用的option
        /*
         *   @withTemplate   是否把数组中的模板留下
         * */
        function getCleanedOption(option, objArray, withTemplate) {
            var optionCopy = $.extend(true, {}, option);
            normalizeObjV2(optionCopy, objArray, withTemplate);
            parseJSObject(optionCopy);
            return optionCopy;
        }


        //显示配置页面
       var  baseConfigure = function ($context, oWidget, setTabVisible, noRefresh) {
            var elem = oWidget[0],
                widget = elem.widget,
                widgetID = elem.widgetID,
                widgetInstance = elem.data;

            // baseConfigInitInstance(widgetInstance.optionCopy, widget.option, {
            // 	widgetID: widgetID
            // });

            baseConfigInitConfigPage($context, widgetInstance, widget, setTabVisible, noRefresh);
        };



        return {
            baseConfigure :baseConfigure,
            baseConfig: baseConfig,
            baseConfigInitConfigPage: baseConfigInitConfigPage,
            baseConfigInitInstance: baseConfigInitInstance,
            initWidget: initWidget,
            updateObj: updateObj,
            getCleanedOption: getCleanedOption,
            updateResponsiveData: updateResponsiveData,
            getRequireAttr: getRequireAttr
        }
    });
})();