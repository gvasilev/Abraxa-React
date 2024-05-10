Ext.define('Abraxa.model.berth.Service', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'da_berth_id',
            type: 'auto',
        },
        {
            name: 'to_num',
            type: 'auto',
        },
        {
            name: 'to_company_id',
            type: 'auto',
        },
        {
            name: 'to_company_name',
            type: 'auto',
        },
        {
            name: 'from_num',
            type: 'auto',
        },
        {
            name: 'from_company_id',
            type: 'auto',
        },
        {
            name: 'from_company_name',
            type: 'auto',
        },
        {
            name: 'service_type',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'berth/${berth_id}/service',
    },
});
