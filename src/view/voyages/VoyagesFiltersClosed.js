Ext.define('Abraxa.view.voyages.VoyagesFiltersClosed', {
    extend: 'Ext.Container',
    xtype: 'voyages.filters.closed',
    cls: 'panel-heading inquiry-filters',
    layout: {
        type: 'hbox',
    },
    items: [
        {
            xtype: 'checkbox',
            cls: 'a-check-fav a-fav-inquiries',
            tooltip: 'Favorites',
            margin: '0 8 0 0',
            stateful: ['checked'],
            stateId: 'voyagesFavoritesFilter',
            listeners: {
                change: 'appyFavoritesFilter',
                initialize: function (me) {
                    let inquiry = me.upVM().get('voyages'),
                        stateProvider = Ext.state.Provider.get(),
                        isFavorite = stateProvider.get('voyagesFavoritesFilter');
                    if (isFavorite && isFavorite.$.checked) {
                        inquiry.addFilter({
                            id: 2222,
                            filterFn: function (item) {
                                if (item.get('favourite')) {
                                    return true;
                                }
                            },
                        });
                    } else {
                        inquiry.removeFilter(2222);
                    }
                },
            },
        },
        {
            text: 'Status',
            height: 28,
            ui: 'filter round btn-sm',
            xtype: 'splitbutton',
            handler: function () {
                this.showMenu();
            },
            arrowHandler: function () {
                let button = this,
                    arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                    inquiry = this.upVM().get('inquiryArchived');
                if (!arrowCls) {
                    let selected = Ext.ComponentQuery.query(
                        'menucheckitem[cls~=statusVoyagesClosedFilterItem][checked="true"]'
                    );
                    Ext.each(selected, function (value, index) {
                        value.setChecked(false);
                    });
                    button.setText('Status');
                    button.splitArrowElement.removeCls('md-icon-close');
                    button.splitArrowElement.addCls('x-arrow-el');
                    button.removeCls('active');
                    inquiry.removeFilter(5555);
                    this.upVM().set('voyagesClosedStatusFilters', []);
                    this.upVM().set('voyagesClosedStatusFiltersIds', []);
                }
            },
            menu: {
                cls: 'filter-menu',
                listeners: {
                    initialize: function (me) {
                        let store = me.upVM().get('inquiryStatusArchive'),
                            data = store.getData().getRange(),
                            items = [];
                        Ext.each(data, function (value) {
                            let item = {
                                xtype: 'menucheckitem',
                                cls: 'statusVoyagesClosedFilterItem',
                                stateful: ['checked'],
                                stateId: 'statusClosed' + value.get('string') + 'voyages',
                                text: value.get('name'),
                                record: value,
                                listeners: {
                                    checkchange: 'applyClosedStatusFilters',
                                },
                            };
                            items.push(item);
                        });
                        me.setItems(items);
                    },
                },
            },
            listeners: {
                painted: function (me) {
                    let store = me.upVM().get('inquiryStatusArchive'),
                        inquiry = me.upVM().get('inquiryArchived'),
                        selectedNames = [],
                        selectedIds = [],
                        stateProvider = Ext.state.Provider.get(),
                        button = me,
                        records = store.getData().items;
                    Ext.each(records, function (value, index) {
                        let record = stateProvider.get('statusClosed' + value.get('string') + 'voyages');
                        if (record) {
                            let checked = record.$.checked;
                            if (checked) {
                                selectedNames.push(value.get('name'));
                                selectedIds.push(value.get('id'));
                            }
                        }
                    });
                    if (selectedNames.length > 1) {
                        let i = 0;
                        let name = '';
                        Ext.each(selectedNames, function (val, index) {
                            if (i === 0) {
                                name = val;
                                button.setText(name);
                                button.getMenu().arrowCls = 'delete';
                            } else {
                                button.setText(name + '  +' + i);
                            }
                            button.splitArrowElement.removeCls('x-arrow-el');
                            button.splitArrowElement.addCls('md-icon-close');
                            button.addCls('active');
                            i++;
                        });
                    }
                    if (selectedNames.length === 1) {
                        let name = selectedNames[0];
                        button.setText(name);
                        button.splitArrowElement.removeCls('x-arrow-el');
                        button.splitArrowElement.addCls('md-icon-close');
                        button.addCls('active');
                    }
                    if (selectedNames.length === 0) {
                        button.setText('Status');
                        button.splitArrowElement.removeCls('md-icon-close');
                        button.splitArrowElement.addCls('x-arrow-el');
                        button.removeCls('active');
                    }
                    if (selectedIds.length > 0) {
                        me.upVM().set('voyagesClosedStatusFilters', selectedNames);
                        me.upVM().set('voyagesClosedStatusFiltersIds', selectedIds);
                        inquiry.addFilter({
                            id: 5555,
                            filterFn: function (item) {
                                if (Ext.Array.contains(selectedIds, item.get('status_data').id)) {
                                    return item;
                                } else {
                                    return false;
                                }
                            },
                        });
                    } else {
                        inquiry.removeFilter(5555);
                    }
                },
            },
        },
        {
            text: 'Port',
            height: 28,
            ui: 'filter round btn-sm',
            xtype: 'splitbutton',
            handler: function () {
                this.showMenu();
            },
            arrowHandler: function () {
                let button = this,
                    arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                    inquiry = this.upVM().get('inquiryArchived');
                if (!arrowCls) {
                    let selected = Ext.ComponentQuery.query(
                        'menucheckitem[cls~=portVoyagesClosedFilterItem][checked="true"]'
                    );
                    Ext.each(selected, function (value, index) {
                        value.setChecked(false);
                    });
                    button.setText('Port');
                    button.splitArrowElement.removeCls('md-icon-close');
                    button.splitArrowElement.addCls('x-arrow-el');
                    button.removeCls('active');
                    inquiry.removeFilter(7777);
                    this.upVM().set('voyagesClosedPortFilters', []);
                    this.upVM().set('voyagesClosedPortFiltersIds', []);
                }
            },
            menu: {
                cls: 'filter-menu',
                listeners: {
                    initialize: function (me) {
                        let store = me.upVM().get('portsServed'),
                            data = store.getData().getRange(),
                            items = [];
                        Ext.each(data, function (value) {
                            let item = {
                                xtype: 'menucheckitem',
                                cls: 'portVoyagesClosedFilterItem',
                                stateful: ['checked'],
                                stateId: 'portClosed' + value.get('port_name') + 'voyages',
                                text: value.get('port_name'),
                                record: value,
                                listeners: {
                                    checkchange: 'applyClosedPortFilters',
                                },
                            };
                            items.push(item);
                        });
                        me.setItems(items);
                    },
                },
            },
            listeners: {
                painted: function (me) {
                    let store = me.upVM().get('portsServed'),
                        inquiry = me.upVM().get('inquiryArchived'),
                        selectedNames = [],
                        selectedIds = [],
                        stateProvider = Ext.state.Provider.get(),
                        button = me,
                        records = store.getData().items;
                    Ext.each(records, function (value, index) {
                        let record = stateProvider.get('portClosed' + value.get('port_name') + 'voyages');
                        if (record) {
                            let checked = record.$.checked;
                            if (checked) {
                                selectedNames.push(value.get('port_name'));
                                selectedIds.push(value.get('port_id'));
                            }
                        }
                    });
                    if (selectedNames.length > 1) {
                        let i = 0;
                        let name = '';
                        Ext.each(selectedNames, function (val, index) {
                            if (i === 0) {
                                name = val;
                                button.setText(name);
                                button.getMenu().arrowCls = 'delete';
                            } else {
                                button.setText(name + '  +' + i);
                            }
                            button.splitArrowElement.removeCls('x-arrow-el');
                            button.splitArrowElement.addCls('md-icon-close');
                            button.addCls('active');
                            i++;
                        });
                    }
                    if (selectedNames.length === 1) {
                        let name = selectedNames[0];
                        button.setText(name);
                        button.splitArrowElement.removeCls('x-arrow-el');
                        button.splitArrowElement.addCls('md-icon-close');
                        button.addCls('active');
                    }
                    if (selectedNames.length === 0) {
                        button.setText('Port');
                        button.splitArrowElement.removeCls('md-icon-close');
                        button.splitArrowElement.addCls('x-arrow-el');
                        button.removeCls('active');
                    }
                    if (selectedIds.length > 0) {
                        me.upVM().set('voyagesClosedPortFilters', selectedNames);
                        me.upVM().set('voyagesClosedPortFiltersIds', selectedIds);
                        inquiry.addFilter({
                            id: 7777,
                            filterFn: function (item) {
                                if (
                                    item.getVoyage() &&
                                    Ext.Array.contains(selectedIds, item.getVoyage().get('port_id'))
                                ) {
                                    return item;
                                } else {
                                    return false;
                                }
                            },
                        });
                    } else {
                        inquiry.removeFilter(7777);
                    }
                },
            },
        },
        {
            text: 'Type',
            ui: 'filter round btn-sm',
            xtype: 'splitbutton',
            height: 28,
            handler: function () {
                this.showMenu();
            },
            arrowHandler: function (me) {
                let arrowCls = me.splitArrowElement.hasCls('x-arrow-el'),
                    inquiry = me.upVM().get('inquiryArchived'),
                    button = me;
                if (!arrowCls) {
                    let selected = Ext.ComponentQuery.query(
                        'menucheckitem[cls=checkvoyageclosedtype-filters][checked="true"]'
                    );
                    Ext.each(selected, function (value, index) {
                        value.setChecked(false);
                    });
                    button.setText('Type');
                    inquiry.removeFilter(9999);
                    button.splitArrowElement.removeCls('md-icon-close');
                    button.splitArrowElement.addCls('x-arrow-el');
                    button.removeCls('active');
                }
            },
            menu: {
                defaults: {
                    xtype: 'menucheckitem',
                    cls: 'checkvoyageclosedtype-filters',
                    listeners: {
                        checkchange: 'applyClosedTypeFilters',
                    },
                },
                items: [
                    {
                        text: 'Dry',
                        stateful: ['checked'],
                        stateId: 'voyagesClosedFilterDry',
                    },
                    {
                        text: 'Wet',
                        stateful: ['checked'],
                        stateId: 'voyagesClosedFilterWet',
                    },
                ],
            },
            listeners: {
                painted: function (me) {
                    let button = this,
                        inquiry = me.upVM().get('inquiryArchived'),
                        filters = this.upVM().get('voyagesClosedInquiryType'),
                        filtersIds = this.upVM().get('voyagesClosedInquiryTypeIds'),
                        stateProvider = Ext.state.Provider.get(),
                        dry = stateProvider.get('voyagesClosedFilterDry'),
                        wet = stateProvider.get('voyagesClosedFilterWet'),
                        selectedNames = [];
                    if (dry) {
                        let checked = dry.$.checked;
                        if (checked) {
                            selectedNames.push('Dry');
                            filtersIds.push(1);
                        }
                    }
                    if (wet) {
                        let checked = wet.$.checked;
                        if (checked) {
                            selectedNames.push('Wet');
                            filtersIds.push(0);
                        }
                    }
                    if (selectedNames.length > 1) {
                        let i = 0;
                        let name = '';
                        Ext.each(selectedNames, function (val, index) {
                            filters.push(val);
                            if (i === 0) {
                                name = val;
                                button.setText(name);
                                button.getMenu().arrowCls = 'delete';
                            } else {
                                button.setText(name + '  +' + i);
                            }
                            button.splitArrowElement.removeCls('x-arrow-el');
                            button.splitArrowElement.addCls('md-icon-close');
                            button.addCls('active');
                            i++;
                        });
                    }
                    if (selectedNames.length === 1) {
                        filters.push(selectedNames[0]);
                        let name = selectedNames[0];
                        button.setText(name);
                        button.splitArrowElement.removeCls('x-arrow-el');
                        button.splitArrowElement.addCls('md-icon-close');
                        button.addCls('active');
                    }
                    if (selectedNames.length === 0) {
                        button.setText('Type');
                        button.splitArrowElement.removeCls('md-icon-close');
                        button.splitArrowElement.addCls('x-arrow-el');
                        button.removeCls('active');
                    }

                    if (filtersIds.length > 0) {
                        me.upVM().set('voyagesClosedInquiryType', selectedNames);
                        me.upVM().set('voyagesClosedInquiryTypeIds', filtersIds);
                        inquiry.addFilter({
                            id: 9999,
                            filterFn: function (item) {
                                if (
                                    item.getVoyage() &&
                                    Ext.Array.contains(filtersIds, item.getVoyage().get('is_dry'))
                                ) {
                                    return item;
                                } else {
                                    return false;
                                }
                            },
                        });
                    } else {
                        inquiry.removeFilter(9999);
                    }
                },
            },
        },
    ],
});
