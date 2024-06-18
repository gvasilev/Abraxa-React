Ext.define('Abraxa.view.portcall.principal.disbursements.BillingPartyDetails', {
    extend: 'Ext.Container',
    xtype: 'BillingPartyDetails',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        formulas: {
            preFundingValue: {
                bind: {
                    bindTo: '{selectedBillingParty}',
                    deep: true,
                },
                get: function (billingParty) {
                    const paymentName = billingParty?.get('payment_term_name');
                    const paymentValue = billingParty?.get('payment_term_value');
                    if (paymentName) {
                        return `${paymentValue}% ${paymentName}`;
                    }
                    return '';
                },
            },
        },
    },
    items: [
        {
            layout: 'hbox',
            margin: '0 0 32 0',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    html: '<div class="fw-b text-uppercase mb-8">Account</div>',
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Billing party',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '<a href="javascript:void(0)" class="fw-b org_name">{selectedBillingParty.org_name}</a>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a.org_name',
                                            fn: function (el) {
                                                let email = this.component.upVM().get('selectedBillingParty.org_email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true
                                                        );
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
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Care of (C/o)',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedBillingParty.co_name ? selectedBillingParty.co_name : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Client ID',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedBillingParty.organization.client_id ? selectedBillingParty.organization.client_id : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    html: '<div class="fw-b text-uppercase mb-8">Currency</div>',
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Preferred currency',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedBillingParty.account_currency}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'ROE',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{selectedBillingParty.exchange_rate}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Pre-funding',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{preFundingValue ? preFundingValue : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    html: '<div class="fw-b text-uppercase mb-8">Reference</div>',
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Customer ref.',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{selectedBillingParty.customer_reference ? selectedBillingParty.customer_reference : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Extra reference',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{selectedBillingParty.extra_reference ? selectedBillingParty.extra_reference : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Appointment date',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{portCallRecord.nomination.date_received ? (portCallRecord.nomination.date_received:date("d M Y")) : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    html: '<div class="fw-b text-uppercase mb-8">Agent account</div>',
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Bank',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{selectedBillingParty.bank ? selectedBillingParty.bank.bank_name : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'IBAN',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{selectedBillingParty.bank ? selectedBillingParty.bank.iban : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Beneficiary',
                                },
                                {
                                    cls: 'a-display-value hbox',
                                    bind: {
                                        html: "{selectedBillingParty.bank.beneficiary ? (\"<a href='javascript:void(0)' class='fw-b org_name'>\" + selectedBillingParty.bank.beneficiary + \"</a><i class='material-icons md-18 md-icon-info c-grey cursor-pointer ml-4'></i>\") : \"<span class='a-placeholder'>---</span>\"}",
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'i',
                                            fn: function (el) {
                                                let bank = this.component.upVM().get('selectedBillingParty.bank');
                                                if (bank) {
                                                    let tool = Ext.create(
                                                        'Abraxa.view.common.tooltips.BankInfoTooltip'
                                                    );
                                                    tool.setData(bank);
                                                    tool.showBy(el);
                                                }
                                            },
                                        },
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
