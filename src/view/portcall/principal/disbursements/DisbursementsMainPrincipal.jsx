import './BillingPartiesMenuListPrincipal';
import './DisbursmentsViewModelPrincipal';
import './BillingPartyDetails';
import './BillingPartyBalance';
import './BillingPartyDisbursementsList';
import './DisbursementDetails';
import './services/DisbursementServicesGrid';

Ext.define('Abraxa.view.portcall.principal.disbursements.DisbursementsMainPrincipal', {
    extend: 'Ext.Container',
    xtype: 'DisbursementsMainPrincipal',
    viewModel: 'DisbursementsViewModelPrincipal',
    itemId: 'disbursementsMainPrincipal',
    cls: 'a-disbursements-main-container',
    // scrollable: 'y',
    // scrollable: true,
    layout: {
        type: 'vbox',
        pack: 'start',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-disbursements-wrap-container',
            flex: 1,
            scrollable: 'y',
            bind: {
                hidden: '{selectedDisbursement ?  true : false}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-disbursements-inner-container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-main-titlebar',
                            layout: 'hbox',
                            shadow: false,
                            margin: '0 32 0 24',
                            padding: 0,
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-main-title has-dropdown hbox cursor-pointer',
                                    bind: {
                                        html: '<h1>{selectedBillingParty.org_name}</h1>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            fn: function fn() {
                                                let menu = this.component.up().down('BillingPartiesMenuListPrincipal');
                                                menu.showBy(this);
                                            },
                                        },
                                    },
                                },
                                {
                                    //inline menu in order to pubish the selection
                                    xtype: 'BillingPartiesMenuListPrincipal',
                                },
                                {
                                    flex: 1,
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-card-container',
                            layout: 'hbox',
                            padding: 24,
                            items: [
                                {
                                    xtype: 'container',
                                    docked: 'top',
                                    bind: {
                                        hidden: '{accounts.count ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            cls: 'a-titlebar a-bb-100',
                                            minHeight: 64,
                                            items: [
                                                {
                                                    xtype: 'title',
                                                    bind: {
                                                        title: '<span>Summary</span>',
                                                    },
                                                },
                                                {
                                                    xtype: 'container',
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            ui: 'blue-light color-default small',
                                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                                            cls: 'a-has-counter',
                                                            bind: {
                                                                text: 'Invoices <em>{billingPartyInvoices.count}</em>',
                                                            },
                                                            handler: function (me) {},
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    flex: 3.5,
                                    xtype: 'BillingPartyDetails',
                                },
                                {
                                    xtype: 'BillingPartyBalance',
                                    cls: 'border-radius a-account-balance',
                                    margin: '0 0 0 12',
                                    flex: 2,
                                },
                            ],
                        },
                        {
                            xtype: 'BillingPartyDisbursementsList',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'DisbursementDetails',
            cls: 'a-disbursements-wrap-container',
            flex: 1,
            scrollable: 'y',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement ? false : true}',
            },
        },
    ],
});
