Ext.define('Abraxa.store.common.port.PortsServedAll', {
    extend: 'Ext.data.Store',
    alias: 'store.ports.served.all',
    model: 'Abraxa.model.common.PortServed',
    autoLoad: false,
    pageSize: 30,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'ports_served/all',
        reader: {
            type: 'json',
        },
    },
});
