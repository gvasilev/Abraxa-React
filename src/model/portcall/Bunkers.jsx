Ext.define('Abraxa.model.portcall.Bunkers', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'arrival_quantity',
            type: 'auto',
        },
        {
            name: 'arrival_unit',
            type: 'auto',
        },
        {
            name: 'departure_quantity',
            type: 'auto',
        },
        {
            name: 'departure_unit',
            type: 'auto',
        },
        {
            name: 'supplied_quantity',
            type: 'auto',
        },
        {
            name: 'supplied_unit',
            type: 'auto',
        },
        {
            name: 'remarks',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/bunkers',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
