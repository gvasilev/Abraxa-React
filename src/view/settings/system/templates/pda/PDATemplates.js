Ext.define('Abraxa.view.settings.system.templates.PDATemplates', {
    extend: 'Ext.Container',

    xtype: 'settings.pda.templates',
    viewModel: {
        type: 'settings-template-pda',
    },
    padding: '24 24 12 24',
    layout: 'hbox',
    items: [
        {
            xtype: 'div',
            flex: 3,
            padding: '16 96 16 16',
            html:
                '<div class="fs-18">Offer templates</div>' +
                '<p class="c-grey-500">Manage your PDA Quote templates.</p>',
        },
        {
            xtype: 'abraxa.container',
            shadow: true,
            height: 'calc(100vh - 124px)',
            flex: 9,
            items: [
                {
                    xtype: 'settings.pda.template.list',
                },
                {
                    xtype: 'settings.pda.template.grid',
                    hidden: true,
                },
            ],
        },
    ],
});
