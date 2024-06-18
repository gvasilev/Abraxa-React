Ext.define('Abraxa.view.operations.PortCallsPricipal.PortCallsPricipalGridViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.portCallsPricipalGridViewModel',

    formulas: {
        totalRecords: {
            bind: {
                bindTo: '{portcallsPrincipal}',
                deep: true,
            },
            get: function (portcallsPrincipal) {
                if (portcallsPrincipal) {
                    return portcallsPrincipal.getTotalCount();
                }
                return 0;
            },
        },
    },
});
