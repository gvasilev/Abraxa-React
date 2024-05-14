import '../adocs/Document.jsx';
Ext.define('Abraxa.model.cargo.CargoDocument', {
    extend: 'Abraxa.model.adocs.DocumentData',
    belongsTo: [
        {
            name: 'document',
            model: 'Abraxa.model.adocs.Document',
            associationKey: 'document',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cargo/${cargo_id}/documents',
    },
});
