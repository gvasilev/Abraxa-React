import './prefunding/PreFundingGrid';
import './AgreementsViewModel';
import './discounts/DiscountGrid';
import './billing/BillingGrid';
import './prefunding/PreFundingRightCard';
import './discounts/DiscountRightCard';
import './billing/BillingRightCard';
import './standardInstructions/InstructionsGrid';
import './standardInstructions/InstructionsRightCard';

Ext.define('Abraxa.view.cdb.company.agreements.Main', {
    extend: 'Ext.Container',
    xtype: 'cdb.company.agreements.main',
    scrollable: true,
    itemId: 'agreementsMain',
    flex: 1,
    weighted: true,
    viewModel: 'agreements-viewmodel',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            docked: 'left',
            cls: 'a-left-menu agreements_left_menu',
            stateful: ['width', 'userCls'],
            stateId: 'agreementsLeftMenu',
            reference: 'agreementsLeftMenu',
            publishes: ['userCls'],
            userCls: 'is-expanded',
            scrollable: true,
            weight: 1,
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
                            html: '<h5>Agreements</h5>',
                        },
                        {
                            xtype: 'button',
                            ui: 'round',
                            itemId: 'agreementsMainExpandTogglBtn',
                            iconCls: 'md-icon-outlined md-icon-first-page',
                            focusable: false,
                            bind: {
                                tooltip: {
                                    html: '<span class="tooltip_expand">{agreementsLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
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
                                let panel = Ext.ComponentQuery.query('[cls~=agreements_left_menu]')[0],
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
                    reference: 'agreements_menu',
                    cls: 'agreements_menu',
                    deselectable: false,
                    variableHeights: true,
                    store: {
                        data: [
                            {
                                html: '<i class="md-icon-outlined">payments</i><span>Pre-Funding</span>',
                                tab: 'preFunding',
                                title: 'Pre-Funding',
                            },
                            {
                                html: '<i class="md-icon-outlined">percent</i><span>Discounts</span>',
                                tab: 'discounts',
                                title: 'Discounts',
                            },
                            {
                                html: '<i class="md-icon-outlined">account_balance_wallet</i><span>Direct billing</span>',
                                tab: 'directBilling',
                                title: 'Direct billing',
                            },
                            {
                                html: '<i class="md-icon-outlined">description</i><span>Standard instructions</span>',
                                tab: 'standardInstructions',
                                title: 'Standard instructions',
                            },
                        ],
                    },
                    itemConfig: {
                        xtype: 'container',
                        cls: 'a-item',
                        testId: 'agreementsMainAgreementsMenuListContainer',
                        viewModel: true,
                        items: [
                            {
                                cls: 'a-tab',
                                testId: 'agreementsMainAgreementsMenuListATab',
                                bind: {
                                    tooltip: {
                                        html: '{agreementsLeftMenu.userCls ? "" : record.title}',
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
                            Ext.ComponentQuery.query('agreements\\.prefunding\\.grid')[0].deselectAll();
                            Ext.ComponentQuery.query('agreements\\.discounts\\.grid')[0].deselectAll();
                            Ext.ComponentQuery.query('agreements\\.billing\\.grid')[0].deselectAll();
                            Ext.ComponentQuery.query('agreements\\.instructions\\.grid')[0].deselectAll();
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            layout: 'fit',
            bind: {
                hidden: '{agreements_menu.selection.tab == "preFunding" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
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
                                title: '<span>{agreements_menu.selection.title}</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'agreements.prefunding.grid',
                    flex: 1,
                    showNoPermissions: true,
                    skipEditPermission: true,
                    slug: 'cdbAgreementsPreFunding',
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            layout: 'fit',
            hidden: true,
            bind: {
                hidden: '{agreements_menu.selection.tab == "discounts" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
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
                                title: '<span>{agreements_menu.selection.title}</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'agreements.discounts.grid',
                    flex: 1,
                    showNoPermissions: true,
                    skipEditPermission: true,
                    slug: 'cdbAgreementsDiscounts',
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            layout: 'fit',
            flex: 1,
            hidden: true,
            bind: {
                hidden: '{agreements_menu.selection.tab == "directBilling" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
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
                                title: '<span>{agreements_menu.selection.title}</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'agreements.billing.grid',
                    flex: 1,
                    showNoPermissions: true,
                    skipEditPermission: true,
                    slug: 'cdbAgreementsDirectBilling',
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
        {
            xtype: 'agreements.prefunding.right.card',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            docked: 'right',
        },
        {
            xtype: 'agreements.discounts.right.card',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            docked: 'right',
        },
        {
            xtype: 'agreements.billing.right.card',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            docked: 'right',
        },
        {
            xtype: 'container',
            layout: 'fit',
            flex: 1,
            bind: {
                hidden: '{agreements_menu.selection.tab == "standardInstructions" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    layout: 'card',
                    flex: 1,
                    showNoPermissions: true,
                    skipEditPermission: true,
                    slug: 'cdbAgreementsStandardInstructions',
                    bind: {
                        permission: '{userPermissions}',
                        layout: {
                            type: 'card',
                            animation: null,
                        },
                        activeItem: '{selectedInstruction ? 1 : 0}',
                        cls: 'a-bgr-white no-shadow slideIn',
                    },
                    items: [
                        {
                            xtype: 'agreements.instructions.grid',
                            flex: 1,
                        },
                        {
                            xtype: 'agreements.instructions.right.card',
                            hidden: true,
                            flex: 1,
                        },
                    ],
                },
            ],
        },
    ],
});
