Ext.define('Abraxa.store.portcalls.PortcallsPrincipal', {
    extend: 'Ext.data.Store',
    alias: 'store.portcallsPrincipal',
    storeId: 'portcallsPrincipal',
    model: 'Abraxa.model.portcall.PortcallPrincipal',
    // autoLoad: true,
    remoteSort: true,
    pageSize: 50,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: false,
            },
        },
    },
    statefulFilters: true,
    remoteFilter: true,
});
