Ext.define('Abraxa.view.settings.library.ports.BerthsMainContaianer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.berths.main',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'settings.library.berths.grid',
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibraryBerth',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
