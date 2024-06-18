import '../../../../core/components/AbraxaTitleBar';
import './ObjectTabs';
import '../../../../core/components/permissions/ObjectPermissionsToggle';
import '../../../../core/components/permissions/ObjectPermissionsCheckbox';

Ext.define('Abraxa.view.settings.users_teams.roles.RoleSettings', {
    extend: 'Ext.Container',
    xtype: 'usersettings.rolesettings',
    cls: 'a-settings-main role_settings needs_show',
    scrollable: true,
    hideMode: 'offsets',
    items: [
        {
            xtype: 'abraxa.titlebar',
            padding: 0,
            margin: '0 -12',
            bind: {
                title: '<div class="hbox"><span class="mr-4">Role</span><span class="text-info">({rolesGrid.selection.name})</span></div>',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '0 16 0 0',
                    align: 'left',
                    iconCls: 'md-icon-keyboard-backspace',
                    ui: 'round default',
                    handler: function () {
                        let upContainer = Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0],
                            downContainer = Ext.ComponentQuery.query('[itemId=rolesDetalsContainer]')[0];
                        downContainer.setHidden(true);
                        upContainer.setHidden(false);
                    },
                },
            ],
        },
        {
            xtype: 'div',
            html: '<h1 class="fw-n">Module settings</h1>',
        },
        {
            xtype: 'div',
            html: '<p class="text-info">Easily manage access & permissions across  modules to control who can see and edit data & files.</p>',
        },
        {
            xtype: 'div',
            html: '<hr>',
        },
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            padding: 0,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'object.tabs',
                    height: 64,
                    padding: 0,
                    activeTab: 0,
                    reference: 'objectTabs',
                    publishes: {
                        activeTab: true,
                        activeTabIndex: true,
                    },
                    defaults: {
                        ui: 'tab-lg',
                        ripple: false,
                    },
                    bind: {
                        store: '{rolesObjects}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            padding: 0,
            maxWidth: 720,
            scrollable: true,
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    padding: '24 0',
                    cls: 'a-bb-100',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'hbox mr-16',
                            flex: 1,
                            bind: {
                                html: '<div class="a-obj-logo a-logo-lg {objectTabs.activeTab.object_record.object.cls} a-shadow mr-24"><i class="{objectTabs.activeTab.object_record.object.icon}"></i></div><div class="a-info"><div class="h3 m-0">{objectTabs.activeTab.object_record.object.name}</div><div class="text-info">{objectTexts.title}</div></div>',
                            },
                        },
                        {
                            xtype: 'object.permissions.toggle',
                            reference: 'objectPermissionToggle',
                            action: 'view',
                            bind: {
                                slug: '{objectTabs.activeTab.object_record.object.slug}',
                                disabled: '{rolesGrid.selection.company_id != 0 ? false : true}',
                                toggleValue: {
                                    bindTo: '{permissions}',
                                    deep: true,
                                },
                            },
                            listeners: {
                                dragchange: function (me, slider, newValue) {
                                    let store = me.upVM().get('rolePermissions'),
                                        slug = me.getSlug(),
                                        activeObject = me.upVM().get('objectTabs.activeTab.object_record.object'),
                                        index = store.findBy(function (rec) {
                                            return rec.get('slug') == slug;
                                        });
                                    if (newValue) {
                                        me.upVM().set('removeSlug', null);
                                        let newRecord = {
                                            slug: slug,
                                            object_id: me.upVM().get('objectTabs.activeTab.object_record.object_id'),
                                            role_id: me.upVM().get('rolesGrid.selection.id'),
                                            view: true,
                                        };
                                        store.add(newRecord);
                                        activeObject.sub_objects().each(function (rec) {
                                            let subObjComponents = rec.components(),
                                                index = store.findBy(function (permRec) {
                                                    return permRec.get('slug') == rec.get('slug');
                                                }),
                                                subObjRecord = store.getAt(index);
                                            if (subObjRecord) {
                                                subObjRecord.set('view', true);
                                            } else {
                                                let newSubObjRecord = Ext.create('Abraxa.model.permission.Permission', {
                                                    slug: rec.get('slug'),
                                                    object_id: rec.get('object_id'),
                                                    role_id: me.upVM().get('rolesGrid.selection.id'),
                                                    view: true,
                                                });
                                                store.add(newSubObjRecord);
                                            }
                                            // //loop object components button and fields
                                            subObjComponents.each(function (componentRec) {
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
                                        });
                                    } else {
                                        if (index >= 0) {
                                            let record = store.getAt(index);
                                            store.remove(record);
                                            activeObject.sub_objects().each(function (rec) {
                                                let index = store.findBy(function (permRec) {
                                                        return permRec.get('slug') == rec.get('slug');
                                                    }),
                                                    record = store.getAt(index);
                                                if (record) {
                                                    store.remove(record);
                                                }

                                                let subObjComponents = rec.components();
                                                //loop object components button and fields
                                                subObjComponents.each(function (componentRec) {
                                                    let index = store.findBy(function (permRec) {
                                                            return permRec.get('slug') == componentRec.get('slug');
                                                        }),
                                                        record = store.getAt(index);
                                                    if (record) {
                                                        store.remove(record);
                                                    }
                                                });
                                            });
                                            if (!record.phantom) {
                                                me.upVM().set('removeSlug', slug);
                                            }
                                        }
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '24 0 0 0',
                    cls: 'bordered border-radius',
                    items: [
                        {
                            xtype: 'container',
                            padding: 24,
                            cls: 'a-bb-100',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-info"><div class="h3 m-0">Create</div><div class="text-info">{objectTexts.create}</div></div>',
                                    },
                                },
                                {
                                    xtype: 'object.permissions.checkbox',
                                    ui: 'large',
                                    action: 'create',
                                    bind: {
                                        disabled:
                                            '{(objectPermissionToggle.value && rolesGrid.selection.company_id != 0) ? false : true}',
                                        slug: '{objectTabs.activeTab.object_record.object.slug}',
                                        toggleChecked: {
                                            bindTo: '{rolePermissions}',
                                            deep: true,
                                        },
                                    },
                                    listeners: {
                                        beforecheckchange: function (me, newValue) {
                                            let store = me.upVM().get('rolePermissions'),
                                                slug = me.getSlug(),
                                                createSlug = slug + Ext.String.capitalize(me.getAction());
                                            if (store) {
                                                let index = store.findBy(function (rec) {
                                                        return rec.get('slug') == slug;
                                                    }),
                                                    record = store.getAt(index);
                                                if (record) {
                                                    if (newValue) {
                                                        record.set(me.getAction(), true);
                                                        let index = store.findBy(function (rec) {
                                                                return rec.get('slug') == createSlug;
                                                            }),
                                                            createRecord = store.getAt(index);

                                                        if (createRecord) {
                                                            createRecord.set('edit', true);
                                                            createRecord.set('view', true);
                                                        } else {
                                                            let createRecord = Ext.create(
                                                                'Abraxa.model.permission.Permission',
                                                                {
                                                                    slug: createSlug,
                                                                    object_id: me
                                                                        .upVM()
                                                                        .get(
                                                                            'objectTabs.activeTab.object_record.object_id'
                                                                        ),
                                                                    role_id: me.upVM().get('rolesGrid.selection.id'),
                                                                    edit: true,
                                                                    view: true,
                                                                }
                                                            );
                                                            store.add(createRecord);
                                                        }
                                                    } else {
                                                        record.set(me.getAction(), false);
                                                        let index = store.findBy(function (permRec) {
                                                                return permRec.get('slug') == createSlug;
                                                            }),
                                                            createRecord = store.getAt(index);
                                                        if (createRecord) {
                                                            store.remove(createRecord);
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: 24,
                            cls: 'a-bb-100',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-info"><div class="h3 m-0">Edit</div><div class="text-info">{objectTexts.edit}</div></div>',
                                    },
                                },
                                {
                                    xtype: 'object.permissions.checkbox',
                                    ui: 'large',
                                    action: 'edit',
                                    bind: {
                                        disabled:
                                            '{(objectPermissionToggle.value && rolesGrid.selection.company_id != 0) ? false : true}',
                                        slug: '{objectTabs.activeTab.object_record.object.slug}',
                                        toggleChecked: {
                                            bindTo: '{rolePermissions}',
                                            deep: true,
                                        },
                                        // checked: '{objectTabs.activeTab.object_record.object.edit}',
                                    },
                                    listeners: {
                                        beforecheckchange: function (me, newValue) {
                                            let store = me.upVM().get('rolePermissions'),
                                                slug = me.getSlug(),
                                                activeObject = me
                                                    .upVM()
                                                    .get('objectTabs.activeTab.object_record.object'),
                                                action = me.getAction();

                                            if (store) {
                                                let index = store.findBy(function (rec) {
                                                        return rec.get('slug') == slug;
                                                    }),
                                                    record = store.getAt(index);

                                                if (newValue) {
                                                    //checked
                                                    //if we have record update it
                                                    if (record) {
                                                        record.set(action, true);
                                                        //loop module object --- like ops disbursements documents etc
                                                        activeObject.sub_objects().each(function (rec) {
                                                            let subObjComponents = rec.components(),
                                                                index = store.findBy(function (permRec) {
                                                                    return permRec.get('slug') == rec.get('slug');
                                                                }),
                                                                subObjRecord = store.getAt(index);
                                                            if (subObjRecord) {
                                                                subObjRecord.set(action, true);
                                                            } else {
                                                                let newSubObjRecord = Ext.create(
                                                                    'Abraxa.model.permission.Permission',
                                                                    {
                                                                        slug: rec.get('slug'),
                                                                        object_id: rec.get('object_id'),
                                                                        role_id: me
                                                                            .upVM()
                                                                            .get('rolesGrid.selection.id'),
                                                                        edit: true,
                                                                        view: true,
                                                                    }
                                                                );
                                                                store.add(newSubObjRecord);
                                                            }
                                                            //loop object components button and fields
                                                            subObjComponents.each(function (componentRec) {
                                                                let index = store.findBy(function (permRec) {
                                                                        return (
                                                                            permRec.get('slug') ==
                                                                            componentRec.get('slug')
                                                                        );
                                                                    }),
                                                                    subObjCompRecord = store.getAt(index);
                                                                if (subObjCompRecord) {
                                                                    subObjCompRecord.set(action, true);
                                                                } else {
                                                                    let newSubObjCompRecord = Ext.create(
                                                                        'Abraxa.model.permission.Permission',
                                                                        {
                                                                            slug: componentRec.get('slug'),
                                                                            object_id: me
                                                                                .upVM()
                                                                                .get(
                                                                                    'objectTabs.activeTab.object_record.object_id'
                                                                                ),
                                                                            role_id: me
                                                                                .upVM()
                                                                                .get('rolesGrid.selection.id'),
                                                                            sub_object_id:
                                                                                componentRec.get('sub_object_id'),
                                                                            edit: true,
                                                                            view: true,
                                                                        }
                                                                    );
                                                                    store.add(newSubObjCompRecord);
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        //we dont have record so we need to add it
                                                        let newRecord = {
                                                            slug: slug,
                                                            object_id: me
                                                                .upVM()
                                                                .get('objectTabs.activeTab.object_record.object_id'),
                                                            role_id: me.upVM().get('rolesGrid.selection.id'),
                                                            edit: true,
                                                            view: true,
                                                        };
                                                        activeObject.sub_objects().each(function (rec) {
                                                            let subObjComponents = rec.components(),
                                                                index = store.findBy(function (permRec) {
                                                                    return permRec.get('slug') == rec.get('slug');
                                                                }),
                                                                subObjRecord = store.getAt(index);
                                                            if (subObjRecord) {
                                                                subObjRecord.set(action, true);
                                                            } else {
                                                                let newSubObjRecord = Ext.create(
                                                                    'Abraxa.model.permission.Permission',
                                                                    {
                                                                        slug: rec.get('slug'),
                                                                        object_id: rec.get('object_id'),
                                                                        role_id: me
                                                                            .upVM()
                                                                            .get('rolesGrid.selection.id'),
                                                                        edit: true,
                                                                        view: true,
                                                                    }
                                                                );
                                                                store.add(newSubObjRecord);
                                                            }
                                                            //loop object components button and fields
                                                            subObjComponents.each(function (componentRec) {
                                                                let index = store.findBy(function (permRec) {
                                                                        return (
                                                                            permRec.get('slug') ==
                                                                            componentRec.get('slug')
                                                                        );
                                                                    }),
                                                                    subObjCompRecord = store.getAt(index);
                                                                if (subObjCompRecord) {
                                                                    subObjCompRecord.set(action, true);
                                                                } else {
                                                                    let newSubObjCompRecord = Ext.create(
                                                                        'Abraxa.model.permission.Permission',
                                                                        {
                                                                            slug: componentRec.get('slug'),
                                                                            object_id: me
                                                                                .upVM()
                                                                                .get(
                                                                                    'objectTabs.activeTab.object_record.object_id'
                                                                                ),
                                                                            role_id: me
                                                                                .upVM()
                                                                                .get('rolesGrid.selection.id'),
                                                                            sub_object_id:
                                                                                componentRec.get('sub_object_id'),
                                                                            edit: true,
                                                                            view: true,
                                                                        }
                                                                    );
                                                                    store.add(newSubObjCompRecord);
                                                                }
                                                            });
                                                        });
                                                    }
                                                } else {
                                                    //unchecked
                                                    //if we have record update it
                                                    if (record) {
                                                        let deleteSlug = slug + 'Delete';
                                                        if (record.get('slug') != deleteSlug) {
                                                            record.set(action, false);
                                                            //loop module object --- like ops disbursements documents etc
                                                            activeObject.sub_objects().each(function (rec) {
                                                                let subObjComponents = rec.components(),
                                                                    index = store.findBy(function (permRec) {
                                                                        return permRec.get('slug') == rec.get('slug');
                                                                    }),
                                                                    subObjRecord = store.getAt(index);
                                                                if (subObjRecord) {
                                                                    if (subObjRecord.get('slug') != deleteSlug)
                                                                        subObjRecord.set(action, false);
                                                                }
                                                                //loop object components button and fields
                                                                subObjComponents.each(function (componentRec) {
                                                                    let index = store.findBy(function (permRec) {
                                                                            return (
                                                                                permRec.get('slug') ==
                                                                                componentRec.get('slug')
                                                                            );
                                                                        }),
                                                                        subObjCompRecord = store.getAt(index);
                                                                    if (subObjCompRecord) {
                                                                        if (subObjCompRecord.get('slug') != deleteSlug)
                                                                            subObjCompRecord.set(action, false);
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: 24,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-info"><div class="h3 m-0">Delete</div><div class="text-info">{objectTexts.delete}</div></div>',
                                    },
                                },
                                {
                                    xtype: 'object.permissions.checkbox',
                                    ui: 'large',
                                    action: 'delete',
                                    bind: {
                                        disabled:
                                            '{(objectPermissionToggle.value && rolesGrid.selection.company_id != 0)  ? false : true}',
                                        slug: '{objectTabs.activeTab.object_record.object.slug}',
                                        toggleChecked: {
                                            bindTo: '{rolePermissions}',
                                            deep: true,
                                        },
                                    },
                                    listeners: {
                                        beforecheckchange: function (me, newValue) {
                                            let store = me.upVM().get('rolePermissions'),
                                                slug = me.getSlug(),
                                                deleteSlug = slug + Ext.String.capitalize(me.getAction());
                                            if (store) {
                                                let index = store.findBy(function (rec) {
                                                        return rec.get('slug') == slug;
                                                    }),
                                                    record = store.getAt(index);
                                                if (newValue) {
                                                    if (record) record.set(me.getAction(), true);
                                                    let index = store.findBy(function (rec) {
                                                            return rec.get('slug') == deleteSlug;
                                                        }),
                                                        deleteRecord = store.getAt(index);

                                                    if (deleteRecord) {
                                                        deleteRecord.set('edit', true);
                                                        deleteRecord.set('view', true);
                                                    } else {
                                                        let deleteRecord = Ext.create(
                                                            'Abraxa.model.permission.Permission',
                                                            {
                                                                slug: deleteSlug,
                                                                object_id: me
                                                                    .upVM()
                                                                    .get(
                                                                        'objectTabs.activeTab.object_record.object_id'
                                                                    ),
                                                                role_id: me.upVM().get('rolesGrid.selection.id'),
                                                                edit: true,
                                                                view: true,
                                                            }
                                                        );
                                                        store.add(deleteRecord);
                                                    }
                                                } else {
                                                    if (record) record.set(me.getAction(), false);
                                                    let index = store.findBy(function (permRec) {
                                                            return permRec.get('slug') == deleteSlug;
                                                        }),
                                                        deleteRecord = store.getAt(index);
                                                    if (deleteRecord) {
                                                        store.remove(deleteRecord);
                                                    }
                                                }
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '24 0 0 0',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Advanced permissions',
                            hidden: false,
                            bind: {
                                hidden: '{hideAdvancedPermissions}',
                                disabled: '{disableAdvancedPermissons}',
                            },
                            ui: 'normal small',
                            margin: '8 0 0 0',
                            height: 28,
                            handler: function (me) {
                                let currentUserPlan = me.upVM().get('currentUserPlan');
                                if (currentUserPlan == 'starter') {
                                    Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                } else {
                                    Ext.ComponentQuery.query('[cls~=role_settings]')[0].setHidden(true);
                                    Ext.ComponentQuery.query('[cls~=permission_settings]')[0].setHidden(false);
                                }
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
