Ext.define('Abraxa.view.portcall.disbursements.ConvertDisbursement', {
    extend: 'Ext.Dialog',
    xtype: 'disbursement.convert',
    testId: 'disbursementConvert',
    cls: 'chameleon_disbursements_convert_popup a-dialog-create a-dialog-has-icon',
    minWidth: 480,
    padding: '0 24 24 72',
    closable: true,
    draggable: false,
    bind: {
        title: '<div class="a-badge a-badge-financial"><i class="md-icon-outlined">attach_money</i></div>{record.type =="sda" ? "Create" : "Convert"} disbursement',
    },
    items: [
        {
            xtype: 'formpanel',
            padding: 0,
            ui: 'no-border-radius',
            items: [
                {
                    xtype: 'form.error',
                    docked: 'top',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
                },
                {
                    xtype: 'textfield',
                    label: false,
                    clearable: false,
                    placeholder: 'Disbursement name',
                    testId: 'disbursementConvertDisbursementNameField',
                    ui: 'field-xl no-border classic',
                    required: true,
                    name: 'name',
                    bind: {
                        value: '{record.name}',
                    },
                    listeners: {
                        painted: function () {
                            this.focus();
                        },
                    },
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'disbursementConvertCancelBtn',

            margin: '0 8 0 0',
            handler: function (btn) {
                btn.upVM().get('record').reject();
                this.up('dialog').destroy();
            },
        },
        {
            enableToggle: true,
            testId: 'disbursementConvertConvertBtn',
            bind: {
                text: '{record.type == "sda" ? "Create" : "Convert"}',
                ui: 'action loading',
                cls: 'chameleon_portcall_disbursement_convert_popup_confirm_button',
            },
            handler: function (btn) {
                let form = this.up('dialog').down('formpanel'),
                    dialog = this.up('dialog');

                if (form.validate()) {
                    let oldDisbursement = btn.upVM().get('oldDisbursement'),
                        newDisbursement = btn.upVM().get('record'),
                        disbursementStore = btn.upVM().get('disbursementStore'),
                        disbursementsGrid = Ext.ComponentQuery.query('disbursements\\.grid')[0],
                        expenses = btn.upVM().get('expenses');

                    oldDisbursement.set('status', 'completed');
                    newDisbursement.set('status', 'draft');
                    newDisbursement.set('template_id', null);

                    newDisbursement.save({
                        success: function (newDisb) {
                            disbursementStore.add(newDisb);
                            Ext.ComponentQuery.query('[itemId=disbursementDetails]')[0].setMasked(true);
                            if (newDisbursement.get('type') != 'sda') {
                                let group = disbursementStore.queryBy(function (rec, id) {
                                    return rec.get('group_id') == newDisb.get('group_id');
                                }).items;

                                Ext.each(group, function (disbursement) {
                                    if (disbursement.get('type') != newDisb.get('type'))
                                        disbursement.set(newDisb.get('type') + '_id', newDisb.get('id'));
                                });
                                disbursementStore.sync({
                                    success: function () {
                                        if (expenses && expenses.getCount()) {
                                            expenses.each(function (item) {
                                                item.set(
                                                    newDisbursement.get('type') + '_id',
                                                    newDisbursement.get('id')
                                                );
                                                item.set(
                                                    newDisbursement.get('type') + '_discounted_price',
                                                    item.get(oldDisbursement.get('type') + '_discounted_price')
                                                );
                                                item.set(
                                                    newDisbursement.get('type') + '_vat_amount',
                                                    item.get(oldDisbursement.get('type') + '_vat_amount')
                                                );
                                                item.set(
                                                    newDisbursement.get('type') + '_discount_amount',
                                                    item.get(oldDisbursement.get('type') + '_discount_amount')
                                                );
                                                if (item.vouchers().count()) {
                                                    item.set(
                                                        newDisbursement.get('type') + '_price',
                                                        item.get(oldDisbursement.get('type') + '_price')
                                                    );
                                                    item.set(
                                                        newDisbursement.get('type') + '_calculated_price',
                                                        item.get(oldDisbursement.get('type') + '_calculated_price')
                                                    );
                                                    item.set(
                                                        newDisbursement.get('type') + '_final_price',
                                                        item.get(oldDisbursement.get('type') + '_final_price')
                                                    );
                                                }
                                            });
                                            expenses.sync({
                                                success: function () {
                                                    disbursementStore.commitChanges();
                                                    disbursementsGrid.select(newDisb);
                                                    Ext.toast('Record created');
                                                },
                                            });
                                        } else {
                                            disbursementStore.commitChanges();
                                            disbursementsGrid.select(newDisb);
                                            Ext.toast('Record created');
                                        }
                                    },
                                });
                            } else {
                                disbursementStore.commitChanges();
                                disbursementsGrid.select(newDisb);
                                Ext.toast('Record created');
                            }
                            dialog.destroy();
                        },
                    });
                } else {
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
