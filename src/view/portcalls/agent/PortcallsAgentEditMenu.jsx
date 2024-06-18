Ext.define('Abraxa.view.portcalls.agent.PortcallsAgentEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcalls.agent.edit.menu',
    cls: 'a-main-edit-menu',
    width: 235,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Duplicate',
            testId: 'portcallsAgentEditMenuDuplicateButton',
            iconCls: 'md-icon md-icon-content-copy',
            slug: 'portcallCreate',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    recordClone = record.clone(null),
                    current_company_id = Ext.getCmp('main-viewport')
                        .getViewModel()
                        .get('currentUser')
                        .get('current_company_id'),
                    recordData = recordClone.getData(),
                    voyage_data = record.getVoyage().getData(),
                    nominationData = record.getNomination().getData(),
                    instruction = record.getInstruction() ? record.getInstruction().getData() : null,
                    container = this.find('agentActiveRightContainer'),
                    cargoStore = record.cargoes(),
                    distribution_groups = record.distribution_groups(),
                    distribution_data = [],
                    cargoes = [];
                delete recordData['id'];
                delete recordData['port_function'];
                delete voyage_data['id'];
                delete voyage_data['file_id'];
                delete nominationData['id'];
                if (instruction) delete instruction['id'];

                recordData.port_ata = null;
                recordData.port_eta = null;
                recordData.port_etd = null;
                recordData.port_atd = null;
                recordData.watching = [];
                recordData.last_published = null;
                recordData.reference_number = null;
                recordData.company_id = current_company_id;

                cargoStore.each(function (record) {
                    let cargo = record.getData();
                    cargoes.push(cargo);
                });
                distribution_groups.each(function (record) {
                    let distribution_group = record.getData();
                    distribution_data.push(distribution_group);
                });

                let newRecord = new Abraxa.model.portcall.Portcall(Object.assign({}, recordData));
                let voyage = new Abraxa.model.voyage.Voyage(Object.assign({}, voyage_data));
                let nomination = new Abraxa.model.nomination.Nomination(Object.assign({}, nominationData));
                let newInstruction = new Abraxa.model.portcall.Instruction(Object.assign({}, instruction));
                newRecord.cargoes().setData(cargoes);
                newRecord.distribution_groups().setData(distribution_data);
                newRecord.setVoyage(voyage);
                newRecord.setNomination(nomination);
                newRecord.setInstruction(newInstruction);
                newRecord.set('associated', false);
                if (container) {
                    container.hide();
                }
                Ext.create('Abraxa.view.portcalls.CreatePortcall', {
                    header: {
                        bind: {
                            title: '{headerTitle}',
                        },
                    },
                    viewModel: {
                        parent: vm,
                        stores: {
                            files: Ext.create('Ext.data.Store'),
                            templates: {
                                type: 'templates',
                                autoLoad: false,
                            },
                            taskTemplates: {
                                source: '{templates}',
                                filters: [
                                    {
                                        property: 'type',
                                        operator: '=',
                                        value: 'task',
                                        exactMatch: true,
                                    },
                                ],
                            },
                            sofTemplates: {
                                source: '{templates}',
                                filters: [
                                    {
                                        property: 'type',
                                        operator: '=',
                                        value: 'sof',
                                        exactMatch: true,
                                    },
                                ],
                            },
                            disbursementTemplates: {
                                source: '{templates}',
                                filters: [
                                    {
                                        property: 'type',
                                        operator: '=',
                                        value: 'disbursement',
                                        exactMatch: true,
                                    },
                                ],
                            },
                        },
                        data: {
                            object_id: 3,
                            editMode: false,
                            visibleInstruction: false,
                            visibleTemplates: false,
                            visibleDistriGroups: false,
                            organizations: vm.get('organizations'),
                            portcalls: vm.get('portcalls'),
                            object_record: newRecord,
                            voyage_data: newRecord.getVoyage(),
                            nomination: newRecord.getNomination(),
                            instruction: newRecord.getInstruction(),
                            hubStructure: false,
                            fromPortcall: true,
                        },
                        formulas: {
                            showInstructions: {
                                bind: {
                                    bindTo: '{instructions.text}',
                                    deep: true,
                                },
                                get: function (text) {
                                    if (text && text.length > 0) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                },
                            },
                            showFiles: {
                                bind: {
                                    filesCount: '{files.count}',
                                    editMode: '{editMode}',
                                },
                                get: function (data) {
                                    if (data) {
                                        if (data.editMode) {
                                            return true;
                                        } else {
                                            if (data.filesCount === 0) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    }
                                },
                            },
                            assignedToImage: {
                                bind: {
                                    bindTo: '{usersCombo.selection}',
                                    deep: true,
                                },
                                get: function (selection) {
                                    if (selection) {
                                        if (selection.get('profile_image')) {
                                            let userImage = selection.get('profile_image');
                                            return (
                                                '<div class="a-person a-icon-round">' +
                                                '<img class="a-profile-image a-user" src="' +
                                                userImage +
                                                '" width="24" alt="" />' +
                                                '</div>'
                                            );
                                        } else {
                                            return (
                                                '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                                                selection.get('first_name')[0] +
                                                selection.get('last_name')[0] +
                                                '</span></div>'
                                            );
                                        }
                                    }
                                    return '<div class="a-field-icon icon-person icon-rounded"><div class="x-before-input-el"></div></div>';
                                },
                            },
                            headerTitle: {
                                bind: {
                                    instructions: '{visibleInstruction}',
                                    templates: '{visibleTemplates}',
                                    dist_group: '{visibleDistriGroups}',
                                },
                                get: function (data) {
                                    if (data) {
                                        if (data.instructions) {
                                            return '<span class="a-dialog-instructions-title">Voyage instructions</span>';
                                        }
                                        if (data.templates) {
                                            return '<span class="a-dialog-instructions-title">Templates</span>';
                                        }
                                        if (data.dist_group) {
                                            return '<span class="a-dialog-instructions-title">Distribution groups</span>';
                                        }
                                    }
                                    return '<div class="a-badge a-badge-portcall"><i class="md-icon-business-center md-icon-outlined"></i></div>Create Port call';
                                },
                            },
                            distribution_groups: {
                                bind: {
                                    bindTo: '{object_record.distribution_groups}',
                                    deep: true,
                                },
                                get: function (store) {
                                    return store;
                                },
                            },
                            dragListeners: {
                                bind: {
                                    bindTo: '{userPermissions}',
                                    deeP: true,
                                },
                                get: function (store) {
                                    if (store && Object.keys(store).length > 0) {
                                        let record = store['portcallDocumentUpload'];
                                        if (record && record.edit) {
                                            return {
                                                element: 'element',
                                                drop: 'onDrop',
                                                dragleave: 'onDragLeaveListItem',
                                                dragover: 'onDragOverListItem',
                                            };
                                        } else {
                                            return {};
                                        }
                                    } else {
                                        return {};
                                    }
                                },
                            },
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Assign to',
            testId: 'portcallsAgentEditMenuAssignToButton',
            iconCls: 'md-icon-outlined md-icon-person',
            slug: 'portcallAssignTo',
            hidden: true,
            bind: {
                permission: '{userPermissions}',
                hidden: '{portcall.company_id != currentUser.current_company_id ? true : false}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    store = vm.get('portcalls');
                Ext.create('Abraxa.view.inquiries.InquiriesAssignTo', {
                    viewModel: {
                        parent: vm,
                        data: {
                            portcall: record,
                            store: store,
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Export to PDF',
            testId: 'portcallsAgentEditMenuExportToPDFButton',
            slug: 'portcallExportPDF',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    dialog = Ext.create('Abraxa.view.common.dialog.common.ExportSectionsDialog', {
                        viewModel: {
                            parent: vm,
                            data: {
                                record: record,
                            },
                        },
                    });
                mixpanel.track('Main export – 3 dots in the prigrid');
                dialog.show();
            },
        },
        // {
        //     text: 'Audit trail',
        //     testId: 'portcallsAgentEditMenuAuditTrailButton',
        //     iconCls: 'md-icon-outlined md-icon-history',
        //     // html: '<span style="margin-right: 12px; color: #FFB74D;"><i class="far fa-gem"></i></span>',
        //     handler: function () {
        //         Ext.create('Abraxa.view.main.ComingSoonDialog').show();
        //     },
        // },
        {
            text: 'Associated port call',
            testId: 'portcallsAgentEditMenuAssociatedPortCallButton',
            iconCls: 'md-icon md-icon-add',
            slug: 'portcallCreate',
            separator: true,
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    recordClone = record.clone(null),
                    current_company_id = Ext.getCmp('main-viewport')
                        .getViewModel()
                        .get('currentUser')
                        .get('current_company_id'),
                    recordData = recordClone.getData(),
                    voyage_data = record.getVoyage().getData(),
                    nominationData = record.getNomination().getData(),
                    instruction = record.getInstruction() ? record.getInstruction().getData() : null,
                    container = this.find('agentActiveRightContainer'),
                    cargoStore = record.cargoes(),
                    distribution_groups = record.distribution_groups(),
                    distribution_data = [],
                    cargoes = [];
                delete recordData['id'];
                delete recordData['port_function'];
                delete voyage_data['id'];
                delete nominationData['id'];
                if (instruction) delete instruction['id'];

                recordData.port_ata = null;
                recordData.port_eta = null;
                recordData.port_etd = null;
                recordData.port_atd = null;
                recordData.watching = [];
                recordData.last_published = null;
                recordData.reference_number = null;
                recordData.company_id = current_company_id;

                cargoStore.each(function (record) {
                    let cargo = record.getData();
                    cargoes.push(cargo);
                });
                distribution_groups.each(function (record) {
                    let distribution_group = record.getData();
                    distribution_data.push(distribution_group);
                });

                let newRecord = new Abraxa.model.portcall.Portcall(Object.assign({}, recordData));
                let voyage = new Abraxa.model.voyage.Voyage(Object.assign({}, voyage_data));
                let nomination = new Abraxa.model.nomination.Nomination(Object.assign({}, nominationData));
                let newInstruction = new Abraxa.model.portcall.Instruction(Object.assign({}, instruction));
                newRecord.cargoes().setData(cargoes);
                newRecord.distribution_groups().setData(distribution_data);
                newRecord.setVoyage(voyage);
                newRecord.setNomination(nomination);
                newRecord.setInstruction(newInstruction);
                newRecord.set('file_id', null);
                newRecord.set('associated', true);
                if (container) {
                    container.hide();
                }
                Ext.create('Abraxa.view.portcalls.CreatePortcall', {
                    header: {
                        bind: {
                            title: '{headerTitle}',
                        },
                    },
                    viewModel: {
                        parent: vm,
                        stores: {
                            files: Ext.create('Ext.data.Store'),
                            templates: {
                                type: 'templates',
                                autoLoad: false,
                            },
                            taskTemplates: {
                                source: '{templates}',
                                filters: [
                                    {
                                        property: 'type',
                                        operator: '=',
                                        value: 'task',
                                        exactMatch: true,
                                    },
                                ],
                            },
                            sofTemplates: {
                                source: '{templates}',
                                filters: [
                                    {
                                        property: 'type',
                                        operator: '=',
                                        value: 'sof',
                                        exactMatch: true,
                                    },
                                ],
                            },
                            disbursementTemplates: {
                                source: '{templates}',
                                filters: [
                                    {
                                        property: 'type',
                                        operator: '=',
                                        value: 'disbursement',
                                        exactMatch: true,
                                    },
                                ],
                            },
                        },
                        data: {
                            object_id: 3,
                            editMode: false,
                            visibleInstruction: false,
                            visibleTemplates: false,
                            visibleDistriGroups: false,
                            organizations: vm.get('organizations'),
                            portcalls: vm.get('portcalls'),
                            object_record: newRecord,
                            voyage_data: newRecord.getVoyage(),
                            nomination: newRecord.getNomination(),
                            instruction: newRecord.getInstruction(),
                            hubStructure: false,
                            fromPortcall: true,
                            associated: true,
                        },
                        formulas: {
                            showInstructions: {
                                bind: {
                                    bindTo: '{instructions.text}',
                                    deep: true,
                                },
                                get: function (text) {
                                    if (text && text.length > 0) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                },
                            },
                            showFiles: {
                                bind: {
                                    filesCount: '{files.count}',
                                    editMode: '{editMode}',
                                },
                                get: function (data) {
                                    if (data) {
                                        if (data.editMode) {
                                            return true;
                                        } else {
                                            if (data.filesCount === 0) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    }
                                },
                            },
                            assignedToImage: {
                                bind: {
                                    bindTo: '{usersCombo.selection}',
                                    deep: true,
                                },
                                get: function (selection) {
                                    if (selection) {
                                        if (selection.get('profile_image')) {
                                            let userImage = selection.get('profile_image');
                                            return (
                                                '<div class="a-person a-icon-round">' +
                                                '<img class="a-profile-image a-user" src="' +
                                                userImage +
                                                '" width="24" alt="" />' +
                                                '</div>'
                                            );
                                        } else {
                                            return (
                                                '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                                                selection.get('first_name')[0] +
                                                selection.get('last_name')[0] +
                                                '</span></div>'
                                            );
                                        }
                                    }
                                    return '<div class="a-field-icon icon-person icon-rounded"><div class="x-before-input-el"></div></div>';
                                },
                            },
                            headerTitle: {
                                bind: {
                                    instructions: '{visibleInstruction}',
                                    templates: '{visibleTemplates}',
                                    dist_group: '{visibleDistriGroups}',
                                },
                                get: function (data) {
                                    if (data) {
                                        if (data.instructions) {
                                            return '<span class="a-dialog-instructions-title">Voyage instructions</span>';
                                        }
                                        if (data.templates) {
                                            return '<span class="a-dialog-instructions-title">Templates</span>';
                                        }
                                        if (data.dist_group) {
                                            return '<span class="a-dialog-instructions-title">Distribution groups</span>';
                                        }
                                    }
                                    return '<div class="a-badge a-badge-portcall"><i class="md-icon-business-center md-icon-outlined"></i></div>Create Port call';
                                },
                            },
                            distribution_groups: {
                                bind: {
                                    bindTo: '{object_record.distribution_groups}',
                                    deep: true,
                                },
                                get: function (store) {
                                    return store;
                                },
                            },
                            dragListeners: {
                                bind: {
                                    bindTo: '{userPermissions}',
                                    deeP: true,
                                },
                                get: function (store) {
                                    if (store && Object.keys(store).length > 0) {
                                        let record = store['portcallDocumentUpload'];
                                        if (record && record.edit) {
                                            return {
                                                element: 'element',
                                                drop: 'onDrop',
                                                dragleave: 'onDragLeaveListItem',
                                                dragover: 'onDragOverListItem',
                                            };
                                        } else {
                                            return {};
                                        }
                                    } else {
                                        return {};
                                    }
                                },
                            },
                        },
                    },
                }).show();
            },
        },
        {
            separator: true,
            text: 'Archive',
            testId: 'portcallsAgentEditMenuArchiveButton',
            iconCls: 'md-icon-outlined md-icon-archive',
            slug: 'portcallArchive',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    container = this.find('agentActiveRightContainer'),
                    call_from_grid = vm.get('call_from_grid');

                Ext.create('Abraxa.view.portcalls.agent.PortcallsAgentArchive', {
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
            testId: 'portcallsAgentEditMenuDeleteButton',
            iconCls: 'md-icon-outlined md-icon-delete',
            slug: 'portcallDelete',
            ui: 'decline',
            bind: {
                permission: '{userPermissions}',
            },
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
                        formulas: {
                            showWarning: {
                                bind: {
                                    bindTo: '{record.members}',
                                    deep: true,
                                },
                                get: function (store) {
                                    if (store && store.getCount() > 1) {
                                        return false;
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                }).show();
                // Ext.Msg.confirm('Delete', 'Are you sure you want to permanently delete this Portcall?', function (btn) {
                //     if (btn === 'yes') {
                //         if (call_from_grid) {
                //             if (is_archived) {
                //                 portcalls_archived.remove(record);
                //                 portcalls_archived.sync({
                //                     success: function () {
                //                         recentlyOpened.reload();
                //                         container.hide();
                //                         Ext.toast('Record deleted', 2500);
                //                     }
                //                 });
                //             } else {
                //                 portcalls.remove(record);
                //                 portcalls.sync({
                //                     success: function () {
                //                         recentlyOpened.reload();
                //                         container.hide();
                //                         Ext.toast('Record deleted', 2500);
                //                     }
                //                 });
                //             }
                //         } else {
                //             Ext.Ajax.request({
                //                 url: Env.ApiEndpoint + 'portcall/' + record.get('id'),
                //                 method: 'DELETE',
                //                 headers: {
                //                     'Content-Type': null
                //                 },
                //                 success: function (response) {
                //                     recentlyOpened.reload();
                //                     Ext.toast('Record deleted', 2500);
                //                     window.location.hash = 'portcalls';
                //                 },
                //             });
                //         }
                //     }
                // });
            },
        },
    ],
});
