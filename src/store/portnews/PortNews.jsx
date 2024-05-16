import '../../model/portnews/PortNews';

Ext.define('Abraxa.store.portnews.PortNews', {
    extend: 'Ext.data.Store',
    // extend: 'Ext.data.virtual.Store',
    alias: 'store.portNews',
    storeId: 'portNewsStore',
    model: 'Abraxa.model.portnews.PortNews',
    autoLoad: false,
    // autoLoad: true,
    pageSize: 10,
    remoteFilter: true,

    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'meta.total',
        },
        url: Env.ApiEndpoint + 'port-news',
    },
});
