Ext.define('Abraxa.model.portnews.PortNewsType', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'slug',
            type: 'string',
        },
    ],

    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'port-news-types',
    },
});
