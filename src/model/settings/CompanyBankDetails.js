Ext.define('Abraxa.model.settings.CompanyBankDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            type: 'string',
            name: 'currency',
        },
        {
            type: 'string',
            name: 'bank_name',
        },
        {
            type: 'string',
            name: 'bank_branch_number',
        },
        {
            type: 'string',
            name: 'aba_number',
        },
        {
            type: 'string',
            name: 'address',
        },
        {
            type: 'string',
            name: 'iban',
        },
        {
            type: 'string',
            name: 'swift_number',
        },
        {
            type: 'boolean',
            name: 'is_default',
        },
        {
            type: 'boolean',
            name: 'is_public',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/bank-details',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'company_bank_details',
            clientIdProperty: 'bankId',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
