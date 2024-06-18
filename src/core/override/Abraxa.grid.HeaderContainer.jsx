Ext.define('Abraxa.GridHeaderContainer', {
    override: 'Ext.grid.HeaderContainer',

    privates: {
        updateHideHeaders: function (hideHeaders) {
            this.getHeaderContainer().toggleCls(Ext.baseCSSPrefix + 'hidden-headers', hideHeaders);
        },
        /**
         * @private
         * Synchronize column UI visible sort state with Store's sorters.
         */
        setSortState: function () {
            if (this.getGrid()) {
                var grid = this.getGrid(),
                    store = grid.getStore(),
                    columns = grid.getColumns(),
                    isGrouped = store.isGrouped(),
                    len = columns && columns.length,
                    sorters = store.getSorters(),
                    grouper = store.getGrouper(),
                    groupers = store.getGroupers(false),
                    i,
                    header,
                    isGroupedHeader,
                    sorter;

                for (i = 0; i < len; i++) {
                    header = columns[i];

                    // Access the column's custom sorter in preference to one keyed on the
                    // data index, but only if it has actually been instantiated and saved
                    // by the updater.
                    sorter = header.sorter;

                    // Is this column being used to group this grid
                    // and Grouper will be null for treegroupedgrid
                    if (!grouper && groupers && groupers.length) {
                        // if groupers are used then you can sort by anything because
                        // it's taken care of.
                        isGrouped = false;
                    } else {
                        isGroupedHeader = store.getGroupField() === header.getDataIndex();
                    }

                    // If sorter instance is not there for column and store sort is applied
                    // Add sorter to the header.
                    if (!sorter) {
                        sorter = sorters.get(header.getDataIndex());

                        // If sort is applied on groupField column, sorter will be Grouper.
                        if (store.getGroupField() === header.getDataIndex()) {
                            sorter = grouper;
                        } else if (sorter) {
                            header.setSorter(sorter);
                        }
                    }

                    if (sorter) {
                        // FIRST: If the grid is grouped and this is the column being used to group it
                        // we need to use the grouper as the sorter to update the UI correctly.
                        // SECOND: If the column was configured with a sorter, we must check that the
                        // sorter is part of the store's sorter collection to update the UI
                        // to the correct state. The store may not actually BE sorted by that
                        // sorter.
                        if (isGrouped && isGroupedHeader) {
                            sorter = grouper;
                        } else if (!(sorters.contains(sorter) || grouper === sorter)) {
                            sorter = null;
                        }
                    }

                    // Important: A null sorter will *clear* the UI sort indicator.
                    header.setSortState(sorter);
                }
            }
        },
    },
});
