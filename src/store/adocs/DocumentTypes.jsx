

Ext.define('Abraxa.store.adocs.DocumentTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.document.types',
    // autoLoad: true,
    sorters: [
        {
            property: 'name',
            direction: 'ASC',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'document_blanks',
    },
});
