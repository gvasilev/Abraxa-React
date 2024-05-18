Ext.define('Abraxa.model.calculator.PriceBook', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'serviceCount', type: 'integer' },
    ],
});
