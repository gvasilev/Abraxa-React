Ext.define('Abraxa.core.plugins.GridStatefulFilterBar', {
    override: 'Ext.grid.plugin.filterbar.FilterBar',

    config: {
        stateful: false,
        stateFilters: [],
        // exclude 'search' and 'archived' filters by default
        nonStatefulFilters: ['search', 'archived'],
    },

    onFilterChanged: function (store, filters) {
        const filterBar = this;
        if (!filterBar.getStateful()) return;

        const storeFilters = [];
        const nonStatefulFilters = filterBar.getNonStatefulFilters();

        filters.forEach((filter) => {
            if (filter.getValue() === '') return;

            const filterId = filter.getId();

            if (nonStatefulFilters.includes(filterId)) return;

            storeFilters.push({
                id: filter.getId(),
                property: filter.getProperty(),
                value: filter.getValue(),
                operator: filter.getOperator(),
            });
        });
        filterBar.saveState(storeFilters);
    },

    resetFilters: function () {
        var columns = this.getGridColumns(),
            len = columns.length,
            i,
            filter;

        for (i = 0; i < len; i++) {
            filter = columns[i].getFilterType();

            if (filter && filter.isGridFilter) {
                filter.resetFilter();
            }
        }
    },

    setStore: function (store) {
        // this.callParent(arguments);
        if (this.getStateful()) {
            this.restoreState();
        }
    },

    onGridStoreChange: function (grid, store) {
        this.setStore(store);
    },

    saveState: function (filters) {
        let grid = this.getGrid();

        if (grid) {
            let stateId = grid.getStateId() + '-filterbar',
                stateProvider = Ext.state.Provider.get(),
                stateFilters = this.getStateFilters();

            if (JSON.stringify(stateFilters) !== JSON.stringify(filters)) {
                stateProvider.set(stateId, filters);
                this.setStateFilters(stateProvider.get(stateId, null));
            }
        }
    },

    restoreState: function () {
        let grid = this.getGrid(),
            store = grid ? this.getGrid().getStore() : null;

        if (grid && store) {
            let stateId = grid.getStateId() + '-filterbar',
                stateProvider = Ext.state.Provider.get(),
                state = stateProvider.get(stateId, null);

            if (state && state.length) {
                store.setFilters(state);
                this.setStateFilters(state);
                this.setHidden(false);
            }
        }
    },

    createColumnFilter: function (column) {
        var filter = column.getFilterType(),
            config = {
                grid: this.getGrid(),
                column: column,
                owner: this,
            };

        if (!filter) {
            config.type = 'none';
            filter = Ext.Factory.gridFilterbar(config);
        } else if (!filter.isGridFilter) {
            if (Ext.isString(filter)) {
                config.type = filter;
            } else {
                Ext.apply(config, filter);
            }

            filter = Ext.Factory.gridFilterbar(config);
        }

        if (this.getStateful() && this.getStateFilters()) {
            let result = Ext.Array.findBy(this.getStateFilters(), function (item, index) {
                return item.property === filter.dataIndex;
            });

            if (result) {
                filter.setValue(result.value);
                filter.setActive(true);
            }
        }

        column.setFilterType(filter);

        return filter;
    },
});
