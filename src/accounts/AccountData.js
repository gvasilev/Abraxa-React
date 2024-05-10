Ext.define('Abraxa.view.portcall.accounts.AccountData', {
    extend: 'Ext.Container',
    xtype: 'account.data',
    items: [
        {
            xtype: 'container',
            cls: 'a-data-row',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            defaults: {
                flex: 1,
                labelAlign: 'left',
            },
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Billing party',
                    cls: 'a-data-left',
                    encodeHtml: false,
                    bind: {
                        value: '{selectedAccount.org_name}',
                    },
                    disabled: true,
                    renderer: function (value) {
                        return '<a href="javascript:void(0)" class="fw-b org_name">' + value + '</a>';
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a.org_name',
                            fn: function (el) {
                                let email = this.component.upVM().get('selectedAccount.org_email');
                                if (email) {
                                    let organizations = this.component.upVM().get('organizations'),
                                        orgRecord = organizations.findRecord('org_email', email, 0, false, false, true);
                                    if (orgRecord) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showOrganizationTooltip(orgRecord.get('org_id'), el);
                                    } else if (email) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showTenantByEmail(email, el);
                                    }
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'displayfield',
                    label: 'Preferred currency',
                    cls: 'a-data-right',
                    encodeHtml: false,
                    bind: {
                        value: '<span class="fw-b">{selectedAccount.account_currency}</span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-data-row',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            defaults: {
                flex: 1,
                labelAlign: 'left',
                listeners: {
                    focusleave: function () {
                        var record = this.upVM().get('selectedAccount');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'organization.combo',
                    label: 'Care of (C/o)',
                    cls: 'a-data-left',
                    ui: 'classic hovered-border',
                    placeholder: 'Choose company',
                    slug: 'portcallBillingPartiesCareOf',
                    subObject: 'accounts',
                    floatedPicker: {
                        minWidth: 293,
                    },
                    hideMode: 'opacity',
                    bind: {
                        value: '{selectedAccount.co_id}',
                        inputValue: '{selectedAccount.co_name}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                        permission: '{userPermissions}',
                        objectPermission: '{objectPermissions}',
                    },
                    listeners: {
                        select: function () {
                            let record = this.upVM().get('selectedAccount'),
                                selection = this.getSelection();

                            record.set('co_name', selection.get('org_name'));
                            record.set('co_email', selection.get('org_email'));
                        },
                        clearicontap: function () {
                            let record = this.upVM().get('selectedAccount');

                            record.set('co_name', null);
                            record.set('co_email', null);
                        },
                    },
                },
                {
                    xtype: 'displayfield',
                    label: 'ROE',
                    cls: 'a-data-right',
                    slug: 'portcallDisbursementROE',
                    viewModel: {
                        formulas: {
                            formattedROE: function (get) {
                                const value = get('selectedAccount.exchange_rate');
                                return Abraxa.utils.Functions.formatROE(value);
                            },
                        },
                    },
                    encodeHtml: false,
                    bind: {
                        permission: '{userPermissions}',
                        value: '<span class="fw-b">{selectedAccount.base_currency} / {selectedAccount.account_currency} = {formattedROE} </span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-data-row',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            defaults: {
                flex: 1,
                labelAlign: 'left',
            },
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Client ID',
                    cls: 'a-data-left',
                    disabled: true,
                    bind: {
                        value: '{selectedAccount.organization.org_debtor_number ? selectedAccount.organization.org_debtor_number : "---"}',
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
                        listeners: {
                            focusleave: function () {
                                var record = this.upVM().get('selectedAccount');
                                if (record.dirty) {
                                    record.save({
                                        success: function () {
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
                            bind: {
                                store: '{paymentTerms}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                value: '{selectedAccount.payment_term_id}',
                                readOnly: '{nonEditable ? true : false}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            maxValue: 100,
                            width: 42,
                            clearable: false,
                            placeholder: '0',
                            textAlign: 'right',
                            hideMode: 'opacity',
                            slug: 'portcallBillingPartiesPreFunding',
                            subObject: 'accounts',
                            bind: {
                                value: '{selectedAccount.payment_term_value}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                readOnly: '{nonEditable ? true : false}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
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
            ],
        },
        {
            xtype: 'container',
            cls: 'a-data-row',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            defaults: {
                flex: 1,
                labelAlign: 'left',
                listeners: {
                    focusleave: function () {
                        var record = this.upVM().get('selectedAccount');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Customer ref.',
                    cls: 'a-data-left',
                    ui: 'classic hovered-border',
                    placeholder: 'Enter reference',
                    slug: 'portcallBillingPartiesCustomerReference',
                    subObject: 'accounts',
                    hideMode: 'opacity',
                    bind: {
                        value: '{selectedAccount.customer_reference}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                        permission: '{userPermissions}',
                        objectPermission: '{objectPermissions}',
                    },
                    stateful: ['label'],
                    stateId: 'someLAbel',
                    listeners: {
                        painted: function (field) {
                            editor.on('complete', function (item, value) {
                                field.setLabel(value);
                            });
                        },
                        dblclick: {
                            element: 'labelElement', //bind to the underlying body property on the panel
                            fn: function (target, el) {
                                editor.startEdit(el);
                            },
                        },
                    },
                },
                {
                    xtype: 'displayfield',
                    label: 'Amount to request',
                    cls: 'a-data-right',
                    encodeHtml: false,
                    bind: {
                        value: '<b class="c-light-grey mr-8">{selectedAccount.account_currency}</b><b class="fw-b">{amountToRequest:number("0,000.00")}</b>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-data-row',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            defaults: {
                flex: 1,
                labelAlign: 'left',
                listeners: {
                    focusleave: function () {
                        var record = this.upVM().get('selectedAccount');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Extra reference',
                    cls: 'a-data-left',
                    ui: 'classic hovered-border',
                    placeholder: 'Enter reference',
                    slug: 'portcallBillingPartiesExtraReference',
                    subObject: 'accounts',
                    hideMode: 'opacity',
                    bind: {
                        value: '{selectedAccount.extra_reference}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                        permission: '{userPermissions}',
                        objectPermission: '{objectPermissions}',
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
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            label: 'Requested payment',
                            encodeHtml: false,
                            bind: {
                                value: '<b class="c-light-grey mr-8">{selectedAccount.account_currency}</b><b class="fw-b">{requestedPayments:number("0,000.00")}</b>',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'c-light-grey',
                            padding: '0 0 0 8',
                            bind: {
                                html: '{balancePercent}%',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-data-row',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            defaults: {
                labelAlign: 'left',
            },
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Appointment date',
                    cls: 'a-data-left',
                    flex: 1,
                    bind: {
                        value: '{object_record.created_at}',
                    },
                    renderer: function (value) {
                        return moment(value).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                    },
                },
                {
                    xtype: 'bank.account.combo',
                    label: 'Payment account',
                    testId: 'portcallBillingPartiesPaymentAccountCombo',
                    cls: 'a-data-right',
                    ui: 'classic hovered-border',
                    reference: 'paymentAccount',
                    flex: 1,
                    padding: '0 42 0 0',
                    matchFieldWidth: false,
                    subObject: 'accounts',
                    slug: 'portcallBillingPartiesPaymentAccount',
                    bind: {
                        value: '{selectedAccount.bank_id}',
                        inputValue: '{selectedAccount.bank_name}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                        permission: '{userPermissions}',
                        objectPermission: '{objectPermissions}',
                    },
                    floatedPicker: {
                        listeners: {
                            select: 'updatePaymentAccount',
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
                            selectedAccount = me.upVM().get('selectedAccount'),
                            isOwner = me.upVM().get('is_owner');
                        if (isOwner && comboSelection) {
                            let tool = Ext.create('Abraxa.view.common.tooltips.BankInfoTooltip');
                            tool.setData(comboSelection.getData());
                            tool.showBy(me);
                        } else {
                            if (selectedAccount && selectedAccount.get('bank_id') && selectedAccount.get('bank')) {
                                let tool = Ext.create('Abraxa.view.common.tooltips.BankInfoTooltip');
                                tool.setData(selectedAccount.get('bank'));
                                tool.showBy(me);
                            }
                        }
                    },
                },
            ],
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
                wrap: true,
            },
            defaults: {
                width: '50%',
                labelAlign: 'left',
                bind: {
                    readOnly: '{nonEditable ? true : false}',
                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                    permission: '{userPermissions}',
                    objectPermission: '{objectPermissions}',
                },
                listeners: {
                    focusleave: function () {
                        var record = this.upVM().get('selectedAccount');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
            },
            customComponentHolderId: 'billingPartyDetails',
            bind: {
                customComponents: '{currentCompany.custom_components}',
            },
        },
    ],
});

var editor = new Ext.Editor({
    // update the innerHTML of the bound element
    // when editing completes
    updateEl: true,
    alignment: 'l-l',
    autoSize: {
        width: 'boundEl',
    },
    field: {
        xtype: 'textfield',
    },
});

// form.header.getTitle().textEl.on('dblclick', function (e, t) {
//     editor.startEdit(t);
// });

// form.getTargetEl().on('dblclick', function (e, t) {
//     editor.startEdit(t);
//     // Manually focus, since clicking on the label will focus the text field
//     editor.getField().focus(50, true);
// });
