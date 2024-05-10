Ext.define('Abraxa.view.voyages.VoyagesGridClosed', {
    extend: 'Ext.grid.Grid',
    xtype: 'voyages.grid.closed',
    flex: 1,
    margin: '8 16 16 16',
    shadow: true,
    cls: 'border-radius a-bgr-white abraxa-grid',
    bind: {
        store: '{inquiryArchived}',
    },
    itemConfig: {
        viewModel: true,
    },
    columns: [
        {
            text: 'ID',
            dataIndex: 'custom_id',
            cls: 'a-cell-id',
            width: 60,
            renderer: function (value, record) {
                if (record && record.get('custom_company_id')) {
                    return record.get('custom_company_id').id;
                } else {
                    return '';
                }
            },
        },
        {
            dataIndex: 'voyage2',
            text: 'Vessel',
            stateId: 'vesse_imo',
            minWidth: 160,
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
                            var imo = this.component.getRecord().getVoyage().get('vessel_imo');
                            if (imo) {
                                Ext.create('Abraxa.view.common.dialog.Vessel', {
                                    viewModel: {
                                        data: {
                                            vessel_imo: imo,
                                        },
                                    },
                                }).show();
                            }
                        },
                    },
                },
            },
        },
        {
            text: 'Port requested',
            dataIndex: 'port_requested',
            xtype: 'templatecolumn',
            tpl: new Ext.XTemplate('{[this.create(values.voyage)]}', {
                create: function (voyage) {
                    let data = AbraxaConstants.placeholders.emptyValue;
                    if (voyage && voyage.port) {
                        data =
                            '<a href="javascript:void(0)" class="a_grid_action" data-portid="' +
                            voyage.port.id +
                            '">' +
                            voyage.port.name +
                            '</a>';
                    }
                    return data;
                },
            }),
            flex: 1,
            minWidth: 160,
            cell: {
                cls: 'expand a-cell-port',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            var me = this;
                            var cmp = me.component;
                            var portId = el.currentTarget.getAttribute('data-portid');
                            let porstsServed = cmp.up('grid').upVM().get('portsServed');
                            if (portId) {
                                let portsServedRecord = porstsServed.findRecord('port_id', portId);
                                let portDialog = Ext.create('Abraxa.view.common.dialog.PortMain'),
                                    portDialogVM = portDialog.getVM(),
                                    portModel = new Abraxa.model.common.Port({
                                        id: portId,
                                    });
                                portModel.load({
                                    success: function () {
                                        portDialogVM.set('record', portModel);
                                        if (portsServedRecord) {
                                            portDialogVM.set('getIsPortServed', true);
                                        }
                                        portDialog.show();
                                    },
                                });
                            }
                        },
                    },
                },
            },
        },
        {
            text: 'Function',
            dataIndex: 'port_function',
            minWidth: 130,
            cell: {
                cls: 'expand a-cell-function',
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                return '<div class="a-function function-' + val + '"><span>' + val + '</span></div>';
            },
        },
        {
            text: 'Cargo',
            minWidth: 160,
            dataIndex: 'cargoes',
            flex: 1,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                tpl: new Ext.XTemplate(
                    // '<tpl for="record">',
                    '{[this.create(values.cargoes)]}',
                    {
                        create: function (cargoes) {
                            if (cargoes.length == 1) {
                                let cargo = cargoes[0],
                                    quantity = numeral(cargo.bl_quantity).format('0,0.[000]');

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
                            } else if (cargoes.length > 1) {
                                return (
                                    '<span class="a-cargo cargo-multiple">* Multiple <span class="a-count-badge count-link">+' +
                                    (cargoes.length - 1) +
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
            text: 'Principal',
            dataIndex: 'parties',
            minWidth: 180,
            cell: {
                cls: 'expand a-cell-company',
                tpl: new Ext.XTemplate('{[this.create(values.parties)]}', {
                    create: function (data) {
                        var label = AbraxaConstants.placeholders.emptyValue;
                        if (data.length > 0) {
                            Ext.each(data, function (value) {
                                if (value.function == 'Appointing') {
                                    let counterPartyName = '';
                                    if (value.counter_party_types) {
                                        counterPartyName = value.counter_party_types.name;
                                    }
                                    label =
                                        '<div class="party-item">' +
                                        '<div class="sm-function function-A">A</div>' +
                                        '<label class="sm-type">' +
                                        counterPartyName +
                                        '</label>' +
                                        '<div class="sm-company text-truncate"><a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                                        value.organization.org_id +
                                        '">' +
                                        value.organization.org_name +
                                        '</a></div>' +
                                        '</div>';
                                }
                            });
                        }
                        return label;
                    },
                }),
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            var company_id = el.target.getAttribute('data-company_id');
                            let vm = this.component.up('grid').upVM();
                            var tooltip_el = Ext.create('Abraxa.view.common.tooltips.CompanyToolTip', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        company_id: company_id,
                                        clickedElement: el.target,
                                    },
                                },
                            }).showBy(el, 'bc-tc?');
                        },
                    },
                },
                encodeHtml: false,
            },
        },
        {
            dataIndex: 'status_name',
            width: 120,
            minWidth: 120,
            text: 'Status',
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record && record.get('status_data')) {
                    return (
                        '<div class="a-status-badge status-xl status-' +
                        record.get('status_data').name.replace(/\s+/g, '-').toLowerCase() +
                        '">' +
                        record.get('status_data').name +
                        '</div>'
                    );
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Archived at',
            dataIndex: 'status_history',
            //renderer: Ext.util.Format.dateRenderer('d M y - H:i'),
            width: 160,
            cell: {
                cls: 'a-cell-eta',
            },
            exportRenderer: true,
            renderer: function renderer(last_status) {
                if (last_status) {
                    let status = last_status;

                    return moment(status.updated_at).format(AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24);
                }

                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Archived by',
            dataIndex: 'status_history',
            width: 160,
            cell: {
                cls: 'a-cell-person',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.person_details',
                        fn: function fn(el) {
                            var user_id = this.component.getRecord().get('status_history').updated_by;
                            var tooltip_el = Ext.create('Abraxa.view.common.PersonToolTip', {
                                viewModel: {
                                    data: {
                                        user_id: user_id,
                                        clickedElement: el.target,
                                    },
                                },
                            }).showBy(el, 'bc-tc?');
                        },
                    },
                },
            },
            renderer: function (last_status) {
                if (last_status) {
                    let storeUsers = this.upVM().get('users');
                    let recordUser = storeUsers.findRecord('id', last_status.updated_by);
                    if (recordUser) {
                        var assigned_to = recordUser.get('first_name')[0] + '.' + recordUser.get('last_name');
                        return (
                            '<div class="a-person"><i class = "material-icons md-18">person</i><a class="person_details" href="javascript:void(0)">' +
                            assigned_to +
                            '</a></div>'
                        );
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            maxWidth: 50,
            sortable: false,
            menuDisabled: true,
            hideable: false,
            docked: 'right',
            resizable: false,
            cell: {
                cls: 'a-cell-more',
                tools: [
                    {
                        iconCls: 'md-icon-more-horiz',
                        ui: 'round',
                        handler: function (owner, tool, e) {
                            let record = tool.record,
                                vm = this.up('grid').upVM();
                            Ext.create('Abraxa.view.inquiries.InquiriesArchivedMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        inquiry_record: record,
                                        call_from_grid: true,
                                        is_archived: true,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childsingletap: function (grid, location, eOpts) {},
        childdoubletap: function childdoubletap(item, location, eOpts) {
            let record = location.record;
            window.location.hash = '#inquiry/' + record.get('id');
        },
    },
});
