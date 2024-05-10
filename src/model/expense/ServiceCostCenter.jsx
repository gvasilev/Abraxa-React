import Env from '../../env.jsx'; // Import Env from env.jsx
Ext.define('Abraxa.model.expense.ServiceCostCenter', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'service-cost-center',
    },
});
