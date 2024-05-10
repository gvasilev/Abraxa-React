Ext.define('Abraxa.model.calculation.CalculationField', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'fieldID',
            type: 'auto',
        },
        {
            name: 'xtype',
            critical: true,
        },
        {
            name: 'children',
            type: 'auto',
        },
        {
            name: 'childrenRaw',
            persist: false,
            mapping: function (data) {
                return JSON.stringify(data.children);
            },
        },
    ],

    idProperty: 'fieldID',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/calculations/${calculation_id}/fields',
        appendId: false,
        batchActions: true,
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            allowSingle: false,
            rootProperty: 'data',
        },
    },
});
