Ext.define('Abraxa.model.cdb.Bank', {
    extend: 'Ext.data.Model',
    idProperty: 'bank_id',
    autoLoad: false,
    fields: [
        {
            type: 'auto',
            name: 'bank_id',
        },
        {
            type: 'string',
            name: 'bank_name',
        },
        {
            type: 'string',
            name: 'currency',
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
            type: 'string',
            name: 'address',
        },
        {
            type: 'string',
            name: 'corresponding_bank',
        },
        {
            type: 'boolean',
            name: 'is_default',
        },
        {
            name: 'bank_org_id',
            type: 'auto',
        },
        {
            type: 'date',
            name: 'created_at',
        },
        {
            type: 'date',
            name: 'update_at',
        },
    ],

    proxy: {
        type: 'rest',
        batchActions: true,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        url: Env.ApiEndpoint + 'organizations/${org_id}/banks',
        writer: {
            allowSingle: false,
        },
    },
});
