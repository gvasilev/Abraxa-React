Ext.define('Abraxa.view.cdb.company.virtualAccounts.CreateFunds', {
    extend: 'Ext.Dialog',
    xtype: 'virtual.accounts.funds.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 520,
    padding: '8 24 0 72',
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">paid</i></div>Add funds',
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
                                    defaults: {
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                    },
                                    items: [
                                        {
                                            xtype: 'organization.combo',
                                            placeholder: 'Choose Company',
                                            label: 'From',
                                            required: true,
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            floatedPicker: {
                                                minWidth: 268,
                                            },
                                            bind: {
                                                value: '{payment.to_org_id}',
                                                inputValue: '{payment.to_org_name}',
                                            },
                                            listeners: {
                                                painted: function (me) {
                                                    me.setError(null);
                                                },
                                                select: function (me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('payment');
                                                        record.set('to_org_name', selection.get('org_name'));
                                                        record.set('from_type', selection.get('model_name'));
                                                        record.set('org_name', selection.get('org_name'));
                                                        record.set('org_id', selection.get('org_id'));
                                                    }
                                                },
                                                clearicontap: function (me, selection) {
                                                    let record = me.upVM().get('payment');
                                                    record.set('to_org_name', null);
                                                    record.set('from_type', null);
                                                    record.set('org_name', null);
                                                    record.set('org_id', null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            label: 'Payment date',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            ui: 'classic hovered-border',
                                            clearable: false,
                                            required: true,
                                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            bind: {
                                                value: '{payment.payment_date}',
                                            },
                                            listeners: {
                                                painted: function (me) {
                                                    me.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                            },
                                            defaults: {
                                                clearable: false,
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.currency.field',
                                                    placeholder: '0,000.00',
                                                    flex: 1,
                                                    label: 'Amount',
                                                    cls: 'a-field-icon icon-money icon-rounded',
                                                    slug: 'portcallPaymentAmount',
                                                    bind: {
                                                        value: '{payment.amount}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'common-combo-currency',
                                                    label: '',
                                                    width: 80,
                                                    bind: {
                                                        value: '{payment.currency}',
                                                    },
                                                    floatedPicker: {
                                                        listeners: {
                                                            select: function (me, selection) {
                                                                let payment = me.upVM().get('payment'),
                                                                    virtualAccount = me.upVM().get('virtualAccount'),
                                                                    defaultCurrency = me.upVM().get('defaultCurrency');
                                                                if (selection) {
                                                                    if (
                                                                        virtualAccount.get('currency') !=
                                                                        selection.get('currency')
                                                                    ) {
                                                                        Abraxa.getApplication()
                                                                            .getController('AbraxaController')
                                                                            .getExchange(
                                                                                selection.get('currency'),
                                                                                virtualAccount.get('currency')
                                                                            )
                                                                            .then(function (response) {
                                                                                if (response && response.length) {
                                                                                    payment.set(
                                                                                        'to_exchange_rate',
                                                                                        response[0].exchange_rate
                                                                                    );
                                                                                }
                                                                            });
                                                                    } else if (
                                                                        defaultCurrency == selection.get('currency')
                                                                    ) {
                                                                        payment.set('to_exchange_rate', 1);
                                                                    }
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            defaults: {
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                            },
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            hidden: true,
                                            bind: {
                                                hidden: '{showExchangeRate}',
                                                permission: '{userPermissions}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.currency.field',
                                                    flex: 5,
                                                    label: 'Exchange rate',
                                                    placeholder: '0,000.00',
                                                    cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                                                    required: false,
                                                    bind: {
                                                        value: '{payment.to_exchange_rate}',
                                                        required: '{payment.to_exchange_rate ? true:false}',
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    cls: 'c-light-grey',
                                                    margin: '0 0 0 32',
                                                    bind: {
                                                        html: '{virtualAccount.currency} {(payment.amount * payment.to_exchange_rate):number("0,000.00")}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset',
                                            html: '',
                                        },
                                        {
                                            xtype: 'textareafield',
                                            ui: 'no-border no-underline',
                                            cls: 'a-field-icon icon-short',
                                            placeholder: 'Enter note (optional)',
                                            bind: {
                                                value: '{payment.description}',
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
            ui: 'action loading',
            handler: function (me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    company = vm.get('selectedCompany'),
                    editMode = vm.get('editMode'),
                    virtualAccountPayments = vm.get('virtualAccountPayments'),
                    virtualAccounts = me.upVM().get('virtualAccounts'),
                    payment = vm.get('payment');

                virtualAccounts.getProxy().setExtraParams({
                    org_id: company.get('id'),
                });

                form = dialog.down('formpanel');
                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    if (editMode) {
                        // virtualAccounts.sync({
                        //     success: function () {
                        //         Ext.toast('Record updated', 1000);
                        //         dialog.destroy();
                        //     }
                        // });
                    } else {
                        payment.save({
                            success: function (rec) {
                                virtualAccountPayments.add(rec);
                                virtualAccountPayments.commitChanges();
                                Ext.ComponentQuery.query('[xtype=company]')[0].getVM().set('newUpdate', new Date());
                                virtualAccounts.load();
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
