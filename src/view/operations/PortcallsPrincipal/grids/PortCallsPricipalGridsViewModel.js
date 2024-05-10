Ext.define('Abraxa.view.operations.PortCallsPricipal.grids.PortCallsPricipalGridsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.portCallsPricipalGridsViewModel',

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
