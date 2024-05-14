Ext.define('Abraxa.model.adocs.DocumentPage', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            type: 'string',
            name: 'html',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'documents/${document_id}/page',
        batchActions: true,
        appendId: false,
        writer: {
            allowSingle: false,
        },
    },
});
