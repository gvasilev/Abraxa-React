Ext.define('Abraxa.view.voyages.VoyagesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.voyages-controller',
    init: function () {},

    createVoyage: function (cmp) {
        Ext.create('Abraxa.view.voyages.create.VoyagesCreateDialog', {
            viewModel: {
                parent: cmp.upVM(),
                links: {
                    voyage: {
                        type: 'Abraxa.model.voyage.Voyage',
                        create: true,
                    },
                    inquiry: {
                        type: 'Abraxa.model.inquiry.Inquiry',
                        create: true,
                    },
                },
                data: {
                    editMode: false,
                },
                formulas: {
                    addDefaultCargo: {
                        bind: {
                            bindTo: '{inquiry.port_function}',
                            deep: true,
                        },
                        get: function (value) {
                            if (value == 'Loading' || value == 'Discharging') {
                                let store = this.get('inquiry').cargoes();
                                if (store && !store.getCount()) {
                                    store.add({});
                                }
                            }
                        },
                    },
                    addDefaultAgentInformation: {
                        bind: {
                            bindTo: '{voyage.invitations}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store && !store.getCount()) store.add({});
                        },
                    },
                },
            },
        }).show();
    },

    applyStatusFilters: function (cmp, newValue) {
        let inquiry = cmp.upVM().get('voyages'),
            filters = cmp.upVM().get('voyagesStatusFilters'),
            filtersIds = cmp.upVM().get('voyagesStatusFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls~=statusVoyageFilterItem][checked="true"]');
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
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
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Status');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            inquiry.addFilter({
                id: 5555,
                filterFn: function (item) {
                    if (Ext.Array.contains(filtersIds, item.getInquiry().get('status_data').id)) {
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
    applyPortFilters: function (cmp, newValue) {
        let inquiry = cmp.upVM().get('voyages'),
            filters = cmp.upVM().get('voyagesPortFilters'),
            filtersIds = cmp.upVM().get('voyagesPortFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls~=portVoyagesFilterItem][checked="true"]');
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('port_id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
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
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Port');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            inquiry.addFilter({
                id: 7777,
                filterFn: function (item) {
                    if (item && Ext.Array.contains(filtersIds, item.get('port_id'))) {
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
    applyTypeFilters: function (cmp, newValue) {
        let inquiry = cmp.upVM().get('voyages'),
            filters = cmp.upVM().get('voyagesInquiryType'),
            filtersIds = cmp.upVM().get('voyagesInquiryTypeIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls=checkvoyagestype-filters][checked="true"]');

        if (cmp.getText() === 'Dry' && newValue) {
            //add filter
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Dry');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(1);
        }
        if (cmp.getText() === 'Dry' && !newValue) {
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (cmp.getText() === 'Wet' && newValue) {
            //add filter
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Wet');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(0);
        }
        if (cmp.getText() === 'Wet' && !newValue) {
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
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
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Type');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }
        if (filtersIds.length > 0) {
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
    appyFavoritesFilter: function (cmp, newValue) {
        let inquiry = cmp.upVM().get('voyages');
        if (newValue) {
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
    //Closed filters

    applyClosedStatusFilters: function (cmp, newValue) {
        let inquiry = cmp.upVM().get('inquiryArchived'),
            filters = cmp.upVM().get('checkedClosedStatusFilters'),
            filtersIds = cmp.upVM().get('checkedClosedStatusFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls~=statusClosedFilterItem][checked="true"]');
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
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
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Status');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            inquiry.addFilter({
                id: 5555,
                filterFn: function (item) {
                    if (Ext.Array.contains(filtersIds, item.get('status_data').id)) {
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
    applyClosedPortFilters: function (cmp, newValue) {
        let inquiry = cmp.upVM().get('inquiryArchived'),
            filters = cmp.upVM().get('checkedClosedPortFilters'),
            filtersIds = cmp.upVM().get('checkedClosedPortFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls~=portClosedFilterItem][checked="true"]');
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('port_id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
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
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Port');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            inquiry.addFilter({
                id: 7777,
                filterFn: function (item) {
                    if (item.getVoyage() && Ext.Array.contains(filtersIds, item.getVoyage().get('port_id'))) {
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
    applyClosedTypeFilters: function (cmp, newValue) {
        let inquiry = cmp.upVM().get('inquiryArchived'),
            filters = cmp.upVM().get('checkedClosedInquiryType'),
            filtersIds = cmp.upVM().get('checkedClosedInquiryTypeIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls=checkclosedtype-filters][checked="true"]');

        if (cmp.getText() === 'Dry' && newValue) {
            //add filter
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Dry');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(1);
        }
        if (cmp.getText() === 'Dry' && !newValue) {
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (cmp.getText() === 'Wet' && newValue) {
            //add filter
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Wet');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(0);
        }
        if (cmp.getText() === 'Wet' && !newValue) {
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
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
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Type');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }
        if (filtersIds.length > 0) {
            inquiry.addFilter({
                id: 9999,
                filterFn: function (item) {
                    if (item.getVoyage() && Ext.Array.contains(filtersIds, item.getVoyage().get('is_dry'))) {
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
});
