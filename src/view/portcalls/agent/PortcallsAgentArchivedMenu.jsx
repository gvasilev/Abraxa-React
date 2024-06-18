Ext.define('Abraxa.view.portcalls.agent.PortcallsAgentArchivedMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcalls-agent-archived-menu',
    items: [
        {
            text: 'Export to PDF',
            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
            slug: 'portcallExportPDF',
            bind: {
                permission: '{userPermissions}',
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
                        },
                    });
                dialog.show();
            },
        },
        {
            text: 'Duplicate',
            iconCls: 'md-icon md-icon-content-copy',
            slug: 'portcallCreate',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    current_company_id = Ext.getCmp('main-viewport')
                        .getViewModel()
                        .get('currentUser')
                        .get('current_company_id'),
                    recordClone = record.clone(null),
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
                recordData.status_id = 1;
                recordData.is_archived = 0;
                recordData.archived_comment = null;
                recordData.watching = [];
                recordData.archived_reason = null;
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
            text: 'Restore',
            iconCls: 'md-icon md-icon-restore',
            slug: 'portcallGridRestore',
            bind: {
                hidden: '{portcall.is_archived && !portcall.parent_id ? false : true}',
                permission: '{userPermissions}',
            },
            handler: function () {
                let vm = this.lookupViewModel(),
                    record = vm.get('portcall'),
                    call_from_grid = vm.get('call_from_grid'),
                    container = this.find('agentCloseRightContainer'),
                    myTasks = Ext.getCmp('main-viewport').getVM().get('myTasks'),
                    taskStore = Ext.getStore('tasks'),
                    accountStore = Ext.getStore('accounts'),
                    disbursementStore = Ext.getStore('disbursements'),
                    paymentStore = Ext.getStore('payments'),
                    store = vm.get('portcalls');

                Ext.Msg.confirm(
                    'Restore port call',
                    '<div class="pl-48"><strong>Are you sure you want to restore the portcall?</strong></div>',
                    function (btn) {
                        if (btn === 'yes') {
                            record.set('is_archived', 0);
                            record.set('canceled_reason', null);
                            record.set('canceled_comment', null);
                            record.save({
                                success: function (batch) {
                                    Ext.toast('Record updated', 1000);
                                    if (container) container.hide();

                                    if (store) {
                                        record.load();
                                        store.remove(record);
                                        store.commitChanges(true);
                                    }

                                    if (myTasks) myTasks.reload();
                                    if (taskStore) taskStore.reload();
                                    if (accountStore) accountStore.reload();
                                    if (disbursementStore) disbursementStore.reload();
                                    if (paymentStore) paymentStore.reload();
                                    if (!call_from_grid) record.load();
                                },
                                failure: function (batch) {},
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
                            ui: 'action',
                            text: 'Restore',
                            separator: true,
                        },
                    ],
                    '<div class="a-badge a-badge-default mr-16 my-8"><i class="material-icons-outlined">settings_backup_restore</i></div>'
                );
            },
        },
        {
            text: 'Delete',
            slug: 'portcallDelete',
            ui: 'decline',
            separator: true,
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon md-icon-outlined md-icon-delete',

            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('portcall'),
                    call_from_grid = vm.get('call_from_grid'),
                    portcalls_archived = vm.get('portcalls'),
                    recentlyOpened = vm.get('recentlyOpened'),
                    container = Ext.ComponentQuery.query('[xtype=portcalls\\.right\\.card]')[0],
                    is_archived = vm.get('is_archived');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you want to permanently delete the portcall?',
                    function (answer) {
                        if (answer == 'yes') {
                            if (call_from_grid) {
                                if (is_archived) {
                                    portcalls_archived.remove(record);
                                    portcalls_archived.sync({
                                        success: function () {
                                            container.hide();
                                            recentlyOpened.reload();
                                            Ext.toast('Record deleted', 2500);
                                        },
                                    });
                                } else {
                                    portcalls_archived.remove(record);
                                    portcalls_archived.sync({
                                        success: function () {
                                            container.hide();
                                            recentlyOpened.reload();
                                            Ext.toast('Record deleted', 2500);
                                        },
                                    });
                                }
                            } else {
                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'portcall/' + record.get('id'),
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': null,
                                    },
                                    success: function (response) {
                                        Ext.toast('Record deleted', 2500);
                                        if (portcalls_archived) {
                                            portcalls_archived.remove(record);
                                            portcalls.archived.commitChanges();
                                        }
                                        recentlyOpened.reload();
                                        Ext.getCmp('main-viewport').getController().redirectTo('portcalls');
                                    },
                                });
                            }
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
                            ui: 'decline alt',
                            text: 'Delete',
                        },
                    ]
                );
            },
        },
    ],
});
