Ext.define('Abraxa.store.portcalls.Statuses', {
    extend: 'Ext.data.Store',
    alias: 'store.portcall.statuses',
    model: 'Abraxa.model.portcall.Status',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall_statuses',
    },
    sorters: [
        {
            property: 'sort_order',
            direction: 'ASC',
        },
    ],
});
