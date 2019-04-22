/*
 *   页面数据加载依赖模板 bootloader.js
 *   lijiancheng@agree.com.cn
 *   last update date:20161026
 *   version：AUI 4.1.1
 *   build: 5520
 * */
(function (global) {

    //noinspection JSValidateTypes
    var
        config, jsLoadList, cssLoadList,
        cssConfigMap = {
    "AUI/css/component.btn.css": "component.btn/css/component.btn.css",
    "AWEB/css/aweb.popover.css": "AWEB/css/aweb.popover.css",
    "AUI/css/component.foundationForm.foundationSelectIcon.css": "component.foundationForm.foundationSelectIcon/css/component.foundationForm.foundationSelectIcon.css",
    "AUI/css/component.foundationForm.foundationWysiwyg.css": "component.foundationForm.foundationWysiwyg/css/component.foundationForm.foundationWysiwyg.css",
    "custom.AIR_rxjsTest/css/custom.AIR_rxjsTest.css": "custom.AIR_rxjsTest/css/custom.AIR_rxjsTest.css",
    "custom.Update2_awl/css/custom.Update2_awl.css": "custom.Update2_awl/css/custom.Update2_awl.css",
    "AUI/css/mobile.SoYComponent.SoYActionSheet.css": "mobile.SoYComponent.SoYActionSheet/css/mobile.SoYComponent.SoYActionSheet.css",
    "AWEB/css/font-awesome.min.css": "AWEB/css/font-awesome.min.css",
    "AUI/css/mobile.SoYComponent.SoYBudget.css": "mobile.SoYComponent.SoYBudget/css/mobile.SoYComponent.SoYBudget.css",
    "AUI/css/mobile.SoYComponent.SoYCalendar.css": "mobile.SoYComponent.SoYCalendar/css/mobile.SoYComponent.SoYCalendar.css",
    "AUI/css/mobile.SoYComponent.SoYCard.css": "mobile.SoYComponent.SoYCard/css/mobile.SoYComponent.SoYCard.css",
    "AUI/css/mobile.SoYComponent.SoYCarouselFigure.css": "mobile.SoYComponent.SoYCarouselFigure/css/mobile.SoYComponent.SoYCarouselFigure.css",
    "AUI/css/mobile.SoYComponent.SoYCheckList.css": "mobile.SoYComponent.SoYCheckList/css/mobile.SoYComponent.SoYCheckList.css",
    "AUI/css/mobile.SoYComponent.SoYCircleChart.css": "mobile.SoYComponent.SoYCircleChart/css/mobile.SoYComponent.SoYCircleChart.css",
    "AUI/css/mobile.SoYComponent.SoYGrid.css": "mobile.SoYComponent.SoYGrid/css/mobile.SoYComponent.SoYGrid.css",
    "AUI/css/mobile.SoYComponent.SoYInputItem.css": "mobile.SoYComponent.SoYInputItem/css/mobile.SoYComponent.SoYInputItem.css",
    "AUI/css/mobile.SoYComponent.SoYList.css": "mobile.SoYComponent.SoYList/css/mobile.SoYComponent.SoYList.css",
    "AUI/css/mobile.SoYComponent.SoYPictureUpload.css": "mobile.SoYComponent.SoYPictureUpload/css/mobile.SoYComponent.SoYPictureUpload.css",
    "AUI/css/mobile.SoYComponent.SoYProgress.css": "mobile.SoYComponent.SoYProgress/css/mobile.SoYComponent.SoYProgress.css",
    "AUI/css/mobile.SoYComponent.SoYRadioList.css": "mobile.SoYComponent.SoYRadioList/css/mobile.SoYComponent.SoYRadioList.css",
    "AUI/css/mobile.SoYComponent.SoYSearch.css": "mobile.SoYComponent.SoYSearch/css/mobile.SoYComponent.SoYSearch.css",
    "AUI/css/mobile.SoYComponent.SoYStepper.css": "mobile.SoYComponent.SoYStepper/css/mobile.SoYComponent.SoYStepper.css",
    "AUI/css/mobile.SoYComponent.SoYSwitch.css": "mobile.SoYComponent.SoYSwitch/css/mobile.SoYComponent.SoYSwitch.css",
    "AUI/css/mobile.SoYComponent.SoYValLine.css": "mobile.SoYComponent.SoYValLine/css/mobile.SoYComponent.SoYValLine.css",
    "AUI/css/mobile.SoYLayout.indexLayout.css": "mobile.SoYLayout.indexLayout/css/mobile.SoYLayout.indexLayout.css",
    "AUI/css/mobile.SoYLayout.mobileDrawer.css": "mobile.SoYLayout.mobileDrawer/css/mobile.SoYLayout.mobileDrawer.css",
    "AUI/css/mobile.SoYLayout.mobileLayout.css": "mobile.SoYLayout.mobileLayout/css/mobile.SoYLayout.mobileLayout.css",
    "AUI/css/mobile.SoYLayout.mobileTab.css": "mobile.SoYLayout.mobileTab/css/mobile.SoYLayout.mobileTab.css",
    "AUI/css/monitor.MComponent.MBaseConfig.css": "monitor.MComponent.MBaseConfig/css/monitor.MComponent.MBaseConfig.css",
    "AUI/css/monitor.MComponent.MCascader.css": "monitor.MComponent.MCascader/css/monitor.MComponent.MCascader.css",
    "AUI/css/monitor.MComponent.MCheckIpt.css": "monitor.MComponent.MCheckIpt/css/monitor.MComponent.MCheckIpt.css",
    "AUI/css/monitor.MComponent.MComponentCard.css": "monitor.MComponent.MComponentCard/css/monitor.MComponent.MComponentCard.css",
    "AUI/css/monitor.MComponent.MDataDisplay.css": "monitor.MComponent.MDataDisplay/css/monitor.MComponent.MDataDisplay.css",
    "AUI/css/monitor.MComponent.MDigitroll.css": "monitor.MComponent.MDigitroll/css/monitor.MComponent.MDigitroll.css",
    "AUI/css/monitor.MComponent.MDropDownFilter.css": "monitor.MComponent.MDropDownFilter/css/monitor.MComponent.MDropDownFilter.css",
    "AUI/css/monitor.MComponent.MGirdValue.css": "monitor.MComponent.MGirdValue/css/monitor.MComponent.MGirdValue.css",
    "AUI/css/monitor.MComponent.MInputItem.css": "monitor.MComponent.MInputItem/css/monitor.MComponent.MInputItem.css",
    "AUI/css/monitor.MComponent.MMessageList.css": "monitor.MComponent.MMessageList/css/monitor.MComponent.MMessageList.css",
    "AUI/css/monitor.MComponent.MPagination.css": "monitor.MComponent.MPagination/css/monitor.MComponent.MPagination.css",
    "AUI/css/monitor.MComponent.MPolymorphicTable.css": "monitor.MComponent.MPolymorphicTable/css/monitor.MComponent.MPolymorphicTable.css",
    "AUI/css/monitor.MComponent.MProductMgr.css": "monitor.MComponent.MProductMgr/css/monitor.MComponent.MProductMgr.css",
    "AUI/css/monitor.MComponent.MProductPanel.css": "monitor.MComponent.MProductPanel/css/monitor.MComponent.MProductPanel.css",
    "AUI/css/monitor.MComponent.MSelectBtnGroup.css": "monitor.MComponent.MSelectBtnGroup/css/monitor.MComponent.MSelectBtnGroup.css",
    "AUI/css/monitor.MComponent.MStatusDashBoard.css": "monitor.MComponent.MStatusDashBoard/css/monitor.MComponent.MStatusDashBoard.css",
    "AUI/css/monitor.MComponent.MTimepicker.css": "monitor.MComponent.MTimepicker/css/monitor.MComponent.MTimepicker.css",
    "AUI/css/monitor.MLayout.MFlexRowCtn.css": "monitor.MLayout.MFlexRowCtn/css/monitor.MLayout.MFlexRowCtn.css",
    "handsonTable/css/handsontable.min.css": "Handsontable/css/handsontable.min.css",
    "MultiplePicUpload/MultiplePicUpload.css": "MultiplePicUpload/MultiplePicUpload.css",
    "switcher/css/bootstrap-switch.css": "bootstrap-switch/css/bootstrap-switch.css",
    "bootstrapTable/css/bootstrapTable.css": "bootstrapTable/css/bootstrapTable.css",
    "bootstrap_datepicker/css/bootstrap-eedatepicker.css": "bootstrap_datepicker/css/bootstrap-datepicker.css",
    "baseConfig/css/bundle.css": "bundle/css/bundle.css",
    "chosen-jquery/css/chosen.css": "chosen.jquery/css/chosen.css",
    "componentTreeV2/css/componentTree.css": "componentTreeV2/css/componentTree.css",
    "jQuery.dataTables/css/buttons.dataTables.min.css": "dataTables.buttons.min/css/buttons.dataTables.min.css",
    "jQuery.dataTables/css/editor.dataTables.min.css": "dataTables.editor.min/css/editor.dataTables.min.css",
    "jQuery.dataTables/css/fixedColumns.dataTables.css": "dataTables.fixedColumns.min/css/fixedColumns.dataTables.css",
    "jQuery.dataTables/css/select.dataTables.min.css": "dataTables.select.min/css/select.dataTables.min.css",
    "easyPopover/css/easyPopover.css": "easypopover/css/easypopover.css",
    "easyui-combotree/easyui.css": "easyui/easyui.css",
    "editableSilder/css/foundationEditableSilder.css": "editableSilder/css/foundationEditableSilder.css",
    "md/editormd.css": "editormd/css/editormd.css",
    "fileUploadBtn/fileUploadBtn.css": "fileUploadBtn/css/fileUploadBtn.css",
    "flatpickr/css/flatpickr.css": "flatpickr/css/flatpickr.css",
    "foundation/css/foundation.css": "foundation/css/foundation.css",
    "jQuery.dataTables/css/jquery.dataTables.css": "jquery.dataTables/css/jquery.dataTables.css",
    "jQuery.ui/jquery-ui.min.css": "jqueryUI/css/jquery-ui.min.css",
    "AUI/css/layout.ctn.css": "layout.ctn/css/layout.ctn.css",
    "leftCatalog/leftCatalog.css": "leftCatalog/css/leftCatalog.css",
    "leftCatalog/leftCatalogBootstrap.css": "leftCatalog/css/leftCatalogBootstrap.css",
    "loginCtn/loginCtn.css": "loginCtn/css/loginCtn.css",
    "multiplechoicelistbox/multiplechoicelistbox.css": "multiselect/css/multiplechoicelistbox.css",
    "handsonTable/css/pikaday.css": "pikaday/css/pikaday.css",
    "stepCtn/stepCtn.css": "stepCtn/css/stepCtn.css",
    "timeLine/css/timeLine.css": "timeLine/css/timeLine.css",
    "timepicker/css/jquery_ui_timepicker_addon.css": "timepicker/css/jquery_ui_timepicker_addon.css",
    "topNav/topNav.css": "topNav/topNav.css",
    "wangEditor/css/wangEditor.min.css": "wangEditor/css/wangEditor.min.css",
    "jQuery.zTree/css/awesome.css": "zTree/css/awesome.css",
    "AWEB/css/am.css": "AWEB/css/am.css",
    "AWEB/css/aweb.css": "AWEB/css/aweb.css",
    "AWEB/css/aweb.page.css": "AWEB/css/aweb.page.css",
    "AWEB/css/icon-font.css": "AWEB/css/icon-font.css",
    "AWEB/css/soy.css": "AWEB/css/soy.css"
} || {};

    config = {
        
    "awebApi": {
        "name": "awebApi",
        "path": "dependence/AWEB/js/aweb.api",
        "deps": [
            "jquery"
        ]
    },
    "awebEnvironment": {
        "name": "awebEnvironment",
        "path": "dependence/AWEB/js/aweb.environment"
    },
    "awebFresher": {
        "name": "awebEnvironment",
        "path": "dependence/AWEB/js/aweb.fresher"
    },
    "awebIndex": {
        "name": "awebIndex",
        "path": "module/index/index"
    },
    "awebDependence": {
        "name": "awebDependence",
        "path": "dependence/AWEB/js/aweb.dependence"
    },
    "aweb-element-ui": {
        "name": "aweb-element-ui",
        "path": "dependence/aweb-element-ui/lib/aweb-element-ui.common.js"
    },
    "component": {
        "name": "component",
        "path": "dependence/component/index.js"
    },
    "component.AIBSTablesV2": {
        "name": "component.AIBSTablesV2",
        "path": "dependence/component.AIBSTablesV2/js/component.AIBSTablesV2.js"
    },
    "component.btn": {
        "name": "component.btn",
        "path": "dependence/component.btn/index.js"
    },
    "component.btn.btnGroup": {
        "name": "component.btn.btnGroup",
        "path": "dependence/component.btn.btnGroup/js/component.btn.btnGroup.js"
    },
    "component.btn.dropdownBtn": {
        "name": "component.btn.dropdownBtn",
        "path": "dependence/component.btn.dropdownBtn/js/component.btn.dropdownBtn.js"
    },
    "component.btn.fileUploadBtn": {
        "name": "component.btn.fileUploadBtn",
        "path": "dependence/component.btn.fileUploadBtn/js/component.btn.fileUploadBtn.js"
    },
    "component.btn.normalBtn": {
        "name": "component.btn.normalBtn",
        "path": "dependence/component.btn.normalBtn/js/component.btn.normalBtn.js"
    },
    "component.dataTables": {
        "name": "component.dataTables",
        "path": "dependence/component.dataTables/js/component.dataTables.js"
    },
    "component.echarts": {
        "name": "component.echarts",
        "path": "dependence/component.echarts/js/component.echarts.js"
    },
    "component.echarts.bar": {
        "name": "component.echarts.bar",
        "path": "dependence/component.echarts.bar/js/component.echarts.bar.js"
    },
    "component.echarts.dashboard": {
        "name": "component.echarts.dashboard",
        "path": "dependence/component.echarts.dashboard/js/component.echarts.dashboard.js"
    },
    "component.echarts.line": {
        "name": "component.echarts.line",
        "path": "dependence/component.echarts.line/js/component.echarts.line.js"
    },
    "component.echarts.pie": {
        "name": "component.echarts.pie",
        "path": "dependence/component.echarts.pie/js/component.echarts.pie.js"
    },
    "component.form": {
        "name": "component.form",
        "path": "dependence/component.form/mimi.vue"
    },
    "component.form.checkbox": {
        "name": "component.form.checkbox",
        "path": "dependence/component.form.checkbox/js/component.form.checkbox.js"
    },
    "component.form.checkboxGroup": {
        "name": "component.form.checkboxGroup",
        "path": "dependence/component.form.checkboxGroup/js/component.form.checkboxGroup.js"
    },
    "component.form.input": {
        "name": "component.form.input",
        "path": "dependence/component.form.input/js/component.form.input.js"
    },
    "component.form.password": {
        "name": "component.form.password",
        "path": "dependence/component.form.password/js/component.form.password.js"
    },
    "component.form.radio": {
        "name": "component.form.radio",
        "path": "dependence/component.form.radio/js/component.form.radio.js"
    },
    "component.form.radioGroup": {
        "name": "component.form.radioGroup",
        "path": "dependence/component.form.radioGroup/js/component.form.radioGroup.js"
    },
    "component.form.select": {
        "name": "component.form.select",
        "path": "dependence/component.form.select/js/component.form.select.js"
    },
    "component.form.textarea": {
        "name": "component.form.textarea",
        "path": "dependence/component.form.textarea/js/component.form.textarea.js"
    },
    "component.formUnionV2": {
        "name": "component.formUnionV2",
        "path": "dependence/component.formUnionV2/js/component.formUnionV2.js"
    },
    "component.foundationForm": {
        "name": "component.foundationForm",
        "path": "dependence/component.foundationForm/js/component.foundationForm.js"
    },
    "component.foundationForm.foundationCKEditor": {
        "name": "component.foundationForm.foundationCKEditor",
        "path": "dependence/component.foundationForm.foundationCKEditor/js/component.foundationForm.foundationCKEditor.js"
    },
    "component.foundationForm.foundationCheckboxGroup": {
        "name": "component.foundationForm.foundationCheckboxGroup",
        "path": "dependence/component.foundationForm.foundationCheckboxGroup/js/component.foundationForm.foundationCheckboxGroup.js"
    },
    "component.foundationForm.foundationDateTimePicker": {
        "name": "component.foundationForm.foundationDateTimePicker",
        "path": "dependence/component.foundationForm.foundationDateTimePicker/js/component.foundationForm.foundationDateTimePicker.js"
    },
    "component.foundationForm.foundationDatepicker": {
        "name": "component.foundationForm.foundationDatepicker",
        "path": "dependence/component.foundationForm.foundationDatepicker/js/component.foundationForm.foundationDatepicker.js"
    },
    "component.foundationForm.foundationDigitInput": {
        "name": "component.foundationForm.foundationDigitInput",
        "path": "dependence/component.foundationForm.foundationDigitInput/js/component.foundationForm.foundationDigitInput.js"
    },
    "component.foundationForm.foundationEditableSelect": {
        "name": "component.foundationForm.foundationEditableSelect",
        "path": "dependence/component.foundationForm.foundationEditableSelect/js/component.foundationForm.foundationEditableSelect.js"
    },
    "component.foundationForm.foundationEditableSilder": {
        "name": "component.foundationForm.foundationEditableSilder",
        "path": "dependence/component.foundationForm.foundationEditableSilder/js/component.foundationForm.foundationEditableSilder.js"
    },
    "component.foundationForm.foundationImg": {
        "name": "component.foundationForm.foundationImg",
        "path": "dependence/component.foundationForm.foundationImg/js/component.foundationForm.foundationImg.js"
    },
    "component.foundationForm.foundationInput": {
        "name": "component.foundationForm.foundationInput",
        "path": "dependence/component.foundationForm.foundationInput/js/component.foundationForm.foundationInput.js"
    },
    "component.foundationForm.foundationMultiplePicUpload": {
        "name": "component.foundationForm.foundationMultiplePicUpload",
        "path": "dependence/component.foundationForm.foundationMultiplePicUpload/js/component.foundationForm.foundationMultiplePicUpload.js"
    },
    "component.foundationForm.foundationPassword": {
        "name": "component.foundationForm.foundationPassword",
        "path": "dependence/component.foundationForm.foundationPassword/js/component.foundationForm.foundationPassword.js"
    },
    "component.foundationForm.foundationRadioGroup": {
        "name": "component.foundationForm.foundationRadioGroup",
        "path": "dependence/component.foundationForm.foundationRadioGroup/js/component.foundationForm.foundationRadioGroup.js"
    },
    "component.foundationForm.foundationSelect": {
        "name": "component.foundationForm.foundationSelect",
        "path": "dependence/component.foundationForm.foundationSelect/js/component.foundationForm.foundationSelect.js"
    },
    "component.foundationForm.foundationSelectIcon": {
        "name": "component.foundationForm.foundationSelectIcon",
        "path": "dependence/component.foundationForm.foundationSelectIcon/js/component.foundationForm.foundationSelectIcon.js"
    },
    "component.foundationForm.foundationSingleUpload": {
        "name": "component.foundationForm.foundationSingleUpload",
        "path": "dependence/component.foundationForm.foundationSingleUpload/js/component.foundationForm.foundationSingleUpload.js"
    },
    "component.foundationForm.foundationSwitch": {
        "name": "component.foundationForm.foundationSwitch",
        "path": "dependence/component.foundationForm.foundationSwitch/js/component.foundationForm.foundationSwitch.js"
    },
    "component.foundationForm.foundationText": {
        "name": "component.foundationForm.foundationText",
        "path": "dependence/component.foundationForm.foundationText/js/component.foundationForm.foundationText.js"
    },
    "component.foundationForm.foundationTextArea": {
        "name": "component.foundationForm.foundationTextArea",
        "path": "dependence/component.foundationForm.foundationTextArea/js/component.foundationForm.foundationTextArea.js"
    },
    "component.foundationForm.foundationTreeSelect": {
        "name": "component.foundationForm.foundationTreeSelect",
        "path": "dependence/component.foundationForm.foundationTreeSelect/js/component.foundationForm.foundationTreeSelect.js"
    },
    "component.foundationForm.foundationUploadButton": {
        "name": "component.foundationForm.foundationUploadButton",
        "path": "dependence/component.foundationForm.foundationUploadButton/js/component.foundationForm.foundationUploadButton.js"
    },
    "component.foundationForm.foundationVerifyInput": {
        "name": "component.foundationForm.foundationVerifyInput",
        "path": "dependence/component.foundationForm.foundationVerifyInput/js/component.foundationForm.foundationVerifyInput.js"
    },
    "component.foundationForm.foundationWangEditor": {
        "name": "component.foundationForm.foundationWangEditor",
        "path": "dependence/component.foundationForm.foundationWangEditor/js/component.foundationForm.foundationWangEditor.js"
    },
    "component.foundationForm.foundationWysiwyg": {
        "name": "component.foundationForm.foundationWysiwyg",
        "path": "dependence/component.foundationForm.foundationWysiwyg/js/component.foundationForm.foundationWysiwyg.js"
    },
    "component.handsontable": {
        "name": "component.handsontable",
        "path": "dependence/component.handsontable/js/component.handsontable.js"
    },
    "component.htmlTag": {
        "name": "component.htmlTag",
        "path": "dependence/component.htmlTag/js/component.htmlTag.js"
    },
    "component.icon": {
        "name": "component.icon",
        "path": "dependence/component.icon/js/component.icon.js"
    },
    "component.img": {
        "name": "component.img",
        "path": "dependence/component.img/js/component.img.js"
    },
    "component.leftCatalog": {
        "name": "component.leftCatalog",
        "path": "dependence/component.leftCatalog/js/component.leftCatalog.js"
    },
    "component.multiHansonTable": {
        "name": "component.multiHansonTable",
        "path": "dependence/component.multiHansonTable/js/component.multiHansonTable.js"
    },
    "component.other": {
        "name": "component.other",
        "path": "dependence/component.other/js/component.other.js"
    },
    "component.other.editableDataTable": {
        "name": "component.other.editableDataTable",
        "path": "dependence/component.other.editableDataTable/js/component.other.editableDataTable.js"
    },
    "component.other.horizontalSplitLine": {
        "name": "component.other.horizontalSplitLine",
        "path": "dependence/component.other.horizontalSplitLine/js/component.other.horizontalSplitLine.js"
    },
    "component.other.multipleChoiceListBox": {
        "name": "component.other.multipleChoiceListBox",
        "path": "dependence/component.other.multipleChoiceListBox/js/component.other.multipleChoiceListBox.js"
    },
    "component.other.progressBar": {
        "name": "component.other.progressBar",
        "path": "dependence/component.other.progressBar/js/component.other.progressBar.js"
    },
    "component.other.timeLine": {
        "name": "component.other.timeLine",
        "path": "dependence/component.other.timeLine/js/component.other.timeLine.js"
    },
    "component.other.topology": {
        "name": "component.other.topology",
        "path": "dependence/component.other.topology/js/component.other.topology.js"
    },
    "component.other.verticalSplitLine": {
        "name": "component.other.verticalSplitLine",
        "path": "dependence/component.other.verticalSplitLine/js/component.other.verticalSplitLine.js"
    },
    "component.platformEditor": {
        "name": "component.platformEditor",
        "path": "dependence/component.platformEditor/js/component.platformEditor.js"
    },
    "component.platformSplitBar": {
        "name": "component.platformSplitBar",
        "path": "dependence/component.platformSplitBar/js/component.platformSplitBar.js"
    },
    "component.text": {
        "name": "component.text",
        "path": "dependence/component.text/js/component.text.js"
    },
    "component.topNav": {
        "name": "component.topNav",
        "path": "dependence/component.topNav/js/component.topNav.js"
    },
    "component.zTree": {
        "name": "component.zTree",
        "path": "dependence/component.zTree/js/component.zTree.js"
    },
    "ctn": {
        "name": "ctn",
        "path": "dependence/ctn/js/ctn.js"
    },
    "ctn.divCtn": {
        "name": "ctn.divCtn",
        "path": "dependence/ctn.divCtn/js/ctn.divCtn.js"
    },
    "ctn.formCtn": {
        "name": "ctn.formCtn",
        "path": "dependence/ctn.formCtn/js/ctn.formCtn.js"
    },
    "ctn.foundationFormCtn": {
        "name": "ctn.foundationFormCtn",
        "path": "dependence/ctn.foundationFormCtn/js/ctn.foundationFormCtn.js"
    },
    "ctn.foundationRowCtn": {
        "name": "ctn.foundationRowCtn",
        "path": "dependence/ctn.foundationRowCtn/js/ctn.foundationRowCtn.js"
    },
    "ctn.loginCtn": {
        "name": "ctn.loginCtn",
        "path": "dependence/ctn.loginCtn/js/ctn.loginCtn.js"
    },
    "ctn.modalCtn": {
        "name": "ctn.modalCtn",
        "path": "dependence/ctn.modalCtn/js/ctn.modalCtn.js"
    },
    "custom": {
        "name": "custom",
        "path": "dependence/custom/index.js"
    },
    "custom.AIR_rxjsTest": {
        "name": "custom.AIR_rxjsTest",
        "path": "dependence/custom.AIR_rxjsTest/js/custom.AIR_rxjsTest.js"
    },
    "custom.Update2_awl": {
        "name": "custom.Update2_awl",
        "path": "dependence/custom.Update2_awl/js/custom.Update2_awl.js"
    },
    "layout": {
        "name": "layout",
        "path": "dependence/layout/index.js"
    },
    "layout.rowCtn": {
        "name": "layout.rowCtn",
        "path": "dependence/layout.rowCtn/js/layout.rowCtn.js"
    },
    "layout.stepCtn": {
        "name": "layout.stepCtn",
        "path": "dependence/layout.stepCtn/js/layout.stepCtn.js"
    },
    "layout.tabCtn": {
        "name": "layout.tabCtn",
        "path": "dependence/layout.tabCtn/js/layout.tabCtn.js"
    },
    "mobile": {
        "name": "mobile",
        "path": "dependence/mobile/index.js"
    },
    "mobile.SoYComponent": {
        "name": "mobile.SoYComponent",
        "path": "dependence/mobile.SoYComponent/index.js"
    },
    "mobile.SoYComponent.SoYActionSheet": {
        "name": "mobile.SoYComponent.SoYActionSheet",
        "path": "dependence/mobile.SoYComponent.SoYActionSheet/js/mobile.SoYComponent.SoYActionSheet.js"
    },
    "mobile.SoYComponent.SoYArticle": {
        "name": "mobile.SoYComponent.SoYArticle",
        "path": "dependence/mobile.SoYComponent.SoYArticle/js/mobile.SoYComponent.SoYArticle.js"
    },
    "mobile.SoYComponent.SoYBudget": {
        "name": "mobile.SoYComponent.SoYBudget",
        "path": "dependence/mobile.SoYComponent.SoYBudget/js/mobile.SoYComponent.SoYBudget.js"
    },
    "mobile.SoYComponent.SoYCalendar": {
        "name": "mobile.SoYComponent.SoYCalendar",
        "path": "dependence/mobile.SoYComponent.SoYCalendar/js/mobile.SoYComponent.SoYCalendar.js"
    },
    "mobile.SoYComponent.SoYCard": {
        "name": "mobile.SoYComponent.SoYCard",
        "path": "dependence/mobile.SoYComponent.SoYCard/js/mobile.SoYComponent.SoYCard.js"
    },
    "mobile.SoYComponent.SoYCarouselFigure": {
        "name": "mobile.SoYComponent.SoYCarouselFigure",
        "path": "dependence/mobile.SoYComponent.SoYCarouselFigure/js/mobile.SoYComponent.SoYCarouselFigure.js"
    },
    "mobile.SoYComponent.SoYCheckList": {
        "name": "mobile.SoYComponent.SoYCheckList",
        "path": "dependence/mobile.SoYComponent.SoYCheckList/js/mobile.SoYComponent.SoYCheckList.js"
    },
    "mobile.SoYComponent.SoYCircleChart": {
        "name": "mobile.SoYComponent.SoYCircleChart",
        "path": "dependence/mobile.SoYComponent.SoYCircleChart/js/mobile.SoYComponent.SoYCircleChart.js"
    },
    "mobile.SoYComponent.SoYGrid": {
        "name": "mobile.SoYComponent.SoYGrid",
        "path": "dependence/mobile.SoYComponent.SoYGrid/js/mobile.SoYComponent.SoYGrid.js"
    },
    "mobile.SoYComponent.SoYIconBtn": {
        "name": "mobile.SoYComponent.SoYIconBtn",
        "path": "dependence/mobile.SoYComponent.SoYIconBtn/js/mobile.SoYComponent.SoYIconBtn.js"
    },
    "mobile.SoYComponent.SoYInputItem": {
        "name": "mobile.SoYComponent.SoYInputItem",
        "path": "dependence/mobile.SoYComponent.SoYInputItem/js/mobile.SoYComponent.SoYInputItem.js"
    },
    "mobile.SoYComponent.SoYKChart": {
        "name": "mobile.SoYComponent.SoYKChart",
        "path": "dependence/mobile.SoYComponent.SoYKChart/js/mobile.SoYComponent.SoYKChart.js"
    },
    "mobile.SoYComponent.SoYLineChart": {
        "name": "mobile.SoYComponent.SoYLineChart",
        "path": "dependence/mobile.SoYComponent.SoYLineChart/js/mobile.SoYComponent.SoYLineChart.js"
    },
    "mobile.SoYComponent.SoYList": {
        "name": "mobile.SoYComponent.SoYList",
        "path": "dependence/mobile.SoYComponent.SoYList/js/mobile.SoYComponent.SoYList.js"
    },
    "mobile.SoYComponent.SoYPictureUpload": {
        "name": "mobile.SoYComponent.SoYPictureUpload",
        "path": "dependence/mobile.SoYComponent.SoYPictureUpload/js/mobile.SoYComponent.SoYPictureUpload.js"
    },
    "mobile.SoYComponent.SoYPieChart": {
        "name": "mobile.SoYComponent.SoYPieChart",
        "path": "dependence/mobile.SoYComponent.SoYPieChart/js/mobile.SoYComponent.SoYPieChart.js"
    },
    "mobile.SoYComponent.SoYProgress": {
        "name": "mobile.SoYComponent.SoYProgress",
        "path": "dependence/mobile.SoYComponent.SoYProgress/js/mobile.SoYComponent.SoYProgress.js"
    },
    "mobile.SoYComponent.SoYRadioList": {
        "name": "mobile.SoYComponent.SoYRadioList",
        "path": "dependence/mobile.SoYComponent.SoYRadioList/js/mobile.SoYComponent.SoYRadioList.js"
    },
    "mobile.SoYComponent.SoYSearch": {
        "name": "mobile.SoYComponent.SoYSearch",
        "path": "dependence/mobile.SoYComponent.SoYSearch/js/mobile.SoYComponent.SoYSearch.js"
    },
    "mobile.SoYComponent.SoYSlider": {
        "name": "mobile.SoYComponent.SoYSlider",
        "path": "dependence/mobile.SoYComponent.SoYSlider/js/mobile.SoYComponent.SoYSlider.js"
    },
    "mobile.SoYComponent.SoYStepper": {
        "name": "mobile.SoYComponent.SoYStepper",
        "path": "dependence/mobile.SoYComponent.SoYStepper/js/mobile.SoYComponent.SoYStepper.js"
    },
    "mobile.SoYComponent.SoYSwitch": {
        "name": "mobile.SoYComponent.SoYSwitch",
        "path": "dependence/mobile.SoYComponent.SoYSwitch/js/mobile.SoYComponent.SoYSwitch.js"
    },
    "mobile.SoYComponent.SoYValLine": {
        "name": "mobile.SoYComponent.SoYValLine",
        "path": "dependence/mobile.SoYComponent.SoYValLine/js/mobile.SoYComponent.SoYValLine.js"
    },
    "mobile.SoYCtn": {
        "name": "mobile.SoYCtn",
        "path": "dependence/mobile.SoYCtn/index.js"
    },
    "mobile.SoYCtn.mobileCtn": {
        "name": "mobile.SoYCtn.mobileCtn",
        "path": "dependence/mobile.SoYCtn.mobileCtn/js/mobile.SoYCtn.mobileCtn.js"
    },
    "mobile.SoYLayout": {
        "name": "mobile.SoYLayout",
        "path": "dependence/mobile.SoYLayout/index.js"
    },
    "mobile.SoYLayout.indexLayout": {
        "name": "mobile.SoYLayout.indexLayout",
        "path": "dependence/mobile.SoYLayout.indexLayout/js/mobile.SoYLayout.indexLayout.js"
    },
    "mobile.SoYLayout.mobileDrawer": {
        "name": "mobile.SoYLayout.mobileDrawer",
        "path": "dependence/mobile.SoYLayout.mobileDrawer/js/mobile.SoYLayout.mobileDrawer.js"
    },
    "mobile.SoYLayout.mobileLayout": {
        "name": "mobile.SoYLayout.mobileLayout",
        "path": "dependence/mobile.SoYLayout.mobileLayout/js/mobile.SoYLayout.mobileLayout.js"
    },
    "mobile.SoYLayout.mobileTab": {
        "name": "mobile.SoYLayout.mobileTab",
        "path": "dependence/mobile.SoYLayout.mobileTab/js/mobile.SoYLayout.mobileTab.js"
    },
    "monitor": {
        "name": "monitor",
        "path": "dependence/monitor/index.js"
    },
    "monitor.MComponent": {
        "name": "monitor.MComponent",
        "path": "dependence/monitor.MComponent/index.js"
    },
    "monitor.MComponent.MAsideMenu": {
        "name": "monitor.MComponent.MAsideMenu",
        "path": "dependence/monitor.MComponent.MAsideMenu/js/monitor.MComponent.MAsideMenu.js"
    },
    "monitor.MComponent.MBaseConfig": {
        "name": "monitor.MComponent.MBaseConfig",
        "path": "dependence/monitor.MComponent.MBaseConfig/js/monitor.MComponent.MBaseConfig.js"
    },
    "monitor.MComponent.MCascader": {
        "name": "monitor.MComponent.MCascader",
        "path": "dependence/monitor.MComponent.MCascader/js/monitor.MComponent.MCascader.js"
    },
    "monitor.MComponent.MCheckIpt": {
        "name": "monitor.MComponent.MCheckIpt",
        "path": "dependence/monitor.MComponent.MCheckIpt/js/monitor.MComponent.MCheckIpt.js"
    },
    "monitor.MComponent.MComponentCard": {
        "name": "monitor.MComponent.MComponentCard",
        "path": "dependence/monitor.MComponent.MComponentCard/js/monitor.MComponent.MComponentCard.js"
    },
    "monitor.MComponent.MComponentTree": {
        "name": "monitor.MComponent.MComponentTree",
        "path": "dependence/monitor.MComponent.MComponentTree/js/monitor.MComponent.MComponentTree.js"
    },
    "monitor.MComponent.MDataDisplay": {
        "name": "monitor.MComponent.MDataDisplay",
        "path": "dependence/monitor.MComponent.MDataDisplay/js/monitor.MComponent.MDataDisplay.js"
    },
    "monitor.MComponent.MDigitroll": {
        "name": "monitor.MComponent.MDigitroll",
        "path": "dependence/monitor.MComponent.MDigitroll/js/monitor.MComponent.MDigitroll.js"
    },
    "monitor.MComponent.MDropDownFilter": {
        "name": "monitor.MComponent.MDropDownFilter",
        "path": "dependence/monitor.MComponent.MDropDownFilter/js/monitor.MComponent.MDropDownFilter.js"
    },
    "monitor.MComponent.MGirdValue": {
        "name": "monitor.MComponent.MGirdValue",
        "path": "dependence/monitor.MComponent.MGirdValue/js/monitor.MComponent.MGirdValue.js"
    },
    "monitor.MComponent.MInputItem": {
        "name": "monitor.MComponent.MInputItem",
        "path": "dependence/monitor.MComponent.MInputItem/js/monitor.MComponent.MInputItem.js"
    },
    "monitor.MComponent.MMessageList": {
        "name": "monitor.MComponent.MMessageList",
        "path": "dependence/monitor.MComponent.MMessageList/js/monitor.MComponent.MMessageList.js"
    },
    "monitor.MComponent.MPagination": {
        "name": "monitor.MComponent.MPagination",
        "path": "dependence/monitor.MComponent.MPagination/js/monitor.MComponent.MPagination.js"
    },
    "monitor.MComponent.MPolymorphicTable": {
        "name": "monitor.MComponent.MPolymorphicTable",
        "path": "dependence/monitor.MComponent.MPolymorphicTable/js/monitor.MComponent.MPolymorphicTable.js"
    },
    "monitor.MComponent.MProductMgr": {
        "name": "monitor.MComponent.MProductMgr",
        "path": "dependence/monitor.MComponent.MProductMgr/js/monitor.MComponent.MProductMgr.js"
    },
    "monitor.MComponent.MProductPanel": {
        "name": "monitor.MComponent.MProductPanel",
        "path": "dependence/monitor.MComponent.MProductPanel/js/monitor.MComponent.MProductPanel.js"
    },
    "monitor.MComponent.MSelectBtnGroup": {
        "name": "monitor.MComponent.MSelectBtnGroup",
        "path": "dependence/monitor.MComponent.MSelectBtnGroup/js/monitor.MComponent.MSelectBtnGroup.js"
    },
    "monitor.MComponent.MStatusDashBoard": {
        "name": "monitor.MComponent.MStatusDashBoard",
        "path": "dependence/monitor.MComponent.MStatusDashBoard/js/monitor.MComponent.MStatusDashBoard.js"
    },
    "monitor.MComponent.MTimepicker": {
        "name": "monitor.MComponent.MTimepicker",
        "path": "dependence/monitor.MComponent.MTimepicker/js/monitor.MComponent.MTimepicker.js"
    },
    "monitor.MEcharts": {
        "name": "monitor.MEcharts",
        "path": "dependence/monitor.MEcharts/js/monitor.MEcharts.js"
    },
    "monitor.MEcharts.M3Dbar": {
        "name": "monitor.MEcharts.M3Dbar",
        "path": "dependence/monitor.MEcharts.M3Dbar/js/monitor.MEcharts.M3Dbar.js"
    },
    "monitor.MEcharts.MCustomizedPie": {
        "name": "monitor.MEcharts.MCustomizedPie",
        "path": "dependence/monitor.MEcharts.MCustomizedPie/js/monitor.MEcharts.MCustomizedPie.js"
    },
    "monitor.MEcharts.MMixedColumnChart": {
        "name": "monitor.MEcharts.MMixedColumnChart",
        "path": "dependence/monitor.MEcharts.MMixedColumnChart/js/monitor.MEcharts.MMixedColumnChart.js"
    },
    "monitor.MEcharts.MPlusMinusColumn": {
        "name": "monitor.MEcharts.MPlusMinusColumn",
        "path": "dependence/monitor.MEcharts.MPlusMinusColumn/js/monitor.MEcharts.MPlusMinusColumn.js"
    },
    "monitor.MEcharts.MStackedArea": {
        "name": "monitor.MEcharts.MStackedArea",
        "path": "dependence/monitor.MEcharts.MStackedArea/js/monitor.MEcharts.MStackedArea.js"
    },
    "monitor.MLayout": {
        "name": "monitor.MLayout",
        "path": "dependence/monitor.MLayout/index.js"
    },
    "monitor.MLayout.MFlexRowCtn": {
        "name": "monitor.MLayout.MFlexRowCtn",
        "path": "dependence/monitor.MLayout.MFlexRowCtn/js/monitor.MLayout.MFlexRowCtn.js"
    },
    "page.mainPanel": {
        "name": "page.mainPanel",
        "path": "dependence/page.mainPanel/index.js"
    },
    "Handsontable": {
        "name": "Handsontable",
        "path": "dependence/Handsontable/js/handsontable.full.min"
    },
    "MultiplePicUpload": {
        "name": "MultiplePicUpload",
        "path": "dependence/MultiplePicUpload/index.js"
    },
    "Raphael": {
        "name": "Raphael",
        "path": "dependence/Raphael/js/raphael.min",
        "exports": "Raphael"
    },
    "baseConfig": {
        "name": "baseConfig",
        "path": "dependence/baseConfig/js/base",
        "deps": [
            "bundle",
            "template",
            "vue"
        ]
    },
    "bootstrap-switch": {
        "name": "bootstrap-switch",
        "path": "dependence/bootstrap-switch/js/bootstrap-switch"
    },
    "bootstrap-wysiwyg": {
        "name": "bootstrap-wysiwyg",
        "path": "dependence/bootstrap-wysiwyg/js/bootstrap-wysiwyg.js"
    },
    "bootstrapTable": {
        "name": "bootstrapTable",
        "path": "dependence/bootstrapTable/js/bootstrapTable.min",
        "exports": "bootstrapTable"
    },
    "bootstrapTableTreegrid": {
        "name": "bootstrapTableTreegrid",
        "path": "dependence/bootstrapTableTreegrid/js/bootstrap-table-treegrid.min",
        "deps": [
            "bootstrapTable",
            "jquery"
        ]
    },
    "bootstrapTableTreegridJq": {
        "name": "bootstrapTableTreegridJq",
        "path": "dependence/bootstrapTableTreegridJq/js/jquery.treegrid.min"
    },
    "bootstrap_datepicker": {
        "name": "bootstrap_datepicker",
        "path": "dependence/bootstrap_datepicker/js/bootstrap-datepicker.min"
    },
    "bscroll": {
        "name": "bscroll",
        "path": "dependence/bscroll/js/betterScroll"
    },
    "bundle": {
        "name": "bundle",
        "path": "dependence/bundle/js/bundle"
    },
    "chosen.jquery": {
        "name": "chosen.jquery",
        "path": "dependence/chosen.jquery/js/chosen.jquery"
    },
    "ckEditor": {
        "name": "ckEditor",
        "path": "dependence/ckEditor/js/ckeditor"
    },
    "componentTreeV2": {
        "name": "componentTreeV2",
        "path": "dependence/componentTreeV2/js/componentTree.js"
    },
    "dataTables.buttons.min": {
        "name": "dataTables.buttons.min",
        "path": "dependence/dataTables.buttons.min/js/dataTables.buttons.min"
    },
    "dataTables.editor.min": {
        "name": "dataTables.editor.min",
        "path": "dependence/dataTables.editor.min/js/dataTables.editor.min"
    },
    "dataTables.fixedColumns.min": {
        "name": "dataTables.fixedColumns.min",
        "path": "dependence/dataTables.fixedColumns.min/js/dataTables.fixedColumns.min"
    },
    "dataTables.select.min": {
        "name": "dataTables.select.min",
        "path": "dependence/dataTables.select.min/js/dataTables.select.min"
    },
    "digitroll": {
        "name": "digitroll",
        "path": "dependence/digitroll/js/digitroll.min"
    },
    "easypopover": {
        "name": "easypopover",
        "path": "dependence/easypopover/js/easyPopover.js",
        "deps": [
            "jquery"
        ]
    },
    "easyui": {
        "name": "easyui",
        "path": "dependence/easyui/js/jquery.easyui.min",
        "deps": [
            "jquery",
            "jqueryUI"
        ]
    },
    "echarts": {
        "name": "echarts",
        "path": "dependence/echarts/js/echarts.min",
        "exports": "echarts"
    },
    "echarts-gl": {
        "name": "echarts-gl",
        "path": "dependence/echarts-gl/js/echarts-gl.min"
    },
    "echarts4.2": {
        "name": "echarts4.2",
        "path": "dependence/echarts4.2/js/echarts-4.2.0.min"
    },
    "editableSilder": {
        "name": "editableSilder",
        "path": "dependence/editableSilder/index.js"
    },
    "editormd": {
        "name": "editormd",
        "path": "dependence/editormd/js/editormd"
    },
    "fileUpload": {
        "name": "fileUpload",
        "path": "dependence/fileUpload/js/jQuery.ajaxfileupload.js",
        "deps": [
            "jquery"
        ]
    },
    "fileUploadBtn": {
        "name": "fileUploadBtn",
        "path": "dependence/fileUploadBtn/index.js"
    },
    "flatpickr": {
        "name": "flatpickr",
        "path": "dependence/flatpickr/js/flatpickr"
    },
    "flowchart": {
        "name": "flowchart",
        "path": "dependence/flowchart/js/flowchart.min"
    },
    "foundation": {
        "name": "foundation",
        "path": "dependence/foundation/js/foundation.js"
    },
    "jQueryFlowchart": {
        "name": "jQueryFlowchart",
        "path": "dependence/jQueryFlowchart/js/jquery.flowchart.min",
        "deps": [
            "flowchart"
        ]
    },
    "jquery": {
        "name": "jquery",
        "path": "dependence/jquery/js/jquery-1.9.1.js",
        "exports": "$"
    },
    "jquery.dataTables": {
        "name": "jquery.dataTables",
        "path": "dependence/jquery.dataTables/js/jquery.dataTables",
        "deps": [
            "jquery"
        ]
    },
    "jquery.editableSelect": {
        "name": "jquery.editableSelect",
        "path": "dependence/jquery.editableSelect/js/jquery.editableSelect"
    },
    "jqueryUI": {
        "name": "jqueryUI",
        "path": "dependence/jqueryUI/js/jquery-ui.min"
    },
    "jtopo.0.4.8.min": {
        "name": "jtopo.0.4.8.min",
        "path": "dependence/jtopo.0.4.8.min/js/jtopo-0.4.8-min"
    },
    "layout.ctn": {
        "name": "layout.ctn",
        "path": "dependence/layout.ctn/index.js"
    },
    "leftCatalog": {
        "name": "leftCatalog",
        "path": "dependence/leftCatalog/index.js"
    },
    "loginCtn": {
        "name": "loginCtn",
        "path": "dependence/loginCtn/index.js"
    },
    "marked": {
        "name": "marked",
        "path": "dependence/marked/js/marked.min",
        "exports": "marked"
    },
    "moment": {
        "name": "moment",
        "path": "dependence/moment/js/moment"
    },
    "multiselect": {
        "name": "multiselect",
        "path": "dependence/multiselect/js/multiselect.js"
    },
    "pagination": {
        "name": "pagination",
        "path": "dependence/pagination/js/jquery.pagination.js",
        "deps": [
            "jquery"
        ]
    },
    "pikaday": {
        "name": "pikaday",
        "path": "dependence/pikaday/js/pikaday"
    },
    "prettify": {
        "name": "prettify",
        "path": "dependence/prettify/js/prettify.min"
    },
    "progressbar": {
        "name": "progressbar",
        "path": "dependence/progressbar/js/progressbar"
    },
    "requireCss": {
        "name": "requireCss",
        "path": "dependence/requireCss/js/require-css.min"
    },
    "requireJS": {
        "name": "requireJS",
        "path": "dependence/requireJS/js/require.js"
    },
    "sequenceDiagram": {
        "name": "sequenceDiagram",
        "path": "dependence/sequenceDiagram/js/sequence-diagram.min",
        "deps": [
            "Raphael",
            "underscore"
        ]
    },
    "slimScroll": {
        "name": "slimScroll",
        "path": "dependence/slimScroll/js/jquery.slimscroll.min",
        "deps": [
            "jquery"
        ]
    },
    "stepCtn": {
        "name": "stepCtn",
        "path": "dependence/stepCtn/index.js"
    },
    "taffydb": {
        "name": "taffydb",
        "path": "dependence/taffydb/js/jquery.slimscroll.min"
    },
    "template": {
        "name": "template",
        "path": "dependence/template/js/template"
    },
    "text": {
        "name": "text",
        "path": "dependence/text/js/text"
    },
    "timeLine": {
        "name": "timeLine",
        "path": "dependence/timeLine/index.js"
    },
    "timepicker": {
        "name": "timepicker",
        "path": "dependence/timepicker/js/jquery_ui_timepicker_addon.js",
        "deps": [
            "jquery"
        ]
    },
    "timepickerSliderAccess": {
        "name": "timepickerSliderAccess",
        "path": "dependence/timepickerSliderAccess/js/jquery_ui_sliderAccess.js",
        "deps": [
            "jquery"
        ]
    },
    "topNav": {
        "name": "topNav",
        "path": "dependence/topNav/index.js"
    },
    "underscore": {
        "name": "underscore",
        "path": "dependence/underscore/js/underscore.min",
        "exports": "_"
    },
    "vue": {
        "name": "vue",
        "path": "dependence/vue/js/vue"
    },
    "wangEditor": {
        "name": "wangEditor",
        "path": "dependence/wangEditor/js/wangEditor.min"
    },
    "zTree": {
        "name": "zTree",
        "path": "dependence/zTree/js/jquery.ztree.all-3.5.min"
    }
/*config*/
    };
    /*jsList*/
    jsLoadList = [];
    /*jsList*/
    /*cssList*/
    cssLoadList = [];
    /*cssList*/




    "IDETAG";
    //do something to edit the vars above
    "IDETAG";

    var _i, _j, _item, _path, name, isPath,
        map = {},
        requireConfig = {
            shim: {
                "widget": {
                    "deps": ["jquery", 'awebApi']
                }
            },
            paths: {
                "widget": "dependence/AWEB/js/aweb.widget"
            },
            text: {
                useXhr: function () {
                    return true;
                }
            },
            waitSeconds: 30
        },
        console,
        cssLoadMap = {},

        SIGNAL_STYLE_FILE_NAME = 'style.css';

    global.aweb = {
        css: {
            deps: []
        },
        globalVariables: {},
        transformJsConfig: function (jsLoadList) {

            //transform path into name
            for (_i = jsLoadList.length; _item = jsLoadList[--_i];) {
                name = jsLoadList[_i];
                //将路径切换为名字
                if (map[name] || map['dependence/' + name]) {

                    name = map[name] || map['dependence/' + name];

                } else if (/[\\\/]/.test(name)) {
                    isPath = false;

                    for (_j in config) {
                        if (config[_j] && config[_j].path && config[_j].path.indexOf(name) !== -1) {
                            name = map[name] = _j;
                            isPath = true;
                            break;
                        }
                    }

                    if (!isPath) {
                        name = 'dependence/' + name;
                    }

                    map[name] = name;
                } else {
                    if (requireConfig.paths[name]) {
                        map[name] = name;
                    } else {
                        map[name] = '';
                        name = '';
                    }
                }


                jsLoadList[_i] = name;
            }


            return jsLoadList;
        },
        transformCssConfig: function (cssLoadList) {
            //css config
            var cssconfigItem;
            for (_i = cssLoadList.length; _item = cssLoadList[--_i];) {
                if (aweb.singleStyleFile && (_item in cssLoadMap)) {

                    cssLoadList[_i] = 'requireCss!' + cssLoadMap[_item];
                } else if (!/^(?:\.)?dependence/.test(_item)) {
                    if (cssConfigMap.hasOwnProperty(_item)) {
                        cssconfigItem = cssConfigMap[_item];
                       
                    }else{
                        cssconfigItem = _item;
                    }
                    _item = 'dependence/' + cssconfigItem;
                    cssLoadList[_i] = 'requireCss!' + _item;
                }
            }

            return cssLoadList;
        },
        stepTo: function (msg) {
            aweb._stepTo = msg;
        },
        exceptionHandler: function () {
            var _console = global.console,
                console = {},
                func = ['log', 'info', 'error', 'warn', 'table'],
                i, item;

            if (_console && _console.hasOwnProperty) {
                for (i in _console) {
                    if (_console.hasOwnProperty(i)) {
                        console[i] = _console[i];
                    }
                }
            }

            for (i = func.length; item = func[--i];) {

                console[item] = (function (item) {

                    if (!_console[item]) {
                        _console[item] = _console.log;
                    }

                    return function () {
                        aweb._stepTo && _console.info('执行到"' + aweb._stepTo + '"。');

                        try {
                            _console[item].apply(_console, arguments);


                            if (item === 'error' && _console.trace) {
                                _console.trace();
                            }

                        } catch (e) {
                            app.alert(arguments[0]);
                        }
                    }
                }(item));
            }

            global.console = console;

            window.onerror = function (errorMsg, scriptURI, lineNumber, columnNumber, errorObj) {
                aweb._stepTo && _console.info('执行到"' + aweb._stepTo + '"报错。');

                //_console.error(errorObj);
            }
        }
    };
    global.app = {};

    if (!(console = global.console)) {
        global.console = console = {};

        console.info = console.log = console.error = console.warning = function (msg) {
            if (global.aweb.log) {
                global.alert(msg);
            }
        };
    }
    //js config
    for (_i in config) {
        if (config.hasOwnProperty(_i)) {
            _item = config[_i];
            requireConfig.shim[_i] = {
                deps: _item.deps,
                exports: _item.exports
            };
            _path = _item.path;
            requireConfig.paths[_i] = ~_path.indexOf('.js') ? _path.substring(0, _path.length - 3) : _path;
        }
    }

    //css dependence
    for (_i = -1; _item = cssLoadList[++_i];) {
        cssLoadMap[_item] = SIGNAL_STYLE_FILE_NAME;
    }

    require.config(requireConfig);

    require(['jquery','awebApi'],function ($) {
        require(['awebEnvironment', 'widget'], function ( environment, widget) {
            //environment
            var aweb = $.extend(true, global.aweb, environment),
                queue = [], cursor = -1, next = function () {
                    var callback = queue[++cursor];

                    if (callback) {
                        callback();
                    }
                };

            if (aweb.requireConfig) {
                if (aweb.requireConfig.urlArgs === false) {
                    aweb.requireConfig.urlArgs = '_t=' + new Date().getTime();
                } else {
                    delete aweb.requireConfig.urlArgs;
                }

                require.config(aweb.requireConfig);
            }

            if (aweb.debug) {
                aweb.exceptionHandler();
            }

            //$AW
            global.$AW = widget;

            //国际化
            if (aweb.translate) {
                queue.push(function () {
                    $._ajax({
                        url: 'NSL/nsl_' + widget.getCurrentLanguage() + '.json',
                        success: function (data) {
                            widget.viewer.nsl = data || {};
                        },
                        error: function () {
                            $AW.viewer.nsl = {};
                        },
                        complete: next
                    });
                });
            }

            //主题
            if (aweb.fresher) {
                queue.push(function () {
                    //主题
                    require(['awebFresher'], function (fresher) {

                        widget.fresher.theme = fresher.theme;
                        widget.fresher.variablesCopy = widget.transformThemeVariables(fresher.variables);
                        next();
                    });
                })
            } else {
                widget.fresher.theme = {};
                widget.fresher.variablesCopy = {};
            }

            //页面
            queue.push(function () {
                require(['awebIndex'], function (index) {
                    var Controller = app.Controller,
                        _domID = app.getUID(),
                        _scope = {},
                        _$el = $('body').attr('id', _domID),
                        _handler = new Controller.Model({
                            conf: '',
                            path: 'module/index/index/',
                            $renderTo: _$el,
                            id: _domID,
                            domID: _domID,
                            type: 'WINDOW'
                        });

                    _$el.css('display', '');
                    _handler._data.$el = _$el;

                    if ($.isFunction(index)) {
                        index = index();
                    }
                    if ($.isFunction(index)) {
                        index = index();
                    }

                    index.load.call(_handler, _$el, _scope, _handler);

                    next();
                });
            });

            //资源
            if (aweb.preloading) {
                queue.push(function () {
                    require(aweb.transformJsConfig(jsLoadList));
                    require(aweb.transformCssConfig(cssLoadList));
                });
            }


            next();

        });
    })



    require.onError = function (err) {
        if (app && app.shelter) {
            app.shelter.hideAll();
        }
        throw  err;
    };

})(this);