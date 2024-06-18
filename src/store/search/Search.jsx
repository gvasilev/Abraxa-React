Ext.define('Abraxa.store.search.Search', {
    extend: 'Ext.data.Store',
    alias: 'store.elasticsearch',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'search',
        reader: {
            type: 'json',
        },
    },
    autoLoad: false,
});
