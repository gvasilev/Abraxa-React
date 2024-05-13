
Ext.define('Abraxa.store.common.PaymentTerms', {
    extend: 'Ext.data.Store',
    alias: 'store.payment.terms',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'payment_terms',
    },
});
