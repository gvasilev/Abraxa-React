Ext.define('Abraxa.model.Component', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'xtype',
            type: 'auto',
        },
        {
            name: 'hash',
            type: 'auto',
        },
        {
            name: 'type',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'components',
    },
});
