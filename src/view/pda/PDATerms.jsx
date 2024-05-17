Ext.define('Abraxa.view.pda.PDATerms', {
    extend: 'Ext.Container',
    xtype: 'pda.terms',
    cls: 'a-summary-left-container',
    layout: 'vbox',
    hidden: true,
    items: [
        {
            cls: 'a-portcall-info',
            flex: 1,
            scrollable: true,
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
                    padding: '16 24',
                    cls: 'a-portcall-data',
                    defaults: {
                        cls: 'a-data-item',
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                        bind: {
                            disabled: '{pda.status !== "draft" || nonEditable}',
                        },
                    },
                    items: [
                        {
                            xtype: 'organization.combo',
                            testId: 'pdaTermBillinDetailsBillingPartyCombo',
                            label: 'Billing party',
                            placeholder: 'Choose company',
                            bind: {
                                value: '{pda.billing_party_id}',
                                inputValue: '{pda.billing_party_name}',
                            },
                            cls: 'a-field-icon icon-business icon-rounded',
                            listeners: {
                                select: function (field) {
                                    let inquiry = field.upVM().get('pda'),
                                        object_record = field.upVM().get('object_record'),
                                        selection = field.getSelection();

                                    inquiry.set({
                                        billing_party_id: selection ? selection.get('org_id') : null,
                                        billing_party_name: selection ? selection.get('org_name') : null,
                                    });

                                    if (inquiry.dirty) {
                                        inquiry.save({
                                            success: function (record, operation) {
                                                Abraxa.utils.Functions.updateInquiry(object_record);
                                                Ext.toast('Record updated');
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'organization.combo',
                            testId: 'pdaTermBillinDetailsBillingPartyComboCO',
                            label: 'C/O',
                            placeholder: 'Choose company',
                            bind: {
                                value: '{pda.co_id}',
                                inputValue: '{pda.co_name}',
                            },
                            cls: 'a-field-icon icon-business icon-rounded',
                            listeners: {
                                select: function (field) {
                                    let inquiry = field.upVM().get('pda'),
                                        object_record = field.upVM().get('object_record'),
                                        selection = field.getSelection();

                                    inquiry.set({
                                        co_id: selection ? selection.get('org_id') : null,
                                        co_name: selection ? selection.get('org_name') : null,
                                    });

                                    if (inquiry.dirty) {
                                        inquiry.save({
                                            success: function (record, operation) {
                                                Abraxa.utils.Functions.updateInquiry(object_record);
                                                Ext.toast('Record updated');
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Voy. number',
                            cls: 'noneditable',
                            ui: 'viewonly classic',
                            readOnly: true,
                            bind: {
                                value: '{pda.inquiry.voyage_number}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-titlebar a-bb-100 a-bt-100',
                    height: 65,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'title',
                            title: '<span>Invoice details</span>',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '16 24',
                    cls: 'a-portcall-data',
                    defaults: {
                        cls: 'a-data-item',
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                        bind: {
                            disabled: '{pda.status !== "draft" || nonEditable}',
                        },
                        listeners: {
                            focusleave: function (field) {
                                let inquiryOffer = field.upVM().get('pda'),
                                    object_record = field.upVM().get('object_record');

                                if (inquiryOffer.dirty) {
                                    inquiryOffer.save({
                                        success: function (record, operation) {
                                            Abraxa.utils.Functions.updateInquiry(object_record);
                                            Ext.toast('Record updated');
                                        },
                                    });
                                }
                            },
                        },
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Proforma No.',
                            placeholder: 'Proforma number',
                            bind: {
                                value: '{pda.proforma_number}',
                            },
                        },
                        {
                            xtype: 'abraxa.datefield',
                            testId: 'pdaTermInvoiceDetailsProformaDateProformaDate',
                            label: 'Proforma date',
                            bind: {
                                value: '{pda.proforma_date}',
                            },
                        },
                        {
                            xtype: 'abraxa.datefield',
                            testId: 'pdaTermInvoiceDetailsProformaDateDueDate',

                            label: 'Due date',
                            bind: {
                                value: '{pda.due_date}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Reference No.',
                            placeholder: 'Reference number',
                            bind: {
                                value: '{pda.reference_number}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-titlebar a-bb-100 a-bt-100',
                    height: 65,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'title',
                            title: '<span>Payment details</span>',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '16 24',
                    cls: 'a-portcall-data',
                    defaults: {
                        cls: 'a-data-item',
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                        bind: {
                            disabled: '{pda.status !== "draft" || nonEditable}',
                        },
                        listeners: {
                            focusleave: function (field) {
                                let inquiryOffer = field.upVM().get('pda'),
                                    object_record = field.upVM().get('object_record');

                                if (inquiryOffer.dirty) {
                                    inquiryOffer.save({
                                        success: function (record, operation) {
                                            Abraxa.utils.Functions.updateInquiry(object_record);
                                            Ext.toast('Record updated');
                                        },
                                    });
                                }
                            },
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-data-right',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                                bind: {
                                    disabled: '{pda.status !== "draft" || nonEditable}',
                                },
                                listeners: {
                                    focusleave: function () {
                                        var record = this.upVM().get('pda'),
                                            object_record = this.upVM().get('object_record');
                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Abraxa.utils.Functions.updateInquiry(object_record);
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'selectfield',
                                    testId: 'pdaTermBillingDetailsBillingPartySelectfieldPreFunding',
                                    label: 'Pre-funding',
                                    encodeHtml: false,
                                    displayField: 'term_name',
                                    valueField: 'id',
                                    placeholder: 'Choose',
                                    flex: 1,
                                    matchFieldWidth: true,
                                    clearable: true,
                                    slug: 'portcallBillingPartiesPreFunding',
                                    subObject: 'accounts',
                                    hideMode: 'opacity',
                                    store: {
                                        type: 'payment.terms',
                                        autoLoad: true,
                                    },
                                    bind: {
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        value: '{pda.payment_term_id}',
                                        readOnly: '{nonEditable ? true : false}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    maxValue: 100,
                                    width: 42,
                                    clearable: false,
                                    placeholder: '0',
                                    textAlign: 'right',
                                    bind: {
                                        value: '{pda.payment_term_value}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        readOnly: '{nonEditable ? true : false}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'c-light-grey',
                                    padding: '0 0 0 2',
                                    html: '%',
                                },
                            ],
                        },
                        {
                            xtype: 'textfield',
                            label: 'Payment ref.',
                            placeholder: 'Payment reference',
                            bind: {
                                value: '{pda.payment_reference}',
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-right',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                                bind: {
                                    disabled: '{pda.status !== "draft" || nonEditable}',
                                },
                            },
                            items: [
                                {
                                    xtype: 'bank.account.combo',
                                    testId: 'pdaTermBillingDetailsBillingPartySelectfieldPaymentAccount',
                                    label: 'Payment account',
                                    cls: 'a-data-right',
                                    ui: 'classic hovered-border',
                                    reference: 'paymentAccount',
                                    flex: 1,
                                    padding: '0 42 0 0',
                                    matchFieldWidth: false,
                                    bind: {
                                        // store: '{bankStoreForAccount}',
                                        value: '{pda.bank_id}',
                                        inputValue: '{pda.bank_name}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                    },
                                    listeners: {
                                        select: function (comboBox, newValue, eOpts) {
                                            // let comboBox = picker.ownerCmp;
                                            let record = comboBox.upVM().get('pda'),
                                                selection = comboBox.getSelection();

                                            if (!record || !selection) return;
                                            // If the selected bank is not in the current Combo store, this means that
                                            // the user has changed his Bank, Office, or Company Settings.
                                            // To avoid showing wrong data or deleting the old bank from the record,
                                            // we add it artificially to the Combo store.
                                            // Once a new bank is selected, the old one will not be present in the combo after refresh.

                                            let banks = [];

                                            if (!comboBox.getStore().getById(selection.getId())) {
                                                let user = comboBox.upVM('main-viewmodel').get('currentUser');
                                                let addedBankIds = [];

                                                if (user) {
                                                    // First check if current user has office and banks
                                                    if (user.get('current_office_id')) {
                                                        let office = user.getOffice();
                                                        if (
                                                            office &&
                                                            office.get('banks') &&
                                                            office.get('banks').length
                                                        ) {
                                                            office.get('banks').forEach((bank) => {
                                                                let bankModel = bank.bank;

                                                                if (!addedBankIds.includes(bankModel.id)) {
                                                                    bankModel.is_default = Boolean(bank.is_default);
                                                                    banks.push(bankModel);
                                                                    addedBankIds.push(bankModel.id);
                                                                }
                                                            });
                                                        }
                                                    }

                                                    // Get banks from company even if there are office banks, since there can be offices without a default bank
                                                    let company = user.get('company');

                                                    if (company && company.banks && company.banks.length) {
                                                        company.banks.forEach((bank) => {
                                                            if (!addedBankIds.includes(bank.id)) {
                                                                banks.push(bank);
                                                                addedBankIds.push(bank.id);
                                                            }
                                                        });
                                                    }
                                                }

                                                let bankToBeSet;

                                                if (banks && banks.length) {
                                                    // First see if old selected bank is found
                                                    bankToBeSet = banks.find(
                                                        (bank) => bank.id === parseInt(selection.getId())
                                                    );

                                                    // If old bank not found, find a default bank
                                                    if (!bankToBeSet || !bankToBeSet.id) {
                                                        bankToBeSet = banks.find((bank) => bank.is_default);
                                                    }
                                                }

                                                // If bank to be set is found, select it in the combo
                                                if (bankToBeSet && bankToBeSet.id) {
                                                    comboBox.getStore().add(bankToBeSet);
                                                    comboBox.setSelection(comboBox.getStore().getById(bankToBeSet.id));
                                                    selection = comboBox.getSelection();
                                                }
                                            }

                                            if (comboBox.getStore().getById(selection.getId())) {
                                                record.set('bank_id', selection.getId());
                                                record.set('bank_name', selection.get('bank_name'));
                                            } else {
                                                // If the selected value still doesn't exist, clear the selection
                                                record.set('bank_id', null);
                                                record.set('bank_name', null);
                                                comboBox.setSelection(null);
                                            }
                                        },
                                        focusleave: function () {
                                            var record = this.upVM().get('pda'),
                                                object_record = this.upVM().get('object_record');
                                            if (record && record.dirty) {
                                                if (!record.get('bank_id')) record.set('bank_name', null);
                                                record.save({
                                                    success: function () {
                                                        Abraxa.utils.Functions.updateInquiry(object_record);
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-info',
                                    ui: 'tool-sm round',
                                    width: 30,
                                    height: 30,
                                    right: 0,
                                    bind: {
                                        disabled: false,
                                    },
                                    tooltip: {
                                        anchorToTarget: true,
                                        align: 'bc-tc?',
                                        html: 'View details',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        closeAction: 'destroy',
                                    },
                                    handler: function (me) {
                                        let comboSelection = me.upVM().get('paymentAccount.selection'),
                                            selectedAccount = me.upVM().get('pda'),
                                            isOwner = me.upVM().get('is_owner');

                                        if (comboSelection) {
                                            let tool = Ext.create('Abraxa.view.common.tooltips.BankInfoTooltip', {
                                                anchorToTarget: true,
                                                anchor: true,
                                            });
                                            tool.setData(comboSelection.getData());
                                            tool.showBy(me);
                                        }
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
