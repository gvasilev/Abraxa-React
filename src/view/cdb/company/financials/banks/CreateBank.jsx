Ext.define('Abraxa.view.cdb.company.financials.banks.CreateBank', {
    extend: 'Ext.Dialog',
    xtype: 'financials.banks.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 620,
    minHeight: 580,
    maxHeight: 860,
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    title: '<div class="a-badge a-badge-bank"><i class="md-icon-outlined">account_balance</i></div>New bank account',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-dialog-form a-general-form',
                                    maxWidth: 520,
                                    defaults: {
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            placeholder: 'Enter bank name',
                                            bind: {
                                                value: '{bank.name}',
                                            },
                                            required: true,
                                            listeners: {
                                                painted: function (me) {
                                                    me.focus();
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Branch number',
                                            placeholder: 'Branch number',
                                            cls: 'a-field-icon icon-rounded icon-short',
                                            bind: {
                                                value: '{bank.bank_branch_number}',
                                            },
                                        },
                                        {
                                            xtype: 'common-combo-currency',
                                            label: 'Currency',
                                            editable: false,
                                            required: true,
                                            placeholder: 'Choose currency',
                                            cls: 'a-field-icon icon-money icon-rounded',
                                            slug: 'cdbFinancialBankAccounts',
                                            matchFieldWidth: true,
                                            bind: {
                                                value: '{bank.currency}',
                                                permission: '{userPermissions}',
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
                                            labelWidth: 202,
                                            ui: null,
                                            margin: '0 0 4 0',
                                            reference: 'number_type',
                                            publishes: 'value',
                                            style: 'align-items: center;',
                                            bind: {
                                                value: '{bank.number_type}',
                                            },
                                            items: [
                                                {
                                                    label: 'IBAN',
                                                    ui: 'medium',
                                                    name: 'number_type',
                                                    value: 'IBAN',
                                                },
                                                {
                                                    label: 'ABA',
                                                    ui: 'medium',
                                                    name: 'number_type',
                                                    value: 'ABA',
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'IBAN',
                                            placeholder: 'Enter IBAN',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            slug: 'cdbFinancialBankAccounts',
                                            bind: {
                                                value: '{bank.iban}',
                                                permission: '{userPermissions}',
                                                label: '{number_type.value == "IBAN" ? "IBAN" : "ABA"}',
                                                placeholder:
                                                    '{number_type.value == "IBAN" ? "Enter IBAN" : "Enter ABA"}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'SWIFT',
                                            placeholder: 'SWIFT code',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            slug: 'cdbFinancialBankAccounts',
                                            bind: {
                                                value: '{bank.swift_number}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Account No',
                                            placeholder: 'Account No',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            slug: 'cdbFinancialBankAccounts',
                                            bind: {
                                                value: '{bank.account_number}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            label: 'Beneficiary',
                                            systemField: 'beneficiary',
                                            placeholder: 'Enter company',
                                            bind: {
                                                value: '{bank.beneficiary}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Address',
                                            placeholder: 'Bank address',
                                            cls: 'a-field-icon icon-location icon-rounded',
                                            slug: 'cdbFinancialBankAccounts',
                                            bind: {
                                                value: '{bank.address}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Correspondent bank',
                                            placeholder: 'Correspondent bank',
                                            cls: 'a-field-icon icon-account_balance icon-rounded',
                                            bind: {
                                                value: '{bank.corresponding_bank}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset',
                                            html: '',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            label: 'Bank ID IFS',
                                            placeholder: 'Enter Bank ID IFS',
                                            cls: 'a-field-icon icon-rounded icon-short',
                                            bind: {
                                                value: '{bank.ifs_id}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Reference number',
                                            placeholder: 'Enter reference number',
                                            cls: 'a-field-icon icon-rounded icon-short',
                                            bind: {
                                                value: '{bank.reference_number}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('bank');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Create',
            testId: 'createBankDialogCreateButton',
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    company = vm.get('selectedCompany'),
                    banks = vm.get('banks'),
                    bank = vm.get('bank'),
                    form = dialog.down('formpanel');

                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    bank.getProxy().setExtraParams({
                        org_id: company.get('org_id'),
                    });
                    bank.save({
                        success: function (rec) {
                            banks.add(rec);
                            banks.commitChanges();
                            Ext.ComponentQuery.query('[xtype=company]')[0].getVM().set('newUpdate', new Date());
                            Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                            dialog.destroy();
                        },
                    });
                } else {
                    me.toggle();
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
