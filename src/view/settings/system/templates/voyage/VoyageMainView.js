Ext.define('Abraxa.view.settings.voyage.VoyageTemplates', {
    extend: 'Ext.Container',
    xtype: 'settings.voyage.main',
    viewModel: {
        type: 'settings-voyage-main',
    },
    layout: 'hbox',
    padding: '24 24 12 24',
    items: [
        {
            xtype: 'div',
            flex: 2,
            padding: '16 96 16 16',
            html:
                '<div class="fs-18">Voyage Templates</div>' +
                '<p class="c-grey-500">Manage your Voyage instructions templates</p>',
        },
        {
            xtype: 'container',
            shadow: false,
            height: 'calc(100vh - 120px)',
            // cls: 'a-bgr-100 border-radius',
            flex: 10,
            items: [
                {
                    xtype: 'settings.voyage.templates',
                },
                {
                    xtype: 'settings.voyage.template.preview',
                    flex: 8,
                    hidden: true,
                },
            ],
        },
    ],
});
