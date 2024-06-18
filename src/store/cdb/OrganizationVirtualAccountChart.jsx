Ext.define('Abraxa.store.cdb.OrganizationVirtualAccountChart', {
    extend: 'Ext.data.Store',
    alias: 'store.organizationVirtualAccountChart',
    autoLoad: false,
    model: 'Abraxa.model.payment.Payment',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cdb/${organization}/virtual-accounts/${virtual_account}/balances',
        reader: {
            type: 'json',
        },
    },
});
