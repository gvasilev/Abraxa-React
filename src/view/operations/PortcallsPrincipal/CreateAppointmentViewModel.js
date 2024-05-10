Ext.define('Abraxa.view.operations.PortcallsPrincipal.CreateAppointmentViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.CreateAppointmentViewModel',
    stores: {},
    data: {
        files: Ext.create('Ext.data.Store'),
    },

    formulas: {
        portcall: {
            bind: {
                bindTo: '{createAppointmentRecord.record}',
            },
            get: function (portcall) {
                return portcall;
            },
        },
        nomination: {
            bind: {
                bindTo: '{portcall}',
            },
            get: function (portcall) {
                return portcall.getNomination();
            },
        },
        activePortcall: {
            bind: {
                bindTo: '{portcall}',
            },
            get: function (portcall) {
                return portcall;
            },
        },
    },
});
