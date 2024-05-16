Ext.define('Abraxa.view.common.combo.Commodity', {
    extend: 'Ext.form.field.ComboBox',
    // extend: 'Abraxa.core.components.combo.Generic',
    xtype: 'commodity.combo',
    ui: 'classic',
    label: 'Commodity Type',
    placeholder: 'Enter commodity',
    editable: true,
    valueField: 'name',
    displayField: 'name',
    forceSelection: true,
    selectOnTab: false,
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
        expand: null,
    },
    store: {
        type: 'commodity',
        autoLoad: false,
        pageSize: 100,
    },
    itemTpl:
        '<div class="combo-item">' +
        '<div class="sm-icon"><i class="md-icon-outlined md-18">view_agenda</i></div>' +
        '<label class="sm-type">{type}</label>' +
        '<div class="sm-value">{name}</div>' +
        '</div>',
    queryMode: 'remote',
    minChars: 2,
    listeners: {
        beforequery: function () {
            let store = this.getStore();
            if (!store.loadCount) store.load();
        },
        // blur: function (combo, e, eOpts) {
        //     var value = combo.getInputValue();
        //     var store = combo.getStore();
        //     var record = store.query('name', value, false, false, true);
        //     if (record.length == 0 && value) {
        //         Ext.Msg.confirm(
        //             'Warning',
        //             'The commodity <b>"' + value + '"</b> does not exist in your list. </br> Would you like to add it?',
        //             function (answer) {
        //                 if (answer == 'yes') {
        //                     store.add({
        //                         name: value,
        //                     });
        //                     store.sync({
        //                         success: function (batch) {
        //                             var response = batch.operations[0]._response.responseJson;
        //                             store.reload({
        //                                 callback: function (records, operation, success) {
        //                                     combo.focus();
        //                                     combo.setValue(response.id);
        //                                     combo.setInputValue(response.name);
        //                                     combo.select();
        //                                     Ext.toast('Record created');
        //                                 }
        //                             });
        //                         }
        //                     });
        //                 } else {
        //                     combo.clearValue();
        //                     combo.focus();
        //                 }
        //             }
        //         );
        //     }
        // },
        expand: function () {
            let combo = this,
                pickerRecords = combo.getPicker().getItems(),
                buttonExists = pickerRecords.keys.indexOf('addCommodityButton');
            if (buttonExists === -1) {
                combo.getPicker().add({
                    xtype: 'container',
                    docked: 'bottom',
                    layout: 'hbox',
                    itemId: 'addCommodityButton',
                    flex: 1,
                    style: 'background-color:#fff',
                    items: [
                        {
                            xtype: 'button',
                            margin: 4,
                            flex: 1,
                            text: 'Add Commodity',
                            ui: 'solid-normal btn-sm',
                            iconCls: 'md-icon-add',
                            handler: function (me) {
                                let dialog = this.up('dialog');
                                if (dialog) {
                                    dialog.hide();
                                }
                                let modal = Ext.create('Abraxa.view.common.dialog.common.AddEditCommodityDialogForm', {
                                    viewModel: {
                                        data: {
                                            action: 'create',
                                            commodity: null,
                                        },
                                        storesToReload: [],
                                    },
                                });
                                modal.show();
                                if (dialog) {
                                    modal.on('destroy', function () {
                                        if (combo.getStore().source) {
                                            combo.getStore().getSource().reload();
                                        } else {
                                            combo.getStore().reload();
                                        }
                                        dialog.show();
                                    });
                                } else {
                                    modal.on('destroy', function () {
                                        if (combo.getStore().source) {
                                            combo.getStore().getSource().reload();
                                        } else {
                                            combo.getStore().reload();
                                        }
                                        combo.focus();
                                        combo.select();
                                    });
                                }
                            },
                        },
                    ],
                });
            }
        },
    },
});