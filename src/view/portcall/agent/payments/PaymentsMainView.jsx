import './PaymentsController.jsx';
import './InitCreate.jsx';
import './PaymentContent.jsx';
import './PaymentsRightCard.jsx';
Ext.define('Abraxa.view.portcall.payments.PaymentsMainView', {
    extend: 'Ext.Container',
    xtype: 'payments.main',
    controller: 'payments-controller',
    reference: 'paymentsMainView',
    bodyCls: 'a-layout-card-wrap',
    flex: 1,
    layout: 'fit',
    viewModel: {
        stores: {
            paymentsAccounts: {
                // Create a new instance of accounts store to avoid conflicts with combo boxes in other views
                source: '{accounts}',
            },
            paymentsPerAccount: {
                source: '{payments}',
                filters: '{paymentsPerAccountFilter}',
            },
            filtedPayments: {
                source: '{paymentsPerAccount}',
                filters: '{paymentsFilter}',
            },
            incomingPayments: {
                source: '{paymentsPerAccount}',
                filters: [
                    {
                        property: 'kind',
                        value: 'incoming',
                    },
                ],
            },
            outgoingPayments: {
                source: '{paymentsPerAccount}',
                filters: [
                    {
                        property: 'kind',
                        value: 'outgoing',
                    },
                ],
            },
            accountAgreements: {
                source: '{agreements}',
                filters: '{agreementsFilter}',
            },
        },
        formulas: {
            selectedAccountId: {
                bind: {
                    bindTo: '{object_record.accounts}',
                    // deep: true,
                },
                get: function (accounts) {
                    let account = null;
                    if (accounts) {
                        account = accounts.first();
                    }
                    if (account) {
                        return account.get('id');
                    }
                },
            },
            paymentsFilter: {
                bind: {
                    bindTo: '{paymentsMenu.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('filtedPayments');
                        if (store) store.clearFilter();
                        return function (rec) {
                            let conditon = null;
                            switch (record.get('tab')) {
                                case 'transactions':
                                    let statuses = ['incoming', 'outgoing'];
                                    conditon =
                                        Ext.Array.contains(statuses, rec.get('kind')) && rec.get('status') != 'draft';
                                    break;
                                case 'requested_payments':
                                    conditon = rec.get('kind') == 'requested' && rec.get('status') != 'draft';
                                    break;
                                case 'drafts':
                                    conditon = rec.get('status') == 'draft';
                                    break;

                                default:
                                    conditon = false;
                                    break;
                            }
                            return conditon;
                        };
                    } else {
                        return function (item) {
                            return false;
                        };
                    }
                },
            },
            paymentsPerAccountFilter: {
                bind: {
                    bindTo: '{accountMainCombo.selection.org_id}',
                    deep: true,
                },
                get: function (org_id) {
                    let store = this.get('paymentsPerAccount');
                    if (store) store.clearFilter();
                    if (org_id) {
                        return function (rec) {
                            if (rec.get('org_id') == org_id) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            totalIncomingPayments: {
                bind: {
                    bindTo: '{incomingPayments}',
                    deep: true,
                },
                get: function (store) {
                    let total = 0;
                    if (store) {
                        total = store.sum('calculated_amount');
                    }
                    return total;
                },
            },
            totalOutgoingPayments: {
                bind: {
                    bindTo: '{outgoingPayments}',
                    deep: true,
                },
                get: function (store) {
                    let total = 0;
                    if (store) {
                        total = store.sum('calculated_amount');
                    }
                    return total;
                },
            },
            balance: {
                bind: {
                    incoming: '{totalIncomingPayments}',
                    outgoing: '{totalOutgoingPayments}',
                },
                get: function (data) {
                    let balance = 0;
                    if (data) {
                        balance = data.incoming - data.outgoing;
                    }
                    return balance;
                },
            },
            agreementsFilter: {
                bind: {
                    bindTo: '{accountMainCombo.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('accountAgreements'),
                            port_id = this.get('object_record.port_id'),
                            port_function = this.get('object_record.port_function');

                        if (store) store.clearFilter();

                        return function (rec) {
                            if (rec.get('organization_org_id') == record.get('org_id')) {
                                let agreementable = rec.get('agreementable'),
                                    port_array = agreementable ? agreementable.port_ids : null;

                                if (agreementable) {
                                    if (port_array) {
                                        if (
                                            port_array.includes(port_id) &&
                                            agreementable.port_function == port_function
                                        ) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    } else {
                                        return true;
                                    }
                                }
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return false;
                        };
                    }
                },
            },
            account: {
                bind: {
                    bindTo: '{accountMainCombo.selection}',
                    deep: true,
                },
                get: function (record) {
                    return record;
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            weighted: true,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    weight: 1,
                    cls: 'a-bb-100',
                    height: 64,
                    padding: '0 24',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'accounts.combo',
                            forceSelection: true,
                            label: '',
                            minWidth: 220,
                            cls: 'a-combo-accounts',
                            ui: 'field-lg classic',
                            placeholder: 'Choose account',
                            reference: 'accountMainCombo',
                            itemId: 'accountMainCombo',
                            floatedPicker: {
                                minWidth: 220,
                            },
                            bind: {
                                store: '{paymentsAccounts}',
                                value: '{selectedAccountId}',
                            },

                            listeners: {
                                clearicontap: function (me) {
                                    me.clearValue();
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    docked: 'left',
                    weight: 0,
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
                {
                    xtype: 'container',
                    docked: 'bottom',
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
        },
    ],
});
