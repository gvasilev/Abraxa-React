import '../../model/calculator/DataField';

Ext.define('Abraxa.store.calculator.DataField', {
    extend: 'Ext.data.Store',
    alias: 'store.calcdatafield',
    model: 'Abraxa.model.calculator.DataField',
    pageSize: 50,
    storeId: 'calcdatafield',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/fields',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
