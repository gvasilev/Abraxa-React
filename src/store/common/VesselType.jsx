import '../../model/common/VesselType';

Ext.define('Abraxa.store.common.VesselType', {
    extend: 'Ext.data.Store',
    alias: 'store.vesselTypeStore',
    model: 'Abraxa.model.common.VesselTypeModel',
    storeId: 'vesselTypeStore',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_vessel_types',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        reader: {
            type: 'json',
        },
    },
    sorters: {
        property: 'name',
    },
    autoLoad: true,
});
