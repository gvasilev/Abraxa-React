Ext.define('Abraxa.view.portnews.Header', {
    extend: 'Ext.Container',
    xtype: 'PortNewsHeader',
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
                    cls: 'a-main-title', //has-dropdown
                    bind: {
                        html: '<h1>News feed</h1>',
                    },

                    //Drop down menu
                    // listeners: {
                    //     click: {
                    //         element: "element",
                    //         fn: function fn() {
                    //             let menu = Ext.create('Abraxa.view.main.RecentlyOpenedMenu', {
                    //                 viewModel: {
                    //                     parent: this.component.upVM()
                    //                 }
                    //             });
                    //             menu.showBy(this);
                    //         }
                    //     }
                    // }
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
