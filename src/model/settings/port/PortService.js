Ext.define('Abraxa.model.settings.port.PortService', {
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
            type: 'auto',
            name: 'service_id',
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
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'port_services',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'portServices',
        },
    },
});
