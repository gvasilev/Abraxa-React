Ext.define('Abraxa.store.disbursements.DisbursementPrincipal', {
    extend: 'Ext.data.Store',
    alias: 'store.disbursementsPrincipal',
    model: 'Abraxa.model.disbursement.DisbursementPrincipal',
    pageSize: 50,
    storeId: 'disbursementsPrincipal',
    remoteFilter: true,
    remoteSort: true,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'disbursements',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
    statefulFilters: true,
});
