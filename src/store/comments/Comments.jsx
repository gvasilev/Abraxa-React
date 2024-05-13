

Ext.define('Abraxa.store.comments.Comments', {
    extend: 'Ext.data.Store',
    alias: 'store.comments',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'my_comments',
    },
});
