Ext.define('Abraxa.model.disbursement.DefaultDisbursementItemDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'default_expense_item_id',
            type: 'auto',
        },
        {
            name: 'vat_enabled',
            type: 'auto',
        },
        {
            name: 'vat',
            type: 'auto',
        },
        {
            name: 'accounting_code',
            type: 'auto',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
    ],
});
