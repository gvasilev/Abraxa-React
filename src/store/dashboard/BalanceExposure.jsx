Ext.define('Abraxa.store.dashboard.BalanceExposure', {
    extend: 'Ext.data.Store',
    alias: 'store.balance.exposure',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'dashboard/balance_exposure',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
