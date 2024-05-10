Ext.define('Abraxa.view.notes.SubscribersCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'subscribers-combo',
    valueField: 'id',
    displayField: 'full_name',
    multiSelect: true,
    margin: 0,
    flex: 1,
    queryMode: 'local',
    placeholder: 'Choose users',
    ui: 'classic hovered-border',
    cls: 'a-field-icon icon-person icon-rounded notify_combobox',
    hidden: true,
    viewModel: {
        formulas: {
            userIds: {
                bind: {
                    bindTo: '{object_record.watching}',
                    deep: true,
                },
                get: function (store) {
                    if (store) return Ext.Array.pluck(store, 'user_id');
                },
            },
        },
    },
    bind: {
        value: '{userIds}',
        store: '{users}',
    },
    doFilter: function (query) {
        var me = this,
            isLocal = me.getQueryMode() === 'local',
            lastQuery = me.lastQuery,
            store = me.getStore() && me._pickerStore,
            filter = me.getPrimaryFilter();
        //dirty hacks possibble anomalies with other filters !!
        // me.getPicker().setLocation({});
        let newFilterFn = function (item) {
            return item.get('full_name').toLowerCase().includes(query.query.toLowerCase(), 0);
        };
        filter.setFilterFn(newFilterFn);

        // fix issue when store is null and store.getFilters() throws error
        if (!store) {
            return false;
        }

        //end dirty hacks
        let filters = store.getFilters(),
            // Decide if, and how we are going to query the store
            queryPlan = me.beforeFilter(
                Ext.apply(
                    {
                        filterGeneration: filter.generation,
                        lastQuery: lastQuery || {},
                        combo: me,
                        cancel: false,
                    },
                    query
                )
            ),
            picker,
            source;
        // Allow veto.
        if (store && queryPlan !== false && !queryPlan.cancel) {
            // User can be typing a regex in here, if it's invalid
            // just swallow the exception and move on
            if (me.getEnableRegEx()) {
                try {
                    queryPlan.query = new RegExp(queryPlan.query);
                } catch (e) {
                    queryPlan.query = null;
                }
            }

            // Update the value.
            filter.setValue(queryPlan.query);

            // If we are not caching previous queries, or the filter has changed in any way
            // (value, or matching criteria etc), or the force flag is different, then we
            // must re-filter. Otherwise, we just drop through to expand.
            if (!me.getQueryCaching() || filter.generation !== lastQuery.filterGeneration || query.force) {
                // If there is a query string to filter against, enable the filter now and prime
                // its value.
                // Filtering will occur when the store's FilterCollection broadcasts its
                // endUpdate signal.
                if (Ext.isEmpty(queryPlan.query)) {
                    filter.setDisabled(true);
                } else {
                    filter.setDisabled(false);

                    // If we are doing remote filtering, set a flag to
                    // indicate to onStoreLoad that the load is the result of filering.
                    me.isFiltering = !isLocal;
                }

                me.lastQuery = queryPlan;

                // Firing the ensUpdate event will cause the store to refilter if local filtering
                // or reload starting at page 1 if remote.
                filters.beginUpdate();
                filters.endUpdate();

                // If we are doing local filtering, the upstream store MUST be loaded.
                // Now we use a ChainedStore we must do this. In previous versions
                // simply adding a filter caused automatic store load.
                if (store.isChainedStore) {
                    source = store.getSource();

                    if (!source.isLoaded() && !source.hasPendingLoad()) {
                        source.load();
                    }
                }
            }

            if (me.getTypeAhead()) {
                me.doTypeAhead(queryPlan);
            }

            // If the query result is non-zero length, or there is empty text to display
            // we must expand.
            // Note that edge pickers do not have an emptyText config.
            picker = me.getPicker();

            // If it's a remote store, we must expand now, so that the picker will show its
            // loading mask to show that some activity is happening.
            if (!isLocal || store.getCount() || (picker.getEmptyText && picker.getEmptyText())) {
                me.expand();

                // If the use is querying by a value, and it's a local filter, then
                // set the location immediately. If it's going to be a remote filter,
                // then onStoreLoad will set the location after the
                if (queryPlan.query && isLocal) {
                    me.setPickerLocation();
                }

                return true;
            }

            // The result of the filtering is no records and there's no emptyText...
            // if it's a local query, hide the picker. If it's remote, we do not
            // know the result size yet, so the loading mask must stay visible.
            me.collapse();
        }

        return false;
    },
    listeners: {
        focusleave: function () {
            let record = this.up('[xtype=notes\\.notify]').upVM().get('object_record'),
                selection = this.getSelection(),
                needSync = this.up('[xtype=notes\\.notify]').upVM().get('needSync');
            users = [];

            Ext.each(selection, function (record) {
                users.push(record.getData());
            });
            record.set('watching', users);
            if (needSync) {
                if (record.dirty) {
                    record.save({
                        success: function () {
                            Ext.toast('Record updated', 1000);
                        },
                    });
                }
            }
            this.up('[xtype=notes\\.notify]').down('[cls~=notify_combobox]').hide();
            this.up('[xtype=notes\\.notify]').down('[cls=notify_users]').show();
        },
    },
});
