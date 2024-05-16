import '../InquiryAssingTo';
import '../InquiryArchive';

Ext.define('Abraxa.view.inquiry.agent.InquiryEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'inquiry.edit.menu',
    cls: 'a-main-edit-menu',
    width: 220,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Duplicate',
            testId: 'duplicateInquiryEditMenuButton',
            iconCls: 'md-icon md-icon-content-copy',
            bind: {
                hidden: '{inquiry.is_archived ? true:false}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry'),
                    recordClone = record.clone(null),
                    current_company_id = Ext.getCmp('main-viewport')
                        .getViewModel()
                        .get('currentUser')
                        .get('current_company_id'),
                    recordData = recordClone.getData(),
                    voyage_data = record.getVoyage().getData(),
                    instruction = record.getInstruction() ? record.getInstruction().getData() : null,
                    portsStore = record.ports(),
                    cargoStore = record.cargoes(),
                    ports = [],
                    cargoes = [];
                delete recordData['id'];
                delete recordData['port_function'];
                delete recordData['inquiry_id'];
                delete voyage_data['id'];
                if (instruction) delete instruction['id'];
                recordData.watching = [];
                recordData.company_id = current_company_id;
                voyage_data.vessel_id = voyage_data.vessel.id;

                portsStore.each(function (record) {
                    ports.push(record.getData());
                });

                cargoStore.each(function (record) {
                    let cargo = record.getData();
                    cargo.quantity = parseInt(cargo.quantity);
                    cargoes.push(cargo);
                });

                let newRecord = new Abraxa.model.inquiry.Inquiry(Object.assign({}, recordData));
                let voyage = new Abraxa.model.voyage.Voyage(Object.assign({}, voyage_data));
                let newInstruction = new Abraxa.model.portcall.Instruction(Object.assign({}, instruction));
                newRecord.cargoes().setData(cargoes);
                newRecord.ports().setData(ports);
                newRecord.setVoyage(voyage);
                newRecord.setInstruction(newInstruction);
                Ext.create('Abraxa.view.inquiry.forms.CreateInquiry', {
                    header: {
                        bind: {
                            title: '{headerTitle}',
                        },
                    },
                    viewModel: {
                        parent: vm,
                        stores: {
                            suggestedOrganizations: Ext.create('Ext.data.Store'),
                            files: Ext.create('Ext.data.Store'),
                            additionalPortsFiltered: {
                                source: '{object_record.ports}',
                                filters: '{additionalPortFilter}',
                            },
                        },
                        data: {
                            object_id: 6,
                            editMode: false,
                            visibleInstruction: false,
                            visibleTemplates: false,
                            object_record: newRecord,
                            voyage_data: newRecord.getVoyage(),
                            instruction: newRecord.getInstruction(),
                        },
                        formulas: {
                            firstPort: {
                                bind: {
                                    bindTo: '{object_record.ports}',
                                    deep: true,
                                },
                                get: function (store) {
                                    if (store && store.getCount()) {
                                        return store.first();
                                    }
                                },
                            },
                            additionalPortFilter: {
                                bind: {
                                    bindTo: '{firstPort}',
                                    deep: true,
                                },
                                get: function (record) {
                                    if (record) {
                                        let store = this.get('additionalPortsFiltered');
                                        if (store) store.clearFilter();
                                        return function (rec) {
                                            if (rec.get('id') != record.get('id')) {
                                                return true;
                                            }
                                        };
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
                            dragListeners: {
                                bind: {
                                    bindTo: '{userPermissions}',
                                    deeP: true,
                                },
                                get: function (store) {
                                    return {
                                        element: 'element',
                                        drop: 'onDrop',
                                        dragleave: 'onDragLeaveListItem',
                                        dragover: 'onDragOverListItem',
                                    };
                                },
                            },
                            headerTitle: {
                                bind: {
                                    instructions: '{visibleInstruction}',
                                },
                                get: function (data) {
                                    if (data) {
                                        if (data.instructions) {
                                            return '<span class="a-dialog-instructions-title">Voyage instructions</span>';
                                        }
                                    }
                                    return '<div class="a-badge a-badge-enquiry"><i class="md-icon-outlined">live_help</i></div>Create enquiry';
                                },
                            },
                            suggestedOrganizationsRequest: {
                                bind: {
                                    bindTo: '{object_record.port_id}',
                                },
                                get: async function (port_id) {
                                    let vm = this,
                                        filter = [
                                            {
                                                property: 'port_id',
                                                value: port_id,
                                                operator: '=',
                                            },
                                        ];
                                    if (port_id) {
                                        Ext.Ajax.request({
                                            url: Env.ApiEndpoint + 'suggested-organizations',
                                            method: 'GET',
                                            params: {
                                                filter: JSON.stringify(filter),
                                            },
                                            success: function (response) {
                                                if (response) {
                                                    vm.get('suggestedOrganizations').add(
                                                        Ext.decode(response.responseText)
                                                    );
                                                }
                                            },
                                            failure: function failure(response) {},
                                        });
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
            testId: 'inquiryEditMenuAssignToButton',
            iconCls: 'md-icon-outlined md-icon-person',
            slug: 'portcallAssignTo',
            bind: {
                permission: '{userPermissions}',
                hidden: '{inquiry.is_archived ? true:false}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry'),
                    store = vm.get('inquiries');
                Ext.create('Abraxa.view.inquiry.InquiryAssingTo', {
                    viewModel: {
                        parent: vm,
                        data: {
                            inquiry: record,
                            store: store,
                        },
                    },
                }).show();
            },
        },
        {
            separator: true,
            text: 'Archive',
            testId: 'inquiryEditMenuArchiveButton',
            iconCls: 'md-icon-outlined md-icon-archive',
            bind: {
                permission: '{userPermissions}',
                hidden: '{inquiry.is_archived ? true:false}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry'),
                    container = this.find('agentActiveRightContainer'),
                    call_from_grid = vm.get('call_from_grid');
                Ext.create('Abraxa.view.inquiry.InquiryArchive', {
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
            text: 'Restore',
            iconCls: 'md-icon md-icon-restore',
            bind: {
                hidden: '{inquiry.is_archived ? false : true}',
            },
            handler: function () {
                let vm = this.lookupViewModel(),
                    record = vm.get('inquiry'),
                    call_from_grid = vm.get('call_from_grid'),
                    myTasks = Ext.getCmp('main-viewport').getVM().get('myTasks'),
                    taskStore = Ext.getStore('tasks'),
                    estimateStore = Ext.getStore('inquiriesPdas'),
                    store = vm.get('inquiries');

                Ext.Msg.confirm(
                    'Restore enquiry',
                    '<div class="pl-48"><strong>Are you sure you want to restore the inquiry?</strong></div>',
                    function (btn) {
                        if (btn === 'yes') {
                            record.set('is_archived', 0);
                            record.set('archived_reason', null);
                            record.set('status', 1);
                            record.save({
                                success: function (batch) {
                                    Ext.toast('Record updated', 1000);
                                    if (store) store.remove(record);
                                    store.commitChanges();
                                    if (myTasks) myTasks.reload();
                                    if (taskStore) taskStore.reload();
                                    if (estimateStore) estimateStore.reload();
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
            testId: 'inquiryEditMenuDeleteButton',
            iconCls: 'md-icon-outlined md-icon-delete',
            slug: 'portcallDelete',
            ui: 'decline',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry'),
                    call_from_grid = vm.get('call_from_grid'),
                    inquiries = vm.get('inquiries'),
                    recentlyOpened = vm.get('recentlyOpened'),
                    estimateStore = Ext.getStore('inquiriesPdas'),
                    container = this.find('inquiryRightContainer'),
                    portcalls_archived = vm.get('portcallsArchived'),
                    is_archived = vm.get('is_archived');
                // Ext.create('Abraxa.view.portcall.PortcallDeleteDialog', {
                //     viewModel: {
                //         data: {
                //             record: record,
                //             portcalls: portcalls,
                //             recentlyOpened: recentlyOpened,
                //             call_from_grid: call_from_grid,
                //         },
                //         formulas: {
                //             showWarning: {
                //                 bind: {
                //                     bindTo: '{record.members}',
                //                     deep: true
                //                 },
                //                 get: function (store) {
                //                     if (store && store.getCount() > 1) {
                //                         return false;
                //                     }
                //                     return true;
                //                 }
                //             }
                //         }
                //     }
                // }).show();
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            if (call_from_grid) {
                                inquiries.remove(record);
                                inquiries.sync({
                                    success: function () {
                                        recentlyOpened.reload();
                                        if (estimateStore) estimateStore.reload();
                                        Ext.toast('Record deleted', 2500);
                                    },
                                });
                            } else {
                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'inquiry/' + record.get('id'),
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': null,
                                    },
                                    success: function (response) {
                                        Ext.toast('Record deleted', 2500);
                                        window.location.hash = 'inquiries';
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
                            testId: 'inquiryDeleteDialogConfirmDeleteButton',
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
