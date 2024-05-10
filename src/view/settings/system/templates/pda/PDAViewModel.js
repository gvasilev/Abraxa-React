Ext.define('Abraxa.view.settings.templates.PDAViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settings-template-pda',

    stores: {
        pdaTemplates: {
            type: 'settings.templates.pda',
            autoLoad: true,
        },
        pdaTemplateItems: {
            type: 'settings.pda.template.items',
            autoLoad: true,
            proxy: {
                extraParams: {
                    pda_template_id: '{pdaTemplateGrid.selection.id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter('extraparamschanged', this.load, this);
                }
            },
        },
    },
});
