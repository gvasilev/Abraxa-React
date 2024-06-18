Ext.define('Abraxa.store.cdb.OrganizationOpenBalances', {
    extend: 'Ext.data.Store',
    alias: 'store.OrganizationOpenBalances',
    autoLoad: false,
    model: 'Abraxa.model.account.Account',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations/${org_id}/open-balances',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'meta.total',
        },
    },
});
