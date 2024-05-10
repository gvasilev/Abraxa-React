Ext.define('Abraxa.model.office.OfficeEmail', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'office_id',
            type: 'integer',
        },
        {
            name: 'email_settings_id',
            type: 'auto',
        },
        {
            type: 'boolean',
            name: 'is_default',
        },
    ],
    idProperty: 'id',
    hasOne: [
        {
            name: 'email',
            model: 'Abraxa.model.settings.company.EmailSettings',
            associatedKey: 'email',
            reference: 'email_settings_id',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/offices/${office_id}/emails',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'office_emails',
            clientIdProperty: 'officEmailId',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
