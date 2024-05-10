Ext.define('Abraxa.model.biling.Biling', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'primary_contact',
            type: 'auto',
        },
        {
            name: 'billing_contact',
            type: 'auto',
        },
        {
            name: 'onboarding_contact',
            type: 'auto',
        },
        {
            name: 'technical_admin',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        appendId: false,
        url: Env.ApiEndpoint + 'billing_company_info',
    },
});
