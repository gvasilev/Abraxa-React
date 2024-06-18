Ext.define('Abraxa.view.common.dialog.common.ImportFileDialog', {
    extend: 'Ext.Dialog',
    xtype: 'importFile.dialog',
    cls: 'a-dialog-import',
    title: 'Import data',
    closable: true,
    showAnimation: 'pop',
    scrollable: true,
    maxWidth: '80%',
    height: '80%',
    layout: 'vbox',
    draggable: false,
    maximizable: true,
    padding: 0,
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
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    //history grid
                    xtype: 'grid',
                    cls: 'a-sof-events abraxa-grid a-import-grid',
                    ui: 'bordered',
                    flex: 1,
                    itemRipple: false,
                    scrollable: true,
                    selectable: false,
                    ripple: false,
                    columnResize: false,
                    scrollToTopOnRefresh: false,
                    enableColumnMove: false,
                    minHeight: 300,
                    maxHeight: 1024,
                    bind: {
                        store: '{gridData}',
                        columns: '{gridColumns}',
                    },
                },
            ],
        },
    ],

    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function (me) {
                let dialog = me.up('dialog'),
                    vm = dialog.upVM();
                let sendData = {
                    sheetInfo: vm.get('sheetInfo'),
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
            text: 'Import',
            ui: 'action',
            handler: function (item, el) {
                let me = this,
                    dialog = this.up('dialog'),
                    form = dialog.down('formpanel'),
                    vm = dialog.upVM(),
                    grid = dialog.down('grid'),
                    store = grid.getStore(),
                    storeForReload = vm.get('storeForReload');
                values = form.getValues();
                if (values) {
                    let allEmpty = true,
                        allValues = [],
                        uniqueArray = [];
                    Object.values(values).forEach(function (val) {
                        if (!Ext.isEmpty(val) && allEmpty) {
                            allEmpty = false;
                        }
                        if (!Ext.isEmpty(val)) {
                            allValues.push(val);
                            uniqueArray.push(val);
                        }
                    });
                    let requiredFields = {
                        name: 'Name',
                        type_name: 'Type',
                        isps: 'ISPS',
                        covid19: 'Covid-19 cleared',
                    };
                    let storeData = store.getRange();
                    let errorArray = [];
                    Ext.Array.each(storeData, function (val) {
                        let rec = val.getData();
                        Ext.Object.each(requiredFields, function (key, value) {
                            if (Ext.isEmpty(rec[key])) {
                                let str = value + ' ' + 'is required.';
                                if (!Ext.Array.contains(errorArray, str)) {
                                    errorArray.push(str);
                                }
                            }
                        });
                    });

                    let uniqValues = Ext.Array.unique(uniqueArray);
                    if (allEmpty) {
                        dialog.down('form\\.error').setHtml('Please select at least one item').show().addCls('error');
                    } else {
                        if (errorArray.length) {
                            dialog.down('form\\.error').setHtml(errorArray[0]).show().addCls('error');
                        } else {
                            if (uniqValues.length == allValues.length) {
                                let sendData = {
                                    columns: values,
                                    sheetInfo: vm.get('sheetInfo'),
                                };
                                dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'import_map',
                                    jsonData: sendData,
                                    headers: {
                                        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                                        'Content-Type': 'application/json',
                                    },
                                    method: 'POST',
                                    success: function success(response) {
                                        var obj = Ext.decode(response.responseText);
                                        if (storeForReload) {
                                            storeForReload.reload();
                                        }
                                        dialog.destroy();
                                    },
                                    failure: function failure(response) {
                                        var obj = Ext.decode(response.responseText);
                                        Ext.Msg.alert('Something went wrong', obj.message);
                                    },
                                });
                            } else {
                                dialog
                                    .down('form\\.error')
                                    .setHtml('You have duplicate information please select only unique values')
                                    .show()
                                    .addCls('error');
                            }
                        }
                    }
                }
            },
        },
    ],
});
