Ext.define('Abraxa.view.common.dialog.common.MultipleSheetDialog', {
    extend: 'Ext.MessageBox',
    closable: true,
    title: 'Choose sheet',
    xtype: 'multiple.sheet.dialog',
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            padding: 0,
            layout: 'vbox',
            defaults: {
                ui: 'classic',
            },
            items: [
                {
                    margin: 0,
                    xtype: 'div',
                    xtype: 'div',
                    cls: 'a-info-box a-warning-box',
                    margin: '0 0 24 0',
                    html: '<i class="material-icons-outlined">report_problem</i><div class="a-info-text">Your document contains more than one sheet.<br /> Please choose the one that contains your import data.</div>',
                },
                {
                    margin: '16 0',
                    xtype: 'abraxa.componentdataview',
                    bind: {
                        store: '{sheets}',
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                recordIndex: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        if (record) {
                                            let store = record.store;
                                            return store.indexOf(record);
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        padding: '4 0',
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'center',
                        },
                        items: [
                            {
                                xtype: 'radiofield',
                                ui: 'large',
                                name: 'sheet',
                                bind: {
                                    value: '{recordIndex}',
                                },
                            },
                            {
                                xtype: 'label',
                                margin: '0 0 0 8',
                                bind: {
                                    html: '{record.name}',
                                },
                            },
                        ],
                    },
                },
            ],
        },
    ],

    buttons: [
        {
            text: 'Cancel',
            handler: function (me) {
                let dialog = me.up('dialog'),
                    vm = dialog.upVM(),
                    fileData = vm.get('data'),
                    sheetInfo = {
                        file_name: fileData.file_name,
                        file_type: fileData.file_type,
                        section: fileData.section,
                        headerRowNumber: fileData.sheets[0].headerRowNumber,
                        sheetNumber: fileData.sheets[0].sheetNumber,
                        object_meta_id: fileData.object_meta_id,
                        object_id: fileData.object_id,
                    };
                let sendData = {
                    sheetInfo: sheetInfo,
                };
                dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'import_cancel',
                    jsonData: sendData,
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    success: function success(response) {
                        dialog.destroy();
                    },
                });
            },
            ui: 'default',
        },
        {
            text: 'Save',
            ui: 'action',
            margin: '0 0 0 8',
            handler: function (item, el) {
                let me = this,
                    dialog = this.up('dialog'),
                    form = dialog.down('formpanel'),
                    vm = dialog.upVM();
                values = form.getValues();
                if (!Ext.Object.isEmpty(values)) {
                    dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                    let button = vm.get('button'),
                        fileData = vm.get('data'),
                        sheet = values.sheet,
                        chosenSheet = vm.get('sheets')[sheet];
                    fileData.sheets = [];
                    if (chosenSheet) {
                        fileData.sheets.push(chosenSheet);
                    }
                    let data = fileData.sheets[0].data,
                        columns = fileData.sheets[0].columns,
                        columns_for_map = fileData.sheets[0].columns_for_map,
                        columns_text = fileData.sheets[0].columns_text;
                    sheetInfo = {
                        file_name: fileData.file_name,
                        file_type: fileData.file_type,
                        section: fileData.section,
                        headerRowNumber: fileData.sheets[0].headerRowNumber,
                        sheetNumber: fileData.sheets[0].sheetNumber,
                        object_meta_id: fileData.object_meta_id,
                        object_id: fileData.object_id,
                    };
                    button.showDialog(data, columns, columns_for_map, sheetInfo, columns_text);
                    dialog.hide();
                } else {
                    dialog.down('form\\.error').setHtml('Please select a sheet to import').show().addCls('error');
                }
            },
        },
    ],
});
