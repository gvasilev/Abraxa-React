Ext.define('Abraxa.model.settings.company.Verification', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'company_name',
            type: 'string',
        },
        {
            name: 'registered_name',
            type: 'auto',
        },
        {
            name: 'company_email',
            type: 'auto',
        },
        {
            name: 'country',
            type: 'auto',
        },
        {
            name: 'country_name',
            type: 'auto',
        },
        {
            name: 'city',
            type: 'auto',
        },
        {
            name: 'city_name',
            type: 'auto',
        },
        {
            name: 'full_registered_address',
            type: 'auto',
        },
        {
            name: 'vat_number',
            type: 'auto',
        },
        {
            name: 'contact_first_name',
            type: 'auto',
        },
        {
            name: 'contact_last_name',
            type: 'auto',
        },
        {
            name: 'contact_position',
            type: 'auto',
        },
        {
            name: 'contact_email',
            type: 'auto',
        },
        {
            name: 'contact_phone',
            type: 'auto',
        },
        {
            name: 'authorize',
            type: 'boolean',
            defaultValue: false,
            persist: false,
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'company/${company_id}/verification',
    },
});
