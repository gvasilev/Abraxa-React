Ext.define('Abraxa.model.disbursement.Sharing', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'disbursement_id',
            type: 'integer',
        },

        {
            name: 'tenant_id',
            type: 'integer',
        },
        {
            name: 'tenants',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'disbursement_sharing',
    },
});
