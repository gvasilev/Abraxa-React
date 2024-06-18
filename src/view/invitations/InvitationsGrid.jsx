Ext.define('Abraxa.view.invitations.InvitationsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'invitations.grid',
    ui: 'bordered',
    flex: 1,
    showNoPermissions: true,
    skipEditPermission: true,
    slug: 'portcallInvitations',
    cls: 'a-detailed-grid abraxa-grid a-invitations-grid a-offset-grid',
    bind: {
        store: 'invitations',
        permission: '{userPermissions}',
    },
    pinHeaders: false,
    keyMapEnabled: true,
    reference: 'invitationsGrid',
    keyMap: {
        scope: 'this',
        ESC: function () {
            Ext.ComponentQuery.query('[itemId=invitationRightContainer]')[0].hide();
        },
    },
    columnMenu: {
        xtype: 'menu',
        weighted: true,
        align: 'tl-bl?',
        hideOnParentHide: false,
        // persist when owning Column is hidden
        items: {
            sortAsc: {
                xtype: 'gridsortascmenuitem',
                group: 'sortDir',
                weight: -100,
            },
            // Wants to be the first
            sortDesc: {
                xtype: 'gridsortdescmenuitem',
                group: 'sortDir',
                weight: -90,
            },
            // Wants to be the second
            //---------------------------------
            // Columns menu is inserted here
            //---------------------------------
            groupByThis: null,
            showInGroups: null,
        },
    },
    // collapsible: {
    //     collapseToolText: 'Collapse group',
    //     tool: {
    //         ui: 'tool-md',
    //         margin: '0 0 0 -2',
    //         zone: 'start',
    //     }
    // },
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-658 -388)"><g transform="translate(-176 43)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M351.031,76.42h-2.478V56a3.723,3.723,0,0,0-3.717-3.717H333.618l-.3-.81a6.175,6.175,0,0,0-11.664,0l-.3.81H310.136A3.724,3.724,0,0,0,306.419,56v51.222a3.723,3.723,0,0,0,3.717,3.717h15.519a14.307,14.307,0,0,0,.892,2.478H310.138a6.2,6.2,0,0,1-6.2-6.2V56h0a6.2,6.2,0,0,1,6.2-6.2h9.532a8.638,8.638,0,0,1,15.628,0h9.532a6.2,6.2,0,0,1,6.2,6.2V76.42M313.441,68.8h0a1.652,1.652,0,0,0,1.652,1.652h24.758A1.652,1.652,0,0,0,341.5,68.8h0a1.652,1.652,0,0,0-1.652-1.652H315.093a1.652,1.652,0,0,0-1.652,1.652Zm0,16.52h0a1.652,1.652,0,0,0,1.652,1.652l12.758.06A1.652,1.652,0,0,0,329.5,85.38h0a1.652,1.652,0,0,0-1.652-1.652l-12.758-.06a1.652,1.652,0,0,0-1.652,1.651Zm0,8.26h0a1.652,1.652,0,0,0,1.652,1.652h6.758A1.652,1.652,0,0,0,323.5,93.58h0a1.652,1.652,0,0,0-1.652-1.652h-6.758a1.652,1.652,0,0,0-1.652,1.651Zm0-16.52h0a1.652,1.652,0,0,0,1.652,1.652h18.758A1.652,1.652,0,0,0,335.5,77.06h0a1.652,1.652,0,0,0-1.652-1.652H315.093a1.652,1.652,0,0,0-1.652,1.651ZM327.49,49.8a3.72,3.72,0,1,0,3.71,3.72,3.72,3.72,0,0,0-3.71-3.72Zm1.85,3.72a1.855,1.855,0,1,1,0-.01Z" transform="translate(391.063 370.158)" fill="#c8d4e6"/><path d="M11.333,16.667C8.213,16.667,2,18.227,2,21.333v2.333H20.667V21.333C20.667,18.227,14.453,16.667,11.333,16.667ZM5.12,21a12.856,12.856,0,0,1,6.213-1.667A12.856,12.856,0,0,1,17.547,21Zm6.213-6.667A4.667,4.667,0,1,0,6.667,9.667,4.672,4.672,0,0,0,11.333,14.333Zm0-6.667a2,2,0,1,1-2,2A2,2,0,0,1,11.333,7.667Zm9.387,9.08a5.59,5.59,0,0,1,2.613,4.587v2.333h5.333V21.333C28.667,18.64,24,17.107,20.72,16.747Zm-1.387-2.413a4.667,4.667,0,1,0,0-9.333,4.594,4.594,0,0,0-2,.467,7.282,7.282,0,0,1,0,8.4A4.594,4.594,0,0,0,19.333,14.333Z" transform="translate(725.667 453.667)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No pending invitations</div></div>',
            },
        ],
    },
    // groupHeader: {
    //     xtype: 'custom-grouper',
    //     tpl: '<div class="a-group-header status-{[values.children[0].data.status]}">{[values.children[0].data.status]} ({count})</div>',
    // },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            height: 64,
            cls: 'a-titlebar a-bb-100',
            bind: {
                items: [
                    {
                        xtype: 'title',
                        bind: {
                            title: 'Port call invitations',
                        },
                    },
                    '{segmentedButtons}',
                ],
            },
        },
    ],
    // collapsible: false,
    // hideHeaders: true,
    itemConfig: {
        height: 58,
        bind: {
            cls: 'a-detailed-item {styleRow}',
        },
        viewModel: {
            formulas: {
                styleRow: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record && record.get('status')) {
                            return record.get('status').toLowerCase();
                        }
                    },
                },
            },
        },
    },
    columns: [
        {
            text: 'ID',
            minWidth: 140,
            cls: 'a-column-id',
            cell: {
                cls: 'a-cell-file-id a-cell-offset-x24 expand',
                encodeHtml: false,
                bind: {
                    tpl: '{(record.voyage.portcall && record.voyage.portcall.file_id)  ? record.voyage.portcall.file_id:"---"}',
                },
            },
        },
        {
            text: 'Vessel',
            minWidth: 180,
            flex: 1,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                bind: {
                    tpl: '<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate" href="javascript:void(0)" title="{record.voyage.vessel_name}">{record.voyage.vessel_name ? record.voyage.vessel_name : "TBN" }</a>',
                },
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.a-vessel-name',

                        fn: function fn() {
                            let imo,
                                record = this.component.getRecord().getVoyage();
                            if (record.get('vessel')) {
                                imo = record.get('vessel').id;
                            }
                            if (imo) {
                                Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                            }
                        },
                    },
                },
            },
        },
        {
            text: 'Port itinerary',
            dataIndex: 'port_eta',
            minWidth: 160,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                actionType: 'prospects',
                listeners: {
                    click: {
                        element: 'element',
                        fn: function (el) {
                            if (el.target.classList[1] == 'open_action_center') {
                                Ext.ComponentQuery.query('appointments-grid')[0].getController().loadActionCenter(el);
                            } else if (el.target.classList[1] == 'a-port-eta') {
                                let portId = el.target.getAttribute('data-portid');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            }
                        },
                    },
                },
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '>',
                // optional configs
                // value: 'star', // setting a value makes the filter active.
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    padding: 3,
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.get('port_eta') < b.get('port_eta') ? -1 : a.get('port_eta') > b.get('port_eta') ? 1 : 0;
                },
            },
            renderer: function (value, invitation) {
                if (invitation && invitation.getVoyage() && invitation.getVoyage().getPortcall()) {
                    let record = invitation.getVoyage().getPortcall(),
                        port_function = record.getNomination().get('port_function');

                    if (record && port_function) {
                        return Abraxa.utils.Functions.portRenderer(record);
                    }
                }
            },
        },
        {
            text: 'Function',
            dataIndex: 'port_function',
            minWidth: 160,
            cell: {
                cls: 'expand a-cell-function',
                encodeHtml: false,
            },
            filterType: {
                type: 'string',
                operator: '=',
                operators: ['='],
                fieldDefaults: {
                    clearable: true,
                    ui: 'classic',
                    padding: 3,
                    xtype: 'combobox',
                    displayField: 'name',
                    valueField: 'name',
                    store: {
                        type: 'berth.function',
                    },
                },
            },
            renderer: function renderer(val, record) {
                if (record) {
                    return '<div class="a-function function-' + val + '"><span>' + val + '</span></div>';
                }
            },
        },
        {
            text: 'Cargo',
            minWidth: 180,
            cell: {
                cls: 'expand',
                encodeHtml: false,

                tpl: new Ext.XTemplate(
                    // '<tpl for="record">',
                    '{[this.create(values.voyage)]}',
                    {
                        create: function (voyage) {
                            if (
                                voyage &&
                                voyage.portcall &&
                                voyage.portcall.nomination.cargoes &&
                                voyage.portcall.nomination.cargoes.length == 1
                            ) {
                                let cargo = voyage.portcall.nomination.cargoes[0],
                                    quantity = numeral(cargo.quantity).format('0,0.[000]');
                                return (
                                    '<div class="a-cargo"><span class="fw-b">' +
                                    quantity +
                                    '</span> ' +
                                    cargo.bl_unit +
                                    '</div><span><a class="a_grid_action fw-n" href="javascript:void(0)" data-commodityid="' +
                                    cargo.commodity_id +
                                    '">' +
                                    cargo.commodity +
                                    '</a></span>'
                                );
                            } else if (
                                voyage &&
                                voyage.portcall &&
                                voyage.portcall.nomination.cargoes &&
                                voyage.portcall.nomination.cargoes.length > 1
                            ) {
                                return (
                                    '<span class="a-cargo cargo-multiple">* Multiple <span class="a-count-badge count-link">+' +
                                    (voyage.portcall.nomination.cargoes.length - 1) +
                                    '</span></span>'
                                );
                            }
                            return AbraxaConstants.placeholders.emptyValue;
                        },
                    }
                    // '</tpl>'
                ),
                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.a_grid_action',
                        fn: function (item, el, eOpts) {
                            var commodity_id = parseInt(item.currentTarget.getAttribute('data-commodityid'));

                            if (commodity_id) Abraxa.Global.showCommodityDialog(commodity_id);
                        },
                    },
                },
            },
        },
        {
            text: 'Request from',
            dataIndex: 'company',
            minWidth: 220,
            cell: {
                cls: 'expand a-cell-company',
                tpl: new Ext.XTemplate('{[this.create(values.company)]}', {
                    create: function (company) {
                        if (company) {
                            label =
                                '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                                company.id +
                                '">' +
                                company.name +
                                '</a>';
                            return label;
                        }
                    },
                }),
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            let record = this.component.getRecord(),
                                vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations');
                            if (record.get('company')) {
                                let email = record.get('company').email,
                                    orgRecord = organizations.findRecord('org_email', email, 0, false, false, true);
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
                encodeHtml: false,
            },
        },
        {
            text: 'Sent to',
            dataIndex: 'org_id',
            minWidth: 220,
            hidden: true,
            cell: {
                cls: 'expand a-cell-company',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            let vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations'),
                                company_id = el.target.getAttribute('data-company_id'),
                                orgRecord = organizations.getById(company_id);
                            if (orgRecord) {
                                Abraxa.getApplication()
                                    .getController('AbraxaController')
                                    .showOrganizationTooltip(company_id, el);
                            }
                        },
                    },
                },
                encodeHtml: false,
                renderer: function (value, record) {
                    var label = AbraxaConstants.placeholders.emptyValue;
                    if (value) {
                        if (record) {
                            label =
                                '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                                record.get('org_id') +
                                '">' +
                                record.get('org_name') +
                                '</a>';
                        }
                    }
                    return label;
                },
            },
        },
        {
            text: 'Status',
            dataIndex: 'status',
            minWidth: 140,
            cell: {
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="a-status-badge a-status-md status-' + value.toLowerCase() + '">' + value + '</div>'
                    );
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Sent',
            minWidth: 160,
            dataIndex: 'created_at',
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    // let dateString,
                    //     cls,
                    //     diff,
                    //     dateCreated = moment.utc(value),
                    //     now = moment(),
                    //     label = 'Received';
                    // currentUser = this.upVM().get('currentUser');
                    // if (record.get('company_id') == currentUser.get('current_company_id')) {
                    //     label = 'Sent';
                    // }
                    // if (moment(value).isSame(moment(), 'day')) {
                    //     if (now.diff(dateCreated, 'minutes') > 0 && now.diff(dateCreated, 'minutes') < 60) {
                    //         diff = now.diff(dateCreated, 'minutes');
                    //         dateString = diff + ' minute/s ago';
                    //     } else if (now.diff(dateCreated, 'hours') >= 1) {
                    //         diff = now.diff(dateCreated, 'hours');
                    //         dateString = diff + ' hour/s ago';
                    //     }
                    // } else {
                    //     dateCreated = moment(value),
                    //         now = moment();
                    //     if (now.diff(dateCreated, 'hours') < 24) {
                    //         diff = now.diff(dateCreated, 'hours');
                    //         dateString = diff + ' hour/s ago';
                    //     } else {
                    //         diff = now.diff(dateCreated, 'days');
                    //         dateString = diff + ' day/s ago';
                    //     }
                    // }

                    // if (now.diff(dateCreated, 'hours') >= 12 && now.diff(dateCreated, 'hours') < 24) {
                    //     cls = 'c-yellow';
                    // } else if (now.diff(dateCreated, 'hours') > 24) {
                    //     cls = 'c-red';
                    // }

                    return (
                        '<span class="a-date">' +
                        Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(value, AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24) +
                        '</span>'
                    );
                }
            },
        },
        {
            dataIndex: '',
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            minWidth: 110,
            flex: 1,
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (item, location, eOpts) {
            if (location.event.target.classList.contains('a_grid_action')) return false;

            let invitation = location.record,
                container = this.find('invitationRightContainer'),
                mainBody = container.getItems().items[1];
            if (invitation) {
                mainBody.getVM().set('invitation', invitation);
                container.show();
            }
        },
    },
});
