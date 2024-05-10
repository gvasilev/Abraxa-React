Ext.define('Abraxa.view.voyages.VoyagesFiltersActive', {
    extend: 'Ext.Container',
    xtype: 'voyages.filters.active',
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
                                if (item.getInquiry().get('favourite')) {
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
                    inquiry = this.upVM().get('voyages');
                if (!arrowCls) {
                    let selected = Ext.ComponentQuery.query(
                        'menucheckitem[cls~=statusVoyageFilterItem][checked="true"]'
                    );
                    Ext.each(selected, function (value, index) {
                        value.setChecked(false);
                    });
                    button.setText('Status');
                    button.splitArrowElement.removeCls('md-icon-close');
                    button.splitArrowElement.addCls('x-arrow-el');
                    button.removeCls('active');
                    inquiry.removeFilter(5555);
                    this.upVM().set('voyagesStatusFilters', []);
                    this.upVM().set('voyagesStatusFiltersIds', []);
                }
            },
            menu: {
                cls: 'filter-menu',
                listeners: {
                    initialize: function (me) {
                        let store = me.upVM().get('inquiryStatusActive'),
                            data = store.getData().getRange(),
                            items = [];
                        Ext.each(data, function (value) {
                            let item = {
                                xtype: 'menucheckitem',
                                cls: 'statusVoyageFilterItem',
                                stateful: ['checked'],
                                stateId: 'status' + value.get('string') + 'Voyages',
                                text: value.get('name'),
                                record: value,
                                listeners: {
                                    checkchange: 'applyStatusFilters',
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
                    let store = me.upVM().get('inquiryStatusActive'),
                        inquiry = me.upVM().get('voyages'),
                        selectedNames = [],
                        selectedIds = [],
                        stateProvider = Ext.state.Provider.get();
                    if (store.isLoaded()) {
                        let records = store.getData();
                        Ext.each(records.items, function (value, index) {
                            let record = stateProvider.get('status' + value.get('string') + 'Voyages');
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
                                    me.setText(name);
                                    me.getMenu().arrowCls = 'delete';
                                } else {
                                    me.setText(name + '  +' + i);
                                }
                                me.splitArrowElement.removeCls('x-arrow-el');
                                me.splitArrowElement.addCls('md-icon-close');
                                me.addCls('active');
                                i++;
                            });
                        }
                        if (selectedNames.length === 1) {
                            let name = selectedNames[0];
                            me.setText(name);
                            me.splitArrowElement.removeCls('x-arrow-el');
                            me.splitArrowElement.addCls('md-icon-close');
                            me.addCls('active');
                        }
                        if (selectedNames.length === 0) {
                            me.setText('Status');
                            me.splitArrowElement.removeCls('md-icon-close');
                            me.splitArrowElement.addCls('x-arrow-el');
                            me.removeCls('active');
                        }
                        if (selectedIds.length > 0) {
                            me.upVM().set('voyagesStatusFilters', selectedNames);
                            me.upVM().set('voyagesStatusFiltersIds', selectedIds);
                            inquiry.addFilter({
                                id: 5555,
                                filterFn: function (item) {
                                    if (Ext.Array.contains(selectedIds, item.getInquiry().get('status_data').id)) {
                                        return item;
                                    } else {
                                        return false;
                                    }
                                },
                            });
                        } else {
                            inquiry.removeFilter(5555);
                        }
                    } else {
                        store.on('load', function (store, records, options) {
                            Ext.each(records, function (value, index) {
                                let record = stateProvider.get('status' + value.get('string') + 'Voyages');
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
                                        me.setText(name);
                                        me.getMenu().arrowCls = 'delete';
                                    } else {
                                        me.setText(name + '  +' + i);
                                    }
                                    me.splitArrowElement.removeCls('x-arrow-el');
                                    me.splitArrowElement.addCls('md-icon-close');
                                    me.addCls('active');
                                    i++;
                                });
                            }
                            if (selectedNames.length === 1) {
                                let name = selectedNames[0];
                                me.setText(name);
                                me.splitArrowElement.removeCls('x-arrow-el');
                                me.splitArrowElement.addCls('md-icon-close');
                                me.addCls('active');
                            }
                            if (selectedNames.length === 0) {
                                me.setText('Status');
                                me.splitArrowElement.removeCls('md-icon-close');
                                me.splitArrowElement.addCls('x-arrow-el');
                                me.removeCls('active');
                            }
                            if (selectedIds.length > 0) {
                                me.upVM().set('voyagesStatusFilters', selectedNames);
                                me.upVM().set('voyagesStatusFiltersIds', selectedIds);
                                inquiry.addFilter({
                                    id: 5555,
                                    filterFn: function (item) {
                                        if (Ext.Array.contains(selectedIds, item.getInquiry().get('status_data').id)) {
                                            return item;
                                        } else {
                                            return false;
                                        }
                                    },
                                });
                            } else {
                                inquiry.removeFilter(5555);
                            }
                        });
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
                    inquiry = this.upVM().get('voyages');
                if (!arrowCls) {
                    let selected = Ext.ComponentQuery.query(
                        'menucheckitem[cls~=portVoyagesFilterItem][checked="true"]'
                    );
                    Ext.each(selected, function (value, index) {
                        value.setChecked(false);
                    });
                    button.setText('Port');
                    button.splitArrowElement.removeCls('md-icon-close');
                    button.splitArrowElement.addCls('x-arrow-el');
                    button.removeCls('active');
                    inquiry.removeFilter(7777);
                    this.upVM().set('voyagesPortFilters', []);
                    this.upVM().set('voyagesPortFiltersIds', []);
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
                                cls: 'portVoyagesFilterItem',
                                stateful: ['checked'],
                                stateId: 'port' + value.get('port_name') + 'Voyages',
                                text: value.get('port_name'),
                                record: value,
                                listeners: {
                                    checkchange: 'applyPortFilters',
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
                        inquiry = me.upVM().get('voyages'),
                        selectedNames = [],
                        selectedIds = [],
                        stateProvider = Ext.state.Provider.get();
                    if (store.isLoaded()) {
                        let records = store.getData();
                        Ext.each(records.items, function (value, index) {
                            let record = stateProvider.get('port' + value.get('port_name') + 'Voyages');
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
                                    me.setText(name);
                                    me.getMenu().arrowCls = 'delete';
                                } else {
                                    me.setText(name + '  +' + i);
                                }
                                me.splitArrowElement.removeCls('x-arrow-el');
                                me.splitArrowElement.addCls('md-icon-close');
                                me.addCls('active');
                                i++;
                            });
                        }
                        if (selectedNames.length === 1) {
                            let name = selectedNames[0];
                            me.setText(name);
                            me.splitArrowElement.removeCls('x-arrow-el');
                            me.splitArrowElement.addCls('md-icon-close');
                            me.addCls('active');
                        }
                        if (selectedNames.length === 0) {
                            me.setText('Port');
                            me.splitArrowElement.removeCls('md-icon-close');
                            me.splitArrowElement.addCls('x-arrow-el');
                            me.removeCls('active');
                        }
                        if (selectedIds.length > 0) {
                            me.upVM().set('voyagesPortFilters', selectedNames);
                            me.upVM().set('voyagesPortFiltersIds', selectedIds);
                            inquiry.addFilter({
                                id: 7777,
                                filterFn: function (item) {
                                    if (item && Ext.Array.contains(selectedIds, item.get('port_id'))) {
                                        return item;
                                    } else {
                                        return false;
                                    }
                                },
                            });
                        } else {
                            inquiry.removeFilter(7777);
                        }
                    } else {
                        store.on('load', function (store, records, options) {
                            Ext.each(records, function (value, index) {
                                let record = stateProvider.get('port' + value.get('port_name') + 'Voyages');
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
                                        me.setText(name);
                                        me.getMenu().arrowCls = 'delete';
                                    } else {
                                        me.setText(name + '  +' + i);
                                    }
                                    me.splitArrowElement.removeCls('x-arrow-el');
                                    me.splitArrowElement.addCls('md-icon-close');
                                    me.addCls('active');
                                    i++;
                                });
                            }
                            if (selectedNames.length === 1) {
                                let name = selectedNames[0];
                                me.setText(name);
                                me.splitArrowElement.removeCls('x-arrow-el');
                                me.splitArrowElement.addCls('md-icon-close');
                                me.addCls('active');
                            }
                            if (selectedNames.length === 0) {
                                me.setText('Port');
                                me.splitArrowElement.removeCls('md-icon-close');
                                me.splitArrowElement.addCls('x-arrow-el');
                                me.removeCls('active');
                            }
                            if (selectedIds.length > 0) {
                                me.upVM().set('voyagesPortFilters', selectedNames);
                                me.upVM().set('voyagesPortFiltersIds', selectedIds);
                                inquiry.addFilter({
                                    id: 7777,
                                    filterFn: function (item) {
                                        if (item && Ext.Array.contains(selectedIds, item.get('port_id'))) {
                                            return item;
                                        } else {
                                            return false;
                                        }
                                    },
                                });
                            } else {
                                inquiry.removeFilter(7777);
                            }
                        });
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
                    inquiry = me.upVM().get('voyages'),
                    button = me;
                if (!arrowCls) {
                    let selected = Ext.ComponentQuery.query(
                        'menucheckitem[cls=checkvoyagestype-filters][checked="true"]'
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
                    cls: 'checkvoyagestype-filters',
                    listeners: {
                        checkchange: 'applyTypeFilters',
                    },
                },
                items: [
                    {
                        text: 'Dry',
                        stateful: ['checked'],
                        stateId: 'voyagesFilterDry',
                    },
                    {
                        text: 'Wet',
                        stateful: ['checked'],
                        stateId: 'voyagesFilterWet',
                    },
                ],
            },
            listeners: {
                painted: function (me) {
                    let button = this,
                        inquiry = me.upVM().get('voyages'),
                        filters = this.upVM().get('voyagesInquiryType'),
                        filtersIds = this.upVM().get('voyagesInquiryTypeIds'),
                        stateProvider = Ext.state.Provider.get(),
                        dry = stateProvider.get('voyagesFilterDry'),
                        wet = stateProvider.get('voyagesFilterWet'),
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
                        me.upVM().set('voyagesInquiryType', selectedNames);
                        me.upVM().set('voyagesInquiryTypeIds', filtersIds);
                        inquiry.addFilter({
                            id: 9999,
                            filterFn: function (item) {
                                if (item && Ext.Array.contains(filtersIds, item.get('is_dry'))) {
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
        {
            xtype: 'splitbutton',
            iconCls: 'md-icon-filter-list',
            ui: 'filter round btn-sm',
            text: 'Date',
            height: 28,
            handler: function () {
                this.showMenu();
            },
            arrowHandler: function (me) {
                let arrowCls = me.splitArrowElement.hasCls('x-arrow-el'),
                    button = me,
                    stateProvider = Ext.state.Provider.get(),
                    inquiry = me.upVM().get('voyages'),
                    menu = button.getMenu(),
                    fromField = menu.down('[itemId=fromField]'),
                    toField = menu.down('[itemId=toField]');
                if (!arrowCls) {
                    button.setText('Date');
                    inquiry.removeFilter(1111);
                    fromField.clearValue();
                    toField.clearValue();
                    fromField.setError(null);
                    toField.setError(null);
                    stateProvider.remove('etaVoyagesFrom');
                    stateProvider.remove('etaVoyagesTo');
                    button.splitArrowElement.removeCls('md-icon-close');
                    button.splitArrowElement.addCls('x-arrow-el');
                    button.removeCls('active');
                }
            },
            menu: {
                minWidth: '160px',
                items: [
                    {
                        xtype: 'formpanel',
                        items: [
                            {
                                label: 'From:',
                                labelAlign: 'top',
                                itemId: 'fromField',
                                name: 'from',
                                required: true,
                                xtype: 'abraxa.datefield',
                            },
                            {
                                label: 'To:',
                                labelAlign: 'top',
                                itemId: 'toField',
                                name: 'to',
                                required: true,
                                xtype: 'abraxa.datefield',
                            },
                        ],
                    },
                    {
                        text: 'Apply',
                        seperator: true,
                        hideOnClick: false,
                        handler: function (me) {
                            let form = me.up('menu').down('formpanel'),
                                button = me.up('button'),
                                values = form.getValues(),
                                fromValue = values.from,
                                toValue = values.to,
                                inquiry = this.upVM().get('voyages'),
                                stateProvider = Ext.state.Provider.get();
                            if (form.validate()) {
                                stateProvider.set('etaVoyagesFrom', fromValue);
                                stateProvider.set('etaVoyagesTo', toValue);
                                inquiry.addFilter({
                                    id: 1111,
                                    filterFn: function (item) {
                                        let etaDate = item.getInquiry().get('port_eta');
                                        if (
                                            moment(etaDate).isSameOrAfter(fromValue, 'day') &&
                                            moment(etaDate).isSameOrBefore(toValue, 'day')
                                        ) {
                                            return item;
                                        }
                                    },
                                });
                                button.setText(
                                    moment(fromValue).format(AbraxaConstants.formatters.date.dayMonthYearSlash) +
                                        ' - ' +
                                        moment(toValue).format(AbraxaConstants.formatters.date.dayMonthYearSlash)
                                );
                                button.splitArrowElement.removeCls('x-arrow-el');
                                button.splitArrowElement.addCls('md-icon-close');
                                button.addCls('active');
                            }
                        },
                    },
                ],
            },
            listeners: {
                painted: function (me) {
                    let button = this,
                        inquiry = me.upVM().get('voyages'),
                        stateProvider = Ext.state.Provider.get(),
                        fromValue = stateProvider.get('etaVoyagesFrom'),
                        toValue = stateProvider.get('etaVoyagesTo'),
                        menu = button.getMenu(),
                        fromField = menu.down('[itemId=fromField]'),
                        toField = menu.down('[itemId=toField]');
                    if (fromValue && toValue) {
                        inquiry.addFilter({
                            id: 1111,
                            filterFn: function (item) {
                                let etaDate = item.getInquiry().get('port_eta');
                                if (
                                    moment(etaDate).isSameOrAfter(fromValue, 'day') &&
                                    moment(etaDate).isSameOrBefore(toValue, 'day')
                                ) {
                                    return item;
                                }
                            },
                        });
                        fromField.setValue(moment(fromValue).format(AbraxaConstants.formatters.date.dayMonthYearSlash));
                        toField.setValue(moment(toValue).format(AbraxaConstants.formatters.date.dayMonthYearSlash));
                        button.setText(
                            moment(fromValue).format(AbraxaConstants.formatters.date.dayMonthYearSlash) +
                                ' - ' +
                                moment(toValue).format(AbraxaConstants.formatters.date.dayMonthYearSlash)
                        );
                        button.splitArrowElement.removeCls('x-arrow-el');
                        button.splitArrowElement.addCls('md-icon-close');
                        button.addCls('active');
                    }
                },
            },
        },
    ],
});
