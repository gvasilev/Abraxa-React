Ext.define('Abraxa.view.inquiry.InquiryHeader', {
    extend: 'Ext.Container',
    xtype: 'inquiry.header',
    layout: 'vbox',
    flex: 1,
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
                                html: '<h1>Enquiries</h1>',
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
                    reference: 'inquiryMainTabbar',
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
                            id: 'enquiries',
                            title: 'Enquiries',
                        },
                        {
                            id: 'estimates',
                            title: 'Estimates',
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
