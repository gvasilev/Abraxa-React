import '../../model/cdb/Appointment';

Ext.define('Abraxa.store.cdb.Appointments', {
    extend: 'Ext.data.Store',
    alias: 'store.CdbAppointmentsStore',
    model: 'Abraxa.model.cdb.Appointment',
    autoLoad: true,
    pageSize: 20, // Page size limitation is the same in the backend
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/appointments/${org_id}',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'meta.total',
        },
    },
});
