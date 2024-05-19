Ext.define('Abraxa.view.directory.DirectoryHeader', {
    extend: 'Ext.Container',
    xtype: 'DirectoryHeader',
    reference: 'DirectoryHeader',
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
                                html: '<h1>Directory</h1>',
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
                    cls: 'a-main-tabs directory_tabs',
                    activeTab: 0,
                    bind: {
                        activeTabIndex: '{setActiveTab}',
                    },
                    reference: 'directroryMainTabbar',
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
                            id: 'agents',
                            hash: 'agents',
                            title: 'Agents',
                        },
                        {
                            id: 'ports',
                            hash: 'ports',
                            title: 'Ports',
                        },
                    ],
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function (tab) {
                                let activeTab = Ext.get(tab.currentTarget).component.getActiveTab();
                                window.history.replaceState({}, document.title, '/#directory/' + activeTab.hash);
                                // Ext.getCmp('main-viewport').getController().redirectTo('#directory/' + activeTab.hash);
                            },
                        },
                    },
                },
                // {
                //     xtype: 'container',
                //     cls: 'a-main-right',
                //     layout: {
                //         type: 'hbox',
                //         align: 'middle',
                //     },
                //     items: [
                //         {
                //             xtype: 'verified.div',
                //         },
                //     ],
                // },
            ],
        },
    },
});
