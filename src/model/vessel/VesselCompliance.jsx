Ext.define('Abraxa.model.vessel.VesselCompliance', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'vessel_id',
            type: 'integer',
            critical: true,
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'vessel/compliance',
    },
});
