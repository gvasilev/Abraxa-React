Ext.define('Abraxa.store.inquiry.Inquiry', {
    extend: 'Ext.data.Store',
    alias: 'store.inquiry',
    model: 'Abraxa.model.inquiry.Inquiry',
    autoLoad: true,
    pageSize: 50,
    storeId: 'inquiries',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: false,
            },
        },
    },
    statefulFilters: true,
    remoteFilter: true,
});
