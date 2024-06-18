Ext.define('Abraxa.view.operations.DisbursementsPrincipal.grids.DisbursementsPrincipalGridAll', {
    extend: 'Ext.grid.Grid',
    xtype: 'DisbursementsPrincipalGridAll',
    itemId: 'disbursementsPrincipalGridAll',
    layout: 'fit',
    cls: 'abraxa-grid a-offset-grid',
    ui: 'bordered',
    scrollable: true,
    flex: 1,
    emptyText: 'There are no disbursements to display.',
    viewModel: 'DisbursementsPrincipalGridsViewModel',
    controller: 'DisbursementsPrincipalGridsController',
    stateful: ['plugins', 'columns'],
    stateId: 'disbursement-grid-principal-all',
    bind: {
        store: '{disbursementsPrincipal}',
    },
    itemConfig: {
        height: 64,
        viewModel: {
            formulas: {
                balanceFormingColumn: {
                    bind: {
                        bindTo: '{record}',
                    },
                    get: function (record) {
                        let column;

                        if (record.get('type') === 'pda' && record.get('status') == 'draft') {
                            column = 'pda';
                        } else if (record.get('type') === 'dda' && record.get('status') == 'draft') {
                            column = 'dda';
                        } else if (record.get('type') === 'fda' && record.get('status') == 'draft') {
                            column = 'fda';
                        }
                        return column;
                    },
                },
            },
        },
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
                            bind: {
                                html: '<div class="h5">Total open balance</div><div class="a-billed-price c-red"><span class="a-billed-currency">{currentCompany.default_currency}</span><span class="a-billed-amount">{totalBalance}</span></div>',
                            },
                        });
                    },
                },
            },
        },
    },

    columns: [
        {
            text: 'Port call ID',
            minWidth: 120,
            dataIndex: 'file_id',
            cell: {
                cls: 'expand a-cell-file-id',
            },
            sorter: {
                property: 'portcall.file_id',
            },
        },
        {
            text: 'Voyage ID',
            dataIndex: 'voyage_number',
            minWidth: 130,
            width: 130,
            flex: 1,
            cls: 'a-header-offset-x24',
            hidden: true,
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            sorter: {
                property: 'portcall.nomination.voyage_number',
            },
            renderer: function (value, record) {
                if (record.get(AbraxaConstants.labels.voyageNumber)) {
                    return record.get(AbraxaConstants.labels.voyageNumber);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Vessel',
            dataIndex: 'vessel',
            minWidth: 220,
            width: 220,
            flex: 1,
            cell: {
                tpl: '<tpl if="vessel.name"><div data-vessel-id="{vessel.id}" class="a-val-link-xl vessel-name-click">{vessel.name}</div> <tpl else><div>---</div></tpl>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link-xl',
                        fn: 'showVesselDialog',
                    },
                },
            },
            sorter: {
                property: 'portcall.voyage.vessel.name',
            },
            exportRenderer: function (value, record) {
                if (record.get(AbraxaConstants.labels.vessel) && record.get(AbraxaConstants.labels.vessel).name) {
                    return record.get(AbraxaConstants.labels.vessel).name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'DA ID',
            dataIndex: 'da_id',
            minWidth: 110,
            width: 110,
            flex: 1,
            cls: 'a-column-bl a-column-br a-column-bgr',
            cell: {
                tpl: '<div class="a-val">{da_id}</div>',
                cls: 'a-cell-bl a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            sorter: {
                property: 'group_id',
            },
        },
        {
            text: 'DA Stage',
            dataIndex: 'type',
            defaultWidth: 160,
            minWidth: 160,
            maxWidth: 160,
            cell: {
                tpl: '<div class="a-val-hbox"><span class="a-badge-da-stage a-badge-da-stage-{status}"></span><span class="fw-b text-uppercase mx-6">{type}</span><span class="a-val">{status:capitalize}</span></div>',
                encodeHtml: false,
            },
            exportRenderer: function (value, record) {
                return record.get('type').toUpperCase() + ' ' + record.get('status');
            },
        },

        {
            text: 'Port',
            dataIndex: 'port',
            defaultWidth: 140,
            minWidth: 140,
            flex: 1,
            cell: {
                tpl: '<div data-port-id="{port.id}" class="a-val-link-md">{port.name}</div>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link-md',
                        fn: 'showPortDialog',
                    },
                },
            },
            sorter: {
                property: 'portcall.port_name',
            },
            exportRenderer: function (value, record) {
                if (value && value.name) {
                    return value.name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'ETD / ATD',
            dataIndex: 'ETD_ATD',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            cell: {
                tpl: '<div class="a-val-md">{ETD_ATD}</div>',
                encodeHtml: false,
            },
            sorter: {
                property: 'portcall.port_ETD_ATD',
            },
        },
        {
            text: 'ETA / ATA',
            dataIndex: 'ETA_ATA',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            hidden: true,
            cell: {
                tpl: '<div class="a-val-md">{ETA_ATA}</div>',
                cls: 'a-cell-date a-cell-bl a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            sorter: {
                property: 'portcall.port_ETA_ATA',
            },
        },
        {
            dataIndex: 'port_eta',
            text: 'ETA',
            minWidth: 150,
            hidden: true,
            cell: {
                cls: 'a-cell-date a-cell-bl a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            sorter: {
                property: 'portcall.port_eta',
            },
        },
        {
            dataIndex: 'port_etb',
            text: 'ETB',
            minWidth: 150,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            sorter: {
                property: 'portcall.port_etb',
            },
        },
        {
            dataIndex: 'port_ata',
            text: 'ATA',
            minWidth: 150,
            hidden: true,
            cell: {
                cls: 'a-cell-date a-cell-bl a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            sorter: {
                property: 'portcall.port_ata',
            },
        },
        {
            dataIndex: 'port_atd',
            text: 'ATD',
            minWidth: 150,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            sorter: {
                property: 'portcall.port_atd',
            },
        },
        {
            text: 'Lead agent',
            dataIndex: 'lead_agent',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            cell: {
                tpl: '<div data-organization-id="{lead_agent.id}" class="a-val-link lead-agent-click">{lead_agent.name}</div>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            sorter: {
                property: 'portcall.nomination.lead_agent_name',
            },

            exportRenderer: function (value, record) {
                if (record.get(AbraxaConstants.labels.leadAgent) && record.get(AbraxaConstants.labels.leadAgent).name) {
                    return record.get(AbraxaConstants.labels.leadAgent).name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Sub agent',
            dataIndex: 'sub_agent',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            hidden: true,
            cell: {
                tpl: '<div data-organization-id="{sub_agent.org_id}" class="a-val-link lead-agent-click"><tpl if="sub_agent.org_name">{sub_agent.org_name}<tpl else>---</tpl></div>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            sorter: {
                property: 'portcall.nomination.sub_agent_name',
            },

            exportRenderer: function (value, record) {
                if (
                    record.get(AbraxaConstants.labels.subAgent) &&
                    record.get(AbraxaConstants.labels.subAgent).org_name
                ) {
                    return record.get(AbraxaConstants.labels.subAgent).org_name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Appointing party',
            dataIndex: 'appointing_party',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            hidden: true,
            cell: {
                tpl: '<div data-organization-id="{appointing_party.org_id}" class="a-val-link lead-agent-click"><tpl if="appointing_party.org_name">{appointing_party.org_name}<tpl else>---</tpl></div>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            sorter: {
                property: 'portcall.nomination.appointing_party_name',
            },

            exportRenderer: function (value, record) {
                if (
                    record.get(AbraxaConstants.labels.appointingParty) &&
                    record.get(AbraxaConstants.labels.appointingParty).org_name
                ) {
                    return record.get(AbraxaConstants.labels.appointingParty).org_name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Nominating party',
            dataIndex: 'nominating_party',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            hidden: true,
            cell: {
                tpl: '<div data-organization-id="{nominating_party.org_id}" class="a-val-link lead-agent-click"><tpl if="nominating_party.org_name">{appointing_party.org_name}<tpl else>---</tpl></div>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            sorter: {
                property: 'portcall.nomination.nominating_party_name',
            },

            exportRenderer: function (value, record) {
                if (
                    record.get(AbraxaConstants.labels.nominatingParty) &&
                    record.get(AbraxaConstants.labels.nominatingParty).org_name
                ) {
                    return record.get(AbraxaConstants.labels.nominatingParty).org_name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Currency',
            dataIndex: 'base_currency',
            defaultWidth: 85,
            minWidth: 85,
            maxWidth: 85,
            align: 'center',
            cls: 'a-column-bl',
            cell: {
                tpl: '<div class="a-val">{base_currency}</div>',
                cls: 'a-cell-bl',
                encodeHtml: false,
            },
        },
        {
            text: 'PDA',
            dataIndex: 'sorting_pda_total_costs',
            defaultWidth: 120,
            minWidth: 120,
            maxWidth: 120,
            align: 'right',
            cls: 'a-column-bl a-column-bgr',
            cell: {
                tpl: '<tpl if="sorting_pda_total_costs"><span class="a-val-md">{sorting_pda_total_costs}</span><tpl else><span class="a-val-disabled">0.00</span></tpl>',
                cls: 'a-cell-bl a-cell-bgr',
                bind: {
                    cls: '{balanceFormingColumn === "pda" ? "a-cell-disabled" : "a-cell-md"} a-cell-bl a-cell-bgr',
                },
                encodeHtml: false,
            },
            sorter: {
                property: 'pda.total_costs',
            },
        },
        {
            text: 'DDA',
            dataIndex: 'sorting_dda_total_costs',
            defaultWidth: 120,
            minWidth: 120,
            maxWidth: 120,
            align: 'right',
            cls: 'a-column-bl',
            cell: {
                tpl: '<tpl if="sorting_dda_total_costs"><span class="a-val-md">{sorting_dda_total_costs}</span><tpl else><span class="a-val-disabled">0.00</span></tpl>',
                cls: 'a-cell-bl',
                bind: {
                    cls: '{balanceFormingColumn === "dda" ? "a-cell-disabled" : "a-cell-md"} a-cell-bl',
                },
                encodeHtml: false,
            },
            sorter: {
                property: 'dda.total_costs',
            },
        },
        {
            text: 'FDA',
            dataIndex: 'sorting_fda_total_costs',
            defaultWidth: 120,
            minWidth: 120,
            maxWidth: 120,
            align: 'right',
            cls: 'a-column-bl a-column-bgr',
            cell: {
                tpl: '<tpl if="sorting_fda_total_costs"><span class="a-val-md">{sorting_fda_total_costs}</span><tpl else><span class="a-val-disabled">0.00</span></tpl>',
                cls: 'a-cell-bl a-cell-bgr',
                bind: {
                    cls: '{balanceFormingColumn === "fda" ? "a-cell-disabled" : "a-cell-md"} a-cell-bl a-cell-bgr',
                },
                encodeHtml: false,
            },
            sorter: {
                property: 'fda.total_costs',
            },
        },
        {
            text: 'My payments',
            dataIndex: 'my_payments',
            sortable: false,
            defaultWidth: 120,
            minWidth: 120,
            maxWidth: 120,
            align: 'right',
            cls: 'a-column-bl',
            cell: {
                cls: 'a-cell-bl',
                encodeHtml: false,
            },
            renderer: function (value) {
                return '<div class="a-val-md">' + value + '</div>';
            },
        },
        {
            text: 'Refund',
            dataIndex: 'refund',
            defaultWidth: 120,
            minWidth: 120,
            maxWidth: 120,
            hidden: true,
            align: 'right',
            cls: 'a-column-bl',
            cell: {
                cls: 'a-cell-bl',
                encodeHtml: false,
            },
            renderer: function (value) {
                return '<div class="a-val-md">' + value + '</div>';
            },
        },
        {
            text: 'Balance',
            dataIndex: 'balance',
            sortable: false,
            defaultWidth: 120,
            minWidth: 120,
            maxWidth: 120,
            align: 'right',
            cls: 'a-column-bl a-column-br a-column-bgr',
            cell: {
                cls: 'a-cell-bl a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            renderer: function (value) {
                colorCls = '';
                if (Ext.isNumber(value)) {
                    if (Ext.Number.sign(value) === -1) {
                        colorCls = 'c-red';
                    }
                    if (Ext.Number.sign(value) === 1) {
                        colorCls = 'c-green';
                    }
                }
                return '<div class="a-val-md ' + colorCls + '">' + value + '</div>';
            },
        },
        {
            dataIndex: 'tags',
            minWidth: 180,
            text: 'Labels',
            sortable: false,
            menuDisabled: true,
            hidden: true,
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                return Abraxa.utils.Functions.renderDisbursementLabels(value);
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
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: 'redirectToDisbursement',
    },
});
