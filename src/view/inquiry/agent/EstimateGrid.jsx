Ext.define('Abraxa.view.inquiry.agent.EstimateGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'inquiry.estimate.grid',
    flex: 1,
    slug: 'estimateGrid',
    ui: 'bordered',
    reference: 'estimateGrid',
    scrollable: true,
    hidden: true,
    cls: 'abraxa-grid a-disbursements-grid a-offset-grid',
    stateful: true,
    stateId: 'estimate-grid',
    itemId: 'estimate-grid',
    infinite: false,
    pinHeaders: false,
    selectable: {
        deselectable: true,
    },
    store: [],
    bind: {
        store: '{inquiriesPdas}',
        hideHeaders: '{inquiriesPdas.count ? false : true}',
    },
    collapsible: false,
    scrollToTopOnRefresh: false,
    items: [
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    items: [
                        {
                            xtype: 'div',
                            itemId: 'mainTitle',
                            cls: 'a-main-title',
                            html: '<h1>My estimates</h1>',
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'hovered-underline',
                            bind: {
                                hidden: '{defaultHiddenItems}',
                            },
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search...',
                            width: 280,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var storeInquiries = this.upVM().get('inquiriesPdas');
                                    if (newValue === '') storeInquiries.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                                    var storeInquiries = this.upVM().get('inquiriesPdas');
                                    storeInquiries.removeFilter('search');
                                    if (query.length > 2) {
                                        storeInquiries.addFilter({
                                            id: 'search',
                                            property: 'search',
                                            operator: '=',
                                            value: query,
                                            exactMatch: true,
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            hidden: true,
                            bind: {
                                hidden: '{defaultHiddenItems}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-br-100',
                                    padding: '0 8 0 0',
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            enableToggle: true,
                                            iconCls: 'md-icon-inventory-2 md-icon-outlined',
                                            text: 'Archive',
                                            handler: function (me) {
                                                let store = this.find('estimate-grid').getStore(),
                                                    toggled = this.getPressed();

                                                if (toggled) {
                                                    store.getProxy().setExtraParam('archived', 1);
                                                    me.upVM().set('inquiryPdasArchiveMode', true);
                                                } else {
                                                    store.getProxy().setExtraParam('archived', 0);
                                                    me.upVM().set('inquiryPdasArchiveMode', false);
                                                }
                                                store.loadPage(1);
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'GridFiltersButton',
                                    gridItemId: 'estimate-grid',
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    ui: 'tool-text-sm',
                                    arrow: false,
                                    text: 'Export',
                                    margin: '0 0 0 8',
                                    slug: 'portcallGridExport',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    menu: {
                                        items: [
                                            // {
                                            //     text: 'Export to PDF',
                                            //     slug: 'portcallExportPDF',
                                            //     bind: {
                                            //         permission: '{userPermissions}',
                                            //     },
                                            //     iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                            //     handler: function () {
                                            //     },
                                            // },
                                            {
                                                text: 'Export to Excel',
                                                separator: true,
                                                iconCls: 'md-icon-outlined md-icon-difference',
                                                handler: function (me) {
                                                    let grid = this.find('estimate-grid');
                                                    grid.saveDocumentAs({
                                                        type: 'xlsx', // exporter alias
                                                        title: 'Estimates',
                                                        showSummary: true,
                                                        fileName: 'Estimates.xlsx',
                                                    });
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-settings',
                                    text: 'Customize',
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        this.find('estimate-grid').getPlugin('gridviewoptions').showViewOptions();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
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
                                html: '<strong>{totalInquiryPdaRecords}</strong> records',
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
        gridfilterbar: {
            hidden: true,
            stateful: true,
        },
    },
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No proforma estimates available</div></div>',
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
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
                            return record.get('status');
                        }
                    },
                },
            },
        },
    },
    columns: [
        {
            text: 'Disbursement ID',
            dataIndex: 'group_id',
            minWidth: 120,
            hidden: true,
            cell: {
                encodeHtml: false,
                cls: 'a-cell-file-id',
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    padding: '0 0 0 12',
                    placeholder: 'ID',
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return '<span title="disbusment-id">' + value + '</span>';
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: true,
        },
        {
            text: 'DA name / ID',
            minWidth: 180,
            dataIndex: 'name',
            cls: 'a-column-offset-x24',
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    padding: '0 0 0 12',
                    placeholder: 'Enter DA name / ID',
                    // any Ext.form.field.Text configs accepteds
                },
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-offset-x24',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.proforma_link',
                        fn: function fn() {
                            let record = this.component.getRecord();
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('inquiry/' + record.getInquiry().get('id') + '/pda/' + record.get('id'));
                        },
                    },
                },
            },
            flex: 1,
            renderer: function (val, record) {
                if (val) {
                    return (
                        '<div class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="pda" data-icon="money"></span><div class="ml-12 text-truncate"><a class="fw-b cursor-pointer proforma_link" href="javascript:void(0);">' +
                        val +
                        '</a><div class="sm-title text-truncate">' +
                        record.get('group_id') +
                        '</div></div></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: 'vessel_name',
            text: 'Vessel name',
            minWidth: 180,
            stateId: 'vesse_imo',
            flex: 1,
            filterType: {
                // required configs
                type: 'string',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter vessel',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand',
                encodeHtml: false,
                bind: {
                    tpl: '<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate" href="javascript:void(0)" title="{record.inquiry.vessel_name}">{record.inquiry.vessel_name ? record.inquiry.vessel_name : "TBN" }</a>',
                },
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.a-vessel-name',
                        fn: function fn() {
                            let imo,
                                record = this.component.getRecord();
                            if (record.getInquiry().getVoyage().get('vessel')) {
                                imo = record.getInquiry().getVoyage().get('vessel').id;
                            }
                            if (imo) {
                                Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                            }
                        },
                    },
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.getInquiry().getVoyage().get('vessel_name') < b.getInquiry().getVoyage().get('vessel_name')
                        ? -1
                        : a.getInquiry().getVoyage().get('vessel_name') > b.getInquiry().getVoyage().get('vessel_name')
                          ? 1
                          : 0;
                },
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record.getInquiry().get('vessel_name')) {
                    return record.getInquiry().get('vessel_name');
                } else {
                    return 'TBN';
                }
            },
        },
        {
            text: 'Voy. number',
            hidden: true,
            dataIndex: 'voyage_number',
            minWidth: 120,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                type: 'string',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Voy. number',
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.getInquiry().get('voyage_number') < b.getInquiry().get('voyage_number')
                        ? -1
                        : a.getInquiry().get('voyage_number') > b.getInquiry().get('voyage_number')
                          ? 1
                          : 0;
                },
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record.getInquiry() && record.getInquiry().get('voyage_number')) {
                    return record.getInquiry().get('voyage_number');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            renderer: function (value, record) {
                if (record.getInquiry() && record.getInquiry().get('voyage_number')) {
                    return record.getInquiry().get('voyage_number');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Port itinerary',
            dataIndex: 'port_requested1',
            minWidth: 150,
            cell: {
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            let portId = el.currentTarget.getAttribute('data-portid');
                            if (portId) {
                                Abraxa.getApplication().getController('AbraxaController').showPortDialogById(portId);
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
                dataIndex: 'port_itinerary_date',
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    placeholder: 'Enter port',
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (value, record) {
                if (record) {
                    let date = AbraxaConstants.placeholders.emptyValue,
                        port_requested = '',
                        port_requested_id = '';
                    if (record && record.getInquiry().ports() && record.getInquiry().ports().count()) {
                        port_requested = record.getInquiry().ports().first().get('name');
                        port_requested_id = record.getInquiry().ports().first().get('id');
                    }
                    if (record.getInquiry().get('port_eta')) {
                        date = moment(record.getInquiry().get('port_eta')).isValid()
                            ? moment(record.getInquiry().get('port_eta')).format('DD MMM - HH:mm')
                            : AbraxaConstants.placeholders.emptyValue;
                    }
                    return (
                        '<a class="fw-b text-truncate a_grid_action" href="javascript:void(0)" title="Port name" data-portid="' +
                        port_requested_id +
                        '">' +
                        port_requested +
                        '</a><div class="sm-title"><b>ETA:</b> ' +
                        date +
                        '</div>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            sorter: {
                sorterFn: function (a, b) {
                    if (a.getInquiry().ports().first() && b.getInquiry().ports().first()) {
                        let portName1 = a.getInquiry().ports().first().get('name'),
                            portName2 = b.getInquiry().ports().first().get('name');

                        return portName1 < portName2 ? -1 : portName1 > portName2 ? 1 : 0;
                    }
                },
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record) {
                    let date = AbraxaConstants.placeholders.emptyValue,
                        port_requested = '',
                        port_requested_id = '';
                    if (record && record.getInquiry().ports() && record.getInquiry().ports().count()) {
                        port_requested = record.getInquiry().ports().first().get('name');
                        port_requested_id = record.getInquiry().ports().first().get('id');
                    }
                    if (record.get('port_eta')) {
                        date = moment(record.getInquiry().get('port_eta')).isValid()
                            ? moment(record.getInquiry().get('port_eta')).format('DD MMM - HH:mm')
                            : AbraxaConstants.placeholders.emptyValue;
                    }
                    return (
                        '<a class="fw-b text-truncate" href="javascript:void(0)" title="Port name" data-portid="' +
                        port_requested_id +
                        '">' +
                        port_requested +
                        '</a><div class="sm-title"><b>ETA:</b> ' +
                        date +
                        '</div>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Port function',
            dataIndex: 'port_function',
            minWidth: 160,
            hidden: true,
            filterType: {
                // required configs
                type: 'string',
                operator: 'in',
                operators: ['in'],
                fieldDefaults: {
                    xtype: 'combobox',
                    ui: 'classic',
                    placeholder: 'Choose',
                    queryMode: 'local',
                    multiSelect: true,
                    displayField: 'name',
                    valueField: 'name',
                    bind: {
                        store: {
                            type: 'berth.function',
                        },
                    },
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'a-cell-function',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                return (
                    '<div class="a-function function-' +
                    record.getInquiry().get('port_function') +
                    '"><span>' +
                    record.getInquiry().get('port_function') +
                    '</span></div>'
                );
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.getInquiry().get('port_function') < b.getInquiry().get('port_function')
                        ? -1
                        : a.getInquiry().get('port_function') > b.getInquiry().get('port_function')
                          ? 1
                          : 0;
                },
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record.getInquiry() && record.getInquiry().get('port_function')) {
                    return record.getInquiry().get('port_function');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Requesting party',
            dataIndex: 'requesting_party_name',
            minWidth: 220,
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                dataIndex: 'requesting_party_name',
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-company',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            var company_id = el.target.getAttribute('data-company_id');
                            let vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations'),
                                email = el.currentTarget.getAttribute('data-email'),
                                orgRecord = organizations.getById(company_id);
                            if (orgRecord) {
                                Abraxa.getApplication()
                                    .getController('AbraxaController')
                                    .showOrganizationTooltip(company_id, el);
                            } else if (email) {
                                Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
                            }
                        },
                    },
                },
                encodeHtml: false,
                renderer: function (value, record) {
                    if (record) {
                        return (
                            '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            record.getInquiry().get('requesting_party_id') +
                            '" data-email="' +
                            record.getInquiry().get('requesting_party_email') +
                            '">' +
                            record.getInquiry().get('requesting_party_name') +
                            '</a>'
                        );
                    }
                    return '<span class="a-cell-placeholder">---</span>';
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.getInquiry().get('requesting_party_name') < b.getInquiry().get('requesting_party_name')
                        ? -1
                        : a.getInquiry().get('requesting_party_name') > b.getInquiry().get('requesting_party_name')
                          ? 1
                          : 0;
                },
            },
            exportRenderer: true,
        },
        {
            text: 'Agency type',
            dataIndex: 'agency_type_name',
            minWidth: 160,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                type: 'string',
                operators: ['like'],
                dataIndex: 'agency_type_name',
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.getInquiry().get('agency_type_name') < b.getInquiry().get('agency_type_name')
                        ? -1
                        : a.getInquiry().get('agency_type_name') > b.getInquiry().get('agency_type_name')
                          ? 1
                          : 0;
                },
            },
            renderer: function (value, record) {
                if (record && record.getInquiry().get('agency_type_name')) {
                    return record.getInquiry().get('agency_type_name');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record && record.getInquiry().get('agency_type_name')) {
                    return record.getInquiry().get('agency_type_name');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Currency',
            dataIndex: 'currency',
            minWidth: 100,
            cls: 'a-column-bl',
            align: 'center',
            cell: {
                cls: 'a-cell-bl text-center',
                encodeHtml: false,
            },
            filterType: {
                type: 'string',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    cls: 'a-filter-bl',
                    placeholder: 'Enter',
                },
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Amount',
            dataIndex: 'total_costs',
            cls: 'a-column-bl a-column-br',
            align: 'right',
            minWidth: 140,
            cell: {
                cls: 'a-cell-bl a-cell-br fw-b',
                encodeHtml: false,
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            filterType: {
                type: 'number',
                operators: ['>', '<'],
                operator: '>',
                fieldDefaults: {
                    ui: 'classic',
                    textAlign: 'right',
                    cls: 'a-filter-bl a-filter-br',
                    placeholder: '00.00',
                },
            },
            formatter: 'number("0,000.00")',
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (val) {
                    return Ext.util.Format.number(val, '0,000.00');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            dataIndex: 'status',
            minWidth: 120,
            text: 'Status',
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'in',
                // optional configs
                operators: ['in'],
                fieldDefaults: {
                    xtype: 'combobox',
                    ui: 'classic',
                    placeholder: 'Choose',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    multiSelect: true,
                    store: {
                        data: [
                            {
                                id: 0,
                                name: 'Draft',
                            },
                            {
                                id: 1,
                                name: 'Under review',
                            },
                            {
                                id: 2,
                                name: 'Submitted',
                            },
                            {
                                id: 3,
                                name: 'Pending approval',
                            },
                            {
                                id: 4,
                                name: 'Changes requested',
                            },
                            {
                                id: 5,
                                name: 'Approved',
                            },
                            {
                                id: 6,
                                name: 'Completed',
                            },
                            {
                                id: 7,
                                name: 'Canceled',
                            },
                        ],
                    },
                    listeners: {
                        beforequery: function (me) {
                            let inquiryPdasArchiveMode = this.up('grid').upVM().get('inquiryPdasArchiveMode');
                            let store = this.getStore();
                            store.clearFilter();
                            const archiveStatuses = [5, 6, 7];
                            const statuses = [0, 1, 2, 3, 4];
                            if (inquiryPdasArchiveMode) {
                                store.filter({
                                    filterFn: function (rec) {
                                        return archiveStatuses.includes(rec.get('id'));
                                    },
                                });
                            } else {
                                store.filter({
                                    filterFn: function (rec) {
                                        return statuses.includes(rec.get('id'));
                                    },
                                });
                            }
                        },
                    },
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="a-status-badge a-status-md status-' +
                        value +
                        '"><span class="text-truncate">' +
                        Ext.String.capitalize(value) +
                        '</span></div>'
                    );
                } else {
                    return '';
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (val) {
                    return (
                        '<div class="a-status-badge a-status-md status-' +
                        val +
                        '"><span class="text-truncate">' +
                        Ext.String.capitalize(val) +
                        '</span></div>'
                    );
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Updated',
            minWidth: 220,
            filterType: {
                // required configs
                type: 'string',
                operator: 'in',
                // optional configs
                dataIndex: 'updated_by',
                operators: ['in'],
                fieldDefaults: {
                    xtype: 'combobox',
                    ui: 'classic',
                    valueField: 'id',
                    displayField: 'full_name',
                    queryMode: 'local',
                    multiSelect: true,
                    placeholder: 'Choose',
                    bind: {
                        store: '{users}',
                    },
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.updated_by_user}',
                            updated_at: '{record.updated_at}',
                        },
                    },
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.get('updated_by') < b.get('updated_by')
                        ? -1
                        : a.get('updated_by') > b.get('updated_by')
                          ? 1
                          : 0;
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (record.get('updated_by_user')) {
                    return record.get('updated_by_user').first_name[0] + '. ' + record.get('updated_by_user').last_name;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            dataIndex: '',
            minWidth: 120,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            toolDefaults: {
                xtype: 'tool',
            },
            tools: [
                {
                    type: 'gear',
                    hidden: true,
                    ui: 'tool-md',
                    right: 4,
                    handler: function () {
                        mixpanel.track('Customize button active tab');
                        this.up('grid').getPlugin('gridviewoptions').showViewOptions();
                    },
                    tooltip: {
                        anchorToTarget: true,
                        html: 'Customize',
                        align: 'bc-tc?',
                    },
                },
            ],

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

                        cls: 'chameleon_view_details_portcall',
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
                        handler: function () {
                            let record = this.upVM().get('record');
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('inquiry/' + record.getInquiry().get('id'));
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },

        childdoubletap: function (grid, location, eOpts) {
            Ext.getCmp('main-viewport').setMasked({
                xtype: 'viewport.mask',
            });
            let record = location.record;
            if (record) {
                Ext.getCmp('main-viewport')
                    .getController()
                    .redirectTo('inquiry/' + record.getInquiry().get('id') + '/pda/' + record.get('id'));

                grid.deselectAll();
            }
        },
    },
});
