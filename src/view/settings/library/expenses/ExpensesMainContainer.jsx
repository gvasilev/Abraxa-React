import './ExpensesGrid.jsx';
Ext.define('Abraxa.view.settings.library.expenses.ExpensesMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.expenses.main',
    layout: 'vbox',
    flex: 1,
    hidden: true,
    bind: {
        hidden: '{library_tabbar.activeTabIndex == 2 ? false: true}',
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
                                    html: '<h1 class="fw-n">Services</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Create and manage your services. Assign accounting codes and create powerful financial automations</p>',
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
            xtype: 'settings.library.expenses.grid',
            flex: 1,
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibraryService',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
