import '../../model/inquiry/InquiryPda';

Ext.define('Abraxa.store.inquiry.InquiryPdas', {
    extend: 'Ext.data.Store',
    alias: 'store.inquiry.pdas',
    model: 'Abraxa.model.inquiry.InquiryPda',
    autoLoad: true,
    pageSize: 50,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry/pdas',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
    statefulFilters: true,
    remoteFilter: true,
});
