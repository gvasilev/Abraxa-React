Ext.define('Abraxa.store.voyage.VoyageTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.voyageTypes',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'voyage-types',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
