Ext.define('Abraxa.view.voyages.VoyagesBottomContainer', {
    extend: 'Ext.Container',
    xtype: 'voyages.bottom.container',
    layout: 'hbox',
    flex: 1,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'voyages.grid.active',
                    hidden: true,
                    showAnimation: 'fade',
                    bind: {
                        hidden: '{voyagesTabbar.activeTabIndex == 0 ? false : true}',
                    },
                },
                {
                    xtype: 'voyages.grid.closed',
                    hidden: true,
                    showAnimation: 'fade',
                    bind: {
                        hidden: '{voyagesTabbar.activeTabIndex == 1 ? false : true}',
                    },
                },
            ],
        },
    },
});
