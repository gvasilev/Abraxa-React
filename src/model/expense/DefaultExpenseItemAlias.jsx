import Env from '../../env.jsx'; // Import Env from env.jsx

Ext.define('Abraxa.model.expense.DefaultExpenseItemAlias', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'default_expense_item_id',
            type: 'integer',
        },
        {
            name: 'accounting_code',
            type: 'auto',
        },
        {
            name: 'name',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_expense_item_alias',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
