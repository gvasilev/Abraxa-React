Ext.define('Abraxa.model.agreements.AgreementPrefunding', {
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
            name: 'payment_term_id',
        },
        {
            type: 'auto',
            name: 'payment_term_name',
        },
        {
            type: 'number',
            name: 'percentage',
        },
        {
            type: 'auto',
            name: 'agency_type_id',
        },
        {
            type: 'auto',
            name: 'agency_type_name',
        },
        {
            type: 'auto',
            name: 'threshold_operator',
        },
        {
            type: 'auto',
            name: 'threshold_amount',
        },
        {
            type: 'auto',
            name: 'threshold_currency',
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
        url: Env.ApiEndpoint + 'company/${org_id}/prefundings',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'prefundings',
            clientIdProperty: 'prefundingId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
