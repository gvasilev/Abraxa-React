Ext.define('Abraxa.view.settings.voyage.VoyageClauseViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settings-voyage-clause',

    stores: {
        voyageClauses: {
            type: 'settings.voyage.clause',
            autoLoad: true,
        },
    },
});
