import '../adocs/Document';

Ext.define('Abraxa.model.amail.File', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
    ],
    hasOne: [
        {
            name: 'document',
            model: 'Abraxa.model.adocs.Document',
            associatedKey: 'document',
            reference: 'document_id',
        },
    ],
});
