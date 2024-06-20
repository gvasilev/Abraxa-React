import './ServiceCostCenter';
import './DefaultExpenseItemAlias';

Ext.define('Abraxa.model.expense.DefaultExpenseItem', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'default_expense_item_category_id',
            type: 'integer',
        },
        {
            name: 'default_expense_item_type_id',
            type: 'integer',
        },
        {
            name: 'accounting_code',
            type: 'string',
            persist: false,
            mapping: function (data) {
                if (data.aliases) return data.aliases.accounting_code;
            },
        },
        {
            name: 'alias_name',
            type: 'string',
            persist: false,
            mapping: function (data) {
                if (data.aliases) return data.aliases.name;
            },
        },
        {
            name: 'aliases',
            type: 'auto',
        },
    ],
    hasMany: [
        {
            name: 'cost_centers',
            model: 'Abraxa.model.expense.ServiceCostCenter',
        },
    ],
    hasOne: [
        {
            name: 'aliases',
            model: 'Abraxa.model.expense.DefaultExpenseItemAlias',
            associatedKey: 'aliases',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_expense_item',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
