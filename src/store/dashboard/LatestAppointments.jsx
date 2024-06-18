Ext.define('Abraxa.store.dashboard.LatestAppointments', {
    extend: 'Ext.data.Store',
    alias: 'store.latest.appointments',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'dashboard/appointments_latest',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
