// table: vessel_type
Ext.define('Abraxa.store.common.VesselOwners', {
    extend: 'Ext.data.Store',
    alias: 'store.vesselOwners',
    storeId: 'vesselOwners',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'vessel_owners',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
    autoLoad: true,
});
