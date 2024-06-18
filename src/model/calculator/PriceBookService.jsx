import './PriceBookServiceFormulaBlock';
import './PriceBookServiceVisibilityFormulaBlock';

Ext.define('Abraxa.model.calculator.PriceBookService', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'string' },
        { name: 'formula', type: 'auto' },
        { name: 'visibility_formula', type: 'auto' },
        { name: 'order', type: 'integer', critical: true },
    ],

    hasMany: [
        {
            model: 'Abraxa.model.calculator.PriceBookServiceFormulaBlock',
            name: 'formula_blocks',
            associationKey: 'formula_blocks',
        },
        {
            model: 'Abraxa.model.calculator.PriceBookServiceVisibilityFormulaBlock',
            name: 'visibility_formula_blocks',
            associationKey: 'visibility_formula_blocks',
        },
    ],
});
