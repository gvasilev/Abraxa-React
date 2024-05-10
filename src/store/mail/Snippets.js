Ext.define('Abraxa.store.mail.Snippets', {
    extend: 'Ext.data.Store',
    alias: 'store.mail.snippets',
    autoLoad: false,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'email_snippets/${object_meta_id}',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
