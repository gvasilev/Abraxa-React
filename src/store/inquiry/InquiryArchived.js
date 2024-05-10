Ext.define('Abraxa.store.inquiry.InquiryArchived', {
    extend: 'Ext.data.Store',
    model: 'Abraxa.model.inquiry.Inquiry',
    alias: 'store.inquiry-archived',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry_archived',
    },
});
