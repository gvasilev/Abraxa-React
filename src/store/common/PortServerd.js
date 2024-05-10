Ext.define('Abraxa.store.common.PortsServed', {
    extend: 'Ext.data.Store',
    alias: 'store.ports.served',
    model: 'Abraxa.model.common.PortServed',
    autoLoad: false,
    pageSize: 30,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'ports_served',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
    remoteFilter: true,
});
