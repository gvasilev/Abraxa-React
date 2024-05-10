Ext.define('Abraxa.view.common.combo.DistributionEmailCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'common-distribution-email-combo',
    // cls: 'a-field-icon icon-business icon-rounded',
    label: 'To:',
    selectable: false,
    forceSelection: false,
    editable: true,
    queryMode: 'local',
    valueField: 'org_email',
    displayField: 'org_email',
    multiSelect: true,
    triggers: {
        search: null,
        expand: null,
    },
    // onInput: function (e) {
    //     var me = this,
    //         value = me.inputElement.dom.value,
    //         store = me.getStore();
    //     store.clearFilter();

    //     if (value) {
    //         store.addFilter(new Ext.data.Query({
    //             source: 'org_name like "' + value + '" or org_email like"' + value + '"'
    //         }));
    //         me.expand();
    //     } else {
    //         me.collapse();
    //     }
    // },
    doFilter: function (query) {
        var me = this,
            isLocal = me.getQueryMode() === 'local',
            lastQuery = me.lastQuery,
            store = me.getStore() && me._pickerStore,
            filter = me.getPrimaryFilter();

        //dirty hacks possibble anomalies with other filters !!
        me.getPicker().setLocation({});
        let newFilterFn = function (item) {
            return (
                item.get('org_name').toLowerCase().includes(query.query.toLowerCase(), 0) ||
                item.get('org_email').toLowerCase().includes(query.query.toLowerCase(), 0)
            );
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
    chipView: {
        xtype: 'chipview',
        displayTpl: new Ext.XTemplate('{[this.renderTpl(values)]}', {
            renderTpl: function (values) {
                if (values.is_contact == true) {
                    let store = Ext.getCmp('main-viewport').getVM().get('organizationContacts'),
                        record = store.getById(values.contact_id);
                    if (record) return record.get('contact_email');
                } else if (values.is_contact == false) {
                    let store = Ext.getCmp('main-viewport').getVM().get('organizations'),
                        record = store.getById(values.org_id);
                    if (record) return record.get('org_email');
                } else {
                    return values.org_email;
                }
            },
        }),
    },
    itemTpl:
        '<div class="party-item">' +
        '<tpl if="is_contact"><div class="sm-person"><i class="md-icon-outlined md-18">person</i><tpl elseif="dept_id"><div class="sm-function function-department"><i class="md-icon-outlined md-18">corporate_fare</i><tpl else ><div class="sm-function function-A"><i class="md-icon md-18">business</i></tpl></div>' +
        '<a href="javascript:void(0);" class="sm-company fw-b">{org_name}</a><div class="sm-type">{org_email}</div>' +
        '</div>',
    bind: {
        store: '{organizationsMulti}',
    },
    placeholder: 'Add an email or company name',
    listeners: {
        paste: function (me, evt) {
            let clipboardData = evt.browserEvent.clipboardData,
                matchRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
                text = clipboardData.getData('Text'),
                extractedValues = text.match(matchRegEx),
                newValues = null,
                currentValues = me.getValue();
            if (currentValues) {
                newValues = Ext.Array.merge(currentValues, extractedValues);
            } else {
                newValues = extractedValues;
            }
            setTimeout(function () {
                me.getValueCollection().removeAll();
                me.setValue(newValues);
            }, 0);
        },
    },
});
