Ext.define('Abraxa.model.common.Holiday', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'is_checked',
            type: 'auto',
            persist: false,
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'holidays',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'holidays',
            writeAllFields: true,
        },
    },
});
