

Ext.define('Abraxa.model.disbursement.DefaultDisbursementItem', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'title',
            type: 'string',
        },
        {
            name: 'type',
            type: 'auto',
        },
        {
            name: 'income',
            type: 'auto',
        },
    ],
    hasOne: [
        {
            name: 'item_details',
            model: 'Abraxa.model.disbursement.DefaultDisbursementItemDetails',
            associationKey: 'item_details',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_disbursement_items',
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: true,
            },
        },
    },
});
