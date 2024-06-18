Ext.define('Abraxa.store.common.Berths', {
    extend: 'Ext.data.Store',
    alias: 'store.berths',
    model: 'Abraxa.model.common.Berth',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'berths',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
    sorters: {
        property: 'name',
    },
});
