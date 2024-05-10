Ext.define('Abraxa.view.directory.DirectoryViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.DirectoryViewModel',
    data: {},
    stores: {
        directoryPorts: {
            type: 'DirectoryPortsStore',
            autoSort: true,
            autoDestroy: true,
            autoLoad: true,
            sorters: [
                {
                    property: 'name',
                    direction: 'ASC',
                },
            ],
        },
        agentsStore: {
            type: 'AgentsStore',
            autoSort: true,
            autoDestroy: true,
            autoLoad: true,
            sorters: [
                {
                    property: 'name',
                    direction: 'ASC',
                },
            ],
        },
    },
    formulas: {
        //total records formula for agents toolbar
        totalAgentsRecords: {
            bind: {
                bindTo: '{agentsStore}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
        //total records formula for paging toolbar
        totalPortsRecords: {
            bind: {
                bindTo: '{directoryPorts}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
        setActiveTab: {
            bind: {
                bindTo: '{routeParams}',
            },
            get: function (routeParams) {
                if (routeParams) {
                    if (routeParams === 'agents') {
                        return 0;
                    }
                    if (routeParams === 'ports') {
                        return 1;
                    }
                }
                return 0;
            },
        },
    },
});
