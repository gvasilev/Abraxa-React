Ext.define('Abraxa.model.agreements.AgreementBilling', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            type: 'number',
            name: 'organization_org_id',
        },
        {
            type: 'auto',
            name: 'billing_name',
        },
        {
            type: 'number',
            name: 'default_expense_item_id',
        },

        {
            type: 'auto',
            name: 'default_expense_item_name',
        },
        {
            type: 'auto',
            name: 'vendor_id',
        },
        {
            type: 'auto',
            name: 'vendor_name',
        },
        {
            type: 'number',
            name: 'percentage',
        },
        {
            type: 'auto',
            name: 'port_ids',
        },
        {
            name: 'port_function',
            type: 'auto',
        },
        {
            type: 'date',
            name: 'validity_from',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
        },
        {
            type: 'date',
            name: 'validity_to',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
        },
        {
            type: 'number',
            name: 'active',
        },
        {
            type: 'auto',
            name: 'description',
        },
        {
            name: 'is_checked',
            type: 'auto',
            persist: false,
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${org_id}/billings',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'billings',
            clientIdProperty: 'billingId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
