import '../../model/calculator/TariffTable.jsx';
Ext.define('Abraxa.store.calculator.TariffTable', {
    extend: 'Ext.data.Store',
    alias: 'store.tarifftable',
    model: 'Abraxa.model.calculator.TariffTable',
    pageSize: 50,
    storeId: 'tarifftable',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/tables',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
