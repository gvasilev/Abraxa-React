Ext.define('Abraxa.model.integration.PortcallIntegration', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${object_meta_id}/integrations',
    },
});
