import Env from '../../env.jsx';
import '../../model/commodity/Commodity.jsx';

Ext.define('Abraxa.store.commodities.Commodities', {
    extend: 'Ext.data.virtual.Store',
    alias: 'store.commodities',
    autoLoad: false,
    pageSize: 100,
    leadingBufferZone: 100,
    autoSync: true,
    model: 'Abraxa.model.commodity.Commodity',
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
