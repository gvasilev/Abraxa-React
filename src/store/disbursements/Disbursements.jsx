Ext.define('Abraxa.store.disbursements.Disbursements', {
    extend: 'Ext.data.Store',
    alias: 'store.disbursements',
    model: 'Abraxa.model.disbursement.Disbursement',
    pageSize: 50,
    // leadingBufferZone: 5,
    storeId: 'disbursements',
    autoLoad: true,
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
    remoteFilter: true,
    grouper: {
        groupFn: function (record) {
            return record.get('status');
        },
        sorterFn: function (a, b) {
            const statusOrder = ['submitted', 'draft', 'completed', 'settled'];

            const aStatusIndex = statusOrder.indexOf(a.get('status'));
            const bStatusIndex = statusOrder.indexOf(b.get('status'));

            if (aStatusIndex === bStatusIndex) return a.status - b.status;

            return aStatusIndex - bStatusIndex;
        },
    },
});
