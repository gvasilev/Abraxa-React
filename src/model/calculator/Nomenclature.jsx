Ext.define('Abraxa.model.calculator.Nomenclature', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'type', type: 'string' },
        { name: 'items', type: 'auto', critical: true },
    ],
    proxy: {
        type: 'rest',
        appendId: false,
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/nomenclatures/${type}',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            rootProperty: 'data',
        },
    },
});
