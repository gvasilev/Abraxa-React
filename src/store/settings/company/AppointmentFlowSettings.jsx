import '../../../model/settings/company/AppointmentFlowSetting';

Ext.define('Abraxa.store.settings.company.AppointmentFlowSettings', {
    extend: 'Ext.data.Store',
    alias: 'store.appointmentFlowSettings',
    model: 'Abraxa.model.settings.company.AppointmentFlowSetting',
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
