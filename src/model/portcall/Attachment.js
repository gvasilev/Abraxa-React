Ext.define('Abraxa.model.portcall.Attachment', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'document',
        },
    ],
    hasOne: [
        {
            name: 'document',
            model: 'Abraxa.model.document.Document',
            associationKey: 'document',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'attachments',
        batchActions: true,
        writer: {
            allowSingle: false,
            rootProperty: 'attachments',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
