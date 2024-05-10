Ext.define('Abraxa.model.settings.company.EmailSignature', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            type: 'number',
            name: 'company_id',
        },
        {
            type: 'number',
            name: 'user_id',
        },
        {
            type: 'string',
            name: 'signature',
        },
        {
            type: 'string',
            name: 'name',
        },
        {
            type: 'date',
            name: 'created_at',
        },
        {
            type: 'number',
            name: 'created_by',
        },
        {
            type: 'date',
            name: 'updated_at',
        },
        {
            type: 'number',
            name: 'updated_by',
        },
        {
            type: 'boolean',
            name: 'is_default',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'user/${user_id}/signatures',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'user_signatures',
            clientIdProperty: 'userSignatureId',
        },
    },
});
