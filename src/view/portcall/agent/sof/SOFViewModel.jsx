Ext.define('Abraxa.view.portcall.sof.SOFViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.sof-viewmodel',

    data: {
        cargoAdvanced: false,
        showSuppliedBunkers: 0,
        activeBerth: null,
        cargoGroupTotal: null,
        showGangsHolds: 0,
        activeBerthCargoCount: 0,
    },
    stores: {
        bunkers: {
            source: '{object_record.bunkers}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
        },
    },
    formulas: {
        opsMenuMembers: {
            bind: {
                bindTo: {
                    selection: '{opsMenu.selection}',
                    members: '{membersPerSection}',
                },
                deep: true,
            },
            get: function (data) {
                if (data['selection'] && data['members']) {
                    let members = data['members'][data.selection.get('subObject')];

                    this.set('sectionMembers', members);
                    this.set('memberPreviewTitle', data.selection.get('title'));

                    return members;
                }
            },
        },
        opsSectionIcon: {
            bind: {
                bindTo: '{opsMenu.selection}',
                deep: true,
            },
            get: function (selection) {
                if (selection) {
                    let slug = selection.get('slug'),
                        icon = '';
                    switch (slug) {
                        case 'general':
                            icon = 'anchor';
                            break;
                        case 'berth':
                            icon = 'place';
                            break;
                        case 'sof':
                            icon = 'timer';
                            break;
                        case 'progress':
                            icon = 'speed';
                            break;
                    }
                    return icon;
                }
            },
        },
        remarks: {
            bind: {
                bindTo: '{object_record.sof}',
                deep: true,
            },
            get: function (sofs) {
                if (sofs) {
                    let sof = sofs.getData().getAt(0),
                        store = sof.remarks();

                    store.getProxy().setExtraParams({
                        sof_id: sof.get('id'),
                    });
                    return store;
                }
            },
        },
        signatures: {
            bind: {
                bindTo: '{object_record.sof}',
                deep: true,
            },
            get: function (sofs) {
                if (sofs) {
                    let sof = sofs.getData().getAt(0),
                        store = sof.signatures();

                    store.getProxy().setExtraParams({
                        sof_id: sof.get('id'),
                    });
                    return store;
                }
            },
        },
        selectableEvents: {
            bind: {
                bindTo: '{nonEditable}',
                deep: true,
            },
            get: function (nonEditable) {
                let selectable = false,
                    store = this.get('userPermissions'),
                    objectPermissions = this.get('objectPermissions');

                if (!nonEditable) {
                    if (store && Object.keys(store).length > 0) {
                        let record = store['portcall'];
                        if (record && record.edit) {
                            selectable = {
                                checkbox: true,
                                mode: 'multi',
                            };
                        } else {
                            return false;
                        }
                    }
                } else {
                    if (objectPermissions && objectPermissions['sof']) {
                        if (objectPermissions['sof'].can_edit) {
                            selectable = {
                                checkbox: true,
                                mode: 'multi',
                            };
                        }
                        if (store && Object.keys(store).length > 0) {
                            let record = store['sof'];
                            if (record && !record.edit) {
                                selectable = false;
                            }
                        }
                    }
                }
                return selectable;
            },
        },
        editableCargoProgress: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (objectPermissions) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    result = false;

                if (!nonEditable) {
                    if (store && Object.keys(store).length > 0) {
                        let record = store['portcallOpsCargoProgress'];
                        if (record && record.edit) {
                            result = true;
                        } else {
                            result = false;
                        }
                    }
                } else {
                    if (objectPermissions && objectPermissions['progress']) {
                        if (objectPermissions['progress'].can_edit) {
                            if (store && Object.keys(store).length > 0) {
                                let record = store['portcallOpsCargoProgress'];
                                if (record && !record.edit) {
                                    result = false;
                                } else {
                                    result = true;
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
        // selectFirst: function (get) {
        //     Ext.ComponentQuery.query('[cls=ops_menu]')[0].select(0);
        // },
        berthServices: {
            bind: {
                bindTo: '{activeBerth.selection}',
                deep: true,
            },
            get: function (record) {
                if (record && Ext.isNumeric(parseInt(record.get('id')))) {
                    let store = record.services();

                    store.getProxy().setExtraParams({
                        berth_id: record.get('id'),
                    });
                    if (store.getCount() == 0 && !record.get('is_live')) {
                        store.add({
                            service_type: 'Towage',
                            da_berth_id: record.get('id'),
                            portcall_id: this.get('object_record.id'),
                        });
                    }
                    return store;
                }
            },
        },
        // showCargoAdvancedPerBerth: {
        //     bind: {
        //         activeBerthFunction: '{activeBerth.selection.function}',
        //         activeBerthCargoes: '{activeBerthCargoCount}'
        //     },
        //     get: function (data) {
        //         if (data) {
        //             if (data.activeBerthFunction == 'Cargo operations' && data.activeBerthCargoes > 0) {
        //                 return false;
        //             } else {
        //                 return true;
        //             }
        //         }
        //         return true;
        //     }
        // },
        cargoGroup: {
            bind: {
                cargoes: '{cargoRange}',
                berth_id: '{activeBerth.selection.id}',
            },
            get: function (data) {
                if (data.cargoes && data.berth_id) {
                    let items = [];
                    Ext.each(data.cargoes, function (cargo) {
                        if (cargo.get('berth_id') == data.berth_id) items.push(cargo);
                    });
                    return items;
                }
            },
        },
        cargoRange: {
            bind: {
                bindTo: '{cargoes}',
                deep: true,
            },
            get: function (data) {
                if (data) return data.getData().getRange();
            },
        },
        cargoGroupTotal: {
            bind: {
                bindTo: '{cargoGroup}',
                deep: true,
            },
            get: function (data) {
                let total = 0;

                Ext.each(data, function (cargo) {
                    if (cargo.get('quantity')) total = total + parseInt(cargo.get('quantity'));
                });

                return numeral(total.toString()).format('0,0.[000]');
            },
        },
        cargoGroupUnit: {
            bind: {
                bindTo: '{cargoGroup}',
                deep: true,
            },
            get: function (data) {
                let unit = '',
                    uniq_units = [];
                Ext.each(data, function (cargo) {
                    if (cargo.get('unit')) uniq_units.push(cargo.get('unit'));
                });
                if (Ext.Array.unique(uniq_units).length && Ext.Array.unique(uniq_units).length == 1) {
                    unit = uniq_units[0];
                }
                return unit;
            },
        },
        cargoGroupCount: {
            bind: {
                bindTo: '{cargoGroup}',
                deep: true,
            },
            get: function (data) {
                if (data) {
                    this.getParent().set('activeBerthCargoCount', data.length);
                }
            },
        },
        // sectionTitle: {
        //     bind: {
        //         bindTo: '{opsMenu.selection}',
        //         deep: true
        //     },
        //     get: function (selection) {
        //         if (selection) {
        //             return selection.get('title');
        //         }
        //         let menu = Ext.ComponentQuery.query('[cls=ops_menu]')[0];
        //         return menu.getData()[0].title;
        //     }
        // }
    },
});
