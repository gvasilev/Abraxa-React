Ext.define('Abraxa.view.settings.users_teams.roles.RoleDetails', {
    extend: 'Ext.Container',
    xtype: 'usersettings.roledetails',
    hidden: true,
    scrollable: true,
    margin: 0,
    cls: 'needs_hide',
    flex: 1,
    itemId: 'rolesDetalsContainer',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        stores: {
            permissions: {
                type: 'permissions',
            },
        },
        formulas: {
            rolePermissions: {
                bind: {
                    bindTo: '{rolesGrid.selection.id}',
                    deep: true,
                },
                get: function (id) {
                    if (id && !this.getView().isHidden()) {
                        let permissions = this.get('permissions');
                        permissions.getProxy().setExtraParams({
                            role_id: id,
                        });
                        permissions.load();
                        return permissions;
                    }
                },
            },
            storeNeedsSync: {
                bind: {
                    bindTo: '{rolePermissions}',
                    deep: true,
                },
                get: function (store) {
                    if (store && (store.getModifiedRecords().length > 0 || store.getRemovedRecords().length > 0))
                        return false;

                    return true;
                },
            },
            disableAdvancedPermissons: {
                bind: {
                    bindTo: '{rolePermissions}',
                    deep: true,
                },
                get: function (store) {
                    let objectRecord = this.get('objectTabs.activeTab.object_record.object');
                    if (objectRecord && store) {
                        var slug = objectRecord.get('slug'),
                            index = store.findBy(function (rec) {
                                return rec.get('slug') == slug;
                            }),
                            record = store.getAt(index);
                        if (record) {
                            return false;
                        }
                    }
                    return true;
                },
            },
            objectTexts: {
                bind: {
                    bindTo: '{objectTabs.activeTab.object_record.object.id}',
                    deep: true,
                },
                get: function (id) {
                    let texts = {};
                    if (id) {
                        switch (id) {
                            case 1: //settings
                                texts.title = 'Manage access to your admin panel settings.';
                                texts.create = 'Allow users to create or duplicate existing data.';
                                texts.edit = 'Allow users to change details and properties.';
                                texts.delete = 'Allow users to delete relevant data.';
                                break;
                            case 2: //cdb
                                texts.title = 'Manage access to your customer database.';
                                texts.create = 'Allow users to create or duplicate existing data.';
                                texts.edit = 'Allow users to change details and properties.';
                                texts.delete = 'Allow users to delete relevant data.';
                                break;
                            case 3: //portcall
                                texts.title = 'Manage access to the right set of port call information.';
                                texts.create = 'Allow users to create new port calls and duplicate existing ones.';
                                texts.edit = 'Allow users to change all details and properties of a port call.';
                                texts.delete = 'Allow users to delete port calls and relevant data.';
                                break;
                            case 4: //task manager
                                texts.title = 'Manage access to your task manager.';
                                texts.create = 'Allow users to create or duplicate existing data.';
                                texts.edit = 'Allow users to change details and properties.';
                                texts.delete = 'Allow users to delete relevant data.';
                                break;
                            case 5: //dashboard
                                texts.title = 'Manage access to your main dashboard stats.';
                                texts.create = 'Allow users to create or duplicate existing data.';
                                texts.edit = 'Allow users to change details and properties.';
                                texts.delete = 'Allow users to delete relevant data.';
                                break;
                            default:
                                texts.title = 'Powerful reporting & collaboration tools made for port agents.';
                                texts.create =
                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.';
                                texts.edit = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.';
                                texts.delete =
                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.';
                                break;
                        }
                    }
                    return texts;
                },
            },
            hideAdvancedPermissions: {
                bind: {
                    bindTo: '{objectTabs.activeTab.object_record.object}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.sub_objects() && record.sub_objects().getCount() > 0) {
                        return false;
                    }
                    return true;
                },
            },
        },
    },
    items: [
        {
            xtype: 'usersettings.rolesettings',
            flex: 1,
        },
        {
            xtype: 'usersettings.permission.settings',
            hidden: true,
        },
        {
            xtype: 'toolbar',
            // docked: 'bottom',
            items: [
                '->',
                {
                    xtype: 'button',
                    ui: 'action',
                    text: 'Save',
                    bind: {
                        hidden: '{rolesGrid.selection.company_id != 0 ? false:true}',
                        disabled: '{storeNeedsSync}',
                    },
                    handler: function () {
                        let vm = this.upVM(),
                            permissions = vm.get('permissions'),
                            currentObject = vm.get('objectTabs.activeTab.object_record.object'),
                            removeSlug = vm.get('removeSlug') ? vm.get('removeSlug') : null;
                        if (removeSlug) {
                            Ext.Msg.confirm(
                                'Confirmation',
                                'Are you sure you would like to turn off this module?<br>All settings will be permanently deleted.',
                                function (answer) {
                                    if (answer == 'yes') {
                                        let allPermissions = permissions.queryRecords(
                                            'object_id',
                                            currentObject.get('id')
                                        );
                                        permissions.remove(allPermissions);
                                        permissions.sync({
                                            success: function () {
                                                vm.set('removeSlug', null);
                                                Ext.toast('Record updated');
                                            },
                                            failure: function () {
                                                Ext.Msg.alert('Something went wrong', 'Could not update record.');
                                            },
                                        });
                                    }
                                },
                                this,
                                [
                                    {
                                        xtype: 'button',
                                        itemId: 'no',
                                        margin: '0 8 0 0',
                                        text: 'Cancel',
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'yes',
                                        enableToggle: true,
                                        ui: 'action loading',
                                        text: 'Yes',
                                    },
                                ]
                            );
                        } else {
                            permissions.sync({
                                success: function () {
                                    Ext.toast('Record updated');
                                },
                                failure: function () {
                                    Ext.Msg.alert('Something went wrong', 'Could not update record.');
                                },
                            });
                        }
                    },
                },
            ],
        },
    ],
});
