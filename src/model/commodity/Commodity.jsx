Ext.define('Abraxa.model.commodity.Commodity', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'location',
            type: 'string',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'port_id',
            type: 'integer',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'commodities',
        writer: {
            allowSingle: false,
            rootProperty: 'commodities',
            writeAllFields: true,
        },
    },
});
