Ext.define('Abraxa.store.portcalls.PortcallsArchived', {
    extend: 'Ext.data.Store',
    model: 'Abraxa.model.portcall.Portcall',
    alias: 'store.portcalls-archived',
    storeId: 'portcallsClosed',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcalls_archived',
    },
});
