import '../../model/calculator/RepeaterType';

Ext.define('Abraxa.store.calculator.GlobalRepeaterType', {
    extend: 'Ext.data.Store',
    alias: 'store.calcglobalrepeatertype',
    model: 'Abraxa.model.calculator.RepeaterType',
    pageSize: 50,
    storeId: 'calcglobalrepeatertype',
    autoLoad: true,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/variables/repeatable',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
