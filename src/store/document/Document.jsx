import '../../model/document/Document.jsx';
Ext.define('Abraxa.store.document.Document', {
    extend: 'Ext.data.Store',
    alias: 'store.document',
    autoLoad: false,
    model: 'Abraxa.model.document.Document',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'document',
    },
});
