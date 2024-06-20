import './PriceBookServiceFormulaBlock';

Ext.define('Abraxa.model.calculator.PriceBookServiceVisibilityFormulaBlockRule', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'type', type: 'string', critical: true, defaultValue: 'formula' },
        { name: 'operator', type: 'string', critical: true, defaultValue: 'is_true' },
        {
            name: 'value',
            type: 'auto',
            critical: true,
            convert: function (value) {
                if (Ext.isArray(value)) {
                    return value;
                } else {
                    return [value];
                }
            },
        },
    ],

    belongsTo: {
        model: 'Abraxa.model.calculator.PriceBookServiceVisibilityFormulaBlock',
        name: 'priceBookServiceRule',
        associationKey: 'price_book_service_visibility_formula_block_id',
    },
});
