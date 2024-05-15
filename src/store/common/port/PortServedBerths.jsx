import '../../../model/common/port/PortBerths.jsx';
Ext.define('Abraxa.store.common.port.PortServedBerths', {
    extend: 'Ext.data.Store',
    storeId: 'store-portServedBerths',
    alias: 'store.commonPortServedBerths',
    model: 'Abraxa.model.common.port.PortBerths',
    proxy: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        type: 'rest',
        url: Env.ApiEndpoint + 'ports_served/${portId}/berths',
    },
    autoload: true,
});
