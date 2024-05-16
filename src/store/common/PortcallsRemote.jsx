Ext.define('Abraxa.store.common.PortcallsRemote', {
    extend: 'Ext.data.Store',
    alias: 'store.portcalls.remote',
    model: 'Abraxa.model.portcall.Portcall',
    autoDestroy: true,
    remoteFilter: true,
    remoteSort: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcalls',
    },
    sorters: {
        property: 'id',
    },
});
