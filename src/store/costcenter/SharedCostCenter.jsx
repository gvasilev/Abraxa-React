Ext.define('Abraxa.store.costcenter.SharedCostCenter', {
    extend: 'Ext.data.Store',
    alias: 'store.SharedCostCenter',
    model: 'Abraxa.model.costcenter.CostCenter',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cost-centers/shared-with-cost-centers',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
