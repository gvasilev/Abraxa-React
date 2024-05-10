Ext.define('Abraxa.model.costcenter.CostCenterService', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'subcenter_id',
        },
        {
            name: 'default_expense_items_ids',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cost-centers/${costCenterId}/services',
    },
});
