Ext.define('Abraxa.model.settings.company.CompanyCurrency', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'currency_id',
            type: 'auto',
        },
        {
            name: 'description',
            type: 'auto',
        },
        {
            name: 'is_default',
            type: 'boolean',
        },
        {
            name: 'forex',
            persist: false,
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/currencies',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'company_currencies',
        },
    },
});
