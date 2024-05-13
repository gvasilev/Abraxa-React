Ext.define('Abraxa.model.common.Port', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'ports',
    },
    hasMany: [
        {
            name: 'berths',
            model: 'Abraxa.model.common.Berth',
            associatedKey: 'berths',
        },
        {
            name: 'terminals',
            model: 'Abraxa.model.common.Terminal',
            associatedKey: 'terminals',
        },
        {
            name: 'holidays',
            model: 'Abraxa.model.common.Holiday',
            associatedKey: 'holidays',
        },
    ],
});
