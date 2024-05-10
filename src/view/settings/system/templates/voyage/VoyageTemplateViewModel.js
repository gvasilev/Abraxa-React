Ext.define('Abraxa.view.settings.templates.voyage.VoyageTemplateViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settings-voyage-main',

    stores: {
        voyageTemplates: {
            type: 'settings.voyage.template',
            autoLoad: true,
        },
    },
});
