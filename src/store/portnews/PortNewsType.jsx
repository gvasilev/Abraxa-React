import '../../model/portnews/PortNewsType';

Ext.define('Abraxa.store.portnews.PortNewsType', {
    extend: 'Ext.data.Store',
    alias: 'store.portNewsType',
    storeId: 'portNewsStoreType',
    model: 'Abraxa.model.portnews.PortNewsType',
    autoLoad: false,
    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },

        url: Env.ApiEndpoint + 'port-news-types',
    },
});
