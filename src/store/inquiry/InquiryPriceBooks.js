Ext.define('Abraxa.store.inquiry.InquiryPriceBooks', {
    extend: 'Ext.data.Store',
    alias: 'store.inquiry.pricebooks',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/port/${port_id}/templates',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
