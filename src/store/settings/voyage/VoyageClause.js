Ext.define('Abraxa.store.settings.voyage.VoyageClause', {
    extend: 'Ext.data.Store',
    alias: 'store.settings.voyage.clause',
    autoLoad: false,
    autoSync: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'voyage_clause/',
    },
});
