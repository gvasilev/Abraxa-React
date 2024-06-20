import '../../portcall/PortcallDeleteDialog';

Ext.define('Abraxa.view.portcalls.principal.PortcallsPrincipalEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcalls.principal.edit.menu',
    cls: 'a-main-edit-menu',
    width: 220,
    maxHeight: 220,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Assigned to',
            iconCls: 'md-icon-outlined md-icon-person',
            slug: 'portcallAssignTo',
            bind: {
                hidden: '{portcall.company_id != currentUser.current_company_id ? true : false}',
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall');
                Ext.create('Abraxa.view.portcalls.principal.PortcallsPrincipalAssignTo', {
                    viewModel: {
                        parent: vm,
                        data: {
                            portcall: record,
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Export to PDF',
            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
            slug: 'portcallExportPDF',
            bind: {
                permission: '{userPermissions}',
                hidden: '{portcall.is_limited}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    dialog = Ext.create('Abraxa.view.common.dialog.common.ExportSectionsDialog', {
                        viewModel: {
                            parent: vm,
                            data: {
                                record: record,
                            },
                            formulas: {
                                member: {
                                    bind: {
                                        bindTo: '{record.members}',
                                        deep: true,
                                    },
                                    get: function (store) {
                                        if (store) {
                                            let currentUser = this.get('currentUser'),
                                                mainVM = Ext.getCmp('main-viewport').getVM();

                                            let member = store.queryBy(function (rec, id) {
                                                return rec.get('tenant_id') == currentUser.get('current_company_id');
                                            }).items[0];

                                            // if (member && mainVM.get(''))
                                            //     mainVM.set('activePortcallTab', 0);

                                            let masked = Ext.ComponentQuery.query('[cls~=mask_container]');
                                            if (masked) {
                                                Ext.each(masked, function (mask) {
                                                    mask.hide();
                                                });
                                            }

                                            return member;
                                        }
                                    },
                                },
                                portcallPermissions: {
                                    bind: {
                                        bindTo: '{member}',
                                        deep: true,
                                    },
                                    get: function (member) {
                                        if (member) {
                                            let permissions = member.permissions(),
                                                object_permissions = {};
                                            permissions.each(function (record) {
                                                let slug = record.get('sub_object_slug');
                                                object_permissions[slug] = {
                                                    can_edit: record.get('can_edit'),
                                                };
                                            });
                                            return this.set('objectPermissions', object_permissions);
                                        } else {
                                            return;
                                        }
                                    },
                                },
                            },
                        },
                    });
                mixpanel.track('Main export – 3 dots in the prigrid');
                dialog.show();
            },
        },
        {
            separator: true,
            iconCls: 'md-icon-outlined md-icon-archive',
            text: 'Archive',
            slug: 'portcallArchive',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    container = this.find('principalActiveRightContainer'),
                    call_from_grid = vm.get('call_from_grid');
                Ext.create('Abraxa.view.portcalls.principal.PortcallsPrincipalArchive', {
                    viewModel: {
                        parent: vm,
                        data: {
                            record: record,
                            call_from_grid: call_from_grid,
                            container: container,
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Delete',
            slug: 'portcallDelete',
            ui: 'decline',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    call_from_grid = vm.get('call_from_grid'),
                    portcalls = vm.get('portcalls'),
                    recentlyOpened = vm.get('recentlyOpened'),
                    container = this.find('agentActiveRightContainer'),
                    portcalls_archived = vm.get('portcallsArchived'),
                    is_archived = vm.get('is_archived');
                Ext.create('Abraxa.view.portcall.PortcallDeleteDialog', {
                    viewModel: {
                        data: {
                            record: record,
                            portcalls: portcalls,
                            recentlyOpened: recentlyOpened,
                            call_from_grid: call_from_grid,
                        },
                    },
                }).show();
            },
        },
    ],
});
