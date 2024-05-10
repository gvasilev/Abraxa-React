Ext.define('Abraxa.model.portcall.CargoOps', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'cargo_id',
            type: 'auto',
        },
        {
            name: 'date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'handled',
            type: 'auto',
        },
        {
            name: 'remaining',
            type: 'auto',
        },
        {
            name: 'gangs',
            type: 'number',
        },
        {
            name: 'holds',
            type: 'number',
        },
        {
            name: 'comment',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/cargo_ops',
    },
});
