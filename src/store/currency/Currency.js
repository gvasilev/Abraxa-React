Ext.define('Abraxa.store.currency.Currency', {
    extend: 'Ext.data.Store',
    alias: 'store.currency',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'currencies',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
