Ext.define('Abraxa.model.costcenter.SubCostCenter', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'name',
        },
        {
            name: 'reference_id',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cost-centers/${costCenterId}/subcenters',
    },
});
