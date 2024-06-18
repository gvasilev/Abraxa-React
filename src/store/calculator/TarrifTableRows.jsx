import '../../model/calculator/TarrifTableRow';

Ext.define('Abraxa.store.calculator.TariffTableRows', {
    extend: 'Ext.data.Store',
    alias: 'store.tarifftable.row.store',
    model: 'Abraxa.model.calculator.TariffTableRow',
    autoLoad: false,
    autoDestroy: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/tables/${portSettingsTariffTableId}/rows',
        batchActions: true,
        appendId: false,
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
        writer: {
            allowSingle: false,
            rootProperty: 'data',
            writeAllFields: true,
        },
        actionMethods: {
            create: 'PATCH',
            read: 'GET',
            update: 'PATCH',
            destroy: 'DELETE',
        },
    },
});
