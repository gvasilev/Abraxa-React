Ext.define('Abraxa.store.portnews.PortNewsCountNew', {
    extend: 'Ext.data.Store',
    idProperty: 'id',
    fields: [
        [
            {
                name: 'count',
                type: 'number',
            },
        ],
    ],

    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'port-news/count-new',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
