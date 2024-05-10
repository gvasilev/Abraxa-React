Ext.define('Abraxa.store.calculator.GlobalVariable', {
    extend: 'Ext.data.Store',
    alias: 'store.calcglobalvariable',
    model: 'Abraxa.model.calculator.Variable',
    pageSize: 50,
    storeId: 'calcglobalvariable',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/variables',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
