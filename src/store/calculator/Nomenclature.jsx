import '../../model/calculator/Nomenclature.jsx';
Ext.define('Abraxa.store.calculator.Nomenclature', {
    extend: 'Ext.data.Store',
    alias: 'store.calcnomenclature',
    model: 'Abraxa.model.calculator.Nomenclature',
    pageSize: 50,
    storeId: 'calcnomenclature',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        appendId: false,
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/nomenclatures',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            rootProperty: 'data',
        },
    },
});
