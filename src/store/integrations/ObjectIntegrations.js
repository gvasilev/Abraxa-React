Ext.define('Abraxa.store.integrations.ObjectIntegrations', {
    extend: 'Ext.data.Store',
    alias: 'store.object-integrations',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${object_meta_id}/integrations',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
