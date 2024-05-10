Ext.define('Abraxa.store.inquiry.VesselData', {
    extend: 'Ext.data.Store',
    alias: 'store.vesseldata',
    storeId: 'store-vesseldata',
    model: 'Abraxa.model.inquiry.VesselData',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'da_inquiries/${inq_id}/vessel_details',
        appendId: false,
        reader: {
            type: 'json',
        },
    },
});
