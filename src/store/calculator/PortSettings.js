Ext.define('Abraxa.store.calculator.PortSettings', {
    extend: 'Ext.data.Store',
    alias: 'store.portsettings',
    model: 'Abraxa.model.calculator.PortSettings',
    pageSize: 50,
    storeId: 'portsettings',
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
