

Ext.define('Abraxa.model.cdb.CreditRating', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations/credit_ratings',
    },
});
