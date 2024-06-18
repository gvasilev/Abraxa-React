Ext.define('Abraxa.model.agreements.AgreementDiscount', {
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
            name: 'discount_name',
        },
        {
            type: 'auto',
            name: 'default_expense_item_id',
        },
        {
            type: 'auto',
            name: 'type',
        },
        {
            type: 'auto',
            name: 'default_expense_item_name',
        },
        {
            type: 'number',
            name: 'percentage',
        },

        {
            type: 'auto',
            name: 'amount',
        },
        {
            type: 'auto',
            name: 'currency',
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
        url: Env.ApiEndpoint + 'company/${org_id}/discounts',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'discounts',
            clientIdProperty: 'discountId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
