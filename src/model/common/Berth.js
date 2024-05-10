Ext.define('Abraxa.model.common.Berth', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'da_settings_blanks_id',
            type: 'integer',
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
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'berths',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'berths',
            writeAllFields: true,
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
