Ext.define('Abraxa.model.portcall.Service', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'da_crewing_visitors_id',
            type: 'integer',
        },
        {
            name: 'da_crewing_and_visitors_service_types_id',
            type: 'auto',
        },
        {
            name: 'remarks',
            type: 'auto',
        },
        {
            name: 'bill_to',
            type: 'auto',
        },
        {
            name: 'org_id',
            type: 'auto',
        },
        {
            name: 'service_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/${crewing_id}/service',
        batchActions: true,
        writer: {
            allowSingle: false,
            rootProperty: 'services',
            clientIdProperty: 'serviceId',
        },
    },
});
