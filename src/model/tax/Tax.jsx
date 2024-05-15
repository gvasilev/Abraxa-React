Ext.define('Abraxa.model.tax.Tax', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'imo',
            type: 'auto',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'amount',
            type: 'number',
        },
        {
            type: 'auto',
            name: 'port_ids',
        },
        {
            type: 'auto',
            name: 'services_ids',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'taxes',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'taxes',
            writeAllFields: true,
        },
    },
});
