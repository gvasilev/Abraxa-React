import '../../model/payment/Payment';

Ext.define('Abraxa.store.payments.Payments', {
    extend: 'Ext.data.Store',
    alias: 'store.payments',
    model: 'Abraxa.model.payment.Payment',
    pageSize: 50,
    storeId: 'payments',
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'payments',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
        writer: {
            writeAllFields: true,
        },
    },
    remoteFilter: true,
});
