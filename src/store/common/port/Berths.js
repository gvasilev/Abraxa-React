Ext.define('Abraxa.store.common.port.Berths', {
    extend: 'Ext.data.Store',
    alias: 'store.port.berths',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'ports/${port_id}/berths',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
