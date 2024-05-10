Ext.define('Abraxa.view.operations.DisbursementsPrincipal.grids.DisbursementsPrincipalGridSubmitted', {
    extend: 'Ext.grid.Grid',
    xtype: 'DisbursementsPrincipalGridSubmitted',
    itemId: 'disbursementsPrincipalGridSubmitted',
    layout: 'fit',
    cls: 'abraxa-grid a-offset-grid',
    ui: 'bordered',
    scrollable: true,
    flex: 1,
    emptyText: 'There are no disbursements to display.',
    viewModel: 'DisbursementsPrincipalGridsViewModel',
    controller: 'DisbursementsPrincipalGridsController',
    stateful: ['plugins', 'columns'],
    stateId: 'disbursement-grid-principal-submitted',
    bind: {
        store: '{disbursementsPrincipal}',
    },
    itemConfig: {
        height: 64,
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
            text: 'Port',
            dataIndex: 'port',
            defaultWidth: 140,
            minWidth: 140,
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
            text: 'DA ID',
            dataIndex: 'da_id',
            minWidth: 110,
            width: 110,
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
            text: 'DA Type',
            dataIndex: 'type',
            minWidth: 110,
            width: 110,
            align: 'center',
            cell: {
                tpl: '<div class="a-val a-status-badge rounded text-uppercase status-{type}">{type}</div>',
                encodeHtml: false,
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
            text: 'Amount',
            dataIndex: 'total_costs',
            defaultWidth: 120,
            minWidth: 120,
            maxWidth: 120,
            align: 'right',
            cls: 'a-column-br a-column-bl',
            cell: {
                tpl: '<div class="a-val-md">{total_costs}</div>',
                cls: 'a-cell-br a-cell-bl',
                encodeHtml: false,
            },
        },
        {
            text: 'Status',
            dataIndex: 'status',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            cell: {
                tpl: '<div class="a-status-badge a-status-md status-{status}">{status:capitalize}</div>',
                encodeHtml: false,
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
    ],
    listeners: {
        childtap: 'redirectToDisbursement',
    },
});
