Ext.define('Abraxa.store.dashboard.PortcallsMap', {
    extend: 'Ext.data.Store',
    alias: 'store.portcalls.map',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'dashboard/portcalls_map',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
