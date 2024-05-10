import Env from '../../env.jsx'; // Import Env from env.jsx
import '../../model/expense/DefaultExpenseItem.jsx';

Ext.define('Abraxa.store.common.DefaultExpenseItems', {
    extend: 'Ext.data.Store',
    alias: 'store.default-expense-items',
    autoLoad: true,
    model: 'Abraxa.model.expense.DefaultExpenseItem',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_expense_item',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
