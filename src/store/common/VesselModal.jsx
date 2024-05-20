import '../../model/common/Vessel';

Ext.define('Abraxa.store.common.VesselModal', {
    extend: 'Ext.data.Store',
    alias: 'store.vesselmodal',
    storeId: 'store-vesselmodal',
    model: 'Abraxa.model.common.Vessel',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'vessels/${id}',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        reader: {
            type: 'json',
        },
    },
});
