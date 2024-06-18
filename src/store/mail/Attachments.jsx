Ext.define('Abraxa.store.mail.Attachments', {
    extend: 'Ext.data.Store',
    storeId: 'mail-attachments',
    alias: 'store.mail.attachments',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'mail/attachments',
    },
});
