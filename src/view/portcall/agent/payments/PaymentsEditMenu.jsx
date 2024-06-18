Ext.define('Abraxa.view.portcall.payments.PaymentsEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'payments.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            slug: 'portcallPaymentDelete',
            iconCls: 'md-icon-outlined md-icon-edit',
            bind: {
                hidden: '{paymentsMenu.selection.tab == "drafts" ? false : true}',
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let record = me.upVM().get('payment');
                Abraxa.getApplication().getController('AbraxaController').addPayment(me, record);
            },
        },
        {
            text: 'Delete',
            slug: 'portcallPaymentDelete',
            ui: 'decline',
            // separator: true,
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (me) {
                let store = me.upVM().get('payments'),
                    container = Ext.ComponentQuery.query('[xtype=payments\\.right.\\card]')[0],
                    record = me.upVM().get('payment');
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
                                failure: function failure(response, batch) {
                                    var msg = response.operations[0].error.response.responseJson.error;
                                    Ext.create('Ext.MessageBox', {
                                        ui: 'warning',
                                        title: 'Delete Cancelled',
                                        innerCls: 'a-bgr-white',
                                        message: msg,
                                        width: 500,
                                        dataTitle: 'Warning',
                                        modal: true,
                                        draggable: false,
                                        bbar: {
                                            manageBorders: false,
                                            items: [
                                                '->',
                                                {
                                                    xtype: 'button',
                                                    ui: 'action',
                                                    text: 'Ok',
                                                    handler: function () {
                                                        store.rejectChanges();
                                                        this.up('dialog').destroy();
                                                    },
                                                },
                                            ],
                                        },
                                    }).show();
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
