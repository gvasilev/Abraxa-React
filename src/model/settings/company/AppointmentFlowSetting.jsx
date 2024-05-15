Ext.define('Abraxa.model.settings.company.AppointmentFlowSetting', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'tenant_id',
            type: 'integer',
        },
        {
            name: 'preferred_tenant_id',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'company/${company_id}/appointment-flow-settings',
        pageParam: false,
        startParam: false,
        limitParam: false,
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
