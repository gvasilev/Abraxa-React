import '../../model/calculator/Variable.jsx';
Ext.define('Abraxa.store.calculator.PriceBookVariable', {
    extend: 'Ext.data.Store',
    alias: 'store.calcpricebookvariable',
    model: 'Abraxa.model.calculator.Variable',
    pageSize: 50,
    storeId: 'calcpricebookvariable',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/templates/${priceBookId}/variables',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
