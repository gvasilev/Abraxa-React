Ext.define('Abraxa.store.common.port.PortHolidays', {
    extend: 'Ext.data.Store',
    storeId: 'store-portHolidays',
    alias: 'store.commonPortHolidays',
    model: 'Abraxa.model.common.port.PortHolidays',
    proxy: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        type: 'rest',
        url: Env.ApiEndpoint + 'ports/holidays',
    },
    autoload: true,
});
