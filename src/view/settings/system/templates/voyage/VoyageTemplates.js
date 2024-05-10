Ext.define('Abraxa.view.settings.system.templates.voyage.VoyageTemplates', {
    extend: 'Abraxa.core.components.Container',

    xtype: 'settings.voyage.templates',
    layout: 'vbox',
    shadow: true,
    margin: 8,
    showAnimation: {
        type: 'slide',
        direction: 'right',
    },
    items: [
        {
            xtype: 'abraxa.titlebar',
            title: 'Templates',
            items: [
                {
                    xtype: 'button',
                    text: 'Add template',
                    iconCls: 'md-icon-add',
                    ui: 'confirm round raised btn-normal',
                    align: 'right',
                    handler: function (btn, e) {
                        Ext.create('AbraxaLive.view.settings.system.templates.voyage.VoyageTemplateCreate', {
                            viewModel: {
                                data: {
                                    templateRecord: null,
                                },
                                stores: {
                                    voyageTemplate: btn.upVM().get('voyageTemplates'),
                                },
                            },
                        }).show();
                    },
                },
            ],
        },
        {
            xtype: 'settings.voyage.template.grid',
            flex: 1,
        },
    ],
});
