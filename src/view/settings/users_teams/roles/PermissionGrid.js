Ext.define('Abraxa.view.settings.users_teams.roles.PermissionGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.permisiongrid',
    flex: 1,
    shadow: false,
    selectable: false,
    ui: 'bordered',
    margin: '0 -32',
    cls: 'a-detailed-grid a-permission-grid abraxa-grid',
    plugins: {
        rowexpander: true,
    },
    variableHeights: true,
    infinite: false,
    viewModel: {
        stores: {
            roleSubObjects: {
                source: '{objectTabs.activeTab.object_record.object.sub_objects}',
                sorters: [
                    {
                        property: 'order',
                        direction: 'ASC',
                    },
                ],
            },
        },
    },
    bind: {
        store: '{roleSubObjects}',
    },
    columns: [
        {
            dataIndex: 'name',
            text: 'Object',
            minWidth: 160,
            flex: 1,
            hidden: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            sortable: false,
            editable: false,
            ignore: true,
            cell: {
                cls: 'a-cell-object',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                return (
                    value +
                    (record.get('section') ? '&nbsp;<span class="sm-title">(' + record.get('section') + ')</span>' : '')
                );
            },
        },
        {
            text: 'View',
            cls: 'a-column-no-space',
            hidden: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            sortable: false,
            editable: false,
            ignore: true,
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype: 'object.permissions.checkbox',
                    ui: 'large',
                    action: 'view',
                    // bodyAlign: 'center',
                    bind: {
                        slug: '{record.slug}',
                        disabled: '{rolesGrid.selection.company_id != 0 ? false:true}',
                        toggleChecked: {
                            bindTo: '{rolePermissions}',
                            deep: true,
                        },
                    },
                    listeners: {
                        beforecheckchange: function (me, newValue) {
                            let store = me.upVM().get('rolePermissions'),
                                slug = me.getSlug(),
                                objectComponents = null,
                                index = store.findBy(function (rec) {
                                    return rec.get('slug') == slug;
                                }),
                                record = store.getAt(index);
                            if (me.upVM().get('record') && me.upVM().get('record').components) {
                                objectComponents = me.upVM().get('record').components();
                            }
                            if (newValue) {
                                //checked
                                //if we have record update it
                                if (record) {
                                    record.set('view', true);
                                    if (objectComponents) {
                                        objectComponents.each(function (componentRec) {
                                            let index = store.findBy(function (permRec) {
                                                    return permRec.get('slug') == componentRec.get('slug');
                                                }),
                                                subObjCompRecord = store.getAt(index);
                                            if (subObjCompRecord) {
                                                subObjCompRecord.set('view', true);
                                            } else {
                                                let newSubObjCompRecord = Ext.create(
                                                    'Abraxa.model.permission.Permission',
                                                    {
                                                        slug: componentRec.get('slug'),
                                                        object_id: me
                                                            .upVM()
                                                            .get('objectTabs.activeTab.object_record.object_id'),
                                                        role_id: me.upVM().get('rolesGrid.selection.id'),
                                                        sub_object_id: componentRec.get('sub_object_id'),
                                                        view: true,
                                                    }
                                                );
                                                store.add(newSubObjCompRecord);
                                            }
                                        });
                                    }
                                } else {
                                    //we dont have record so we need to add it
                                    let newRecord = {
                                        slug: slug,
                                        object_id: me.upVM().get('objectTabs.activeTab.object_record.object_id'),
                                        role_id: me.upVM().get('rolesGrid.selection.id'),
                                        view: true,
                                    };
                                    store.add(newRecord);
                                    if (objectComponents) {
                                        objectComponents.each(function (componentRec) {
                                            let index = store.findBy(function (permRec) {
                                                    return permRec.get('slug') == componentRec.get('slug');
                                                }),
                                                subObjCompRecord = store.getAt(index);
                                            if (subObjCompRecord) {
                                                subObjCompRecord.set('view', true);
                                            } else {
                                                let newSubObjCompRecord = Ext.create(
                                                    'Abraxa.model.permission.Permission',
                                                    {
                                                        slug: componentRec.get('slug'),
                                                        object_id: me
                                                            .upVM()
                                                            .get('objectTabs.activeTab.object_record.object_id'),
                                                        role_id: me.upVM().get('rolesGrid.selection.id'),
                                                        sub_object_id: componentRec.get('sub_object_id'),
                                                        view: true,
                                                    }
                                                );
                                                store.add(newSubObjCompRecord);
                                            }
                                        });
                                    }
                                }
                            } else {
                                //unchecked
                                //if we have record update it
                                let index = store.findBy(function (rec) {
                                    return rec.get('slug') == slug;
                                });
                                if (index >= 0) {
                                    let record = store.getAt(index);
                                    store.remove(record);
                                    if (objectComponents) {
                                        //loop object components button and fields
                                        objectComponents.each(function (componentRec) {
                                            let index = store.findBy(function (permRec) {
                                                    return permRec.get('slug') == componentRec.get('slug');
                                                }),
                                                record = store.getAt(index);
                                            if (record) {
                                                store.remove(record);
                                            }
                                        });
                                    }
                                }
                            }
                        },
                    },
                },
            },
        },
        {
            text: 'Edit',
            cls: 'a-column-no-space',
            hidden: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            sortable: false,
            editable: false,
            ignore: true,
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype: 'object.permissions.checkbox',
                    ui: 'large',
                    action: 'edit',
                    bind: {
                        slug: '{record.slug}',
                        disabled: '{rolesGrid.selection.company_id != 0 ? false:true}',
                        toggleChecked: {
                            bindTo: '{rolePermissions}',
                            deep: true,
                        },
                    },
                    listeners: {
                        beforecheckchange: function (me, newValue) {
                            let store = me.upVM().get('rolePermissions'),
                                slug = me.getSlug(),
                                objectComponents = null,
                                index = store.findBy(function (rec) {
                                    return rec.get('slug') == slug;
                                }),
                                record = store.getAt(index);
                            if (me.upVM().get('record') && me.upVM().get('record').components) {
                                objectComponents = me.upVM().get('record').components();
                            }
                            if (newValue) {
                                //checked
                                //if we have record update it
                                if (record) {
                                    record.set('edit', true);
                                    record.set('view', true);
                                    //loop module object --- like ops disbursements documents etc
                                    if (objectComponents) {
                                        objectComponents.each(function (componentRec) {
                                            let index = store.findBy(function (permRec) {
                                                    return permRec.get('slug') == componentRec.get('slug');
                                                }),
                                                subObjCompRecord = store.getAt(index);
                                            if (subObjCompRecord) {
                                                subObjCompRecord.set('edit', true);
                                                subObjCompRecord.set('view', true);
                                            } else {
                                                let newSubObjCompRecord = Ext.create(
                                                    'Abraxa.model.permission.Permission',
                                                    {
                                                        slug: componentRec.get('slug'),
                                                        object_id: me
                                                            .upVM()
                                                            .get('objectTabs.activeTab.object_record.object_id'),
                                                        role_id: me.upVM().get('rolesGrid.selection.id'),
                                                        sub_object_id: componentRec.get('sub_object_id'),
                                                        view: true,
                                                        edit: true,
                                                    }
                                                );
                                                store.add(newSubObjCompRecord);
                                            }
                                        });
                                    }
                                } else {
                                    //we dont have record so we need to add it
                                    let newRecord = {
                                        slug: slug,
                                        object_id: me.upVM().get('objectTabs.activeTab.object_record.object_id'),
                                        role_id: me.upVM().get('rolesGrid.selection.id'),
                                        edit: true,
                                        view: true,
                                    };
                                    store.add(newRecord);
                                    if (objectComponents) {
                                        objectComponents.each(function (componentRec) {
                                            let index = store.findBy(function (permRec) {
                                                    return permRec.get('slug') == componentRec.get('slug');
                                                }),
                                                subObjCompRecord = store.getAt(index);
                                            if (subObjCompRecord) {
                                                subObjCompRecord.set('edit', true);
                                                subObjCompRecord.set('view', true);
                                            } else {
                                                let newSubObjCompRecord = Ext.create(
                                                    'Abraxa.model.permission.Permission',
                                                    {
                                                        slug: componentRec.get('slug'),
                                                        object_id: me
                                                            .upVM()
                                                            .get('objectTabs.activeTab.object_record.object_id'),
                                                        role_id: me.upVM().get('rolesGrid.selection.id'),
                                                        sub_object_id: componentRec.get('sub_object_id'),
                                                        view: true,
                                                        edit: true,
                                                    }
                                                );
                                                store.add(newSubObjCompRecord);
                                            }
                                        });
                                    }
                                }
                            } else {
                                //unchecked
                                //if we have record update it
                                if (record) {
                                    record.set('edit', false);
                                    //loop module object --- like ops disbursements documents etc
                                    if (objectComponents) {
                                        objectComponents.each(function (componentRec) {
                                            let index = store.findBy(function (permRec) {
                                                    return permRec.get('slug') == componentRec.get('slug');
                                                }),
                                                subObjCompRecord = store.getAt(index);
                                            if (subObjCompRecord) {
                                                subObjCompRecord.set('edit', false);
                                            }
                                        });
                                    }
                                }
                            }
                        },
                    },
                },
            },
        },
        {
            hidden: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            sortable: false,
            editable: false,
            ignore: true,
            width: 56,
        },
    ],
    itemConfig: {
        expandedField: null,
        viewModel: {
            formulas: {
                objectComponents: {
                    bind: {
                        bindTo: '{record.components}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            store.setRemoteFilter(false);
                            return store;
                        }
                    },
                },

                parentRecord: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        return record;
                    },
                },

                hideCollapser: {
                    bind: {
                        bindTo: '{objectComponents.count}',
                        deep: true,
                    },
                    get: function (count) {
                        if (!count) {
                            this.getView().getCells()[0].setHideMode('opacity');
                            this.getView().getCells()[0].setHidden(true);
                        }
                    },
                },
            },
            stores: {
                fieldStore: {
                    source: '{record.components}',
                    filters: [
                        {
                            property: 'type',
                            value: 'field',
                            operator: '=',
                        },
                    ],
                },
                buttonStore: {
                    source: '{record.components}',
                    filters: [
                        {
                            property: 'type',
                            value: 'button',
                            operator: '=',
                        },
                    ],
                },
            },
        },
        body: {
            xtype: 'container',
            shadow: true,
            margin: '8 16 16 48',
            cls: 'border-radius',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            flex: 1,
            plugins: {
                lazygridrow: {
                    items: [
                        {
                            xtype: 'tabbar',
                            activeTab: 0,
                            padding: '0 16',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                            },
                            defaults: {
                                ripple: false,
                            },
                            items: [
                                {
                                    text: 'Fields',
                                },
                                {
                                    text: 'Buttons',
                                },
                            ],
                            listeners: {
                                activeTabchange: function (me, value) {
                                    var activeTab = me.getActiveTab();
                                    let mainContainerItems = me
                                        .up('container')
                                        .down('[cls~=inner_container]')
                                        .getItems();
                                    if (me.items.indexOf(activeTab) == 0) {
                                        mainContainerItems.items[1].hide(null);
                                        mainContainerItems.items[0].show(null);
                                    } else if (me.items.indexOf(activeTab) == 1) {
                                        mainContainerItems.items[0].hide(null);
                                        mainContainerItems.items[1].show(null);
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'inner_container',
                            flex: 1,
                            hideMode: 'offsets',
                            items: [
                                {
                                    xtype: 'grid',
                                    ui: 'bordered',
                                    hideMode: 'offsets',
                                    cls: 'field_grid a-fields-grid',
                                    flex: 1,
                                    infinite: false,
                                    hideHeaders: true,
                                    bind: {
                                        store: '{fieldStore}',
                                    },
                                    itemConfig: {
                                        viewModel: {
                                            formulas: {
                                                subObjectRecord: {
                                                    bind: {
                                                        bindTo: '{parentRecord}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        return record;
                                                    },
                                                },
                                                updateParent: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        if (
                                                            record &&
                                                            this.get('rolePermissions') &&
                                                            this.get('rolePermissions').count() > 0
                                                        ) {
                                                            this.get('rolePermissions')
                                                                .getData()
                                                                .getAt(0)
                                                                .set('updated', new Date());
                                                        }
                                                    },
                                                },
                                                checkedSubObjectViewRecord: {
                                                    bind: {
                                                        bindTo: '{permissions}',
                                                        deep: true,
                                                    },
                                                    get: function (store) {
                                                        let subObjectRecord = this.get('subObjectRecord'),
                                                            company_id = this.get('rolesGrid.selection.company_id'),
                                                            disabled = true;
                                                        if (subObjectRecord) {
                                                            if (company_id) {
                                                                let index = store.findBy(function (permRec) {
                                                                        return (
                                                                            permRec.get('slug') ==
                                                                            subObjectRecord.get('slug')
                                                                        );
                                                                    }),
                                                                    record = store.getAt(index);
                                                                if (record && record.get('view')) {
                                                                    disabled = false;
                                                                }
                                                            }
                                                        }
                                                        return disabled;
                                                    },
                                                },
                                                checkedSubObjectEditRecord: {
                                                    bind: {
                                                        bindTo: '{permissions}',
                                                        deep: true,
                                                    },
                                                    get: function (store) {
                                                        let subObjectRecord = this.get('subObjectRecord'),
                                                            company_id = this.get('rolesGrid.selection.company_id'),
                                                            disabled = true;
                                                        if (subObjectRecord) {
                                                            if (company_id) {
                                                                let index = store.findBy(function (permRec) {
                                                                        return (
                                                                            permRec.get('slug') ==
                                                                            subObjectRecord.get('slug')
                                                                        );
                                                                    }),
                                                                    record = store.getAt(index);
                                                                if (record && record.get('edit')) {
                                                                    disabled = false;
                                                                }
                                                            }
                                                        }
                                                        return disabled;
                                                    },
                                                },
                                                currentFieldRecord: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        return record;
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    columns: [
                                        {
                                            dataIndex: 'name',
                                            minWidth: 160,
                                            flex: 1,
                                            hidden: false,
                                            menuDisabled: true,
                                            resizable: false,
                                            hideable: false,
                                            sortable: false,
                                            editable: false,
                                            ignore: true,
                                            cell: {
                                                encodeHtml: false,
                                            },
                                        },
                                        {
                                            text: 'View',
                                            align: 'center',
                                            hidden: false,
                                            menuDisabled: true,
                                            resizable: false,
                                            hideable: false,
                                            sortable: false,
                                            editable: false,
                                            ignore: true,
                                            cell: {
                                                xtype: 'widgetcell',
                                                widget: {
                                                    xtype: 'object.permissions.checkbox',
                                                    ui: 'large',
                                                    action: 'view',
                                                    bodyAlign: 'center',
                                                    bind: {
                                                        slug: '{currentFieldRecord.slug}',
                                                        disabled: '{checkedSubObjectViewRecord}',
                                                        toggleChecked: {
                                                            bindTo: '{rolePermissions}',
                                                            deep: true,
                                                        },
                                                    },
                                                    listeners: {
                                                        beforecheckchange: function (me, newValue) {
                                                            let store = me.upVM().get('rolePermissions'),
                                                                slug = me.getSlug(),
                                                                index = store.findBy(function (rec) {
                                                                    return rec.get('slug') == slug;
                                                                }),
                                                                record = store.getAt(index);
                                                            if (newValue) {
                                                                //checked
                                                                //if we have record update it
                                                                if (record) {
                                                                    record.set('view', true);
                                                                } else {
                                                                    //we dont have record so we need to add it
                                                                    let newRecord = {
                                                                        slug: slug,
                                                                        object_id: me
                                                                            .upVM()
                                                                            .get(
                                                                                'objectTabs.activeTab.object_record.object_id'
                                                                            ),
                                                                        role_id: me
                                                                            .upVM()
                                                                            .get('rolesGrid.selection.id'),
                                                                        sub_object_id: me
                                                                            .upVM()
                                                                            .get('currentFieldRecord').id,
                                                                        view: true,
                                                                    };
                                                                    store.add(newRecord);
                                                                }
                                                            } else {
                                                                //unchecked
                                                                let index = store.findBy(function (rec) {
                                                                    return rec.get('slug') == slug;
                                                                });
                                                                if (index >= 0) {
                                                                    let record = store.getAt(index);
                                                                    store.remove(record);
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            text: 'Edit',
                                            align: 'center',
                                            hidden: false,
                                            menuDisabled: true,
                                            resizable: false,
                                            hideable: false,
                                            sortable: false,
                                            editable: false,
                                            ignore: true,
                                            cell: {
                                                xtype: 'widgetcell',
                                                widget: {
                                                    xtype: 'object.permissions.checkbox',
                                                    ui: 'large',
                                                    action: 'edit',
                                                    bodyAlign: 'center',
                                                    bind: {
                                                        disabled: '{checkedSubObjectEditRecord}',
                                                        slug: '{currentFieldRecord.slug}',
                                                        toggleChecked: {
                                                            bindTo: '{rolePermissions}',
                                                            deep: true,
                                                        },
                                                    },
                                                    listeners: {
                                                        beforecheckchange: function (me, newValue) {
                                                            let store = me.upVM().get('rolePermissions'),
                                                                slug = me.getSlug(),
                                                                index = store.findBy(function (rec) {
                                                                    return rec.get('slug') == slug;
                                                                }),
                                                                record = store.getAt(index);
                                                            if (newValue) {
                                                                //checked
                                                                //if we have record update it
                                                                if (record) {
                                                                    record.set('edit', true);
                                                                    record.set('view', true);
                                                                } else {
                                                                    //we dont have record so we need to add it
                                                                    let newRecord = {
                                                                        slug: slug,
                                                                        object_id: me
                                                                            .upVM()
                                                                            .get(
                                                                                'objectTabs.activeTab.object_record.object_id'
                                                                            ),
                                                                        role_id: me
                                                                            .upVM()
                                                                            .get('rolesGrid.selection.id'),
                                                                        sub_object_id: me
                                                                            .upVM()
                                                                            .get('currentFieldRecord').id,
                                                                        edit: true,
                                                                        view: true,
                                                                    };
                                                                    store.add(newRecord);
                                                                }
                                                            } else {
                                                                //unchecked
                                                                //if we have record update it
                                                                if (record) {
                                                                    record.set('edit', false);
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            width: 16,
                                        },
                                    ],
                                },
                                {
                                    xtype: 'grid',
                                    ui: 'bordered',
                                    cls: 'a-fields-grid',
                                    flex: 1,
                                    hidden: true,
                                    infinite: false,
                                    hideHeaders: true,
                                    bind: {
                                        store: '{buttonStore}',
                                    },
                                    itemConfig: {
                                        viewModel: {
                                            formulas: {
                                                subObjectRecord: {
                                                    bind: {
                                                        bindTo: '{parentRecord}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        return record;
                                                    },
                                                },
                                                updateParent: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        if (
                                                            record &&
                                                            this.get('rolePermissions') &&
                                                            this.get('rolePermissions').count() > 0
                                                        ) {
                                                            this.get('rolePermissions')
                                                                .getData()
                                                                .getAt(0)
                                                                .set('updated', new Date());
                                                        }
                                                    },
                                                },
                                                checkedSubObjectViewRecord: {
                                                    bind: {
                                                        bindTo: '{permissions}',
                                                        deep: true,
                                                    },
                                                    get: function (store) {
                                                        let subObjectRecord = this.get('subObjectRecord'),
                                                            company_id = this.get('rolesGrid.selection.company_id'),
                                                            disabled = true;
                                                        if (subObjectRecord) {
                                                            if (company_id) {
                                                                let index = store.findBy(function (permRec) {
                                                                        return (
                                                                            permRec.get('slug') ==
                                                                            subObjectRecord.get('slug')
                                                                        );
                                                                    }),
                                                                    record = store.getAt(index);
                                                                if (record && record.get('view')) {
                                                                    disabled = false;
                                                                }
                                                            }
                                                        }
                                                        return disabled;
                                                    },
                                                },
                                                checkedSubObjectEditRecord: {
                                                    bind: {
                                                        bindTo: '{permissions}',
                                                        deep: true,
                                                    },
                                                    get: function (store) {
                                                        let subObjectRecord = this.get('subObjectRecord'),
                                                            company_id = this.get('rolesGrid.selection.company_id'),
                                                            disabled = true;
                                                        if (subObjectRecord) {
                                                            if (company_id) {
                                                                let index = store.findBy(function (permRec) {
                                                                        return (
                                                                            permRec.get('slug') ==
                                                                            subObjectRecord.get('slug')
                                                                        );
                                                                    }),
                                                                    record = store.getAt(index);
                                                                if (record && record.get('edit')) {
                                                                    disabled = false;
                                                                }
                                                            }
                                                        }
                                                        return disabled;
                                                    },
                                                },
                                                currentButtonRecord: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        return record;
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    columns: [
                                        {
                                            dataIndex: 'name',
                                            minWidth: 160,
                                            flex: 1,
                                            hidden: false,
                                            menuDisabled: true,
                                            resizable: false,
                                            hideable: false,
                                            sortable: false,
                                            editable: false,
                                            ignore: true,
                                            cell: {
                                                encodeHtml: false,
                                            },
                                        },
                                        {
                                            text: 'View',
                                            align: 'center',
                                            hidden: false,
                                            menuDisabled: true,
                                            resizable: false,
                                            hideable: false,
                                            sortable: false,
                                            editable: false,
                                            ignore: true,
                                            cell: {
                                                xtype: 'widgetcell',
                                                widget: {
                                                    xtype: 'object.permissions.checkbox',
                                                    ui: 'large',
                                                    action: 'view',
                                                    bodyAlign: 'center',
                                                    bind: {
                                                        slug: '{currentButtonRecord.slug}',
                                                        disabled: '{checkedSubObjectViewRecord}',
                                                        toggleChecked: {
                                                            bindTo: '{rolePermissions}',
                                                            deep: true,
                                                        },
                                                    },
                                                    listeners: {
                                                        beforecheckchange: function (me, newValue) {
                                                            let store = me.upVM().get('rolePermissions'),
                                                                slug = me.getSlug(),
                                                                index = store.findBy(function (rec) {
                                                                    return rec.get('slug') == slug;
                                                                }),
                                                                record = store.getAt(index);
                                                            if (newValue) {
                                                                //checked
                                                                //if we have record update it
                                                                if (record) {
                                                                    record.set('view', true);
                                                                } else {
                                                                    //we dont have record so we need to add it
                                                                    let newRecord = {
                                                                        slug: slug,
                                                                        object_id: me
                                                                            .upVM()
                                                                            .get(
                                                                                'objectTabs.activeTab.object_record.object_id'
                                                                            ),
                                                                        role_id: me
                                                                            .upVM()
                                                                            .get('rolesGrid.selection.id'),
                                                                        sub_object_id: me
                                                                            .upVM()
                                                                            .get('currentButtonRecord').id,
                                                                        view: true,
                                                                    };
                                                                    store.add(newRecord);
                                                                }
                                                            } else {
                                                                //unchecked
                                                                let index = store.findBy(function (rec) {
                                                                    return rec.get('slug') == slug;
                                                                });
                                                                if (index >= 0) {
                                                                    let record = store.getAt(index);
                                                                    store.remove(record);
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            text: 'Edit',
                                            align: 'center',
                                            hidden: false,
                                            menuDisabled: true,
                                            resizable: false,
                                            hideable: false,
                                            sortable: false,
                                            editable: false,
                                            ignore: true,
                                            cell: {
                                                xtype: 'widgetcell',
                                                widget: {
                                                    xtype: 'object.permissions.checkbox',
                                                    ui: 'large',
                                                    action: 'edit',
                                                    bodyAlign: 'center',
                                                    bind: {
                                                        slug: '{currentButtonRecord.slug}',
                                                        disabled: '{checkedSubObjectEditRecord}',
                                                        toggleChecked: {
                                                            bindTo: '{rolePermissions}',
                                                            deep: true,
                                                        },
                                                    },
                                                    listeners: {
                                                        beforecheckchange: function (me, newValue) {
                                                            let store = me.upVM().get('rolePermissions'),
                                                                slug = me.getSlug(),
                                                                index = store.findBy(function (rec) {
                                                                    return rec.get('slug') == slug;
                                                                }),
                                                                record = store.getAt(index);
                                                            if (newValue) {
                                                                //checked
                                                                //if we have record update it
                                                                if (record) {
                                                                    record.set('edit', true);
                                                                    record.set('view', true);
                                                                } else {
                                                                    //we dont have record so we need to add it
                                                                    let newRecord = {
                                                                        slug: slug,
                                                                        object_id: me
                                                                            .upVM()
                                                                            .get(
                                                                                'objectTabs.activeTab.object_record.object_id'
                                                                            ),
                                                                        role_id: me
                                                                            .upVM()
                                                                            .get('rolesGrid.selection.id'),
                                                                        sub_object_id: me
                                                                            .upVM()
                                                                            .get('currentButtonRecord').id,
                                                                        edit: true,
                                                                        view: true,
                                                                    };
                                                                    store.add(newRecord);
                                                                }
                                                            } else {
                                                                //unchecked
                                                                //if we have record update it
                                                                if (record) {
                                                                    record.set('edit', false);
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            width: 16,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        },
    },
    listeners: {
        childtap: function (cmp, item) {
            if (item.sourceElement.classList.value.indexOf('x-icon-el') >= 0) {
                this.upVM().get('rolePermissions').getData().getAt(0).set('updated', new Date());
            }
        },
    },
});
