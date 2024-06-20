Ext.define('Abraxa.view.dashboard.DashboardBottomLeftContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboard.bottom.left.container',
    cls: 'a-card-container bordered',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '{currentUserType == "agent" ? "Top clients by appointment":"Top agents by appointment"}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 16 16 16',
            flex: 1,
            showNoPermissions: true,
            slug: 'dashboardTopClients',
            bind: {
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'fusionchart',
                    flex: 1,
                    type: 'stackedbar2d',
                    itemId: 'stackedChart',
                    width: '100%',
                    height: '100%',
                },
            ],
        },
    ],
});
