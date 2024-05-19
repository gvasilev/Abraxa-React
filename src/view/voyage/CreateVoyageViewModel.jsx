Ext.define('Abraxa.view.voyage.CreateVoyageViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.CreateVoyageViewModel',
    data: {},
    stores: {
        portcalls: {
            source: '{voyage.portcalls}',
            sorters: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        },
    },
    formulas: {
        voyage: {
            bind: {
                bindTo: '{createVoyageRecord.record}',
            },
            get: function (voyage) {
                return voyage;
            },
        },
        addDefaultPortcall: {
            bind: {
                bindTo: '{voyage}',
            },
            get: function (voyage) {
                if (voyage && voyage.portcalls() && !voyage.portcalls().getCount()) {
                    voyage.portcalls().add({});
                }
            },
        },
    },
});
