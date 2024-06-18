Ext.define('Abraxa.view.portlog.payment.RequestRightContent', {
    extend: 'Ext.Container',
    xtype: 'request.right.content',
    testId: 'requestRightContent',
    cls: 'a-data-item',
    defaults: {
        labelAlign: 'left',
        ui: 'classic hovered-border',
    },
    items: [
        {
            xtype: 'accounts.combo',
            forceSelection: true,
            label: 'Billing party',
            testId: 'requestRightContentBillingPartyCombo',
            placeholder: 'Choose account',
            reference: 'billingParty',
            valueField: 'org_id',
            cls: 'a-field-icon icon-business-center icon-rounded',
            floatedPicker: {
                minWidth: 220,
            },
            required: true,
            disabled: false,
            hidden: true,
            bind: {
                value: '{payment.org_id}',
                disabled: '{account ? true : editMode ? true:false }',
                readOnly: '{nonEditable ? true : false}',
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
            testId: 'requestRightContentChooseCompanyCombo',
            label: 'Request from',
            hidden: false,
            required: true,
            cls: 'a-field-icon icon-business-center icon-rounded',
            floatedPicker: {
                minWidth: 336,
            },
            bind: {
                value: '{payment.from_id}',
                inputValue: '{payment.from_org_name}',
                readOnly: '{nonEditable ? true : false}',
            },
            listeners: {
                select: function (me, selection) {
                    if (selection) {
                        let record = me.upVM().get('payment');
                        record.set('from_type', selection.get('model_name'));
                    }
                },
                clearicontap: function (me) {
                    let record = me.upVM().get('payment');
                    record.set('from_type', null);
                },
            },
        },
        {
            xtype: 'bank.account.combo',
            flex: 1,
            label: 'My account',
            testId: 'requestRightContentMyAccountCombo',
            placeholder: 'Choose',
            reference: 'incomingBank',
            itemCls: 'a-account-listitem',
            cls: 'a-field-icon icon-account icon-rounded',
            slug: 'portcallPaymentMyAccount',
            required: true,
            bind: {
                value: '{payment.to_id}',
                permission: '{userPermissions}',
                readOnly: '{nonEditable ? true : false}',
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
                        if (record.get('currency') != selection.get('currency')) {
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
            xtype: 'abraxa.datefield',
            label: 'Due date',
            testId: 'requestRightContentDueDateField',
            cls: 'a-field-icon icon-date icon-rounded',
            ui: 'classic hovered-border',
            clearable: false,
            required: true,
            hidden: false,
            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
            slug: 'portcallPayments',
            bind: {
                permission: '{userPermissions}',
                value: '{payment.payment_date}',
                hidden: '{payment.kind == "requested" ? false:true}',
                required: '{payment.kind == "requested" ? true:false}',
                readOnly: '{nonEditable ? true : false}',
            },
        },
        {
            xtype: 'combobox',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            label: 'Related object',
            testId: 'requestRightContentRelatedObjectCombo',
            placeholder: 'Choose',
            cls: 'a-field-icon icon-layers icon-rounded',
            slug: 'portcallPaymentRelatedObject',
            floatedPicker: {
                minWidth: 220,
            },
            bind: {
                store: '{relatedObjects}',
                value: '{payment.paymentable_id}',
                inputValue: '{payment.paymentable.name}',
                permission: '{userPermissions}',
                readOnly: '{nonEditable ? true : false}',
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
                    }
                },
            },
        },
        {
            xtype: 'selectfield',
            label: 'Type',
            testId: 'requestRightContentTypeCombo',
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
            ],
            bind: {
                value: '{payment.type}',
                readOnly: '{nonEditable ? true : false}',
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
                    testId: 'requestRightContentAmountField',
                    cls: 'a-field-icon icon-money icon-rounded',
                    slug: 'portcallPaymentAmount',
                    bind: {
                        value: '{payment.amount}',
                        permission: '{userPermissions}',
                        readOnly: '{nonEditable ? true : false}',
                    },
                },
                {
                    xtype: 'common-combo-currency',
                    label: '',
                    width: 80,
                    slug: 'portcallPaymentAmount',
                    testId: 'requestRightContentPaymentAmountCurrencyCombo',
                    bind: {
                        value: '{payment.currency}',
                        permission: '{userPermissions}',
                        readOnly: '{nonEditable ? true : false}',
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
                    testId: 'requestRightContentExchangeRateField',
                    placeholder: '0,000.00',
                    cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                    required: false,
                    bind: {
                        value: '{payment.exchange_rate}',
                        required: '{payment.exchange_rate ? true:false}',
                        readOnly: '{nonEditable ? true : false}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'c-light-grey',
                    testId: 'requestRightContentExchangeRateLabel',
                    margin: '0 0 0 32',
                    bind: {
                        html: '{billingParty.selection.account_currency} {payment.calculated_amount:number("0,000.00")}',
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'divider divider-offset offset-x24',
            html: '',
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'label',
                    html: 'Created by',
                    testId: 'requestRightContentCreatedByLabel',
                    maxWidth: 147,
                },
                {
                    xtype: 'public.updated.by',
                    cls: 'chatter-avatar',
                    testId: 'requestRightContentCreatedByAvatar',
                    bind: {
                        data: {
                            user: '{payment.created_by_user}',
                            updated_at: '{payment.created_at}',
                        },
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'divider divider-offset offset-x24',
            html: '',
        },
        {
            labelAlign: 'top',
            cls: 'a-field-icon icon-short',
            ui: 'no-border no-underline',
            placeholder: 'Enter description (optional)',
            xtype: 'textareafield',
            testId: 'requestRightContentDescriptionField',
            slug: 'portcallPaymentDescription',
            bind: {
                value: '{payment.description}',
                permission: '{userPermissions}',
                readOnly: '{nonEditable ? true : false}',
            },
        },
    ],
});
