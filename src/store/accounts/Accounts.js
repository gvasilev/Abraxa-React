Ext.define('Abraxa.store.accounts.Accounts', {
    extend: 'Ext.data.Store',
    alias: 'store.accounts',
    model: 'Abraxa.model.account.Account',
    pageSize: 50,
    storeId: 'accounts',
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'accounts',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
    statefulFilters: true,
    remoteFilter: true,
});
