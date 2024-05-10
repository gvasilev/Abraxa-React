Ext.define('Abraxa.view.portcall.disbursements.ApplyDisbursementTemplate', {
    extend: 'Ext.Dialog',
    closable: true,
    minWidth: 1024,
    height: '80%',
    maxHeight: 800,
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: 0,
    layout: 'vbox',
    title: '<div class="a-badge a-badge-apply-template"><i class="material-icons-outlined">playlist_add_check</i></div>Apply Disbursement template',
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'container',
            cls: 'a-general-form',
            items: [
                {
                    xtype: 'combobox',
                    placeholder: 'Choose template',
                    queryMode: 'local',
                    valueField: 'id',
                    width: 250,
                    displayField: 'name',
                    ui: 'field-xl no-border classic',
                    cls: 'task_template_selection a-cursor-pointer',
                    reference: 'selectedTemplate',
                    required: true,
                    bind: {
                        store: '{taskTemplates}',
                        value: '{firstValue}',
                    },
                },
                {
                    xtype: 'div',
                    margin: '0 0 24 0',
                    bind: {
                        html: '<p class="text-info">{selectedTemplate.selection.description}</p>',
                    },
                },
            ],
        },
        {
            xtype: 'grid',
            cls: 'a-offset-grid abraxa-grid a-bt-100',
            ui: 'bordered',
            bind: {
                store: '{templateItems}',
            },
            flex: 1,
            columns: [
                {
                    text: 'Main Port Costs',
                    cls: 'a-column-offset-x24',
                    dataIndex: 'default_expense_item_id',
                    sortable: false,
                    minWidth: 260,
                    cell: {
                        cls: 'a-cell-offset-x24',
                        encodeHtml: false,
                    },
                    flex: 1,
                    menuDisabled: true,
                    editable: true,
                    editor: {
                        field: {
                            xtype: 'default.expense.items.combo',
                            displayField: 'title',
                            placeholder: 'Choose item',
                            valueField: 'id',
                            category: 'financial',
                        },
                        listeners: {
                            beforecomplete: function (editor, value, startValue, eOpts) {
                                var val = editor.getField().getInputValue();
                                var store = editor.getField().getStore();
                                var record = store.query('name', val);
                                if (record.length == 0 && val && val != '') {
                                    return false;
                                }
                            },
                            complete: function (editor) {
                                let store = this.upVM().get('templateItems');
                                var val = editor.getField().getInputValue();
                                let gridRecord = editor.ownerCmp.getRecord();
                                if (val && val != '' && val != 0) {
                                    gridRecord.set('default_expense_item_name', val);
                                    store.sync({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                } else {
                                    store.rejectChanges();
                                }
                            },
                        },
                    },
                    renderer: function (val, selection) {
                        if (val) {
                            return selection.get('default_expense_item_name');
                        } else {
                            return '<span class="a-cell-placeholder">Choose item</span>';
                        }
                    },
                },
                {
                    dataIndex: 'proforma_da',
                    menuDisabled: true,
                    sortable: false,
                    editable: true,
                    text: 'PDA',
                    flex: 1,
                    align: 'right',
                    cell: {
                        cls: 'a-cell-amount a-final-da-cell',
                        align: 'right',
                        encodeHtml: false,
                    },
                    editor: {
                        field: {
                            ui: 'classic',
                            placeholder: '00.00',
                            clearable: false,
                            xtype: 'numberfield',
                        },
                        listeners: {
                            complete: function (editor) {
                                let store = this.upVM().get('templateItems');
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return Ext.util.Format.number(value, '0,000.00');
                        } else {
                            return '<span class="a-cell-placeholder">00.00</span>';
                        }
                    },
                },
                {
                    dataIndex: 'sailing_da',
                    text: 'Sailing DA',
                    menuDisabled: true,
                    sortable: false,
                    editable: true,
                    flex: 1,
                    align: 'right',
                    cell: {
                        cls: 'a-cell-amount',
                        encodeHtml: false,
                        align: 'right',
                    },
                    editor: {
                        field: {
                            ui: 'classic',
                            placeholder: '00.00',
                            clearable: false,
                            xtype: 'numberfield',
                        },
                        listeners: {
                            complete: function (editor) {
                                let store = this.upVM().get('templateItems');
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return Ext.util.Format.number(value, '0,000.00');
                        } else {
                            return '<span class="a-cell-placeholder">00.00</span>';
                        }
                    },
                },
                {
                    dataIndex: 'final_da',
                    text: 'Final DA',
                    menuDisabled: true,
                    flex: 1,
                    sortable: false,
                    editable: true,
                    align: 'right',
                    cell: {
                        cls: 'a-cell-amount a-final-da-cell',
                        encodeHtml: false,
                    },
                    editor: {
                        field: {
                            ui: 'classic',
                            placeholder: '00.00',
                            clearable: false,
                            xtype: 'numberfield',
                        },
                        listeners: {
                            complete: function (editor) {
                                let store = this.upVM().get('templateItems');
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return Ext.util.Format.number(value, '0,000.00');
                        } else {
                            return '<span class="a-cell-placeholder">00.00</span>';
                        }
                    },
                },
                {
                    text: 'Reference',
                    dataIndex: 'ref_number',
                    sortable: false,
                    menuDisabled: true,
                    editable: true,
                    flex: 2,
                    editor: {
                        field: {
                            ui: 'classic',
                            placeholder: AbraxaConstants.placeholders.emptyValue,
                            xtype: 'textfield',
                        },
                        listeners: {
                            complete: function (editor) {
                                let store = this.upVM().get('templateItems');
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                    },
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (!value) return '<span class="a-cell-placeholder">---</span>';

                        return value;
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function () {
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                ui: 'action',
                text: 'Apply',
                handler: function (cmp) {
                    let vm = this.upVM(),
                        template_name = Ext.ComponentQuery.query('[cls~=task_template_selection]')[0],
                        newItems = [],
                        dialog = cmp.up('dialog'),
                        selectedDisbursement = vm.get('selectedDisbursement'),
                        expensesStore = vm.get('expenses'),
                        gridItems = vm.get('disbItemsStore');

                    if (template_name.validate()) {
                        this.up('dialog').down('form\\.error').hide();
                        let template = vm.get('selectedTemplate.selection'),
                            items = vm.get('templateItems');

                        items.each(function (item) {
                            let data = item.getData();
                            data.disbursement_id = selectedDisbursement.get('id');
                            data.portcall_id = selectedDisbursement.get('portcall_id');
                            data.bill_to = selectedDisbursement.get('bill_to_id');
                            data.bill_to_name = selectedDisbursement.get('bill_to_name');
                            newItems.push(data);
                        });
                        if (gridItems.length) {
                            Ext.Msg.confirm(
                                '<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>Warning</div>',
                                'Applying this template will replace all current items.',
                                function (answer) {
                                    if (answer == 'yes') {
                                        Ext.Ajax.request({
                                            url:
                                                Env.ApiEndpoint +
                                                'disbursement_template/apply/3/' +
                                                vm.get('object_record').get('id'),
                                            method: 'POST',
                                            jsonData: {
                                                newItems: newItems,
                                                disbursement_id: selectedDisbursement.get('id'),
                                            },
                                            success: function (response) {
                                                Ext.toast('Record updated', 1500);
                                                expensesStore.load({
                                                    callback: function (records, operation, success) {
                                                        if (success) {
                                                            let container =
                                                                Ext.ComponentQuery.query('disbursements\\.main')[0];
                                                            if (container) {
                                                                container.getVM().set('updateGridItems', new Date());
                                                            }
                                                        }
                                                    },
                                                });
                                                dialog.destroy();
                                            },
                                        });
                                    }
                                },
                                this,
                                [
                                    {
                                        xtype: 'button',
                                        itemId: 'no',
                                        margin: '0 8 0 0',
                                        text: 'Cancel',
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'yes',
                                        ui: 'action alt',
                                        text: 'OK',
                                        separator: true,
                                    },
                                ]
                            );
                        } else {
                            Ext.Ajax.request({
                                url:
                                    Env.ApiEndpoint +
                                    'disbursement_template/apply/3/' +
                                    vm.get('object_record').get('id'),
                                method: 'POST',
                                jsonData: {
                                    newItems: newItems,
                                    disbursement_id: selectedDisbursement.get('id'),
                                },
                                success: function (response) {
                                    Ext.toast('Record updated', 1500);
                                    expensesStore.load({
                                        callback: function (records, operation, success) {
                                            if (success) {
                                                let container =
                                                    Ext.ComponentQuery.query('disbursements\\.container')[0];

                                                if (container) {
                                                    container.getVM().set('updateGridItems', new Date());
                                                }
                                            }
                                        },
                                    });
                                    cmp.up('dialog').destroy();
                                },
                            });
                        }
                    } else {
                        this.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please select a template')
                            .show()
                            .addCls('error');
                    }
                },
            },
        ],
    },
});
