Ext.define('Abraxa.view.settings.company.AddEditBank', {
    xtype: 'settings.company.add.edit.banks',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-bank"><i class="md-icon-outlined">account_balance</i></div>{editMode ? "Edit bank":"Add bank"}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 480,
    padding: '0 24 0 72',
    controller: 'company.controller',
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogNameTestId',
                    label: false,
                    placeholder: 'Enter bank name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{record.bank_name}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogBranchTestId',
                    label: 'Branch number',
                    placeholder: 'Branch number',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        value: '{record.bank_branch_number}',
                    },
                },
                {
                    xtype: 'common-combo-currency',
                    testId: 'addBankDialogCurrencyComboTestId',
                    label: 'Currency',
                    editable: false,
                    placeholder: 'Choose currency',
                    cls: 'a-field-icon icon-rounded icon-money',
                    bind: {
                        value: '{record.currency}',
                    },
                },
                {
                    xtype: 'div',
                    margin: '16 0',
                    html: '<hr>',
                },
                {
                    xtype: 'radiogroup',
                    label: 'IBAN/ABA',
                    ui: null,
                    labelWidth: 161,
                    reference: 'number_type',
                    margin: '0 0 4 0',
                    publishes: 'value',
                    style: 'align-items: center;',
                    bind: {
                        value: '{record.number_type}',
                    },
                    items: [
                        {
                            label: 'IBAN',
                            ui: 'medium',
                            name: 'number_type',
                            value: 'IBAN',
                            bind: {
                                checked: '{record.number_type == "IBAN"}',
                            },
                        },
                        {
                            label: 'ABA',
                            ui: 'medium',
                            name: 'number_type',
                            value: 'ABA',
                            bind: {
                                checked: '{record.number_type == "ABA"}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogIBANTestId',
                    label: 'IBAN',
                    placeholder: 'IBAN number',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        label: '{number_type.value == "IBAN" ? "IBAN" : "ABA"}',
                        value: '{record.iban}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogSWIFTTestId',
                    label: 'SWIFT',
                    placeholder: 'SWIFT number',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        value: '{record.swift_number}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogAccountNumberTestId',
                    label: 'Account No',
                    placeholder: 'Account No',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{record.account_number}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogBeneficiaryTestId',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    label: 'Beneficiary',
                    placeholder: 'Enter company',
                    bind: {
                        value: '{record.beneficiary}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogAddressTestId',
                    label: 'Address',
                    placeholder: 'Bank address',
                    cls: 'a-field-icon icon-rounded icon-location',
                    bind: {
                        value: '{record.address}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'addBankDialogCorespondentBankTestId',
                    label: 'Correspondent bank',
                    placeholder: 'Correspondent bank',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        value: '{record.corresponding_bank}',
                    },
                },
                {
                    xtype: 'container',
                    margin: '16 0 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Set as default',
                            bind: {
                                disabled: '{disableDefault}',
                                checked: '{record.is_default}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function () {
                    this.upVM().get('companyBankDetails').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                testId: 'addBankDialogSaveButtonTestId',
                ui: 'action loading',
                handler: 'onBankCreate',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
            },
        ],
    },
});
