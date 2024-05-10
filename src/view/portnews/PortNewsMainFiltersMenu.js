Ext.define('Abraxa.view.portnews.PortNewsMainFiltersMenu', {
    xtype: 'PortNewsMainFiltersMenu',
    extend: 'Ext.Container',
    cls: 'a-portnews-filters',
    scrollable: 'y',
    viewModel: {
        data: {
            filteredTypes: [],
            allPublicationsId: null,
        },
    },
    defaults: {
        clearable: false,
        labelAlign: 'top',
        ui: 'classic',
        margin: '0 0 16 0',
    },
    controller: {
        listen: {
            global: {
                selectedNewsType: function (newsType) {
                    const store = Ext.getStore('portNewsStore');
                    const filteredTypes = this.getViewModel().get('filteredTypes');
                    if (newsType.pressed) {
                        filteredTypes.push(newsType.record.get('id'));
                    } else {
                        const index = filteredTypes.indexOf(newsType.record.get('id'));
                        if (index > -1) {
                            filteredTypes.splice(index, 1);
                        }
                    }
                    if (filteredTypes.length > 0) {
                        store.addFilter({
                            id: 'filteredTypes',
                            property: 'type_ids',
                            value: filteredTypes,
                            operator: 'in',
                            exactMatch: true,
                        });
                    } else {
                        store.removeFilter('filteredTypes');
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'title',
            cls: 'h2',
            title: 'Filters',
        },
        {
            xtype: 'container',
            margin: '0 0 8 0',
            layout: {
                type: 'vbox',
            },
            items: [
                {
                    xtype: 'label',
                    html: '<span class="c-blue-grey">Filter by tags</span>',
                },
                {
                    xtype: 'PortNewsTypes',
                    editable: true,
                    bind: {
                        store: '{portNewsTypes}',
                    },
                },
            ],
        },
        {
            xtype: 'selectfield',
            forceSelection: true,
            label: 'Show',
            labelAlign: 'top',
            cls: 'a-field-icon icon-feed a-has-info icon-rounded disbursement_record',
            ui: 'classic',
            displayField: 'name',
            valueField: 'id',
            value: 1,
            options: [
                {
                    id: 1,
                    name: 'All publications',
                },
                {
                    id: 2,
                    name: 'My publications',
                },
            ],
            listeners: {
                change: function (combo, value) {
                    const store = Ext.getStore('portNewsStore');
                    const filter = store.getFilters().items.filter((item) => item._id === 'companyFilter');
                    const myCompanyId = combo.upVM().get('currentUser').get('company').id;
                    const vm = combo.upVM();

                    if (value === 2) {
                        vm.set('allPublicationsId', myCompanyId);
                        if (filter.length === 0) {
                            store.addFilter({
                                id: 'companyFilter',
                                property: 'company_ids',
                                value: [myCompanyId],
                                operator: '=',
                                exactMatch: true,
                            });
                        } else {
                            filter[0].setValue([...filter[0].getValue(), myCompanyId]);
                            store.removeFilter('companyFilter');
                            store.addFilter(filter[0]);
                        }
                    } else {
                        if (filter.length === 0) return;
                        const newFilterIds = filter[0].getValue().filter((item) => item !== myCompanyId);
                        store.removeFilter('companyFilter');
                        vm.set('allPublicationsId', null);
                        if (newFilterIds.length === 0) {
                            store.removeFilter('companyFilter');
                            return;
                        }
                        store.addFilter({
                            id: 'companyFilter',
                            property: 'company_ids',
                            value: newFilterIds,
                            operator: '=',
                            exactMatch: true,
                        });
                    }
                },
            },
        },
        {
            xtype: 'FromToDateField',
            label: 'Filter by date',
            labelAlign: 'top',
            cls: 'a-field-icon icon-date icon-rounded',
            ui: 'classic',
            clearable: true,
            listeners: {
                painted: function (cmp, newValue) {
                    const store = Ext.getStore('portNewsStore');
                    const firstDateField = cmp.query('abraxa\\.datefield')[0];
                    const secondDateField = cmp.query('abraxa\\.datefield')[1];
                    firstDateField.on('change', function (cmp, value) {
                        if (value) {
                            store.addFilter({
                                id: 'validityFromDataFilter',
                                property: 'validity_from',
                                value: moment(value).format('YYYY-MM-DD'),
                                operator: '=',
                                exactMatch: true,
                            });
                        } else {
                            store.removeFilter('validityFromDataFilter');
                        }
                    });
                    secondDateField.on('change', function (cmp, value) {
                        if (value) {
                            store.addFilter({
                                id: 'validityToDataFilter',
                                property: 'validity_to',
                                value: moment(value).format('YYYY-MM-DD'),
                                operator: '=',
                                exactMatch: true,
                            });
                        } else {
                            store.removeFilter('validityToDataFilter');
                        }
                    });
                },
            },
        },
        {
            xtype: 'combobox',
            itemId: 'newsPortFilterCountryCombo',
            label: 'Filter by country',
            editable: true,
            labelAlign: 'top',
            cls: 'a-field-icon icon-public icon-rounded',
            placeholder: 'Choose country',
            ui: 'classic',
            valueField: 'id',
            displayField: 'country_name',
            multiSelect: true,
            minChars: 2,
            queryMode: 'local',
            bind: {
                store: '{countryStore}',
            },
            listeners: {
                change: function (combo, countryIds, oldValue, eOpts) {
                    const store = Ext.getStore('portNewsStore');
                    const selectedPorts = [];
                    let diff = [];
                    const value = combo.getValue();
                    if (value && value.length > 0) {
                        store.addFilter({
                            id: 'countryFilter',
                            property: 'country_ids',
                            value: combo.getValue(),
                            operator: '=',
                            exactMatch: true,
                        });
                    } else {
                        store.removeFilter('countryFilter');
                    }
                    //Clear port from  port-combo  if country is not the same like a selected port country
                    const portServedCombo = combo.up('PortNewsMainFiltersMenu').down('port\\.combo');

                    const portServedComboStore = portServedCombo.getStore();
                    const portServedComboValue = portServedCombo.getValue();
                    if (portServedComboValue) {
                        portServedComboValue.forEach((portId) => {
                            const selectedPort = portServedComboStore.findRecord('port_id', portId);
                            if (selectedPort) selectedPorts.push(selectedPort);
                        });

                        if (countryIds.length && selectedPorts.length) {
                            diff = selectedPorts.filter((element) => !countryIds.includes(element.country_id));
                        }

                        const portIds = diff.map((port) => port.id);
                        const newPortsServedComboValue = portServedComboValue.filter(
                            (portId) => !portIds.includes(portId)
                        );

                        portServedCombo.setValue(newPortsServedComboValue);
                    }
                },
            },
        },
        {
            xtype: 'port.combo',
            name: 'port_id',
            flex: 1,
            label: 'Filter by port',
            labelAlign: 'top',
            ui: 'classic',
            cls: 'a-field-icon icon-port icon-rounded',
            multiSelect: true,
            forceSelection: true,
            placeholder: 'Choose ports',
            listeners: {
                painted: function (combo, newValue) {
                    //Filter only for selected country if country is selected
                    combo.getStore().on('load', function (store, records) {
                        countryIds = combo.up('PortNewsMainFiltersMenu').down('#newsPortFilterCountryCombo').getValue();
                        let filteredRecords = [...records];
                        if (countryIds) {
                            filteredRecords = records.filter((record) => countryIds.includes(record.get('country_id')));
                        }
                        store.loadData(filteredRecords);
                    });
                },
                change: function (combo, newValue, oldValue, eOpts) {
                    const value = combo.getValue();
                    const store = Ext.getStore('portNewsStore');

                    if (value && value.length > 0) {
                        store.addFilter({
                            id: 'portsServedFilter',
                            property: 'port_ids',
                            value: combo.getValue(),
                            operator: '=',
                            exactMatch: true,
                        });
                    } else {
                        store.removeFilter('portsServedFilter');
                    }
                },
            },
        },
        {
            xtype: 'commodity.combo',
            cls: 'a-field-icon icon-short icon-rounded',
            name: 'commodity_ids',
            label: 'Filter by commodity',
            labelAlign: 'top',
            multiSelect: true,
            valueField: 'id',
            displayField: 'name',
            placeholder: 'Choose commodity',
            listeners: {
                change: function (combo, newValue, oldValue, eOpts) {
                    const value = combo.getValue();
                    const store = Ext.getStore('portNewsStore');

                    if (value && value.length > 0) {
                        store.addFilter({
                            id: 'commodityFilter',
                            property: 'commodity_ids',
                            value: combo.getValue(),
                            operator: '=',
                            exactMatch: true,
                        });
                    } else {
                        store.removeFilter('commodityFilter');
                    }
                },
            },
        },
        {
            xtype: 'combobox',
            cls: 'a-field-icon icon-business icon-rounded',
            placeholder: 'Choose company',
            label: 'Filter by company (author)',
            labelAlign: 'top',
            valueField: 'id',
            displayField: 'name',
            store: {
                type: 'AgentsStore',
            },
            multiSelect: true,
            listeners: {
                change: function (combo, newValue, oldValue, eOpts) {
                    const value = combo.getValue();
                    const store = Ext.getStore('portNewsStore');
                    const vm = combo.upVM();

                    if (!vm.get('allPublicationsId')) {
                        if (value && value.length > 0) {
                            store.addFilter({
                                id: 'companyFilter',
                                property: 'company_ids',
                                value: combo.getValue(),
                                operator: '=',
                                exactMatch: true,
                            });
                        } else {
                            store.removeFilter('companyFilter');
                        }
                    } else {
                        if (value && value.length > 0) {
                            store.addFilter({
                                id: 'companyFilter',
                                property: 'company_ids',
                                value: [...combo.getValue(), vm.get('allPublicationsId')],
                                operator: '=',
                                exactMatch: true,
                            });
                        } else {
                            store.addFilter({
                                id: 'companyFilter',
                                property: 'company_ids',
                                value: [vm.get('allPublicationsId')],
                                operator: '=',
                                exactMatch: true,
                            });
                        }
                    }
                },
            },
        },
        {
            xtype: 'container',
            height: 38,
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'label',
                    html: 'Active only',
                    cls: 'c-blue-grey mr-12',
                },
                {
                    xtype: 'checkboxfield',
                    ui: 'switch icon',
                    label: false,
                    checked: false,
                    publishes: ['value'],
                    listeners: {
                        change: function (el, value) {
                            const store = Ext.getStore('portNewsStore');
                            if (value) {
                                store.addFilter({
                                    id: 'activeFilter',
                                    property: 'active',
                                    value: value,
                                    operator: '=',
                                    exactMatch: true,
                                });
                            } else {
                                store.removeFilter('activeFilter');
                            }
                        },
                    },
                },
            ],
        },
    ],
});
