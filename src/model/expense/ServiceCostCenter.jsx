
Ext.define('Abraxa.model.expense.ServiceCostCenter', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'service-cost-center',
    },
});
