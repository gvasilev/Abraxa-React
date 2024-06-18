import './inquiryDetails/ProformaCargo';
import '../notes/NotesNotify';
import './appoint/AppointList';

Ext.define('Abraxa.view.inquiry.InquiryAgentCard', {
    extend: 'Ext.Container',
    xtype: 'inquiry.right.card',
    cls: 'a-portcalls-right-container a-has-vertical-tabs a-right-container',
    hidden: true,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    weighted: true,
    viewModel: {
        data: {
            inquiry: null,
            dialog: true,
            hidePersonIncharge: true,
            inquirySections: {
                data: [
                    {
                        html: '<i class="md-icon-outlined" data-qtip="Overview" data-qalign="bc-tc" data-qanchor="true">view_agenda</i><span>Overview</span>',
                        tab: 'overview',
                        title: 'Overview',
                        slug: 'overview',
                        subObject: 'overview',
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
        },
        stores: {
            instructions: {
                source: '{inquiry.instructions}',
            },
        },
        formulas: {
            activeGrid: {
                bind: {
                    bindTo: '{inquiryGrid.selection}',
                    deep: true,
                },
                get: function(selection) {
                    if (selection) {
                        this.set('inquiry', selection);
                    } else {
                        this.set('inquiry', null);
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
                    bindTo: '{inquiry.voyage}',
                    deep: true,
                },
                get: function(voyage) {
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
                get: function(vessel) {
                    if (vessel) {
                        if (vessel.company_id && vessel.vessel_img) {
                            return vessel.vessel_img;
                        } else {
                            return AbraxaConstants.urls.staticAbraxa + 'ships/' + vessel.imo + '.jpg';
                        }
                    }
                },
            },
            vesselTitle: {
                bind: {
                    bindTo: '{vessel}',
                    deep: true,
                },
                get: function(vessel) {
                    if (vessel) {
                        let flag = null,
                            voyage = this.get('inquiry').getVoyage();

                        if (voyage && vessel && vessel.flags && vessel.flags.country_code) {
                            flag =
                                'src="' +
                                AbraxaConstants.urls.staticAbraxa +
                                'flags/1x1/' +
                                vessel.flags.country_code.toLocaleLowerCase() +
                                '.svg"';
                        }
                        return (
                            '<img height=24" ' +
                            flag +
                            '  title="" alt=""/><div><div class="vessel-imo">IMO: ' +
                            vessel.imo +
                            '</div><a href="javascript:void(0);" class="vessel-name vessel">' +
                            voyage.get('vessel_name') +
                            '</a></div>'
                        );
                    }
                },
            },
            vesselType: {
                bind: {
                    bindTo: '{vessel}',
                    deep: true,
                },
                get: function(vessel) {
                    if (vessel && vessel.types) {
                        return vessel.types.name;
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                },
            },
            modalTitle: {
                bind: {
                    bindTo: '{inquiry}',
                    deep: true,
                },
                get: function(inquiry) {
                    if (inquiry) {
                        if (inquiry.get('status')) {
                            let status = inquiry.get('status'),
                                flag = null,
                                vessel = this.get('vessel'),
                                voyage = inquiry.getVoyage();
                            if (voyage) {
                                if (
                                    voyage &&
                                    voyage.get('vessel') &&
                                    voyage.get('vessel').flags &&
                                    voyage.get('vessel').flags.country_code
                                ) {
                                    flag =
                                        'src="' +
                                        AbraxaConstants.urls.staticAbraxa +
                                        'flags/1x1/' +
                                        voyage.get('vessel').flags.country_code.toLocaleLowerCase() +
                                        '.svg"';
                                }
                                return (
                                    '<div class="hbox"><img height="28" class="a-img-round mr-12" ' +
                                    flag +
                                    ' /><span><a href="javascript:void(0);" class="vessel-name vessel mr-16">' +
                                    voyage.get('vessel_name') +
                                    '</a><span class="a-panel-id">' +
                                    inquiry.get('inquiry_id') +
                                    '</span></span></div>'
                                );
                            }
                        }
                    }
                },
            },
            watching: {
                bind: {
                    bindTo: '{portcall.watching}',
                    deep: true,
                },
                get: function(store) {
                    if (store) return store;
                },
            },
            object_record: {
                bind: {
                    bindTo: '{inquiry}',
                    deep: true,
                },
                get: function(record) {
                    if (record) return record;
                },
            },
            status: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function(record) {
                    if (record) {
                        return record.status_data;
                    }
                },
            },
            attachmentInstructionsVisible: {
                bind: {
                    bindTo: '{instructionsVisible}',
                    deep: true,
                },

                get: function(visible) {
                    if (visible) {
                        return true;
                    }
                    return false;
                },
            },
            voyage: {
                bind: {
                    bindTo: '{object_record}',
                    deep: true,
                },
                get: function(record) {
                    if (record) {
                        return record.getVoyage();
                    }
                },
            },
            etaRendererDate: {
                bind: {
                    bindTo: '{inquiry.port_eta}',
                    deep: true,
                },
                get: function(date) {
                    if (date) {
                        return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
            assignTo: {
                bind: {
                    bindTo: '{inquiry}',
                    deep: true,
                },
                get: function(record) {
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
                get: function(store) {
                    if (store) {
                        let currentUser = this.get('currentUser');

                        let member = store.queryBy(function(rec, id) {
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
                get: function(member) {
                    if (member) {
                        let permissions = member.permissions(),
                            object_permissions = {};

                        permissions.each(function(record) {
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
                get: function(permissions) {
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
                    inquiry: '{inquiry}',
                    editablePermissions: '{editablePermissions}',
                },
                get: function(data) {
                    if (data.inquiry) {
                        if (data.inquiry.get('is_archived')) {
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
                get: function(record) {
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
                get: function(date) {
                    if (date) {
                        return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
        },
    },
    bind: {
        hidden: '{inquiry ? false:true}',
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
                    reference: 'inquiryRightCardMenu',
                    deselectable: false,
                    variableHeights: true,
                    store: [],
                    bind: {
                        store: '{inquirySections}',
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
                        painted: function(list) {
                            list.select(0);
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            minHeight: 64,
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
                                            record = this.component.upVM().get('inquiry').getVoyage();
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
                                text: '{inquiry.status_string}',
                                cls: 'a-main-status status-{inquiry.status_string}',
                                hidden: '{!hideStatusButton}',
                                permission: '{userPermissions}',
                            },
                            menu: {
                                defaults: {
                                    handler: function() {
                                        var record = this.upVM().get('inquiry'),
                                            status_id = this.statusId;

                                        record.set('status', status_id);

                                        record.save({
                                            success: function() {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    },
                                },
                                items: [
                                    {
                                        text: 'Draft',
                                        statusId: 1,
                                    },
                                    {
                                        text: 'In progress',
                                        statusId: 2,
                                    },
                                    {
                                        text: 'Submitted',
                                        statusId: 3,
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'div',
                            bind: {
                                html: '<div class="a-status-badge status-xl status-{inquiry.status_string} text-capitalize">{inquiry.status_string}</div>',
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
                            iconCls: 'md-icon-outlined md-icon-done-all',
                            bind: {
                                hidden: '{inquiry.is_archived}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Appoint',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function(me) {
                                let vm = me.upVM();
                                let inquiry = vm.get('inquiry');
                                Ext.create('Abraxa.view.inquiry.appoint.AppointList', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            inquiryOffers: inquiry.offers().setSorters([
                                                {
                                                    property: 'created_at',
                                                    direction: 'DESC',
                                                },
                                            ]),
                                            inquiry: inquiry,
                                        },
                                    },
                                }).show();
                            },
                        },
                        // {
                        //     xtype: 'button',
                        //     ui: 'round tool-round-md',
                        //     iconCls: 'md-icon-mode-comment md-icon-outlined',
                        //     bind: {
                        //         hidden: '{inquiry.is_archived}',
                        //     },
                        //     tooltip: {
                        //         anchorToTarget: true,
                        //         html: 'Add note',
                        //         align: 'bc-tc?',
                        //         showDelay: 0,
                        //         hideDelay: 0,
                        //         dismissDelay: 0,
                        //         allowOver: false,
                        //         closeAction: 'destroy',
                        //     },
                        //     handler: function () {
                        //         let notes = this.upVM().get('inquiry').notes();
                        //         Ext.create('Abraxa.view.notes.AddNotePopup', {
                        //             viewModel: {
                        //                 data: {
                        //                     inquiry: this.upVM().get('inquiry'),
                        //                     users: this.upVM().get('users'),
                        //                     // sortedFilesNoLimit: this.upVM().get('sortedFilesNoLimit'),
                        //                     currentUser: this.upVM().get('currentUser'),
                        //                     noSubObjects: true,
                        //                     editMode: true,
                        //                     record: notes.add({})[0],
                        //                 },
                        //             },
                        //         }).show();
                        //     },
                        // },
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            testId: 'inquiryRigtCardMoreActionsButton',
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
                                let grid = this.find('inquiry-grid-active'),
                                    vm = grid.upVM(),
                                    activeTab = vm.get('inquiryTabbar.activeTabIndex'),
                                    record = grid.getSelection(),
                                    currentUserType = vm.get('currentUserType');
                                if (activeTab == 1) {
                                    grid = this.find('portcalls-grid-close');
                                    vm = grid.upVM();
                                    record = grid.getSelection();
                                    if (currentUserType == 'agent') {
                                        Ext.create('Abraxa.view.inquiry.agent.InquiryEditMenu', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    inquiry: record,
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
                                                    inquiry: record,
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
                                            Ext.create('Abraxa.view.inquiry.agent.InquiryEditMenu', {
                                                viewModel: {
                                                    parent: vm,
                                                    data: {
                                                        inquiry: record,
                                                        call_from_grid: true,
                                                        is_archived: false,
                                                    },
                                                },
                                            }).showBy(this);
                                        } else {
                                            //limited menu
                                            Ext.create('Abraxa.view.inquiry.agent.InquiryEditMenu', {
                                                viewModel: {
                                                    parent: vm,
                                                    data: {
                                                        inquiry: record,
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
                            handler: function(me) {
                                let activeGrid = Ext.ComponentQuery.query('[xtype=inquiry\\.agent\\.active\\.grid]')[0],
                                    archiveGrid = Ext.ComponentQuery.query('[xtype=portcalls\\.grid\\.closed]')[0];
                                activeGrid.deselectAll();
                                if (archiveGrid) {
                                    archiveGrid.deselectAll();
                                }
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
                hidden: '{inquiryRightCardMenu.selection.tab == "overview" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    defaults: {
                        cls: 'a-data-item',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
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
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    cls: 'a-title-md',
                                    title: '<div class="a-badge a-badge-enquiry my-8"><i class="md-icon-outlined">live_help</i></div>Enquiry info',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Enquiry ID',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.inquiry_id}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            // slug: 'portcallAssignTo',
                            // bind: {
                            // 	permission: '{userPermissions}',
                            // },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Assigned to',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield',
                                    bind: {
                                        html: '<div class="x-before-input-el">{assignTo}</div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a.person_details',
                                            fn: function fn(el) {
                                                var user = this.component.upVM().get('object_record').get('assignee');
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
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Requesting party',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);"  data-email ="{object_record.requesting_party_email ? object_record.requesting_party_email :null}" title="{object_record.requesting_party_name ? object_record.requesting_party_name:"---"}">{object_record.requesting_party_name ? object_record.requesting_party_name:"---"}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function(el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true,
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
                            // slug: 'portcallNominationVoyageNumber',
                            // bind: {
                            // 	permission: '{userPermissions}',
                            // },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Voy. number',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.voyage_number ? object_record.voyage_number:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            // slug: 'portcallNominationVoyageNumber',
                            // bind: {
                            // 	permission: '{userPermissions}',
                            // },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Preferred currency',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.currency ? object_record.currency:"---"}</div>',
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
                            xtype: 'list',
                            deselectable: false,
                            inline: true,
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            store: [],
                            bind: {
                                store: '{inquiry.ports}',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'label',
                                        html: 'Port of call',
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-displayfield a-field-icon icon-rounded icon-port',
                                        bind: {
                                            html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);">{record.name}</a></div>',
                                        },
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a',
                                                fn: function(el) {
                                                    let me = this,
                                                        cmp = me.component,
                                                        porstsServed = cmp.upVM().get('portsServed'),
                                                        portId = cmp.upVM().get('record').get('id');
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
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Port function',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{inquiry.port_function}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Agency type',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">Full agency</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            slug: 'portcallNominationVoyageNumber',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Ref. number',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.reference_number ? object_record.reference_number:"---"}</div>',
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
                    bind: {
                        hidden: '{inquiry.cargoes.count ? false:true}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    bind: {
                        hidden: '{inquiry.cargoes.count ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'title',
                            cls: 'a-title-md',
                            title: '<div class="a-badge a-badge-cargo my-8"><i></i></div>Cargoes',
                        },
                    ],
                },
                {
                    xtype: 'proforma.cargo',
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-data a-archive-comment',
                    padding: '0 0 24 0',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    hidden: true,
                    bind: {
                        hidden: '{inquiry.is_archived && inquiry.archived_comment ? false : true}',
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
                            padding: '0 24',
                            bind: {
                                html: '{inquiry.archived_comment}',
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
            scrollable: true,
            flex: 1,
            bind: {
                hidden: '{inquiryRightCardMenu.selection.tab == "instructions" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    docked: 'top',
                    hidden: true,
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
                                                        fn: function() {
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
                                                    html: '{record.description}',
                                                },
                                                listeners: {
                                                    click: {
                                                        element: 'element',
                                                        delegate: 'a.instruction_link',
                                                        fn: function() {
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
            padding: '8 16',
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
                    text: 'View enquiry',
                    // bind: {
                    //     hidden: '{portcallsAgentTabbar.activeTabIndex == 0 ? false : true}'
                    // },
                    handler: function(me) {
                        let vm = me.upVM(),
                            activeTab = vm.get('portcallsAgentTabbar.activeTabIndex');
                        inquiry = vm.get('inquiry');
                        tab = 'Active grid';
                        if (activeTab == 1) {
                            tab = 'Closed grid';
                        }
                        mixpanel.track('View more button (десен панел) - ' + tab);
                        window.location.hash = '#inquiry/' + inquiry.get('id');
                    },
                },
            ],
        },
    ],
});
