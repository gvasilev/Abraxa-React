Ext.define('Abraxa.view.voyages.VoyagesTopContainer', {
    extend: 'Ext.Container',
    xtype: 'voyages.top.container',
    margin: '16 16 8 16',
    cls: 'border-radius',
    shadow: true,
    items: [
        {
            xtype: 'voyages.tabbar',
        },
        {
            xtype: 'voyages.filters.active',
            hidden: true,
            bind: {
                hidden: '{voyagesTabbar.activeTabIndex == 0 ? false : true}',
            },
        },
        {
            xtype: 'voyages.filters.closed',
            hidden: true,
            bind: {
                hidden: '{voyagesTabbar.activeTabIndex == 1 ? false : true}',
            },
        },
    ],
});
