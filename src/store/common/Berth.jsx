Ext.define('Abraxa.store.common.Berth', {
    extend: 'Ext.data.Store',
    alias: 'store.berth',
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
