Ext.define('Abraxa.view.settings.library.expense.ExpensesForm', {
    xtype: 'settings.lybrary.expenses.form',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    cls: 'a-dialog-create a-dialog-has-icon',
    bind: {
        title: '<div class="a-badge a-badge-sof"><i class="material-icons-outlined">timer</i></div>{title}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 500,
    padding: '0 24 0 0',
    viewModel: true,
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
            cls: 'a-general-form',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'textfield',
                    label: false,
                    placeholder: 'Enter item name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{record.title}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Type',
                    placeholder: 'Choose type',
                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                    valueField: 'id',
                    displayField: 'name',
                    required: true,
                    bind: {
                        value: '{record.type}',
                    },
                    store: [
                        {
                            id: 'supplies',
                            name: 'Supplies',
                        },
                        {
                            id: 'bunkers',
                            name: 'Bunkers',
                        },
                        {
                            id: 'disposal',
                            name: 'Disposal',
                        },
                        {
                            id: 'services',
                            name: 'Services',
                        },
                        {
                            id: 'financial',
                            name: 'Financial',
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function (me) {
                    let vm = me.upVM(),
                        store = vm.get('disbursementsItems');

                    store.rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        combo = vm.get('combo'),
                        editor = vm.get('editor'),
                        currentUser = Ext.getCmp('main-viewport').getVM().get('currentUser'),
                        store = null;
                    if (combo) {
                        store = combo.getStore();
                    } else {
                        store = vm.get('disbursementsItems');
                    }
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            if (record.dirty) {
                                store.sync({
                                    success: function (batch, opt) {
                                        Ext.toast('Record updated', 1000);
                                        dialog.destroy();
                                    },
                                    failure: function (batch, operations) {
                                        me.toggle();
                                    },
                                });
                            } else {
                                dialog.destroy();
                            }
                        } else {
                            let recordExists = store.findBy(function (rec) {
                                if (
                                    rec.get('type') == record.get('type') &&
                                    rec.get('title') == record.get('title') &&
                                    rec.get('company_id') == currentUser.get('current_company_id')
                                ) {
                                    return rec;
                                }
                            });
                            if (recordExists != -1) {
                                Ext.Msg.warning('Warning', 'Record already exists!');
                                me.toggle();
                            } else {
                                record.save({
                                    success: function (rec, operation) {
                                        Ext.toast('Record created', 1000);
                                        store.add(rec);
                                        if (editor) {
                                            let grid = editor.up('grid'),
                                                plugin = grid.getPlugin(),
                                                gridColumns = grid.getHeaderContainer().getVisibleColumns(),
                                                recordIndex = grid.getStore().indexOf(editor.ownerCmp.getRecord()),
                                                foundedColumn = Ext.Array.findBy(gridColumns, function (rec) {
                                                    if (
                                                        rec.getDataIndex() &&
                                                        rec.getDataIndex() == editor.ownerCmp.dataIndex
                                                    ) {
                                                        return rec;
                                                    }
                                                }),
                                                foundedColumnIndex = gridColumns.indexOf(foundedColumn);
                                            plugin.startEdit(recordIndex, foundedColumnIndex);
                                        }
                                        dialog.destroy();
                                    },
                                    failure: function (batch, operations) {
                                        me.toggle();
                                    },
                                });
                            }
                        }
                    } else {
                        dialog
                            .down('form\\.error')
                            .setHtml('Please fill in all required fields')
                            .show()
                            .addCls('error');
                        me.toggle();
                    }
                },
            },
        ],
    },
});
