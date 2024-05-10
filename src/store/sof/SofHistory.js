Ext.define('Abraxa.store.sof.SofHistory', {
    extend: 'Ext.data.Store',
    alias: 'store.sof.history',
    model: 'Abraxa.model.sof.SOF',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof_history/${appoitment_id}',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
