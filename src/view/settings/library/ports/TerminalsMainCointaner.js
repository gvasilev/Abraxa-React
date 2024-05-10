Ext.define('Abraxa.view.settings.library.ports.TerminalsMainContaianer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.terminals.main',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'settings.library.terminals.grid',
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibraryTerminal',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
