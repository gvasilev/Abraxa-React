import '../../model/calculator/DataField';

Ext.define('Abraxa.store.calculator.ServiceDataField', {
    extend: 'Ext.data.Store',
    alias: 'store.calcservicedatafield',
    model: 'Abraxa.model.calculator.DataField',
    pageSize: 50,
    storeId: 'calcservicedatafield',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/templates/${priceBookId}/services/${serviceId}/fields',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
