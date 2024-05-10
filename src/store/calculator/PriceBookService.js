Ext.define('Abraxa.store.calculator.PriceBookService', {
    extend: 'Ext.data.Store',
    alias: 'store.calcpricebookservice',
    model: 'Abraxa.model.calculator.PriceBookService',
    pageSize: 50,
    storeId: 'calcpricebookservice',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/templates/${priceBookId}/services',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: true,
            },
        },
    },
});
