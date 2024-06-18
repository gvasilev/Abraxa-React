Ext.define('Abraxa.store.cdb.OrganizationVirtualAccountPayments', {
    extend: 'Ext.data.Store',
    alias: 'store.organizationVirtualAccountPayments',
    autoLoad: false,
    pageSize: 20,
    model: 'Abraxa.model.payment.Payment',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cdb/${organization}/virtual-accounts/${virtual_account}/payments',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'meta.total',
        },
    },
});
