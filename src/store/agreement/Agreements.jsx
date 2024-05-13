

Ext.define('Abraxa.store.agreement.Agreements', {
    extend: 'Ext.data.Store',
    alias: 'store.agreements',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'agreements',
    },
});
