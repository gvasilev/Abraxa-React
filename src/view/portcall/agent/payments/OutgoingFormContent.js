Ext.define('Abraxa.view.portlog.payment.OutgoingFormContent', {
    extend: 'Ext.Container',
    xtype: 'outgoing.form.content',
    cls: 'a-dialog-form a-general-form',
    defaults: {
        labelAlign: 'left',
        ui: 'classic hovered-border',
    },
    items: [
        {
            xtype: 'accounts.combo',
            forceSelection: true,
            label: 'Billing party',
            placeholder: 'Choose account',
            reference: 'billingParty',
            valueField: 'org_id',
            cls: 'a-field-icon icon-business-center icon-rounded',
            floatedPicker: {
                minWidth: 220,
            },
            hidden: true,
            disabled: false,
            bind: {
                value: '{payment.org_id}',
                disabled: '{account ? true : editMode ? true:false }',
            },
            listeners: {
                select: function (me, selection) {
                    if (selection) {
                        let record = me.upVM().get('payment');
                        record.set('org_name', selection.get('org_name'));
                    }
                },
            },
        },
        {
            xtype: 'organization.combo',
            placeholder: 'Choose Company',
            label: 'Payment to',
            required: true,
            reference: 'outgoingPayment',
            cls: 'a-field-icon icon-business-center icon-rounded',
            floatedPicker: {
                minWidth: 288,
            },
            bind: {
                value: '{payment.to_org_id}',
            },
            listeners: {
                painted: function (me) {
                    me.setError(null);
                    const toOrgId = [me.upVM().get('payment').get('to_org_id')];
                    if (toOrgId) {
                        me.getStore().load({
                            params: {
                                org_ids: JSON.stringify(toOrgId),
                            },
                            scope: this,
                        });
                        me.setValue(me.upVM().get('payment.to_org_id'));
                        me.setInputValue(me.upVM().get('payment.to_org_name'));
                    }
                },
                select: function (me, selection) {
                    if (selection) {
                        let record = me.upVM().get('payment');
                        record.set('to_org_name', selection.get('org_name'));
                    }
                },
                clearicontap: function (me) {
                    let record = me.upVM().get('payment');
                    record.set('to_org_name', null);
                },
            },
        },
        {
            xtype: 'selectfield',
            flex: 1,
            itemTpl: new Ext.XTemplate('{[this.renderTpl(values)]}', {
                renderTpl: function (values) {
                    if (values.type == 'bank') {
                        let status = values.is_verified ? 'verified' : 'not';
                        return (
                            '<div class="hbox a-verification a-' +
                            status +
                            '"><div class="a-badge a-badge-bank mr-12"><i class="md-icon-outlined">account_balance</i></div><div class="a-bank"><div class="a-bank-name">' +
                            values.name +
                            '<i class="md-icon-outlined a-verification-icon ml-2"></i></div><div class="a-bank-iban sm-type">' +
                            values.number_type +
                            ': ' +
                            values.iban +
                            '</div></div><div class="a-bank-currency">' +
                            values.currency +
                            '</div></div>'
                        );
                    }
                    if (values.type == 'virtual_account') {
                        return (
                            '<div class="hbox"><div class="a-badge a-badge-bank mr-12"><i class="md-icon-outlined">account_balance_wallet</i></div><div class="a-bank"><div class="a-bank-name">' +
                            values.name +
                            '</div><div class="a-bank-iban sm-type">' +
                            values.balance +
                            '</div></div><div class="a-bank-currency">' +
                            values.currency +
                            '</div></div>'
                        );
                    }
                },
            }),
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            label: 'Payee account',
            reference: 'outGoingBank',
            floatedPicker: {
                groupHeader: {
                    cls: 'a-header-offset-x24',
                    tpl: new Ext.XTemplate(
                        '<div class="h5 a-header-{[this.parceString(values.name)]}">{[this.parceString(values.name)]} ({count})</div>',
                        {
                            parceString: function (value) {
                                if (value == 'bank') {
                                    return 'BANK ACCOUNTS';
                                } else {
                                    return 'VIRTUAL ACCOUNTS';
                                }
                            },
                        }
                    ),
                },
            },
            placeholder: 'Choose',
            itemCls: 'a-account-listitem',
            cls: 'a-field-icon icon-account icon-rounded',
            required: false,
            slug: 'portcallPaymentPayeeAccount',
            bind: {
                value: '{payment.to_id}',
                store: '{outgoingBanksStore}',
                permission: '{userPermissions}',
            },
            listeners: {
                painted: function (me) {
                    me.setError(null);
                },
                select: function (me, selection) {
                    if (selection) {
                        let record = me.upVM().get('payment');
                        record.set('to_type', selection.get('model_name'));
                        record.set('to_currency', selection.get('currency'));
                        record.set('from_kind', selection.get('type'));
                        if (record.get('currency') && record.get('currency') != selection.get('currency')) {
                            Abraxa.getApplication()
                                .getController('AbraxaController')
                                .getExchange(record.get('currency'), selection.get('currency'))
                                .then(function (response) {
                                    if (response && response.length) {
                                        record.set('to_exchange_rate', response[0].exchange_rate);
                                    }
                                });
                        } else if (record.get('currency') == selection.get('currency')) {
                            record.set('to_exchange_rate', 1);
                        }
                    }
                },
            },
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            defaults: {
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'bank.account.combo',
                    flex: 1,
                    label: 'My account',
                    placeholder: 'Choose',
                    itemCls: 'a-account-listitem',
                    cls: 'a-field-icon icon-account icon-rounded',
                    reference: 'incomingBank',
                    required: false,
                    slug: 'portcallPaymentMyAccount',
                    bind: {
                        value: '{payment.from_id}',
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.setError(null);
                        },
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('payment');
                                record.set('from_type', selection.get('model_name'));
                                record.set('from_currency', selection.get('currency'));
                                if (record.get('currency') != selection.get('currency')) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .getExchange(record.get('currency'), selection.get('currency'))
                                        .then(function (response) {
                                            if (response && response.length) {
                                                record.set('from_exchange_rate', response[0].exchange_rate);
                                            }
                                        });
                                } else if (record.get('currency') == selection.get('currency')) {
                                    record.set('from_exchange_rate', 1);
                                }
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
                    margin: '0 0 0 4',
                    bind: {
                        hidden: '{incomingBank.selection ? false:true}',
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
                        let comboSelection = me.upVM().get('incomingBank.selection');
                        if (comboSelection) {
                            let tool = Ext.create('Abraxa.view.common.tooltips.BankInfoTooltip');
                            tool.setData(comboSelection.getData());
                            tool.showBy(me);
                        }
                    },
                },
            ],
        },
        {
            xtype: 'abraxa.datefield',
            label: 'Payment date',
            cls: 'a-field-icon icon-date icon-rounded',
            ui: 'classic hovered-border',
            clearable: false,
            hidden: true,
            required: false,
            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
            slug: 'portcallPayments',
            bind: {
                permission: '{userPermissions}',
                value: '{payment.payment_date}',
                hidden: '{payment.kind == "outgoing" || payment.kind == "incoming" ? false:true}',
                required: '{payment.kind == "outgoing" || payment.kind == "incoming" ? true:false}',
            },
            listeners: {
                painted: function (me) {
                    me.setError(null);
                },
            },
        },
        {
            xtype: 'combobox',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            label: 'Related object',
            placeholder: 'Choose',
            cls: 'a-field-icon icon-layers icon-rounded',
            slug: 'portcallPaymentRelatedObject',
            floatedPicker: {
                minWidth: 220,
            },
            bind: {
                store: '{relatedObjects}',
                value: '{payment.paymentable_id}',
                permission: '{userPermissions}',
            },
            listeners: {
                beforequery: function () {
                    let store = this.getStore(),
                        account = this.upVM().get('billingParty.selection');

                    if (store && account) {
                        store.removeFilter(8787);
                        store.addFilter({
                            id: 8787,
                            property: 'account_id',
                            operator: '=',
                            value: account.get('id'),
                            exactMatch: true,
                        });
                    }
                },
                select: function (me, selection) {
                    if (selection) {
                        let record = me.upVM().get('payment');
                        record.set('paymentable_type', selection.get('model_name'));
                        if (selection.get('group_id')) record.set('disbursement_group_id', selection.get('group_id'));
                    }
                },
            },
        },
        {
            xtype: 'selectfield',
            label: 'Type',
            placeholder: 'Choose type',
            labelAlign: 'left',
            required: true,
            ui: 'classic hovered-border',
            cls: 'a-field-icon icon-short icon-rounded',
            options: [
                {
                    value: 'advance',
                    text: 'Advance',
                },
                {
                    value: 'final',
                    text: 'Final',
                },
                {
                    value: 'additional',
                    text: 'Additional',
                },
                {
                    value: 'refund',
                    text: 'Refund',
                },
            ],
            bind: {
                value: '{payment.type}',
            },
            listeners: {
                select: function (me, selection) {
                    if (selection && selection.get('value') == 'refund') {
                        let record = me.upVM().get('payment');
                        record.set('is_refund', true);
                    }
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
                    xtype: 'abraxa.pricefield',
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
                    slug: 'portcallPaymentAmount',
                    bind: {
                        value: '{payment.currency}',
                        permission: '{userPermissions}',
                    },
                    floatedPicker: {
                        listeners: {
                            select: function (me, selection) {
                                let billingParty = me.upVM().get('billingParty.selection'),
                                    payment = me.upVM().get('payment');
                                if (selection) {
                                    if (billingParty && billingParty.get('account_currency')) {
                                        if (billingParty.get('account_currency') != selection.get('currency')) {
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .getExchange(
                                                    selection.get('currency'),
                                                    billingParty.get('account_currency')
                                                )
                                                .then(function (response) {
                                                    if (response && response.length) {
                                                        payment.set('exchange_rate', response[0].exchange_rate);
                                                    }
                                                });
                                        } else if (billingParty.get('account_currency') == selection.get('currency')) {
                                            payment.set('exchange_rate', 1);
                                        }
                                    }
                                    if (payment.get('from_currency')) {
                                        if (payment.get('from_currency') != selection.get('currency')) {
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .getExchange(selection.get('currency'), payment.get('from_currency'))
                                                .then(function (response) {
                                                    if (response && response.length) {
                                                        payment.set('from_exchange_rate', response[0].exchange_rate);
                                                    }
                                                });
                                        } else if (payment.get('from_currency') == selection.get('currency')) {
                                            payment.set('from_exchange_rate', 1);
                                        }
                                    }
                                    if (payment.get('to_currency')) {
                                        if (payment.get('to_currency') != selection.get('currency')) {
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .getExchange(selection.get('currency'), payment.get('to_currency'))
                                                .then(function (response) {
                                                    if (response && response.length) {
                                                        payment.set('to_exchange_rate', response[0].exchange_rate);
                                                    }
                                                });
                                        } else if (payment.get('to_currency') == selection.get('currency')) {
                                            payment.set('to_exchange_rate', 1);
                                        }
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
            slug: 'portcallPaymentExchangeRate',
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
                        value: '{payment.exchange_rate}',
                        required: '{payment.exchange_rate ? true:false}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'c-light-grey',
                    margin: '0 0 0 32',
                    bind: {
                        html: '{billingParty.selection.account_currency} {payment.calculated_amount:number("0,000.00")}',
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
                hidden: '{outGoingBank.selection.type == "virtual_account" && (outGoingBank.selection.currency != payment.currency) ? false : true}',
            },
            items: [
                {
                    xtype: 'abraxa.currency.field',
                    flex: 5,
                    label: 'Exchange rate(VA)',
                    placeholder: '0,000.00',
                    cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                    required: true,
                    bind: {
                        value: '{payment.to_exchange_rate}',
                        // hidden: '{outGoingBank.selection.type == "virtual_account" && (outGoingBank.selection.currency != payment.currency) ? true:false}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'c-light-grey',
                    margin: '0 0 0 32',
                    bind: {
                        html: '{outGoingBank.selection.currency} {(payment.amount * payment.to_exchange_rate):number("0,000.00")}',
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
            labelAlign: 'top',
            cls: 'a-field-icon icon-short',
            ui: 'no-border no-underline',
            placeholder: 'Enter description (optional)',
            xtype: 'textareafield',
            slug: 'portcallPaymentDescription',
            bind: {
                value: '{payment.description}',
                permission: '{userPermissions}',
            },
        },
    ],
});
