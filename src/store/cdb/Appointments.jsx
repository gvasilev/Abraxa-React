import '../../model/cdb/Appointment';
Ext.define('Abraxa.store.cdb.Appointments', {
    extend: 'Ext.data.Store',
    alias: 'store.CdbAppointmentsStore',
    model: 'Abraxa.model.cdb.Appointment',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/appointments/${org_id}',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
