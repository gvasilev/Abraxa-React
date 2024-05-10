Ext.define('Abraxa.view.tasks.TaskHeader', {
    extend: 'Ext.Container',
    xtype: 'tasks.header',
    layout: 'vbox',
    flex: 1,
    controller: 'task-controller',
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
                                html: '<h1>{viewTitle}</h1>',
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
                    reference: 'taskMainTabbar',
                    slug: 'task',
                    bind: {
                        permission: '{userPermissions}',
                    },
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
                            id: 'active',
                            title: 'Active',
                            tab: 'Active',
                            listeners: {
                                element: 'element',
                                click: function () {
                                    mixpanel.track('Page changed', {
                                        Type: 'Tab',
                                        Target: 'Task manager - Active tasks',
                                        Tag: 'Primary event',
                                    });

                                    // Change the location after page change event
                                    mixpanel.register({
                                        Origin: 'Task manager / Active tasks',
                                    });
                                },
                            },
                        },
                        {
                            id: 'completed',
                            title: 'Completed',
                            tab: 'Completed',
                            listeners: {
                                element: 'element',
                                click: function () {
                                    mixpanel.track('Page changed', {
                                        Type: 'Tab',
                                        Target: 'Task manager - Completed tasks',
                                        Tag: 'Primary event',
                                    });

                                    // Change the location after page change event
                                    mixpanel.register({
                                        Origin: 'Task manager / Completed tasks',
                                    });
                                },
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
