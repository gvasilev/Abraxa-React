Ext.define('Abraxa.model.directory.Berths', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'berth',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
