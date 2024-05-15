import './TaxesGrid.jsx';
Ext.define('Abraxa.view.settings.library.taxes.TaxesMainContaine', {
    extend: 'Ext.Container',
    xtype: 'settings.library.taxes.taxes.main',
    hidden: true,
    layout: 'vbox',
    flex: 1,
    bind: {
        hidden: '{library_tabbar.activeTabIndex == 6 ? false: true}',
    },
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h1 class="fw-n">Taxes</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Set up your local or national applicable taxes</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0 0 0',
                                    html: '<hr>',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'settings.library.taxes.grid',
            flex: 1,
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibraryTax',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
