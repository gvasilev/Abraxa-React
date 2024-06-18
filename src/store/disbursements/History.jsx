Ext.define('Abraxa.store.disbursements.History', {
    extend: 'Ext.data.Store',
    alias: 'store.disbursements.history',
    model: 'Abraxa.model.disbursement.Disbursement',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'disbursement_history/${disbursement_id}',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
