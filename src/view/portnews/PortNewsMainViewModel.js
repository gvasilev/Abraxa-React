Ext.define('Abraxa.view.portnews.PortNewsMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.PortNewsMainViewModel',
    data: {
        isFilterOpened: false,
        filterCount: 0,
        selectedPorts: null,
    },
    stores: {
        portNews: {
            type: 'portNews',
            // pageSize: 5,
            autoLoad: true,
        },
        portNewsTypes: {
            type: 'portNewsType',
            autoLoad: true,
        },
    },
    formulas: {
        filterCount: {
            bind: {
                bindTo: '{portNews}',
                deep: true,
            },
            get: function (store) {
                let filterCount = +store.getFilters().length;
                const filter = store.getFilters().items.map(function (item) {
                    return item._id === 'portsSearchFilter' ? item : null;
                })[0];
                if (filter) {
                    filterCount -= 1;
                }
                return filterCount;
            },
        },
    },
});
