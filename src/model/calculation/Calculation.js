Ext.define('Abraxa.model.calculation.Calculation', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'status',
            type: 'auto',
            convert: function (val, record) {
                let statuses = ['draft', 'submitted', 'approved', 'rejected'];
                return statuses[val];
            },
        },
        {
            name: 'vessel_data',
            type: 'auto',
            critical: true,
        },
        {
            name: 'dataFields',
            critical: true,
            mapping: function (data) {
                return data.offer_fields;
            },
        },
    ],
    hasOne: [
        {
            name: 'vessel',
            model: 'Abraxa.model.common.Vessel',
        },
    ],
    hasMany: [
        {
            name: 'services',
            model: 'Abraxa.model.calculation.CalculationService',
        },
        {
            name: 'dataFields',
            model: 'Abraxa.model.calculation.CalculationField',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/calculations',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
