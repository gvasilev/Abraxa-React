Ext.define('Abraxa.model.cargo.CargoAdditional', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'cargo_id',
            type: 'auto',
        },
        {
            name: 'quantity',
            type: 'auto',
        },
        {
            name: 'unit',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        defaultExtraParams: true,
        url: Env.ApiEndpoint + 'cargo/${cargo_id}/additional_quantity',
        writer: {
            allowSingle: false,
            rootProperty: 'cargo_additionals',
        },
    },
});
