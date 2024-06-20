Ext.define('Abraxa.view.operations.PortCallsPricipal.grids.PortCallsPricipalGridPendingAppointments', {
    extend: 'Ext.grid.Grid',
    xtype: 'PortCallsPricipalGridPendingappointments',
    itemId: 'PortCallsPricipalGridPendingappointments',
    layout: 'fit',
    cls: 'abraxa-grid a-offset-grid',
    ui: 'bordered',
    scrollable: true,
    flex: 1,
    viewModel: 'portCallsPricipalGridsViewModel',
    controller: 'PortCallsPricipalGridsController',
    emptyText: 'There are no port calls to display.',
    stateful: ['plugins', 'columns'],
    stateId: 'portcalls-grid-principal-pending-appointments',
    bind: {
        store: '{portcallsPrincipal}',
        hideHeaders: '{!portcallsPrincipal.count}',
    },
    itemConfig: {
        height: 64,
        viewModel: {},
    },
    plugins: {
        gridviewoptions: true,
        gridexporter: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
            loadPages: true,
            toolbar: {
                bordered: true,
                nextButton: {
                    ui: 'tool-sm round',
                },
                prevButton: {
                    ui: 'tool-sm round',
                },
                listeners: {
                    initialize: function () {
                        this.add({
                            xtype: 'div',
                            margin: '0 16',
                            cls: 'sm-title',
                            bind: {
                                html: '<strong>{totalRecords}</strong> records',
                            },
                        });
                        this.add({
                            xtype: 'div',
                            width: '60%',
                        });
                    },
                },
            },
        },
    },

    columns: [
        {
            text: 'Vessel',
            dataIndex: 'vessel',
            minWidth: 220,
            width: 220,
            flex: 1,
            cls: 'a-header-offset-x24',
            cell: {
                cls: 'a-cell-offset-x24',
                tpl: '<tpl if="vessel && vessel.name"><div id="{id}" class="a-val-link-xl">{vessel.name}</div> <tpl else><span class="a-cell-placeholder">---</span></tpl>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link-xl',
                        // fn: 'openVesselInfoDialog',
                        fn: function (me, element, eOpts) {
                            let voyage = this.component.getRecord().getVoyage();
                            let record = this.component.getRecord();
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('voyage/' + voyage.get('id') + '/appoint/' + record.get('id'));
                        },
                    },
                },
            },
            sortable: false,
            exportRenderer: 'exportVesselNameRenderer',
        },
        {
            text: 'Port',
            dataIndex: 'port_name',
            defaultWidth: 140,
            minWidth: 140,
            flex: 1,
            sortable: false,
            cell: {
                tpl: '<div data-port-id="{port_id}" class="a-val-link-md">{port_name}</div>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link-md',
                        fn: 'openPortInfoDialog',
                    },
                },
            },
        },
        {
            text: 'ETA',
            dataIndex: 'port_eta',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            sortable: false,
            cls: 'a-column-bl a-column-br',
            cell: {
                tpl: [
                    '<div class="a-val-sub">',
                    '<tpl if="port_eta"><span class="fw-b"></span> {port_eta:date("d M - H:m")}<tpl else><span class="a-cell-placeholder">---</span></tpl>',
                    '</div>',
                ],
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
        },

        {
            text: 'Appointed agent',
            dataIndex: 'lead_agent',
            defaultWidth: 200,
            minWidth: 200,
            flex: 1,
            sortable: false,
            cell: {
                tpl: new Ext.XTemplate('{[this.renderOrganizationName(values.lead_agent)]}', {
                    renderOrganizationName: function (organization) {
                        if (organization && organization.org_name) {
                            return Abraxa.utils.Functions.renderOrganizationLink(
                                organization.org_id,
                                organization.org_name
                            );
                        }
                        return AbraxaConstants.placeholders.emptySpan;
                    },
                }),
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link',
                        fn: 'openCompanyInfo',
                    },
                },
            },
            exportRenderer: 'exportOrganizationNameRenderer',
        },
        {
            text: 'Status',
            dataIndex: 'status_name',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            sortable: false,
            cell: {
                tpl: '<div class="a-status-badge a-status-md status-pending">Pending</div>',
                encodeHtml: false,
            },
        },
        {
            text: 'Requested by',
            dataIndex: 'voyage',
            defaultWidth: 180,
            minWidth: 180,
            sortable: false,
            cell: {
                bind: {
                    tpl: '<div  id="{created_by.id}" class="a-val a-person a-icon-round"><img src="{created_by.profile_image}" height="30" alt=""><div class="a-val-link">{created_by.first_name.0}. {created_by.last_name}</div></div>',
                },
                viewModel: {
                    formulas: {
                        created_by: {
                            bind: {
                                bindTo: '{record.voyage}',
                            },
                            get: function (voyage) {
                                const createdBy = {
                                    id: null,
                                    first_name: AbraxaConstants.placeholders.emptyValue,
                                    last_name: AbraxaConstants.placeholders.emptyValue,
                                    profile_image: null,
                                };

                                createdBy.id = voyage.get('created_by_user').id;
                                createdBy.first_name = voyage.get('created_by_user').first_name;
                                createdBy.last_name = voyage.get('created_by_user').last_name;
                                createdBy.profile_image = voyage.get('created_by_user').profile_image
                                    ? voyage.get('created_by_user').profile_image
                                    : AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image.svg';

                                return createdBy;
                            },
                        },
                    },
                },

                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link',
                        fn: function (element, htmlEl, c) {
                            const userId = this.component.getViewModel().get('created_by').id;
                            this.component.up('grid').getController().openUserInfo(element, userId, c, this);
                        },
                    },
                },
            },
            exportRenderer: function (val, record) {
                if (record._voyage && record._voyage.get(AbraxaConstants.labels.createdByUser)) {
                    return (
                        record._voyage.get(AbraxaConstants.labels.createdByUser).first_name.at(0) +
                        '. ' +
                        record._voyage.get(AbraxaConstants.labels.createdByUser).last_name
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Requested date',
            minWidth: 140,
            sortable: false,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                let invitation = record
                    .invitations()
                    .findRecord(
                        'tenant_id',
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('current_company_id')
                    );
                if (invitation) {
                    return Ext.util.Format.date(invitation.get('created_at'), 'd M - H:m');
                }
                return AbraxaConstants.placeholders.emptySpan;
            },
            exportRenderer: function (val, record) {
                if (record && record._invitations) {
                    let invitation = record
                        .invitations()
                        .findRecord(
                            'tenant_id',
                            Ext.getCmp('main-viewport').upVM().get('currentUser').get('current_company_id')
                        );
                    if (invitation) {
                        return Ext.util.Format.date(invitation.get('created_at'), 'd M - H:m');
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            dataIndex: '',
            minWidth: 90,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    // {
                    //     xtype: 'button',
                    //     margin: '0 16',
                    //     ui: 'normal-light small',
                    //     iconCls: 'md-icon md-icon-notification-add',
                    //     text: 'Send reminder',
                    // },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            anchor: true,
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function (me) {
                            let portcall = me.ownerCmp.getRecord();
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo(
                                    'voyage/' + portcall.getVoyage().get('id') + '/appoint/' + portcall.get('id')
                                );
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childDoubleTap: 'gridsChildDoubleTap',
    },
});
