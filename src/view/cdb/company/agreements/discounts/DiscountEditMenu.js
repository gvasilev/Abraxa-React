Ext.define('Abraxa.view.cdb.company.agreements.discounts.DiscountEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'agreements.discounts.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            ui: 'decline',
            separator: true,
            iconCls: 'md-icon-outlined md-icon-delete',
            slug: 'cdbAgreementsDiscountDelete',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let store = me.upVM().get('discounts'),
                    container = this.find('discountRightCard'),
                    record = me.upVM().get('discount');
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
