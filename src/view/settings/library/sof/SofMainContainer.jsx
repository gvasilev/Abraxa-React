import './SofEventsGrid';

Ext.define('Abraxa.view.settings.library.sof.SofMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.sof.main',
    layout: 'vbox',
    flex: 1,
    hidden: true,
    bind: {
        hidden: '{library_tabbar.activeTabIndex == 1 ? false: true}',
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
                                    html: '<h1 class="fw-n">Events library</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Create and manage your SOF library items.</p>',
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
            xtype: 'settings.library.sof.grid',
            flex: 1,
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibrarySOF',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
