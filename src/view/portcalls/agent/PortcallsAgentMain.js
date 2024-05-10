Ext.define('Abraxa.view.portcalls.agent.PortacallAgentMain', {
    extend: 'Ext.Container',
    xtype: 'portcalls.agent.main',
    viewModel: 'portcalls-agent-viewmodel',
    controller: 'portcalls-agent-controller',
    slug: 'portcall',
    showNoPermissions: true,
    skipEditPermission: true,
    bind: {
        permission: '{userPermissions}',
    },
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'portcalls.agent.top.container',
        },
        {
            xtype: 'portcalls.grid.active',
        },
        {
            xtype: 'portcalls.right.card',
        },
    ],
});
