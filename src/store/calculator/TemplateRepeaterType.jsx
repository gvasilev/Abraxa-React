import '../../model/calculator/RepeaterType';

Ext.define('Abraxa.store.calculator.TemplateRepeaterType', {
    extend: 'Ext.data.Store',
    alias: 'store.calctemplaterepeatertype',
    model: 'Abraxa.model.calculator.RepeaterType',
    pageSize: 50,
    storeId: 'calctemplaterepeatertype',
    autoLoad: true,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/variables/repeatable/${priceBookId}',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
