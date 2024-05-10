Ext.define('Abraxa.store.common.Port', {
    extend: 'Ext.data.Store',
    alias: 'store.port',
    model: 'Abraxa.model.common.Port',
    autoDestroy: true,
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'ports',
    },
    sorters: {
        property: 'name',
    },
    remoteFilter: true,
});
