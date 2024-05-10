Ext.define('Abraxa.model.portcall.Status', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'is_archive',
            type: 'number',
        },
        {
            name: 'string',
            type: 'string',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall_statuses',
    },
});
