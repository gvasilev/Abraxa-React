Ext.define('Abraxa.store.settings.HistoricalRates', {
    extend: 'Ext.data.Store',
    alias: 'store.historical.rates',
    autoLoad: false,
    autoSync: false,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/historical_rates/${currency}',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
