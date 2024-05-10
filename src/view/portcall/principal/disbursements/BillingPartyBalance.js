Ext.define('Abraxa.view.portcall.principal.disbursements.BillingPartyBalance', {
    extend: 'Ext.Container',
    xtype: 'BillingPartyBalance',
    padding: '4 24',
    layout: {
        type: 'vbox',
        pack: 'space-between',
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-balance-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-balance-label',
                            html: 'Total costs',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-balance-amount',
                            bind: {
                                html: '<span class="a-currency">{selectedBillingParty.account_currency}</span><span class="a-value">{billingPartyTotalCosts:number("0,000.00")}</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-balance-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-balance-label',
                            bind: {
                                html: 'Payments ({receivedPercent}%)',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-balance-amount',
                            bind: {
                                html: '<span class="a-currency">{selectedBillingParty.account_currency}</span><span class="a-value">{receivedPayments:number("0,000.00")}</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-balance-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    // hidden: true,
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-balance-label',
                            bind: {
                                html: 'Refund',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-balance-amount',
                            bind: {
                                html: '<span class="a-currency">{selectedBillingParty.account_currency}</span><span class="a-value">{outGoingPayments:number("0,000.00")}</span>',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-total-balance-row',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-total-balance-label',
                            html: 'Balance',
                        },
                        {
                            xtype: 'div',
                            bind: {
                                html: '<i class="material-icons-outlined"></i><span class="text-capitalize">{selectedBillingParty.funded}</span>',
                                cls: 'a-status-badge rounded no-border a-has-icon status-{selectedBillingParty.funded}',
                                hidden: '{editableDisbursementPermissions}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-total-balance-amount',
                    bind: {
                        html: '<span class="a-currency">{selectedBillingParty.account_currency}</span><span class="a-value {finalBalance > 0 ? "c-green-500" : (finalBalance < 0 ? "c-red" : "")}">{finalBalance:number("0,000.00")}</span>',
                    },
                },
            ],
        },
    ],
});
