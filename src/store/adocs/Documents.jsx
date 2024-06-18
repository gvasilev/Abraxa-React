Ext.define('Abraxa.store.adocs.Documents', {
    extend: 'Ext.data.Store',
    alias: 'store.documents',
    autoLoad: false,
    model: 'Abraxa.model.adocs.Document',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'documents',
    },
});
