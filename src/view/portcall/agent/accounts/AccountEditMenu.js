Ext.define('Abraxa.view.portcall.account.AccountEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcall.account.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            ui: 'decline',
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (me) {
                let store = me.upVM().get('accounts'),
                    account = me.upVM().get('account'),
                    payments = me.upVM().get('payments'),
                    members = account.members().count(),
                    disbursements = account.disbursements().count();
                payments_exists = payments.queryBy(function (rec, id) {
                    return rec.get('org_id') == account.get('org_id');
                }).items;
                if (members || disbursements || payments_exists.length)
                    return Ext.Msg.alert(
                        'Warning',
                        'This record cannot be deleted due to availability of associated records'
                    );

                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            store.remove(account);
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
