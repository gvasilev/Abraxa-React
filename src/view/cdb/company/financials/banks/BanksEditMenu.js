Ext.define('Abraxa.view.cdb.company.financials.banks.BanksEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'financials.banks.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            ui: 'decline',
            separator: true,
            iconCls: 'md-icon-outlined md-icon-delete',
            slug: 'cdbFinancialBankAccountsDelete',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let store = me.upVM().get('banks'),
                    container = this.find('banksRightCard'),
                    record = me.upVM().get('bank');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            container.hide();
                            store.remove(record);
                            store.sync({
                                success: function () {
                                    Ext.ComponentQuery.query('[xtype=company]')[0].getVM().set('newUpdate', new Date());
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
