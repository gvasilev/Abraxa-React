Ext.define('Abraxa.store.mail.Templates', {
    extend: 'Ext.data.Store',
    alias: 'store.mail.templates',
    autoLoad: false,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'mail_templates/${object_id}/${object_meta_id}',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
