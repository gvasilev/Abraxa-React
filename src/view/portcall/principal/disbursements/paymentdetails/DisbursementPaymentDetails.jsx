Ext.define('Abraxa.view.portcall.principal.disbursements.paymentdetails.DisbursementPaymentDetails', {
    extend: 'Ext.Container',
    xtype: 'DisbursementPaymentDetails',
    layout: 'hbox',
    padding: '0 24 16',
    items: [
        {
            xtype: 'container',
            flex: 1,
            hidden: true,
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
                            html: 'Payment details',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: AbraxaConstants.placeholders.emptySpan,
                            },
                        },
                    ],
                },
                {
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Due date',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: AbraxaConstants.placeholders.emptySpan,
                            },
                        },
                    ],
                },
                {
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Payment reference',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: AbraxaConstants.placeholders.emptySpan,
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
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
                            html: 'Bank name',
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
                            html: 'Branch number',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: '{(selectedBillingParty.bank && selectedBillingParty.bank.bank_branch_number) ? selectedBillingParty.bank.bank_branch_number : "<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'IBAN number',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: '{(selectedBillingParty.bank && selectedBillingParty.bank.iban) ? selectedBillingParty.bank.iban : "<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
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
                            html: 'SWIFT',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: '{(selectedBillingParty.bank && selectedBillingParty.bank.swift_number) ? selectedBillingParty.bank.swift_number : "<span class=\'a-placeholder\'>---</span>"}',
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
                            cls: 'a-display-value',
                            bind: {
                                html: '{(selectedBillingParty.bank && selectedBillingParty.bank.beneficiary) ? selectedBillingParty.bank.beneficiary : "<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Correspondent bank',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: '{(selectedBillingParty.bank && selectedBillingParty.bank.corresponding_bank) ? selectedBillingParty.bank.corresponding_bank : "<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            flex: 1,
        },
    ],
});
