Ext.define('Abraxa.view.portcall.accounts.AccountCreate', {
    extend: 'Ext.Dialog',
    xtype: 'account.create',
    testId: 'portcallAcountsCreate',
    title: '<div class="a-badge a-badge-account"><i class="md-icon-outlined">corporate_fare</i></div>New billing party',
    cls: 'chameleon_accounts_add_popup a-dialog-create a-dialog-has-icon',
    minWidth: 540,
    minHeight: 380,
    padding: '8 24 8 72',
    closable: true,
    draggable: false,
    viewModel: {
        data: {
            accountAdvanced: false,
        },
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
                    xtype: 'organization.combo',
                    testId: 'portcallAccountCreateBillToCombo',
                    label: 'Bill to',
                    placeholder: 'Choose company',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    name: 'bill_to',
                    labelAlign: 'left',
                    required: true,
                    floatedPicker: {
                        minWidth: 288,
                    },
                    bind: {
                        value: '{record.org_id}',
                        readOnly: '{nonEditable ? true : false}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                        select: function () {
                            let record = this.upVM().get('record'),
                                selection = this.getSelection();

                            record.set('org_name', selection.get('org_name'));
                            record.set('org_email', selection.get('org_email'));
                            if (selection.get('preferred_currency')) {
                                record.set('account_currency', selection.get('preferred_currency'));
                            }
                        },
                    },
                },
                {
                    xtype: 'common-combo-currency',
                    testId: 'portcallAccountCreatePrefCurrencyCombo',

                    placeholder: 'Preferred currency',
                    labelAlign: 'left',
                    label: 'Preferred currency',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-money icon-rounded',
                    bind: {
                        value: '{record.account_currency}',
                        readOnly: '{nonEditable ? true : false}',
                    },
                    listeners: {
                        select: function () {
                            let record = this.upVM().get('record'),
                                selection = this.getSelection();

                            record.set('exchange_rate', selection.get('exchange_rate'));
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    placeholder: 'Customer reference',
                    testId: 'portcallAccountCreateCustomerReferenceField',
                    labelAlign: 'left',
                    label: 'Customer reference',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    name: 'customer_reference',
                    slug: 'portcallBillingPartiesCustomerReference',
                    bind: {
                        value: '{record.customer_reference}',
                        readOnly: '{nonEditable ? true : false}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'organization.combo',
                    testId: 'portcallAccountCreateCareOfCombo',
                    label: 'Care of (C/o)',
                    placeholder: 'Choose company',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    name: 'co_id',
                    labelAlign: 'left',
                    hidden: true,
                    slug: 'portcallBillingPartiesCareOf',
                    floatedPicker: {
                        minWidth: 288,
                    },
                    bind: {
                        hidden: '{accountAdvanced ? false : true}',
                        value: '{record.co_id}',
                        readOnly: '{nonEditable ? true : false}',
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        select: function () {
                            let record = this.upVM().get('record'),
                                selection = this.getSelection();

                            record.set('co_name', selection.get('org_name'));
                            record.set('co_email', selection.get('org_email'));
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    placeholder: 'Extra reference',
                    testId: 'portcallAccountCreateExtraRefField',
                    labelAlign: 'left',
                    label: 'Extra reference',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    name: 'extra_reference',
                    slug: 'portcallBillingPartiesExtraReference',
                    hidden: true,
                    bind: {
                        hidden: '{accountAdvanced ? false : true}',
                        value: '{record.extra_reference}',
                        readOnly: '{nonEditable ? true : false}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'button',
                    ui: 'tool-text-sm normal',
                    testId: 'portcallAccountCreateHideShowAdvancedBtn',
                    margin: '16 0',
                    enableToggle: true,
                    bind: {
                        text: '{accountAdvanced ? "Hide advanced" : "Show advanced"}',
                        iconCls:
                            '{accountAdvanced ? "md-icon-outlined md-icon-unfold-less" : "md-icon-outlined md-icon-unfold-more"}',
                    },
                    handler: function () {
                        let advancedMode = this.upVM().get('accountAdvanced');

                        if (advancedMode) {
                            this.upVM().set('accountAdvanced', false);
                        } else {
                            this.upVM().set('accountAdvanced', true);
                        }
                    },
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'portCallsAccountCreateCancelBtn',
            margin: '0 8 0 0',
            handler: function (btn) {
                btn.upVM().get('record').reject();
                this.up('dialog').destroy();
            },
        },
        {
            enableToggle: true,
            testId: 'portCallsAccountCreateSaveBtn',
            bind: {
                text: '{editMode ? "Save":"Create"}',
                ui: 'action loading',
                cls: 'chameleon_portcall_disbursement_add_popup_confirm_button',
            },
            handler: function (btn) {
                let form = this.up('dialog').down('formpanel'),
                    dialog = this.up('dialog');

                if (form.validate()) {
                    let store = btn.upVM().get('accounts'),
                        record = btn.upVM().get('record'),
                        object_record = btn.upVM().get('object_record'),
                        record_exists = store.queryBy(function (rec) {
                            return rec.get('org_id') == record.get('org_id');
                        }).items.length;

                    if (record_exists) {
                        form.down('form\\.error')
                            .setHtml('You have already have a billing party with this company')
                            .show()
                            .addCls('error');
                        btn.toggle();
                        // Ext.Msg.warning('Warning', 'You have already have a billing party with this company');
                        // Ext.Msg.alert('Oops', 'Organization with this email already exists!');
                    } else {
                        record.save({
                            success: function () {
                                store.add(record);
                                object_record.set('updated_at', new Date());
                                Ext.toast('Record created');
                                mixpanel.track('Create billing party');
                                dialog.destroy();
                            },
                        });
                    }
                } else {
                    btn.toggle();
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
