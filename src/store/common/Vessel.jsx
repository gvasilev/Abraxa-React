Ext.define('Abraxa.store.common.Vessel', {
    extend: 'Ext.data.Store',
    alias: 'store.vessel',
    model: 'Abraxa.model.common.Vessel',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'vessels',
        writer: {
            allowSingle: false,
            rootProperty: 'vessels',
            writeAllFields: true,
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
    sorters: {
        property: 'name',
    },
    // remoteFilter: true,
    // noCache: true,
    autoLoad: false,
    autoDestroy: true,
});
