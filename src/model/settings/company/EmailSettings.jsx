Ext.define('Abraxa.model.settings.company.EmailSettings', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'email',
            type: 'auto',
        },
        {
            name: 'smtp_username',
            type: 'auto',
        },
        {
            name: 'smtp_password',
            type: 'auto',
        },
        {
            name: 'smtp_server',
            type: 'auto',
        },
        {
            name: 'smtp_port',
            type: 'auto',
        },
        {
            name: 'secure_connection',
            type: 'auto',
        },
        {
            type: 'boolean',
            name: 'is_default',
            critical: true,
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/emails',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'email_settings',
            clientIdProperty: 'emailSettingId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
