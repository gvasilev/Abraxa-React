Ext.define('Abraxa.store.common.port.PortBerths', {
    extend: 'Ext.data.Store',
    storeId: 'store-portBerths',
    alias: 'store.commonPortBerths',
    model: 'Abraxa.model.common.port.PortBerths',
    proxy: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        type: 'rest',
        url: Env.ApiEndpoint + 'ports/berths',
    },
    autoload: true,
});
