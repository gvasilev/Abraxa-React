Ext.define('Abraxa.model.portnews.PortNewsCreate', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'title',
            type: 'string',
            critical: true,
        },
        {
            name: 'validity_from',
            type: 'string',
        },
        {
            name: 'validity_to',
            type: 'string',
        },
        {
            name: 'body',
            type: 'string',
        },
        {
            name: 'port_ids',
            type: 'auto',
        },
        {
            name: 'commodity_ids',
            type: 'auto',
        },
        {
            name: 'attachments',
            type: 'auto',
        },
    ],

    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'port-news',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
