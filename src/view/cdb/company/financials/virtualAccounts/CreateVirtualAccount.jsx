import '../../../../../core/components/AbraxaNumberfield';

Ext.define('Abraxa.view.cdb.company.virtualAccounts.CreateVirtualAccount', {
    extend: 'Ext.Dialog',
    xtype: 'virtual.accounts.create',
    testId: 'virtAccountsCreate',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 540,
    minHeight: 580,
    maxHeight: 860,
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">credit_score</i></div>{editMode ? "Edit float line":"New float line"}',
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    testId: 'virtAccountsCreateForm',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            testId: 'virtAccountsCreateFormErr',
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
                                        slug: 'cdbFinancialVirtualAccounts',
                                        bind: {
                                            permission: '{userPermissions}',
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            testId: 'virtAccountsCreateAccNameField',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            placeholder: 'Enter account name',
                                            bind: {
                                                value: '{virtualAccount.name}',
                                            },
                                            required: true,
                                            listeners: {
                                                painted: function(me) {
                                                    me.focus();
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Account ID',
                                            testId: 'virtAccountsCreateAccIDField',
                                            placeholder: 'Enter account ID',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            bind: {
                                                value: '{virtualAccount.account_number}',
                                            },
                                        },
                                        {
                                            xtype: 'common-combo-currency',
                                            label: 'Currency',
                                            testId: 'virtAccountsCreateCurrencyField',
                                            editable: false,
                                            placeholder: 'Choose currency',
                                            required: true,
                                            cls: 'a-field-icon icon-money icon-rounded',
                                            matchFieldWidth: true,
                                            bind: {
                                                value: '{virtualAccount.currency}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.numberfield',
                                            label: 'Minimum balance',
                                            testId: 'virtAccountsCreateMinBalanceField',
                                            labelAlign: 'left',
                                            placeholder: '0,000.00',
                                            cls: 'a-field-icon icon-money icon-rounded a-append a-append-units',
                                            ui: 'classic hovered-border',
                                            bind: {
                                                value: '{virtualAccount.minimum_balance}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset',
                                            html: '',
                                        },
                                        {
                                            xtype: 'textareafield',
                                            testId: 'virtAccountsCreateEnterDescField',
                                            ui: 'no-border no-underline',
                                            cls: 'a-field-icon icon-short',
                                            placeholder: 'Enter description (optional)',
                                            bind: {
                                                value: '{virtualAccount.description}',
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
            testId: 'virtAccountsCreateCancelBtn',
            margin: '0 8 0 0',
            handler: function() {
                let record = this.upVM().get('virtualAccount');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            bind: {
                text: '{editMode ? "Save":"Create"}',
            },
            enableToggle: true,
            testId: 'virtAccountsCreateSaveBtn',
            ui: 'action loading',
            handler: function(me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    company = vm.get('selectedCompany'),
                    editMode = vm.get('editMode'),
                    virtualAccounts = vm.get('virtualAccounts'),
                    virtualAccount = vm.get('virtualAccount');
                form = dialog.down('formpanel');
                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    if (editMode) {
                        virtualAccounts.sync({
                            success: function() {
                                Ext.toast('Record updated', 1000);
                                dialog.destroy();
                            },
                        });
                    } else {
                        virtualAccount.getProxy().setExtraParams({
                            org_id: company.get('org_id'),
                        });
                        virtualAccount.save({
                            success: function(rec) {
                                virtualAccounts.add(rec);
                                virtualAccounts.commitChanges();
                                Ext.ComponentQuery.query('[xtype=company]')[0].getVM().set('newUpdate', new Date());
                                dialog.destroy();
                            },
                        });
                    }
                } else {
                    me.toggle();
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
