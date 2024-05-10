Ext.define('Abraxa.view.dashboard.DashboardLeftContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboard.left.container',
    cls: 'a-card-container bordered',
    flex: 7,
    hideMode: 'opacity',
    layout: 'fit',
    padding: 0,
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar',
            top: 0,
            left: 0,
            items: [
                {
                    xtype: 'title',
                    title: 'Global coverage',
                },
            ],
        },
        {
            xtype: 'map.voyage.count',
            flex: 1,
            showNoPermissions: true,
            slug: 'dashboardGlobalCoverage',
            bind: {
                permission: '{userPermissions}',
            },
            // xtype: 'div',
            // cls: 'a-dashboard-map',
            // flex: 1,
            // height: '100%'
        },
    ],
});
