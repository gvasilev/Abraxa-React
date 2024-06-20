import './CreateVirtualAccount';

Ext.define('Abraxa.view.cdb.company.virtualAccounts.VirtualAccountsEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'virtual.accounts.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            iconCls: 'md-icon-outlined md-icon-edit',
            slug: 'cdbFinancialVirtualAccounts',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let record = me.upVM().get('record'),
                    selectedCompany = me.upVM().get('object_record');
                Ext.create('Abraxa.view.cdb.company.virtualAccounts.CreateVirtualAccount', {
                    viewModel: {
                        parent: me.upVM(),
                        data: {
                            selectedCompany: selectedCompany,
                            editMode: true,
                            virtualAccount: record,
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Enable',
            ui: 'tool-text-sm',
            slug: 'cdbFinancialVirtualAccountsDisable',
            bind: {
                permission: '{userPermissions}',
                hidden: '{record.disabled ? false:true}',
            },
            iconCls: 'md-icon-outlined md-icon-visibility',
            handler: function (me) {
                let vm = this.upVM(),
                    grid = vm.get('grid'),
                    record = me.upVM().get('record'),
                    virtualAccounts = vm.get('virtualAccounts');
                selections = grid.getSelections();
                Ext.Msg.confirm(
                    'Enable',
                    'Are you sure you want to enable this direct billings?',
                    function (answer) {
                        if (answer == 'yes') {
                            if (selections && selections.length) {
                                Ext.each(selections, function (rec, index) {
                                    rec.set('disabled', 0);
                                });
                            } else {
                                record.set('disabled', 0);
                            }
                            virtualAccounts.sync({
                                success: function (err, msg) {
                                    Ext.toast('Record updated', 1000);
                                    grid.deselectAll();
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
                            ui: 'action loading',
                            text: 'Enable',
                        },
                    ]
                );
            },
        },
        {
            text: 'Disable',
            ui: 'tool-text-sm',
            slug: 'cdbFinancialVirtualAccountsDisable',
            bind: {
                permission: '{userPermissions}',
                hidden: '{record.disabled ? true:false}',
            },
            iconCls: 'md-icon-outlined md-icon-visibility-off',
            handler: function (me) {
                let vm = this.upVM(),
                    grid = vm.get('grid'),
                    record = me.upVM().get('record'),
                    virtualAccounts = vm.get('virtualAccounts');
                selections = grid.getSelections();
                Ext.Msg.confirm(
                    'Disable',
                    'Are you sure you want to disable this Virtual Account?',
                    function (answer) {
                        if (answer == 'yes') {
                            if (selections && selections.length) {
                                Ext.each(selections, function (rec, index) {
                                    rec.set('disabled', 1);
                                });
                            } else {
                                record.set('disabled', 1);
                            }
                            virtualAccounts.sync({
                                success: function (err, msg) {
                                    Ext.toast('Record updated', 1000);
                                    grid.deselectAll();
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
                            ui: 'decline alt',
                            text: 'Disable',
                        },
                    ]
                );
            },
        },
        {
            text: 'Delete',
            ui: 'decline',
            separator: true,
            iconCls: 'md-icon-outlined md-icon-delete',
            slug: 'cdbFinancialVirtualAccountsDelete',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let store = me.upVM().get('virtualAccounts'),
                    container = this.find('banksRightCard'),
                    record = me.upVM().get('record');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            container.hide();
                            store.remove(record);
                            store.sync({
                                success: function () {
                                    Ext.toast('Record deleted', 1000);
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
                            ui: 'decline alt',
                            text: 'Delete',
                        },
                    ]
                );
            },
        },
    ],
});
