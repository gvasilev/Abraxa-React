Ext.define('Abraxa.store.integrations.Integrations', {
    extend: 'Ext.data.Store',
    alias: 'store.integrations',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'integrations',
    },
});
