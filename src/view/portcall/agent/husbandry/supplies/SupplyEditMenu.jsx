Ext.define('Abraxa.view.portcall.husbandry.supplies.SupplyEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcall.supply.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            hidden: true,
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (me) {
                let controller = me.find('supplyMainGrid').getController(),
                    record = me.upVM().get('supply');
                controller.supplyDialog(record.get('type'), true, record);
            },
        },
        {
            text: 'Delete',
            slug: 'portcallSupplyDelete',
            ui: 'decline',
            // separator: true,
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (me) {
                let store = me.upVM().get('expenses'),
                    vouchers = me.upVM().get('vouchers'),
                    container = this.find('suppliesRightCard'),
                    record = me.upVM().get('supply'),
                    disbursementsStore = me.upVM().get('disbursements'),
                    recordDisbursements = [
                        record.get('pda_id'),
                        record.get('dda_id'),
                        record.get('fda_id'),
                        record.get('sda_id'),
                    ],
                    nonDraftStatus = disbursementsStore.queryBy(function (disbursement) {
                        if (recordDisbursements.includes(disbursement.get('id')))
                            return disbursement.get('status') != 'draft';
                    }).items.length;

                if (nonDraftStatus)
                    return Ext.Msg.alert(
                        'Warning',
                        'Unable to delete.<br>The service is assigned to a non-draft disbursement.'
                    );

                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            container.hide();
                            store.remove(record);
                            store.sync({
                                success: function () {
                                    if (record.vouchers() && record.vouchers().getCount()) {
                                        record.vouchers().each(function (rec) {
                                            rec.set('expense_id', null);
                                        });
                                        record
                                            .vouchers()
                                            .getProxy()
                                            .setExtraParams({
                                                portcall_id: record.get('portcall_id'),
                                            });
                                        record.vouchers().sync({
                                            success: function () {
                                                vouchers.reload();
                                            },
                                        });
                                    }
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
