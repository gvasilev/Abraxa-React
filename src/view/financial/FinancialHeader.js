Ext.define('Abraxa.view.financial.FinancialHeader', {
    extend: 'Ext.Container',
    xtype: 'financial.header',
    layout: 'vbox',
    flex: 1,
    slug: 'wpsfinancial',
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-main-titlebar',
                    items: [
                        {
                            xtype: 'div',
                            itemId: 'mainTitle',
                            cls: 'a-main-title has-dropdown',
                            bind: {
                                html: '<h1>Financial board</h1>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let menu = Ext.create('Abraxa.view.main.RecentlyOpenedMenu', {
                                            viewModel: {
                                                parent: Ext.getCmp('main-viewport').getViewModel(),
                                            },
                                        });
                                        menu.showBy(this);
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'tabbar',
                    cls: 'a-main-tabs',
                    activeTab: 0,
                    reference: 'financialMainTabbar',
                    publishes: {
                        activeTab: true,
                        activeTabIndex: true,
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                    },
                    defaults: {
                        ui: 'tab-main',
                        ripple: false,
                    },
                    items: [
                        {
                            id: 'accounts',
                            title: 'Port calls',
                            tab: 'Port calls',
                        },
                        {
                            id: 'disbursements',
                            title: 'Disbursements',
                            tab: 'Disbursements',
                        },
                        {
                            id: 'transactions',
                            title: 'Transactions',
                            tab: 'Transactions',
                            hidden: true,
                            bind: {
                                hidden: '{currentUserType != "principal" ? false : true}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-main-right',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'verified.div',
                        },
                    ],
                },
            ],
        },
    },
});
