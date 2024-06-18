import './CostCenterGrid';

Ext.define('Abraxa.view.settings.library.costCenter.CostCenterMainContainer', {
    extend: 'Ext.Container',
    xtype: 'CostCenterMainContainer',
    hidden: true,
    layout: 'vbox',
    flex: 1,
    bind: {
        hidden: '{library_tabbar.activeTabIndex == 3 ? false: true}',
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
                                    html: '<h1 class="fw-n">Cost center</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Create and manage your custom cost centers to streamline your financial flows as per your internal rules</p>',
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
            xtype: 'CostCenterGrid',
        },
    ],
});
