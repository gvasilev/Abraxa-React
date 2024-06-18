import '../../model/common/Commodity';

Ext.define('Abraxa.store.common.Commodity', {
    extend: 'Ext.data.Store',
    alias: 'store.commodity',
    model: 'Abraxa.model.common.Commodity',
    autoLoad: false,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'commodities',
        writer: {
            allowSingle: false,
            rootProperty: 'commodities',
            writeAllFields: true,
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
