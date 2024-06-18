Ext.define('Abraxa.view.portcall.accounts.AccountBalance', {
    extend: 'Ext.Container',
    xtype: 'account.balance',
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
                                html: '<span class="a-currency">{selectedAccount.account_currency}</span><span class="a-value">{totalAccountFinal:number("0,000.00")}</span>',
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
                                html: 'Received payments ({receivedPercent}%)',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-balance-amount',
                            bind: {
                                html: '<span class="a-currency">{selectedAccount.account_currency}</span><span class="a-value">{receivedPayments:number("0,000.00")}</span>',
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
                                html: '<span class="a-currency">{selectedAccount.account_currency}</span><span class="a-value">{outGoingPayments:number("0,000.00")}</span>',
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
                            html: 'Client balance',
                        },
                        {
                            xtype: 'div',
                            bind: {
                                html: '<i class="material-icons-outlined"></i><span class="text-capitalize">{selectedAccount.funded}</span>',
                                cls: 'a-status-badge rounded no-border a-has-icon status-{selectedAccount.funded}',
                                hidden: '{editableDisbursementPermissions}',
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'status default rounded',
                            slug: 'portcallBillingPartiesFunded',
                            iconCls: 'md-icon-attach-money',
                            subObject: 'accounts',
                            bind: {
                                text: '{selectedAccount.funded}',
                                cls: 'status-{selectedAccount.funded} solid',
                                // disabled: '{nonEditable ? true : false}',
                                objectPermission: '{objectPermissions}',
                                permission: '{userPermissions}',
                                hidden: '{!editableDisbursementPermissions}',
                                // arrow: '{nonEditable ? false : true}'
                            },
                            menu: {
                                defaults: {
                                    handler: function () {
                                        var record = this.upVM().get('selectedAccount'),
                                            funded = this.value;

                                        record.set('funded', funded);

                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                },
                                items: [
                                    {
                                        text: 'Not funded',
                                        value: 'not funded',
                                    },
                                    {
                                        text: 'Partially funded',
                                        value: 'partially funded',
                                    },
                                    {
                                        text: 'Funded',
                                        value: 'funded',
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-total-balance-amount',
                    bind: {
                        html: '<span class="a-currency">{selectedAccount.account_currency}</span><span class="a-value {balance > 0 ? "c-red" : (balance < 0 ? "c-green-500" : "")}">{balance:number("0,000.00")}</span>',
                    },
                },
            ],
        },
    ],
});
