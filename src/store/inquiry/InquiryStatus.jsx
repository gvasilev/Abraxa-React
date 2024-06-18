Ext.define('Abraxa.store.inquiry.InquiryStatus', {
    extend: 'Ext.data.Store',
    alias: 'store.inquiry.status',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry_statuses',
    },
});
