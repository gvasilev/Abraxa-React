Ext.define('Abraxa.view.portcalls.principal.PortcallsPrincipalArchivedMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcalls-principal-archived-menu',
    cls: 'a-main-edit-menu',
    width: 220,
    maxHeight: 140,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Restore',
            iconCls: 'md-icon md-icon-restore',
            slug: 'portcallGridRestore',
            hidden: true,
            bind: {
                hidden: '{portcall.is_archived && !portcall.parent_id  ? false : true}',
                permission: '{userPermissions}',
            },
            handler: function () {
                let vm = this.lookupViewModel(),
                    record = vm.get('portcall'),
                    container = this.find('principalCloseRightContainer'),
                    myTasks = Ext.getCmp('main-viewport').getVM().get('myTasks'),
                    taskStore = Ext.getStore('tasks'),
                    accountStore = Ext.getStore('accounts'),
                    disbursementStore = Ext.getStore('disbursements'),
                    paymentStore = Ext.getStore('payments'),
                    store = vm.get('portcalls');

                Ext.Msg.confirm('Restore', 'Are you sure you want to restore the portcall?', function (btn) {
                    if (btn === 'yes') {
                        record.set('is_archived', 0);
                        record.set('canceled_reason', null);
                        record.set('canceled_comment', null);
                        record.save({
                            success: function (batch) {
                                Ext.toast('Record updated', 1000);
                                if (container) container.hide();

                                if (store) store.add(record);
                                if (myTasks) myTasks.reload();
                                if (taskStore) taskStore.reload();
                                if (accountStore) accountStore.reload();
                                if (disbursementStore) disbursementStore.reload();
                                if (paymentStore) paymentStore.reload();
                            },
                            failure: function (batch) {},
                        });
                    }
                });
            },
        },
        {
            text: 'Delete',
            slug: 'portcallDelete',
            ui: 'decline',
            separator: true,
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon md-icon-outlined md-icon-delete',
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    call_from_grid = vm.get('call_from_grid'),
                    portcalls = vm.get('portcalls'),
                    portcalls_archived = vm.get('portcalls'),
                    is_archived = vm.get('is_archived');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you want to permanently delete the portcall?',
                    function (answer) {
                        if (answer == 'yes') {
                            if (call_from_grid) {
                                if (is_archived) {
                                    portcalls_archived.remove(record);
                                    portcalls_archived.sync({
                                        success: function () {
                                            Ext.toast('Record deleted', 2500);
                                        },
                                    });
                                } else {
                                    portcalls_archived.remove(record);
                                    portcalls_archived.sync({
                                        success: function () {
                                            Ext.toast('Record deleted', 2500);
                                        },
                                    });
                                }
                            } else {
                                record.erase({
                                    success: function (record, operation) {
                                        Ext.toast('Record deleted', 2500);
                                        if (portcalls_archived) {
                                            portcalls_archived.remove(record);
                                            portcalls.archived.commitChanges();
                                        }
                                        window.location.hash = 'portcalls';
                                    },
                                });
                            }
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
