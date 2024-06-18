Ext.define('Abraxa.store.calculator.Columns', {
    extend: 'Ext.data.Store',
    alias: 'store.column.store',
    model: 'Abraxa.model.calculator.TariffTableColumn',
    // data: [{
    //     columnId: 1,
    //     text: 'Y column',
    //     locked: true,
    //     minWidth: 320,
    //     value: [1, 10],
    //     label: '1-10',
    //     type: 'range',
    //     editor: {
    //         field: {
    //             xtype: 'textfield'
    //         }
    //     }
    // }]
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/tables/${portSettingsTariffTableId}/columns',
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
