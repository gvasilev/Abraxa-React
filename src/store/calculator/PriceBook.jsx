import '../../model/calculator/PriceBook.jsx';
Ext.define('Abraxa.store.calculator.PriceBook', {
    extend: 'Ext.data.Store',
    alias: 'store.calcpricebook',
    model: 'Abraxa.model.calculator.PriceBook',
    pageSize: 50,
    storeId: 'calcpricebook',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/templates',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
