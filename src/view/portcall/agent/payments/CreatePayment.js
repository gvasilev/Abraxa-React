Ext.define('Abraxa.view.portcall.payments.CreatePayment', {
    extend: 'Ext.Dialog',
    xtype: 'payments.create.payment',
    cls: 'a-dialog-has-icon a-dialog-payments',
    closable: false,
    viewModel: 'payments-viewmodel',
    controller: 'payments-controller',
    layout: 'fit',
    draggable: false,
    showAnimation: null,
    hideAnimation: null,
    height: '100%',
    width: '100%',
    scrollable: true,
    padding: 0,
    modal: false,
    title: '<div class="a-badge a-badge-payments"><i class="md-icon-outlined">monetization_on</i></div><div class="a-container-title"><div>Manage payments</div><div class="a-subtitle a-private"><i class="md-icon-outlined md-icon-lock"></i><span>Internal only</span></div></div>',
    tools: {
        account: {
            xtype: 'accounts.combo',
            forceSelection: true,
            // hidden: true,
            // bind: {
            //     hidden: '{payments.count ? false:true}'
            // },
            label: '',
            left: 296,
            minWidth: 220,
            ui: 'classic',
            placeholder: 'Choose account',
            reference: 'accountMainCombo',
            // cls: 'a-field-icon icon-business-center icon-rounded',
            floatedPicker: {
                minWidth: 220,
            },

            listeners: {
                initialize: function (me) {
                    if (me.upVM().get('selectedAccount')) {
                        me.setValue(me.upVM().get('selectedAccount').get('id'));
                    }
                },
                // change: function (me, newValue) {
                //     if (newValue) {
                //         me.upVM().set('account', me.getSelection());
                //     } else {
                //         me.upVM().set('account', null);

                //     }
                // },
                clearicontap: function (me) {
                    me.clearValue();
                },
            },
        },
        close: {
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    centered: true,
    lbar: [
        {
            xtype: 'container',
            // hidden: true,
            // bind: {
            //     hidden: '{payments.count ? false:true}'
            // },
            cls: 'a-left-menu payments_left_menu',
            stateful: ['width', 'userCls'],
            stateId: 'paymentsLeftMenu',
            reference: 'paymentsLeftMenu',
            publishes: ['userCls'],
            userCls: 'is-expanded',
            scrollable: true,
            docked: 'left',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-menu-heading',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'sm-heading',
                            html: '<h5>Payments</h5>',
                        },
                        {
                            xtype: 'button',
                            ui: 'round',
                            iconCls: 'md-icon-outlined md-icon-first-page',
                            focusable: false,
                            bind: {
                                hidden: '{nonEditable ? true : false}',
                                tooltip: {
                                    html: '<span class="tooltip_expand">{paymentsLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                    anchor: true,
                                    align: 'bc-tc?',
                                },
                            },
                            handler: function () {
                                let panel = Ext.ComponentQuery.query('[cls~=payments_left_menu]')[0],
                                    cls = panel.getUserCls() == 'is-expanded';

                                if (cls != '') {
                                    panel.setUserCls('');
                                } else {
                                    panel.setUserCls('is-expanded');
                                }
                            },
                        },
                    ],
                },
                {
                    xtype: 'list',
                    reference: 'paymentsMenu',
                    deselectable: false,
                    variableHeights: true,
                    store: {
                        data: [
                            {
                                html: '<i class="md-icon-outlined" data-qtip="Transactions" data-qalign="bc-tc" data-qanchor="true">checklist</i><span>Transactions</span>',
                                tab: 'transactions',
                                title: 'Transactions',
                                icon: 'layers',
                            },
                            {
                                html: '<i class="md-icon-outlined" data-qtip="Requested payments" data-qalign="bc-tc" data-qanchor="true">inventory</i><span>Requested payments</span>',
                                tab: 'requested_payments',
                                title: 'Requested payments',
                                icon: 'supervisor_account',
                            },
                            {
                                html: '<i class="md-icon-outlined" data-qtip="Drafts" data-qalign="bc-tc" data-qanchor="true">drive_file_rename_outline</i><span>Drafts</span>',
                                tab: 'drafts',
                                title: 'Drafts',
                                icon: 'supervisor_account',
                            },
                            // {
                            //     html: '<i class="md-icon-outlined" data-qtip="Virtual account" data-qalign="bc-tc" data-qanchor="true">credit_score</i><span>Virtual account</span>',
                            //     tab: 'virtual_account',
                            //     title: 'Virtual account',
                            //     icon: 'supervisor_account'
                            // }
                        ],
                    },
                    itemConfig: {
                        xtype: 'container',
                        cls: 'a-item',
                        viewModel: true,
                        items: [
                            {
                                cls: 'a-tab',
                                bind: {
                                    html: '<div class="hbox">{record.html}</div>',
                                    tooltip: {
                                        html: '{paymentsLeftMenu.userCls ? "" : record.title}',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                        align: 'bc-tc?',
                                        anchor: true,
                                    },
                                },
                            },
                        ],
                    },
                    listeners: {
                        select: function (me) {
                            Ext.ComponentQuery.query('payments\\.grid')[0].deselectAll();
                        },
                        painted: function (me) {
                            me.select(0);
                        },
                    },
                },
            ],
        },
    ],
    bbar: {
        padding: '8 24',
        cls: 'a-bt-100',
        items: [
            {
                xtype: 'div',
                cls: 'a-total-billed-docked',
                hidden: true,
                bind: {
                    hidden: '{(payments.count && filtedPayments.count && paymentsMenu.selection.tab == "transactions") ? false:true}',
                    html: '<div class="h5">Incoming / Outgoing total balance</div><div class="a-billed-price"><span class="a-billed-currency">{accountMainCombo.selection.account_currency}</span><span class="a-billed-amount">{balance:number("0,000.00")}</span></div>',
                },
            },
        ],
    },
    items: [
        {
            xtype: 'init.create.container',
        },
        {
            xtype: 'payment.content',
        },
        {
            xtype: 'payments.right.card',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            weight: 0,
            docked: 'right',
        },
    ],
});
