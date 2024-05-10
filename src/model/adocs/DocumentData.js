Ext.define('Abraxa.model.adocs.DocumentData', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'document_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'due_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
    ],
    belongsTo: [
        {
            name: 'document',
            model: 'Abraxa.model.adocs.Document',
            associationKey: 'document',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'document/data',
    },
});
