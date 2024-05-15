import './HolidaysGrid.jsx';
Ext.define('Abraxa.view.settings.library.ports.HolidaysMainCointaner', {
    extend: 'Ext.Container',
    xtype: 'settings.library.holidays.main',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'settings.library.holidays.grid',
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibraryHoliday',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
