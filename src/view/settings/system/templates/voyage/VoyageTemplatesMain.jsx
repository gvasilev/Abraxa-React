Ext.define('Abraxa.view.settings.system.templates.voyage.VoyageTemplatesMain', {
    extend: 'Ext.Container',
    xtype: 'settings.voyage.template.main',
    items: [
        {
            xtype: 'abraxa.container',
            shadow: false,
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    docked: 'top',
                    cls: 'a-bb-100',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'tabbar',
                            activeTab: 0,
                            items: [
                                {
                                    title: 'Templates',
                                },
                                {
                                    title: 'Clauses',
                                },
                                {
                                    title: 'Documents',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
