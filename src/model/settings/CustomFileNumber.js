Ext.define('Abraxa.model.settings.CustomFileNumber', {
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
            name: 'prefix',
        },
        {
            type: 'string',
            name: 'suffix',
        },
        {
            type: 'string',
            name: 'sequence',
            critical: true,
        },
        {
            type: 'number',
            name: 'pad',
        },
        {
            type: 'number',
            name: 'office_id',
        },
        {
            type: 'string',
            name: 'numerable_type',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'custom-file-number',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
