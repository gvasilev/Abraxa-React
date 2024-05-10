import './FinancialsViewModel.jsx';
import './banks/BanksGrid.jsx';
import './banks/BanksRightCard.jsx';
import './transactions/TransactionsView.jsx';
import './virtualhub/VirtualHubView.jsx';
Ext.define('Abraxa.view.cdb.company.financials.Main', {
    extend: 'Ext.Container',
    xtype: 'cdb.company.financials.main',
    scrollable: true,
    itemId: 'financialsMain',
    testId: 'financialsMain',
    flex: 1,
    viewModel: 'financials-viewmodel',
    layout: 'hbox',
    items: [
        {
            cls: 'a-container-premium errorHandler',
            maxWidth: 540,
            bind: {
                hidden: '{currentUserPlan == "starter" ? false:true}',
            },
            items: [
                {
                    xtype: 'div',
                    padding: '16 48',
                    cls: 'text-center',
                    html: '<div class="h1">Premium feature</div><p class="a-txt">The ultimate all-in-one package for companies that need to handle port calls with confidence.</p>',
                },
                {
                    xtype: 'div',
                    margin: '16 0 24 -12',
                    cls: 'text-center',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="416" height="248" viewBox="0 0 416 248"><g transform="translate(-533 -328)"><rect width="242" height="158" rx="8" transform="translate(533 328)" fill="#fbe3c9" opacity="0.4"/><rect width="400" height="232" rx="8" transform="translate(549 344)" fill="#fff"/><rect width="64" height="8" rx="4" transform="translate(741 384)" fill="#f3c46b"/><rect width="64" height="8" rx="4" transform="translate(741 528)" fill="#ecf0f1"/><rect width="64" height="8" rx="4" transform="translate(637 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(637 528)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 432)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 480)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 528)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 432)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 480)" fill="#b0bec5" opacity="0.24"/><g transform="translate(333 85)"><rect width="40" height="40" rx="8" transform="translate(240 283)" fill="#ffb74d"/><g transform="translate(248 291)"><path d="M0,0H24V24H0Z" fill="none"/><path d="M20,6H17.82A2.993,2.993,0,0,0,12.5,3.35l-.5.67-.5-.68A2.994,2.994,0,0,0,6.18,6H4A1.985,1.985,0,0,0,2.01,8L2,19a1.993,1.993,0,0,0,2,2H20a1.993,1.993,0,0,0,2-2V8A1.993,1.993,0,0,0,20,6ZM15,4a1,1,0,1,1-1,1A1,1,0,0,1,15,4ZM9,4A1,1,0,1,1,8,5,1,1,0,0,1,9,4ZM20,19H4V17H20Zm0-5H4V8H9.08L7,10.83,8.62,12,11,8.76,12,7.4l1,1.36L15.38,12,17,10.83,14.92,8H20Z" fill="#fff"/></g></g></g></svg>',
                },
                {
                    xtype: 'button',
                    margin: '16 0',
                    ui: 'premium large',
                    text: 'Upgrade to Premium',
                    testId: 'financialsMainUpgradeToPremium',
                    handler: function () {
                        window.open('https://www.abraxa.com/pricing/');
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-left-menu financials_left_menu',
            stateful: ['width', 'userCls'],
            stateId: 'financialsLeftMenu',
            reference: 'financialsLeftMenu',
            publishes: ['userCls'],
            userCls: 'is-expanded',
            scrollable: true,
            testId: 'financialsMainFinancialsLeftMenu',
            bind: {
                hidden: '{currentUserPlan == "starter" ? true:false}',
            },
            weight: 0,
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
                            html: '<h5>Financials</h5>',
                        },
                        {
                            xtype: 'button',
                            testId: 'financialsMainExpandTogglBtn',
                            ui: 'round',
                            iconCls: 'md-icon-outlined md-icon-first-page',
                            focusable: false,
                            bind: {
                                tooltip: {
                                    html: '<span class="tooltip_expand">{financialsLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
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
                                let panel = Ext.ComponentQuery.query('[cls~=financials_left_menu]')[0],
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
                    testId: 'financialsMainMenuList',
                    reference: 'financials_menu',
                    cls: 'financials_menu',
                    deselectable: false,
                    variableHeights: true,
                    store: {
                        data: [
                            {
                                html: '<i class="md-icon-outlined">account_balance</i><span>Bank accounts</span>',
                                tab: 'bank_accounts',
                                title: 'Bank accounts',
                            },
                            {
                                html: '<i class="md-icon-outlined">receipt_long</i><span>Transactions</span>',
                                tab: 'transactions',
                                title: 'Transactions',
                            },
                            {
                                html: '<i class="md-icon-outlined">price_change</i><span>Virtual HUB account</span>',
                                tab: 'virtual_hub_account',
                                title: 'Virtual HUB account',
                            },
                            {
                                html: '<i class="md-icon-outlined">credit_score</i><span>Float line</span>',
                                tab: 'virtual_accounts',
                                title: 'Float line',
                            },
                        ],
                    },
                    itemConfig: {
                        xtype: 'container',
                        testId: 'financialsMainMenuListContainer',
                        cls: 'a-item',
                        viewModel: true,
                        items: [
                            {
                                cls: 'a-tab',
                                bind: {
                                    tooltip: {
                                        html: '{financialsLeftMenu.userCls ? "" : record.title}',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                        // anchorToTarget: false,
                                        align: 'bc-tc?',
                                        anchor: true,
                                    },
                                    html: '<div class="hbox">{record.html}</div>',
                                },
                            },
                        ],
                    },
                    listeners: {
                        childsingletap: function () {
                            Ext.ComponentQuery.query('virtual\\.accounts\\.grid')[0].deselectAll();
                            Ext.ComponentQuery.query('financials\\.banks')[0].deselectAll();
                            Ext.ComponentQuery.query('[cls~=transactions_grid]')[0].deselectAll();
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            weighted: true,
            bind: {
                hidden: '{currentUserPlan == "starter" ? true:false}',
            },
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    bind: {
                        hidden: '{financials_menu.selection.tab == "bank_accounts" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            docked: 'top',
                            flex: 1,
                            cls: 'a-titlebar a-bb-100',
                            weight: 2,
                            height: 65,
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'title',
                                    bind: {
                                        title: '<span>{financials_menu.selection.title}</span>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'financials.banks',
                            flex: 1,
                            showNoPermissions: true,
                            skipEditPermission: true,
                            slug: 'cdbFinancialBankAccounts',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'financials.banks.right.card',
                            showAnimation: {
                                type: 'slide',
                                direction: 'left',
                            },
                            hideAnimation: null,
                            flex: 1,
                            height: '100%',
                            docked: 'right',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'fit',
                    flex: 1,
                    bind: {
                        hidden: '{financials_menu.selection.tab == "transactions" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'company.transactions.view',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'fit',
                    flex: 1,
                    bind: {
                        hidden: '{financials_menu.selection.tab == "virtual_hub_account" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'company.virtualhub.view',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'fit',
                    flex: 1,
                    bind: {
                        hidden: '{financials_menu.selection.tab == "virtual_accounts" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'card',
                            flex: 1,
                            showNoPermissions: true,
                            skipEditPermission: true,
                            slug: 'cdbFinancialVirtualAccounts',
                            bind: {
                                permission: '{userPermissions}',
                                layout: {
                                    type: 'card',
                                    animation: '{selectedVa ? "cover" : "reveal"}',
                                },
                                activeItem: '{selectedVa ? 1 : 0}',
                                cls: 'a-bgr-white no-shadow slideIn',
                            },
                            items: [
                                {
                                    xtype: 'virtual.accounts.grid',
                                    flex: 1,
                                },
                                {
                                    xtype: 'virtual.account.right.card',
                                    hidden: true,
                                    flex: 1,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
