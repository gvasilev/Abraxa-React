import './PriceBookServiceFormulaBlock';

Ext.define('Abraxa.model.calculator.PriceBookServiceFormulaBlockRule', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'type', type: 'string', critical: true, defaultValue: 'formula' },
        { name: 'operator', type: 'string', critical: true, defaultValue: 'is_true' },
        {
            name: 'value',
            type: 'auto',
            critical: true,
            convert: function(value) {
                if (Ext.isArray(value)) {
                    return value;
                } else {
                    return [value];
                }
            },
        },
    ],

    belongsTo: {
        model: 'Abraxa.model.calculator.PriceBookServiceFormulaBlock',
        name: 'priceBookServiceRule',
        associationKey: 'price_book_service_formula_block_id',
    },
});
