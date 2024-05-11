Ext.define('Abraxa.store.common.CurrencyRates', {
    extend: 'Ext.data.Store',
    alias: 'store.currency_rates',
    autoLoad: false,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'currency_rates/${base_currency}',
    },
});
