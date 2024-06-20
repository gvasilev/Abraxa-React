import '../notes/AddNotePopup';
import '../portcalls/agent/PortcallsAgentArchivedMenu';

Ext.define('Abraxa.view.portcalls.agent.PortacallAgentCard', {
    extend: 'Ext.Container',
    xtype: 'portcalls.right.card',
    cls: 'a-portcalls-right-container a-has-vertical-tabs a-right-container',
    hidden: true,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    weighted: true,
    flex: 1,
    scrollable: 'y',
    viewModel: {
        data: {
            portcall: null,
            dialog: true,
            hidePersonIncharge: true,
        },
        stores: {
            portcallSections: {
                data: [
                    {
                        html: '<i class="md-icon-outlined" data-qtip="Overview" data-qalign="bc-tc" data-qanchor="true">view_agenda</i><span>Overview</span>',
                        tab: 'overview',
                        title: 'Overview',
                        slug: 'overview',
                        subObject: 'overview',
                    },
                    {
                        html: '<i class="md-icon-outlined" data-qtip="Itinerary" data-qalign="bc-tc" data-qanchor="true">date_range</i><span>Itinerary</span>',
                        tab: 'itinerary',
                        title: 'Itinerary',
                        slug: 'itinerary',
                        subObject: 'itinerary',
                    },
                    {
                        html: '<i class="md-icon-outlined" data-qtip="Instructions" data-qalign="bc-tc" data-qanchor="true">description</i><span>Instructions</span>',
                        tab: 'instructions',
                        title: 'Instructions',
                        slug: 'instructions',
                        subObject: 'instructions',
                    },
                ],
            },
            instructions: {
                source: '{portcall.instructions}',
                extraParams: {
                    object_meta_id: '{object_record.id}',
                    object_id: 3,
                },
                listeners: {
                    beforesync: function (store) {
                        let object_record = Ext.ComponentQuery.query(
                            Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type +
                                'portcall\\.main'
                        )[0]
                            .upVM()
                            .get('object_record');
                        if (object_record) object_record.set('updated_at', new Date());
                    },
                },
            },
        },
        formulas: {
            activeGrid: {
                bind: {
                    bindTo: '{portcallGridActive.selection}',
                    deep: true,
                },
                get: function (selection) {
                    if (selection) {
                        this.set('portcall', selection);
                    } else {
                        this.set('portcall', null);
                    }
                },
            },
            archiveGrid: {
                bind: {
                    bindTo: '{portcallsGridArchived.selection}',
                    deep: true,
                },
                get: function (selection) {
                    if (selection) {
                        this.set('portcall', selection);
                    } else {
                        this.set('portcall', null);
                    }
                },
            },
            // portcall: {
            //     bind: {
            //         activeGrid: '{portcallGridActive.selection}',
            //         archiveGrid: '{portcallsGridArchived.selection}'
            //     },
            //     get: function (data) {

            //         if (data.activeGrid) {
            //             return data.activeGrid;
            //         }
            //         if (data.archiveGrid) {
            //             return data.archiveGrid;
            //         }
            //     }
            // },
            vessel: {
                bind: {
                    bindTo: '{portcall.voyage}',
                    deep: true,
                },
                get: function (voyage) {
                    if (voyage) {
                        if (voyage.get('custom_vessel')) {
                            return voyage.get('custom_vessel');
                        } else {
                            return voyage.get('vessel');
                        }
                    }
                },
            },
            vesselImage: {
                bind: {
                    bindTo: '{vessel}',
                    deep: true,
                },
                get: function (vessel) {
                    if (vessel) {
                        if (vessel.company_id && vessel.vessel_img) {
                            return vessel.vessel_img;
                        } else {
                            return AbraxaConstants.urls.staticAbraxa + 'ships/' + vessel.imo + '.jpg';
                        }
                    }
                },
            },
            vesselType: {
                bind: {
                    bindTo: '{vessel}',
                    deep: true,
                },
                get: function (vessel) {
                    if (vessel && vessel.types) {
                        return vessel.types.name;
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                },
            },
            modalTitle: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (portcall) {
                    if (portcall) {
                        let flag = null,
                            voyage = portcall.getVoyage();
                        if (voyage && voyage.get('vessel')) {
                            let vessel = voyage.get('vessel');
                            if (voyage && vessel && vessel.flags && vessel.flags.country_code) {
                                flag =
                                    'src="' +
                                    AbraxaConstants.urls.staticAbraxa +
                                    'flags/1x1/' +
                                    vessel.flags.country_code.toLocaleLowerCase() +
                                    '.svg"';
                            }
                            return (
                                '<div class="hbox"><img height="28" class="a-img-round mr-12" ' +
                                flag +
                                ' /><span><a href="javascript:void(0);" class="vessel-name vessel mr-16">' +
                                voyage.get('vessel_name') +
                                '</a><span class="a-panel-id">' +
                                portcall.get('file_id') +
                                '</span></span></div>'
                            );
                        }
                    }
                },
            },
            watching: {
                bind: {
                    bindTo: '{portcall.watching}',
                    deep: true,
                },
                get: function (store) {
                    if (store) return store;
                },
            },
            object_record: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (record) {
                    if (record) return record;
                },
            },
            status: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.status_data;
                    }
                },
            },
            instructions: {
                bind: {
                    bindTo: '{portcall.instructions}',
                    deep: true,
                },
                get: function (instructions) {
                    if (instructions) {
                        return instructions;
                    }
                },
            },
            instructionsVisible: {
                bind: {
                    bindTo: '{instructions.count}',
                    deep: true,
                },
                get: function (count) {
                    if (count) {
                        return false;
                    }
                    return true;
                },
            },
            attachmentInstructionsVisible: {
                bind: {
                    bindTo: '{instructionsVisible}',
                    deep: true,
                },

                get: function (visible) {
                    if (visible) {
                        return true;
                    }
                    return false;
                },
            },
            voyage: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.getVoyage();
                    }
                },
            },
            etaRendererDate: {
                bind: {
                    bindTo: '{portcall.port_eta}',
                    deep: true,
                },
                get: function (date) {
                    if (date) {
                        return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
            assignTo: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        if (record.get('assigned_to')) {
                            let storeUsers = this.get('users');
                            let recordUser = storeUsers.findRecord('id', record.get('assigned_to'));
                            if (recordUser) {
                                var assigned_to = recordUser.get('first_name')[0] + '. ' + recordUser.get('last_name');
                                let str = '<span class="a-int">' + recordUser.get('abbr') + '</span>';
                                if (recordUser.get('profile_image') && recordUser.get('profile_image') != '') {
                                    let img = recordUser.get('profile_image');
                                    str =
                                        '<img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                        img +
                                        '">';
                                }

                                return (
                                    '<div class="a-person a-icon-round">' +
                                    str +
                                    ' ' +
                                    '<a class="a-person a_grid_action person_details" href="javascript:void(0)">' +
                                    assigned_to +
                                    '</a></div>'
                                );
                            } else {
                                return AbraxaConstants.placeholders.emptyValue;
                            }
                        }
                    }
                },
            },
            member: {
                bind: {
                    bindTo: '{portcall.members}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        let currentUser = this.get('currentUser');

                        let member = store.queryBy(function (rec, id) {
                            return rec.get('tenant_id') == currentUser.get('current_company_id');
                        }).items[0];

                        return member;
                    }
                },
            },
            objectPermissions: {
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
                        return object_permissions;
                    } else {
                        return;
                    }
                },
            },
            editablePermissions: {
                bind: {
                    bindTo: '{objectPermissions}',
                    deep: true,
                },
                get: function (permissions) {
                    let portcall = this.get('portcall');
                    if (portcall && portcall.get('portcall.is_archived')) return false;
                    if (permissions) {
                        let generalPermission = Object.keys(permissions).includes('general');
                        if (generalPermission) {
                            if (!permissions['general'].can_edit) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                    return true;
                },
            },
            hideStatusButton: {
                bind: {
                    portcall: '{portcall}',
                    editablePermissions: '{editablePermissions}',
                },
                get: function (data) {
                    if (data.portcall) {
                        if (data.portcall.get('is_archived')) {
                            return false;
                        }
                        return data.editablePermissions;
                    }
                },
            },
            portFunction: {
                bind: {
                    bindTo: '{portcall.nomination}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.get('port_function');
                    }
                },
            },
            dateReceived: {
                bind: {
                    bindTo: '{portcall.nomination.date_received}',
                    deep: true,
                },
                get: function (date) {
                    if (date) {
                        return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
        },
    },
    bind: {
        hidden: '{portcall ? false:true}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-br-100',
            docked: 'left',
            width: 64,
            weight: 2,
            items: [
                {
                    xtype: 'list',
                    reference: 'portcallRightCardMenu',
                    deselectable: false,
                    variableHeights: true,
                    store: [],
                    bind: {
                        store: '{portcallSections}',
                    },
                    itemConfig: {
                        xtype: 'container',
                        cls: 'a-item',
                        viewModel: true,
                        items: [
                            {
                                cls: 'a-tab',
                                bind: {
                                    html: '{record.html}',
                                    slug: '{record.slug}',
                                },
                            },
                        ],
                    },
                    listeners: {
                        painted: function (list) {
                            if (list && list.getStore() && list.getStore().getCount()) {
                                list.select(0);
                            }
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 64,
            docked: 'top',
            weight: 1,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '{modalTitle}',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'a.vessel',
                                    fn: function fn() {
                                        let imo,
                                            record = this.component.upVM().get('portcall').getVoyage();
                                        if (record.get('vessel')) {
                                            imo = record.get('vessel').id;
                                        }
                                        if (record.get('custom_vessel_id')) {
                                            if (record.get('custom_vessel').company_id) {
                                                imo = record.get('custom_vessel').id;
                                            }
                                        }
                                        if (imo) {
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .showVesselDialog(imo);
                                        }
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'status default',
                            slug: 'portcallStatus',
                            bind: {
                                text: '{portcall.status_data.name}',
                                cls: 'a-main-status status-{portcall.status_data.string}',
                                hidden: '{!hideStatusButton}',
                                permission: '{userPermissions}',
                            },
                            menu: {
                                listeners: {
                                    initialize: function (me) {
                                        let store = this.upVM().get('portcallAgentStatus'),
                                            items = [];
                                        store.each(function (value) {
                                            let item = {
                                                text: value.get('name'),
                                                statusId: value.get('id'),
                                            };
                                            items.push(item);
                                        });
                                        me.setItems(items);
                                    },
                                },
                                defaults: {
                                    handler: function () {
                                        var record = this.upVM().get('portcall'),
                                            status_id = this.statusId;

                                        record.set('status_id', status_id);

                                        record.save({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    },
                                },
                                // items: [
                                //     {
                                //         text: 'En route',
                                //         statusId: 1,
                                //     },
                                //     {
                                //         text: 'Drifting',
                                //         statusId: 13,
                                //     },
                                //     {
                                //         text: 'Anchored',
                                //         statusId: 2,
                                //     },
                                //     {
                                //         text: 'Berthed',
                                //         statusId: 3,
                                //     },
                                //     {
                                //         text: 'Cargo operations',
                                //         statusId: 4,
                                //     },
                                //     {
                                //         text: 'Shifting',
                                //         statusId: 5,
                                //     },
                                //     {
                                //         text: 'Awaiting documents',
                                //         statusId: 6,
                                //     },
                                //     {
                                //         text: 'Bunkering',
                                //         statusId: 7,
                                //     },
                                //     {
                                //         text: 'Pilot ordered',
                                //         statusId: 8,
                                //     },
                                //     {
                                //         text: 'Sailed',
                                //         statusId: 9,
                                //     },
                                //     {
                                //         text: 'FDA settlement',
                                //         statusId: 10,
                                //     },
                                //     {
                                //         text: 'Completed',
                                //         statusId: 11,
                                //     },
                                //     {
                                //         text: 'Canceled',
                                //         statusId: 12,
                                //     },
                                // ],
                            },
                        },
                        {
                            xtype: 'div',
                            bind: {
                                html: '<div class="a-status-badge status-xl status-{object_record.status_data.string}">{object_record.status_data.name}</div>',
                                hidden: '{hideStatusButton}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-outlined md-icon-add-task',
                            slug: 'taskCreate',
                            testId: 'portCallsRightCardTaskCreateButton',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{nonEditable ? true : false}',
                                hidden: '{object_record.is_archived}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add task',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;

                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            object_record: this.upVM().get('portcall'),
                                            noSubObjects: true,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            editMode: false,
                                            taskEdit: false,
                                            fromGrid: true,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 3,
                                                object_meta_id: this.upVM().get('portcall').get('id'),
                                                priority: 'normal',
                                            }),
                                        },
                                    },
                                    // Add listeners to reset the flag when the task is closed
                                    listeners: {
                                        destroy: () => {
                                            button.taskOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the task
                                task.show();
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-mode-comment md-icon-outlined',
                            testId: 'portCallsRightCardAddNoteButton',
                            bind: {
                                hidden: '{object_record.is_archived}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add note',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.noteOpened) {
                                    return;
                                }

                                let notes = this.upVM().get('portcall').notes();

                                button.noteOpened = true;

                                let note = Ext.create('Abraxa.view.notes.AddNotePopup', {
                                    viewModel: {
                                        data: {
                                            object_record: this.upVM().get('portcall'),
                                            users: this.upVM().get('users'),
                                            // sortedFilesNoLimit: this.upVM().get('sortedFilesNoLimit'),
                                            currentUser: this.upVM().get('currentUser'),
                                            noSubObjects: true,
                                            editMode: true,
                                            record: notes.add({})[0],
                                        },
                                    },
                                    // Add listeners to reset the flag when the note is closed
                                    listeners: {
                                        destroy: () => {
                                            button.noteOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the note
                                note.show();
                            },
                        },
                        {
                            xtype: 'button',
                            testId: 'portCallsRightCardMoreActionsButton',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-more-horiz',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'More actions',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function handler(owner, tool, e) {
                                let grid = this.find('portcalls-grid-active'),
                                    vm = grid.upVM(),
                                    activeTab = vm.get('archiveMode'),
                                    record = grid.getSelection(),
                                    currentUserType = vm.get('currentUserType');
                                if (activeTab == 1) {
                                    vm = grid.upVM();
                                    record = grid.getSelection();
                                    if (currentUserType == 'agent') {
                                        Ext.create('Abraxa.view.portcalls.agent.PortcallsAgentArchivedMenu', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    portcall: record,
                                                    call_from_grid: true,
                                                    is_archived: false,
                                                },
                                            },
                                        }).showBy(this);
                                    }
                                    if (currentUserType == 'principal') {
                                        Ext.create('Abraxa.view.portcalls.principal.PortcallsPrincipalArchivedMenu', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    portcall: record,
                                                    call_from_grid: true,
                                                    is_archived: false,
                                                },
                                            },
                                        }).showBy(this);
                                    }
                                } else {
                                    if (record) {
                                        if (
                                            record.get('company_id') ==
                                                vm.get('currentUser').get('current_company_id') &&
                                            !record.get('parent_id')
                                        ) {
                                            //full menu
                                            Ext.create('Abraxa.view.portcalls.agent.PortcallsAgentEditMenu', {
                                                viewModel: {
                                                    parent: vm,
                                                    data: {
                                                        portcall: record,
                                                        call_from_grid: true,
                                                        is_archived: false,
                                                    },
                                                },
                                            }).showBy(this);
                                        } else {
                                            //limited menu
                                            Ext.create('Abraxa.view.portcalls.principal.PortcallsPrincipalEditMenu', {
                                                viewModel: {
                                                    parent: vm,
                                                    data: {
                                                        portcall: record,
                                                        call_from_grid: true,
                                                        is_archived: false,
                                                    },
                                                },
                                            }).showBy(this);
                                        }
                                    }
                                }
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'portCallsRightCardTooltipCloseButton',
                            handler: function (me) {
                                let activeGrid = Ext.ComponentQuery.query('[xtype=portcalls\\.grid\\.active]')[0];
                                activeGrid.deselectAll();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-portcall-info',
            layout: 'vbox',
            padding: '8 0 0',
            flex: 1,
            scrollable: true,
            bind: {
                hidden: '{portcallRightCardMenu.selection.tab == "overview" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-image',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'image',
                            bind: {
                                src: '{vesselImage}',
                            },
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    defaults: {
                                        xtype: 'div',
                                        cls: 'a-xtype-div',
                                        flex: 1,
                                    },
                                    items: [
                                        {
                                            bind: {
                                                html: '<div class="sm-title">Type</div><div class="fw-b">{vesselType}</div>',
                                            },
                                        },
                                        {
                                            bind: {
                                                html: '<div class="sm-title">Dwt</div><div class="fw-b">{vessel.dwt}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    defaults: {
                                        xtype: 'div',
                                        flex: 1,
                                    },
                                    items: [
                                        {
                                            bind: {
                                                html: '<div class="sm-title">GT</div><div class="fw-b">{vessel.gt}</div>',
                                            },
                                        },
                                        {
                                            bind: {
                                                html: '<div class="sm-title">LOA</div><div class="fw-b">{vessel.loa}</div>',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-portcall-archived',
                    hidden: true,
                    bind: {
                        hidden: '{portcall.is_archived ? false : true}',
                        html: '<i class="md-icon-outlined">info</i><span>{portcall.archived_reason}</span>',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    cls: 'a-title-md',
                                    title: '<div class="a-badge a-badge-general my-8"><i class="md-icon-outlined">edit_note</i></div>General info',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            slug: 'portcallFileID',
                            bind: {
                                hidden: '{currentUserType == "principal" ? true:false}',
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'File ID',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.file_id ? portcall.file_id:"---" }</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            slug: 'portcallAssignTo',
                            bind: {
                                hidden: '{dialog ? false:true}',
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Assigned to',
                                },
                                {
                                    xtype: 'div',
                                    testId: 'portcallsRightCardAssignedToPersonDetailsLink',
                                    cls: 'a-displayfield',
                                    bind: {
                                        html: '<div class="x-before-input-el">{assignTo}</div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a.person_details',
                                            fn: function fn(el) {
                                                var user = this.component.upVM().get('portcall').get('assignee');
                                                if (user) {
                                                    let tipExist = Ext.getCmp('createdByTool');
                                                    if (tipExist) {
                                                        tipExist.destroy();
                                                    }
                                                    Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                                        target: el.target,
                                                        id: 'createdByTool',
                                                        viewModel: {
                                                            data: {
                                                                user: user,
                                                                clickedElement: el.target,
                                                            },
                                                        },
                                                    }).showBy(el, 'bc-tc?');
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'ETA',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{etaRendererDate}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Port name',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-port',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);">{portcall.port_name}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let me = this,
                                                    cmp = me.component,
                                                    portId = null;
                                                if (cmp.upVM().get('portcall').port_id) {
                                                    portId = cmp.upVM().get('portcall').port_id;
                                                } else {
                                                    portId = cmp.upVM().get('portcall').get('port_id');
                                                }
                                                if (portId) {
                                                    Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .showPortDialogById(portId);
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'my-8',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    cls: 'a-title-md',
                                    title: '<div class="a-badge a-badge-nomination my-8"><i class="md-icon-outlined">business_center</i></div>Nomination info',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Appointing party',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{portcall.nomination.appointing_party_email ? portcall.nomination.appointing_party_email :null}">{portcall.nomination.appointing_party_name ? portcall.nomination.appointing_party_name:"---"}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true
                                                        );
                                                    if (orgRecord) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showOrganizationTooltip(orgRecord.get('org_id'), el);
                                                    } else if (email) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showTenantByEmail(email, el);
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Voy. number',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.voyage_number ? portcall.nomination.voyage_number:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Nominating party',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{portcall.nomination.nominating_party_email ? portcall.nomination.nominating_party_email :null}">{portcall.nomination.nominating_party_name ? portcall.nomination.nominating_party_name:"---"}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true
                                                        );
                                                    if (orgRecord) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showOrganizationTooltip(orgRecord.get('org_id'), el);
                                                    } else if (email) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showTenantByEmail(email, el);
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            slug: 'nominationReference',
                            bind: {
                                hidden: '{currentUserType == "principal" ? true:false}',
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Nomination reference',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.nomination_reference ? portcall.nomination.nomination_reference:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            slug: 'nominationDateReceived',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Date received',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{dateReceived}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',

                                    html: 'Port function',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portFunction}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Agency type',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.agency_type_name ? portcall.nomination.agency_type_name:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            bind: {
                                hidden: '{portcall.nomination.lead_agent_id ? false:true}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Lead agent',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{portcall.nomination.lead_agent_email ? portcall.nomination.lead_agent_email :null}">{portcall.nomination.lead_agent_name ? portcall.nomination.lead_agent_name:"---"}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true
                                                        );
                                                    if (orgRecord) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showOrganizationTooltip(orgRecord.get('org_id'), el);
                                                    } else if (email) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showTenantByEmail(email, el);
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            // slug: 'nominationHubStructure',
                            bind: {
                                hidden: '{portcall.nomination.sub_agent_id ? false:true}',
                                // permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Sub agent',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{portcall.nomination.sub_agent_email ? portcall.nomination.sub_agent_email :null}">{portcall.nomination.sub_agent_name ? portcall.nomination.sub_agent_name:"---"}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true
                                                        );
                                                    if (orgRecord) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showOrganizationTooltip(orgRecord.get('org_id'), el);
                                                    } else if (email) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showTenantByEmail(email, el);
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            // slug: 'nominationHubStructure',
                            bind: {
                                hidden: '{portcall.nomination.hub_reference ? false:true}',
                                // permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Hub reference',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.hub_reference ? portcall.nomination.hub_reference:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        // {
                        //     xtype: 'container',
                        //     cls: 'a-data-item',
                        //     layout: {
                        //         type: 'hbox',
                        //         align: 'center',
                        //     },
                        //     items: [{
                        //         xtype: 'label',
                        //         html: 'Record owner'
                        //     }, {
                        //         xtype: 'div',
                        //         cls: 'a-displayfield a-field-icon icon-rounded icon-business',
                        //         bind: {
                        //             html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{agent ? agent.org_email :null}">{agent.org_name}</a></div>'
                        //         },
                        //         listeners: {
                        //             click: {
                        //                 element: "element",
                        //                 delegate: "a",
                        //                 fn: function (el) {
                        //                     let email = el.currentTarget.getAttribute("data-email");
                        //                     if (email) {
                        //                         let organizations = this.component.upVM().get('organizations'),
                        //                             orgRecord = organizations.findRecord('org_email', email, 0, false, false, true);
                        //                         if (orgRecord) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showOrganizationTooltip(orgRecord.get('org_id'), el);
                        //                         } else if (email) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
                        //                         }
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }]
                        // },
                        // {
                        //     xtype: 'container',
                        //     cls: 'a-data-item',
                        //     bind: {
                        //         hidden: '{hidePersonIncharge}'
                        //     },
                        //     layout: {
                        //         type: 'hbox',
                        //         align: 'center',
                        //     },
                        //     items: [{
                        //         xtype: 'label',
                        //         html: 'Person in charge'
                        //     }, {
                        //         xtype: 'public.updated.by',
                        //         bind: {
                        //             data: {
                        //                 user: '{portcall.assignee}',
                        //                 pic: '{portcall.assignee}'
                        //             },
                        //         },
                        //     }]
                        // },
                        // {
                        //     xtype: 'container',
                        //     cls: 'a-data-item',
                        //     layout: {
                        //         type: 'hbox',
                        //         align: 'center',
                        //     },
                        //     items: [{
                        //         xtype: 'label',
                        //         html: 'Principal'
                        //     }, {
                        //         xtype: 'div',
                        //         cls: 'a-displayfield a-field-icon icon-rounded icon-business',
                        //         bind: {
                        //             html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);"  data-email ="{principal ? principal.org_email :null}">{principal.org_name}</a></div>'
                        //         },
                        //         listeners: {
                        //             click: {
                        //                 element: "element",
                        //                 delegate: "a",
                        //                 fn: function (el) {
                        //                     let email = el.currentTarget.getAttribute("data-email");
                        //                     if (email) {
                        //                         let organizations = this.component.upVM().get('organizations'),
                        //                             orgRecord = organizations.findRecord('org_email', email, 0, false, false, true);
                        //                         if (orgRecord) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showOrganizationTooltip(orgRecord.get('org_id'), el);
                        //                         } else if (email) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
                        //                         }
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }]
                        // }
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-data a-cargo-data',
                    padding: '0 0 16 0',
                    bind: {
                        hidden: '{portcall.nomination.cargoes.count ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'my-8',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    cls: 'a-title-md',
                                    title: '<div class="a-badge a-badge-cargo my-8"><i></i></div>Cargoes',
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.formlist',
                            padding: '0 24 0 72',
                            bind: {
                                store: '{portcall.nomination.cargoes}',
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        recordIndex: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record) {
                                                    let store = record.store;
                                                    if (store) {
                                                        return store.indexOf(record);
                                                    }
                                                }
                                            },
                                        },
                                        functionIcon: {
                                            bind: {
                                                bindTo: '{record.function}',
                                                deep: true,
                                            },
                                            get: function (func) {
                                                let str = '';
                                                if (func) {
                                                    switch (func) {
                                                        case 'Loading':
                                                            str = 'L';
                                                            break;
                                                        case 'Discharging':
                                                            str = 'D';
                                                            break;
                                                        case 'Transshipment':
                                                            str = 'TS';
                                                            break;
                                                        case 'Lightering':
                                                            str = 'LT';
                                                            break;

                                                        default:
                                                            break;
                                                    }
                                                }
                                                return str;
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                cls: 'a-cargo-container',
                                items: [
                                    {
                                        xtype: 'container',
                                        cls: 'a-cargo-titlebar',
                                        padding: 0,
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'hbox',
                                                bind: {
                                                    html: '<div><div class="a-cargo-title"><span class="a-qty">{record.quantity:number("0,000.###")} {record.unit}</span><span class="a-commodity">{record.commodity}</span><span class="a-function a-function-sm function-{record.function ? record.function : ""}" title="{record.function ? record.function : ""}">{functionIcon}</span></div><div class="a-cargo-subtitle">#Cargo-{recordIndex + 1}</div></div>',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-data a-declined-container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    hidden: true,
                    bind: {
                        hidden: '{invitation.status == "Declined" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Declined reason',
                                },
                            ],
                        },
                        {
                            padding: '0 24',
                            bind: {
                                html: '{invitation.declined_reason}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-data a-archive-comment',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    hidden: true,
                    bind: {
                        hidden: '{portcall.is_archived ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Archive comment',
                                },
                            ],
                        },
                        {
                            padding: '0 24 24',
                            bind: {
                                html: '{portcall.archived_comment}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            hidden: true,
            layout: 'vbox',
            flex: 1,
            scrollable: true,
            bind: {
                hidden: '{portcallRightCardMenu.selection.tab == "itinerary" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    docked: 'top',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Itinerary',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-info',
                    padding: '8 0',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-portcall-data',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            cls: 'a-title-md',
                                            title: '<div class="a-badge a-badge-general my-8"><i class="md-icon-outlined">anchor</i></div>Current port',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-data-item',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Port',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-port',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.port_name}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-data-item',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Arrival PS',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.arrival_ps ? (portcall.arrival_ps:date("d M y - H:i")) : "---"}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-data-item',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Departure PS',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.departure_ps ? (portcall.departure_ps:date("d M y - H:i")) : "---"}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-data-item',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'ETA',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.port_eta ? (portcall.port_eta:date("d M y - H:i")) : "---"}</div>',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'my-8',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-portcall-data',
                            scrollable: true,
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            cls: 'a-title-md',
                                            title: '<div class="a-badge a-badge-general my-8"><i class="md-icon-outlined">place</i></div>Berths',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.componentdataview',
                                    cls: 'a-portcall-data-list',
                                    bind: {
                                        store: '{portcall.berths}',
                                    },
                                    itemConfig: {
                                        xtype: 'container',
                                        cls: 'a-portcall-data',
                                        scrollable: true,
                                        viewModel: true,
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch',
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'Berth name',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-place',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.name}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'Berth function',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.function ? record.function : "---"}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.berthed ? true : false}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'ETB',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.etb ? (record.etb:date("d M y - H:i")) : "---"}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.berthed ? false : true}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'Berthed',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.berthed ? (record.berthed:date("d M y - H:i")) : "---"}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.completed ? true : false}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'ETC',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.etc ? (record.etc:date("d M y - H:i")) : "---"}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.completed ? false : true}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'Completed',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.completed ? (record.completed:date("d M y - H:i")) : "---"}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.departed ? true : false}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'ETD',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.etd ? (record.etd:date("d M y - H:i")) : "---"}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-data-item',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.departed ? false : true}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'center',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        html: 'Departed',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                                        bind: {
                                                            html: '<div class="x-before-input-el"></div><div class="x-text-el">{record.departed ? (record.departed:date("d M y - H:i")) : "---"}</div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'div',
                                                cls: 'a-divider',
                                                html: '<hr>',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'my-8',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-portcall-data',
                            scrollable: true,
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            cls: 'a-title-md',
                                            title: '<div class="a-badge a-badge-general my-8"><i class="md-icon-outlined">anchor</i></div>Next port',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-data-item',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Port',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-port',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.next_port ? portcall.next_port : "---"}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-data-item',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'ETA',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.next_port_eta ? (portcall.next_port_eta:date("d M y - H:i")) : "---"}</div>',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            hidden: true,
            layout: 'vbox',
            scrollable: true,
            flex: 1,
            bind: {
                hidden: '{portcallRightCardMenu.selection.tab == "instructions" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    docked: 'top',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Instructions',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-info',
                    padding: '8 0',
                    layout: 'vbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-portcall-instructions',
                            layout: 'vbox',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'abraxa.formlist',
                                    minHeight: 280,
                                    flex: 1,
                                    cls: 'instruction_list',
                                    bind: {
                                        store: '{instructions}',
                                    },
                                    itemTpl: null,
                                    emptyText: {
                                        xtype: 'container',
                                        zIndex: 999,
                                        layout: {
                                            type: 'vbox',
                                        },
                                        centered: true,
                                        items: [
                                            {
                                                xtype: 'div',
                                                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9972 -18910)"><g transform="translate(9138 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(10007 18945)"><path d="M13,33.5H31V38H13Zm0-9H31V29H13ZM26.5,2H8.5A4.513,4.513,0,0,0,4,6.5v36A4.494,4.494,0,0,0,8.477,47H35.5A4.513,4.513,0,0,0,40,42.5v-27Zm9,40.5H8.5V6.5H24.25V17.75H35.5Z" transform="translate(5 2.5)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1.5"/><g transform="translate(18 18)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1"><rect width="8" height="4.5" stroke="none"/><rect x="0.5" y="0.5" width="7" height="3.5" fill="none"/></g></g></g></svg><div class="a-no-content-txt">No instructions available</div></div>',
                                            },
                                        ],
                                    },
                                    emptyTextDefaults: {
                                        xtype: 'emptytext',
                                        cls: 'a-empty-text',
                                    },
                                    itemConfig: {
                                        viewModel: true,
                                        xtype: 'container',
                                        cls: 'a-portcall-instructions-item',
                                        padding: '8 24 16 24',
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'fs-14 fw-b',
                                                bind: {
                                                    html: '<div class="hbox"><div class="a-badge a-badge-default mr-12"><i class="md-icon-outlined">description</i></div>{record.title}</div>',
                                                },
                                                listeners: {
                                                    click: {
                                                        element: 'element',
                                                        delegate: 'a.instruction_link',
                                                        fn: function () {
                                                            var record = this.component.upVM().get('record');
                                                            Ext.ComponentQuery.query('[xtype=appointment\\.main]')[0]
                                                                .getVM()
                                                                .set('selectedInstruction', record);
                                                        },
                                                    },
                                                },
                                            },
                                            {
                                                xtype: 'div',
                                                padding: '8 24 8 46',
                                                cls: 'a-portcall-instructions-description',
                                                bind: {
                                                    html: '{record.description_plain:substr(0, 240)}...',
                                                },
                                                listeners: {
                                                    click: {
                                                        element: 'element',
                                                        delegate: 'a.instruction_link',
                                                        fn: function () {
                                                            var record = this.component.upVM().get('record');
                                                            Ext.ComponentQuery.query('[xtype=appointment\\.main]')[0]
                                                                .getVM()
                                                                .set('selectedInstruction', record);
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'toolbar',
            height: 64,
            border: true,
            weight: 3,
            docked: 'bottom',
            cls: 'a-bt-100',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'notes.notify',
                    flex: 1,
                },
                {
                    xtype: 'button',
                    margin: '8 0 8 8',
                    ui: 'action',
                    text: 'View port call',
                    // bind: {
                    //     hidden: '{portcallsAgentTabbar.activeTabIndex == 0 ? false : true}'
                    // },
                    handler: function (me) {
                        let vm = me.upVM(),
                            activeTab = vm.get('portcallsAgentTabbar.activeTabIndex'),
                            portcall = vm.get('portcall'),
                            tab = 'Active grid';

                        if (activeTab == 1) {
                            tab = 'Closed grid';
                        }
                        mixpanel.track('View more button (десен панел) - ' + tab);
                        Ext.getCmp('main-viewport').setMasked({
                            xtype: 'viewport.mask',
                        });
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo('portcall/' + portcall.get('id'));
                    },
                },
            ],
        },
    ],
});
