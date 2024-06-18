import './PriceBookService';
import './PriceBookServiceVisibilityFormulaBlockRule';

Ext.define('Abraxa.model.calculator.PriceBookServiceVisibilityFormulaBlock', {
    extend: 'Ext.data.Model',

    fields: [{ name: 'formula', type: 'string', critical: true }],

    belongsTo: {
        model: 'Abraxa.model.calculator.PriceBookService',
        name: 'priceBookService',
        associationKey: 'price_book_service_id',
    },

    hasMany: [
        {
            model: 'Abraxa.model.calculator.PriceBookServiceVisibilityFormulaBlockRule',
            name: 'rules',
            associationKey: 'rules',
        },
    ],
});
