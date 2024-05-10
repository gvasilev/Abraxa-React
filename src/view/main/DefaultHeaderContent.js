Ext.define('Abraxa.view.main.DefaultHeaderContent', {
    extend: 'Ext.Container',
    xtype: 'default.header',
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-main-titlebar',
            items: [
                {
                    xtype: 'div',
                    itemId: 'mainTitle',
                    cls: 'a-main-title has-dropdown chameleon_header_dropdown',
                    id: 'a-main-title',
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
});
