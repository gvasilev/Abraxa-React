Ext.define('Abraxa.view.portcall.husbandry.HusbandryViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.husbandry-viewmodel',
    stores: {
        serviceStore: {
            source: '{expenses}',
            filters: [
                {
                    id: 'service',
                    filterFn: function (record) {
                        const categories = [5, 6, 10];
                        if (record.get('default_expense_item'))
                            return categories.includes(record.get('default_expense_item').default_expense_item_type_id);
                    },
                },
            ],
        },
        disbItemStore: {
            source: '{defaultExpenseItems}',
        },
        rates: {
            source: '{currencyRates}',
        },
        orgs: {
            source: '{organizations}',
        },
    },
    formulas: {
        selectFirst: {
            bind: {
                bindTo: '{husbandrySections}',
                deep: true,
            },
            get: function (data) {
                if (data) {
                    // Ext.ComponentQuery.query('[cls=husbandry_menu]')[0].select(0);
                }
            },
        },
        husbandryMenuMembers: {
            bind: {
                bindTo: {
                    selection: '{husbandryMenu.selection}',
                    members: '{membersPerSection}',
                },
                deep: true,
            },
            get: function (data) {
                if (data['selection'] && data['members']) {
                    let members = data['members'][data.selection.get('slug')];

                    this.set('sectionMembers', members);
                    this.set('memberPreviewTitle', data.selection.get('title'));

                    return members;
                }
            },
        },
        husbandrySectionIcon: {
            bind: {
                bindTo: '{husbandryMenu.selection}',
                deep: true,
            },
            get: function (selection) {
                if (selection) {
                    let slug = selection.get('slug'),
                        icon = '';
                    switch (slug) {
                        case 'supply':
                            icon = 'layers';
                            break;
                        case 'crewing':
                            icon = 'supervisor_account';
                            break;
                    }
                    return icon;
                }
            },
        },
        places: {
            bind: {
                bindTo: '{berths}',
                deep: true,
            },
            get: function (berths) {
                let places = [],
                    nonEditable = this.get('nonEditable'),
                    defaultPlace = {
                        id: 0,
                        name: 'Anchorage',
                    };
                places.push(defaultPlace);
                if (berths) {
                    let berthsData = berths.getData().getRange();
                    if (berthsData) {
                        Ext.Array.each(berthsData, function (value) {
                            let place = {
                                id: value.get('id'),
                                name: value.get('name'),
                            };
                            places.push(place);
                        });
                    }
                }
                return places;
            },
        },
        currency: {
            bind: {
                bindTo: '{currentUser.company.default_currency}',
                deep: true,
            },
            get: function (currency) {
                return currency;
            },
        },
        amountValue: {
            bind: {
                amount: '{suppliesGrid.selection.amount}',
                amount_xr: '{suppliesGrid.selection.amount_xr}',
            },
            get: function (data) {
                if (data.amount && data.amount_xr) {
                    let record = this.get('suppliesGrid.selection');
                    record.set('amount_bce', data.amount * data.amount_xr);
                    return data.amount * data.amount_xr;
                }
            },
        },
        commissionValue: {
            bind: {
                commission: '{suppliesGrid.selection.commission}',
                commission_xr: '{suppliesGrid.selection.commission_xr}',
            },
            get: function (data) {
                if (data.commission && data.commission_xr) {
                    let record = this.get('suppliesGrid.selection');
                    record.set('commission_bce', data.commission * data.commission_xr);
                    return data.commission * data.commission_xr;
                }
            },
        },
        chargesValue: {
            bind: {
                final_da: '{suppliesGrid.selection.final_da}',
                final_da_xr: '{suppliesGrid.selection.final_da_xr}',
            },
            get: function (data) {
                if (data.final_da && data.final_da_xr) {
                    let record = this.get('suppliesGrid.selection');
                    record.set('final_da_bce', data.final_da * data.final_da_xr);
                    return data.final_da * data.final_das_xr;
                }
            },
        },
        selectableCrewing: {
            bind: {
                bindTo: '{nonEditable}',
                deep: true,
            },
            get: function (value) {
                let store = this.get('userPermissions'),
                    objectPermissions = this.get('objectPermissions');

                if (value) {
                    if (objectPermissions && objectPermissions['crewing']) {
                        if (objectPermissions['crewing'].can_edit) {
                            return;
                        }
                        if (store && Object.keys(store).length > 0) {
                            Ext.ComponentQuery.query('husbandry\\.crewing\\.grid')[0].getColumns()[0].hide();
                            return;
                        }
                    }
                    Ext.ComponentQuery.query('husbandry\\.crewing\\.grid')[0].getColumns()[0].hide();
                    return;
                }
            },
        },
        selectableSupply: {
            bind: {
                bindTo: '{nonEditable}',
                deep: true,
            },
            get: function (value) {
                let store = this.get('userPermissions'),
                    objectPermissions = this.get('objectPermissions');

                if (value) {
                    if (objectPermissions && objectPermissions['supply']) {
                        if (objectPermissions['supply'].can_edit) {
                            return;
                        }
                        if (store && Object.keys(store).length > 0) {
                            // Ext.ComponentQuery.query('husbandry\\.supplies\\.grid')[0].getColumns()[0].hide();
                            return;
                        }
                    }
                    // Ext.ComponentQuery.query('husbandry\\.supplies\\.grid')[0].getColumns()[0].hide();
                    return;
                }
            },
        },
    },
});
