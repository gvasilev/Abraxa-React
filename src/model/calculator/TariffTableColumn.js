Ext.define('Abraxa.model.calculator.TariffTableColumn', {
    extend: 'Ext.data.Model',
    idProperty: 'dataIndex',
    fields: [
        {
            name: 'match',
            critical: true,
        },
        {
            name: 'label',
        },
        {
            name: 'matchТype',
            persist: false,
        },
        {
            name: 'editor',
            critical: true,
        },
    ],
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
