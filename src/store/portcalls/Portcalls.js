Ext.define('Abraxa.store.portcalls.Portcalls', {
    extend: 'Ext.data.Store',
    alias: 'store.portcalls',
    storeId: 'portcalls',
    model: 'Abraxa.model.portcall.Portcall',
    autoLoad: true,
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
