Ext.define('Abraxa.view.settings.library.taxes.AddTax', {
    extend: 'Ext.Dialog',
    xtype: 'library.taxes.add.tax',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 540,
    minHeight: 480,
    // maxHeight: 860,
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">receipt_long</i></div>Add tax',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-dialog-form',
                                    margin: '0 24 0 72',
                                    maxWidth: 520,
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            placeholder: 'Enter tax name',
                                            bind: {
                                                value: '{tax.name}',
                                            },
                                            required: true,
                                            listeners: {
                                                painted: function (me) {
                                                    me.focus();
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Code',
                                            placeholder: 'Enter code',
                                            labelAlign: 'left',
                                            cls: 'a-field-icon icon-numbers icon-rounded',
                                            ui: 'classic hovered-border',
                                            bind: {
                                                value: '{tax.code}',
                                            },
                                        },
                                        {
                                            xtype: 'numberfield',
                                            label: 'Amount',
                                            labelAlign: 'left',
                                            minValue: 0,
                                            maxValue: 100,
                                            placeholder: '00.00',
                                            cls: 'a-field-icon icon-percent icon-rounded',
                                            ui: 'classic hovered-border',
                                            bind: {
                                                value: '{tax.amount}',
                                            },
                                        },
                                        {
                                            xtype: 'ports.served.combo',
                                            label: 'Ports applicable',
                                            testId: 'portsServedComboTestIdAddTaxDialog',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-port icon-rounded',
                                            multiSelect: true,
                                            forceSelection: false,
                                            bind: {
                                                placeholder: '{tax.port_ids ? null:"Choose ports"}',
                                                value: '{tax.port_ids}',
                                            },
                                        },
                                        {
                                            xtype: 'default.expense.items.combo',
                                            label: 'Service',
                                            testId: 'defaultExpenseItemsComboTestIdAddTaxDialog',
                                            labelAlign: 'left',
                                            placeholder: 'Choose service',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            ui: 'classic hovered-border',
                                            itemCls: 'a-disb-costs-combo',
                                            multiSelect: true,
                                            forceSelection: false,
                                            bind: {
                                                value: '{tax.services_ids}',
                                            },
                                            listeners: {
                                                beforequery: function () {
                                                    let store = this.getStore();
                                                    if (store) {
                                                        store.removeFilter(8787);
                                                        store.addFilter({
                                                            id: 8787,
                                                            filterFn: function (record) {
                                                                if (
                                                                    record &&
                                                                    record.get('category') &&
                                                                    record.get('category').name == 'port'
                                                                )
                                                                    return true;
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('tax');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            enableToggle: true,
            testId: 'addTaxDialogSaveButtonTestId',
            ui: 'action loading',
            bind: {
                text: '{editMode ? "Save" : "Add"}',
            },
            handler: function (me) {
                let dialog = me.up('dialog'),
                    form = dialog.down('formpanel'),
                    vm = me.upVM(),
                    store = vm.get('taxes');
                if (form.validate()) {
                    dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                    let record = vm.get('tax'),
                        editMode = vm.get('editMode');
                    if (editMode) {
                        store.sync({
                            success: function (batch, opt) {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                        dialog.destroy();
                    } else {
                        store.add(record);
                        store.sync({
                            success: function (batch, opt) {
                                Ext.toast('Record created', 1000);
                                dialog.destroy();
                            },
                        });
                    }
                } else {
                    dialog.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                    me.toggle();
                }
            },
        },
    ],
});
