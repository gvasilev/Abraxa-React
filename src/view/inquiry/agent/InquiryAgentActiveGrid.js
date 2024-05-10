var doubleClickInProgress = false;
Ext.define('Abraxa.view.inquiry.agent.InquiryAgentActiveGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'inquiry.agent.active.grid',
    flex: 1,
    slug: 'inquiryGrid',
    ui: 'bordered',
    reference: 'inquiryGrid',
    scrollable: true,
    cls: 'abraxa-grid a-enquiries-grid',
    stateful: ['plugins', 'columns', 'filters'],
    stateId: 'inquiry-grid-active',
    itemId: 'inquiry-grid-active',
    collapsible: false,
    pinHeaders: false,
    infinite: false,
    selectable: {
        deselectable: true,
    },
    store: [],
    bind: {
        store: '{inquiries}',
        hideHeaders: '{defaultHiddenItems}',
    },
    scrollToTopOnRefresh: false,
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
                                html: '<strong>{totalInquiryRecords}</strong> records',
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
                            xtype: 'button',
                            testId: 'inquiryGridAddButton',
                            text: 'Enquiry',
                            iconCls: 'md-icon-add',
                            cls: 'chameleon_add_task',
                            ui: 'action small',
                            hideMode: 'opacity',
                            handler: 'createInquiry',
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
                                    var storeInquiries = this.upVM().get('inquiries');
                                    if (newValue == '') storeInquiries.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    var query = this.getValue().toLowerCase();
                                    var storeInquiries = this.upVM().get('inquiries');
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
                                                let store = this.find('inquiry-grid-active').getStore(),
                                                    toggled = this.getPressed();

                                                if (toggled) {
                                                    store.getProxy().setExtraParam('archived', 1);
                                                    me.upVM().set('inquiryArchiveMode', true);
                                                } else {
                                                    store.getProxy().setExtraParam('archived', 0);
                                                    me.upVM().set('inquiryArchiveMode', false);
                                                }
                                                store.loadPage(1);
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'GridFiltersButton',
                                    gridItemId: 'inquiry-grid-active',
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
                                                    let grid = this.find('inquiry-grid-active');
                                                    grid.saveDocumentAs({
                                                        type: 'xlsx', // exporter alias
                                                        title: 'Enquiries',
                                                        showSummary: true,
                                                        fileName: 'Enquiries.xlsx',
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
                                    hidden: false,
                                    bind: {
                                        hidden: '{defaultHiddenItems}',
                                    },
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        this.find('inquiry-grid-active').getPlugin('gridviewoptions').showViewOptions();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-483 -193)"><g transform="translate(-351 -152)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M21050.852-12405.871h-22a4.029,4.029,0,0,1-4-4v-22a4.021,4.021,0,0,1,4-4h22a4.018,4.018,0,0,1,4,4v22A4.026,4.026,0,0,1,21050.852-12405.871ZM21033-12431a2,2,0,0,0-2,2v14a2,2,0,0,0,2,2h4l3,3,3-3h4a2,2,0,0,0,2-2v-14a2,2,0,0,0-2-2Zm-16.391,23.578H21000.2a6.209,6.209,0,0,1-6.2-6.2v-51.213a6.208,6.208,0,0,1,6.2-6.2h9.531a8.633,8.633,0,0,1,3.189-3.612,8.622,8.622,0,0,1,4.627-1.345,8.611,8.611,0,0,1,4.625,1.345,8.648,8.648,0,0,1,3.189,3.612h9.533a6.208,6.208,0,0,1,6.2,6.2v20.418h-2.479v-20.418a3.733,3.733,0,0,0-3.715-3.72h-11.217l-.3-.809a6.176,6.176,0,0,0-5.834-4.148,6.171,6.171,0,0,0-5.828,4.148l-.3.809H21000.2a3.728,3.728,0,0,0-3.715,3.72v51.219a3.728,3.728,0,0,0,3.715,3.72h15.52a14.292,14.292,0,0,0,.891,2.478Zm23.387-5.406h0l-1.59-1.59-.576-.581H21033v-14h14v14h-4.83l-.592.592-1.58,1.579Zm-1-5.173h0v2h2v-2Zm1-8a2.007,2.007,0,0,1,2,2c0,.879-.57,1.314-1.23,1.819a3.587,3.587,0,0,0-1.771,3.18h2a3.093,3.093,0,0,1,1.439-2.355A3.411,3.411,0,0,0,21044-12424a4,4,0,0,0-4-4,4,4,0,0,0-4,4h2A2,2,0,0,1,21040-12426Zm-28.084.392h-6.76a1.654,1.654,0,0,1-1.652-1.649,1.655,1.655,0,0,1,1.652-1.653h6.76a1.655,1.655,0,0,1,1.654,1.653A1.654,1.654,0,0,1,21011.914-12425.612Zm6-8.2-12.762-.059a1.655,1.655,0,0,1-1.652-1.653,1.654,1.654,0,0,1,1.652-1.649l12.762.059a1.654,1.654,0,0,1,1.648,1.654A1.651,1.651,0,0,1,21017.916-12433.813Zm6-8.317h-18.76a1.656,1.656,0,0,1-1.652-1.654,1.653,1.653,0,0,1,1.652-1.648h18.76a1.653,1.653,0,0,1,1.654,1.648A1.656,1.656,0,0,1,21023.914-12442.131Zm6-8.259h-24.762a1.656,1.656,0,0,1-1.652-1.654,1.655,1.655,0,0,1,1.652-1.653h24.756a1.655,1.655,0,0,1,1.654,1.653A1.661,1.661,0,0,1,21029.916-12450.39Zm-12.365-13.216h-.01a3.7,3.7,0,0,1-2.635-1.092,3.7,3.7,0,0,1-1.086-2.633,3.728,3.728,0,0,1,3.719-3.715h.012a3.727,3.727,0,0,1,3.711,3.72A3.721,3.721,0,0,1,21017.551-12463.605Zm0-5.58a1.857,1.857,0,0,0-1.855,1.855,1.857,1.857,0,0,0,1.855,1.854h.01a1.825,1.825,0,0,0,1.3-.542,1.837,1.837,0,0,0,.541-1.308v-.011A1.853,1.853,0,0,0,21017.547-12469.186Z" transform="translate(-20474 12696.002)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No inquiries available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Enquiry',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: 'createInquiry',
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
            text: '',
            dataIndex: 'is_watching',
            cls: 'a-cell-id',
            width: 32,
            hidden: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            sortable: false,
            editable: false,
            ignore: true,
            cell: {
                encodeHtml: false,
                cls: 'expand',
                forceWidth: true,
                tools: [
                    {
                        xtype: 'div',
                        tooltip: {
                            html: 'Subscribe to start receiving<br> follow up notifications',
                            anchor: true,
                            align: 'b50-t50',
                        },
                        bind: {
                            html: '<div class="a-fav cursor-pointer a_grid_action"><i class="a_grid_action {record.is_watching ? "material-icons c-yellow" : "material-icons-outlined md-inactive"}">{record.is_watching ? "notifications" : "notifications"}</i></div>',
                        },
                    },
                ],
                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.a-fav',
                        fn: function fn() {
                            let record = this.component.getRecord(),
                                recentlyOpened = this.component.up('grid').upVM().get('recentlyOpened'),
                                favourite = record.get('is_watching');
                            if (favourite) {
                                record.set('is_watching', 0);
                            } else {
                                record.set('is_watching', 1);
                            }
                            record.save({
                                success: function () {
                                    recentlyOpened.reload();
                                    Ext.toast('Record updated');
                                },
                            });
                        },
                    },
                },
            },
            ignoreExport: true,
        },
        {
            text: 'ID',
            dataIndex: 'abraxa_id',
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
                    placeholder: 'ID',
                },
            },
            renderer: function (value, record) {
                if (record && record.get('parent_id')) {
                    return '<span title="INQ-ID">' + record.get('inquiry_id') + '</span>';
                } else {
                    return '<span title="INQ-ID">' + record.get('inquiry_id') + '</span>';
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record && record.get('parent_id')) {
                    return record.get('inquiry_id');
                } else {
                    return record.get('inquiry_id');
                }
            },
        },
        {
            dataIndex: 'vessel_name',
            text: 'Vessel / ID',
            minWidth: 180,
            stateId: 'vesse_imo',
            flex: 1,
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter vessel / ID',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            cell: {
                cls: 'expand',
                encodeHtml: false,
                bind: {
                    tpl: '<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate" href="javascript:void(0)" title="{record.vessel_name}">{record.vessel_name ? record.vessel_name : "TBN" }</a><div class="sm-title text-truncate">{record.inquiry_id}</div>',
                },
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.a-vessel-name',
                        fn: function fn() {
                            let imo,
                                record = this.component.getRecord();
                            window.location.hash = '#inquiry/' + record.get('id');

                            // if (record.get('vessel')) {
                            //     imo = record.get('vessel').id
                            // }
                            // if (record.get('custom_vessel_id')) {
                            //     if (record.get('custom_vessel').company_id != this.component.up('grid').upVM().get('currentUser').get('current_company_id')) {
                            //         imo = record.get('custom_vessel').id;
                            //     }
                            // }
                            // if (imo) {
                            //     Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                            // }
                        },
                    },
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    if (a.getVoyage().get('vessel_name') < b.getVoyage().get('vessel_name')) {
                        return -1;
                    } else if (a.getVoyage().get('vessel_name') > b.getVoyage().get('vessel_name')) {
                        return 1;
                    }

                    return 0;
                },
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record.getVoyage().get('vessel_name')) {
                    return record.getVoyage().get('vessel_name');
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
            filterType: {
                type: 'string',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Voy. number',
                },
            },
            cell: {
                encodeHtml: false,
            },
            exportRenderer: true,
            renderer: function (value, record) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Port itinerary',
            dataIndex: 'port_requested1',
            itemId: 'portRequested',
            minWidth: 150,
            filterType: {
                // required configs
                type: 'date',
                operator: '>',
                // optional configs
                dataIndex: 'port_itinerary_date',
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    xtype: 'abraxa.datefield',
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            Ext.defer(() => {
                                if (doubleClickInProgress) return;
                                let portId = el.currentTarget.getAttribute('data-portid');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            }, 500);
                        },
                    },
                    dblclick: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            doubleClickInProgress = true;
                            Ext.defer(() => {
                                doubleClickInProgress = false;
                            }, 1000);
                        },
                    },
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    if (a.ports().first() && b.ports().first()) {
                        let portName1 = a.ports().first().get('name'),
                            portName2 = b.ports().first().get('name');

                        return portName1 < portName2 ? -1 : portName1 > portName2 ? 1 : 0;
                    }
                },
            },
            renderer: function (value, record) {
                if (record) {
                    let date = AbraxaConstants.placeholders.emptyValue,
                        port_requested = '',
                        port_requested_id = '';
                    if (record && record.ports() && record.ports().count()) {
                        port_requested = record.ports().first().get('name');
                        port_requested_id = record.ports().first().get('id');
                    }
                    if (record.get('port_eta')) {
                        date = moment(record.get('port_eta')).isValid()
                            ? moment(record.get('port_eta')).format('DD MMM - HH:mm')
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
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record) {
                    let date = AbraxaConstants.placeholders.emptyValue,
                        port_requested = '',
                        port_requested_id = '';
                    if (record && record.ports() && record.ports().count()) {
                        port_requested = record.ports().first().get('name');
                        port_requested_id = record.ports().first().get('id');
                    }
                    if (record.get('port_eta')) {
                        date = moment(record.get('port_eta')).isValid()
                            ? moment(record.get('port_eta')).format('DD MMM - HH:mm')
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
            text: 'ETA',
            dataIndex: 'port_eta',
            minWidth: 140,
            hidden: true,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            renderer: function (value, record) {
                if (value) {
                    return moment(record.get('port_eta')).isValid()
                        ? moment(record.get('port_eta')).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptySpan;
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record && record.get('port_eta')) {
                    return moment(record.get('port_eta')).isValid()
                        ? moment(record.get('port_eta')).format('DD MMM - HH:mm')
                        : AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Port function',
            dataIndex: 'port_function',
            minWidth: 160,
            cell: {
                cls: 'a-cell-function',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'in',
                operators: ['in'],
                fieldDefaults: {
                    xtype: 'combobox',
                    ui: 'classic',
                    placeholder: 'Choose',
                    valueField: 'full_name',
                    displayField: 'full_name',
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
            renderer: function (value, record) {
                return '<div class="a-function function-' + value + '"><span>' + value + '</span></div>';
            },
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
                // required configs
                type: 'string',
                operator: 'in',
                // optional configs
                operators: ['in'],
                dataIndex: 'agency_type_id',
                fieldDefaults: {
                    xtype: 'combobox',
                    ui: 'classic',
                    placeholder: 'Choose',
                    valueField: 'value',
                    displayField: 'text',
                    queryMode: 'local',
                    multiSelect: true,
                    options: [
                        {
                            value: 1,
                            text: 'Full agency',
                        },
                        {
                            value: 2,
                            text: 'Husbandry agency',
                        },
                        {
                            value: 3,
                            text: 'Service agency',
                        },
                        {
                            value: 4,
                            text: 'Owners protective agency',
                        },
                        {
                            value: 5,
                            text: 'Cargo protective agency',
                        },
                    ],
                },
            },
            renderer: function (value, record) {
                return value;
            },
        },
        {
            text: 'Cargo',
            minWidth: 140,
            dataIndex: 'cargoes',
            bind: {
                permission: '{userPermissions}',
            },
            filterType: {
                dataIndex: 'cargo_string',
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter cargo',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
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
                                    quantity = numeral(cargo.quantity).format('0,0.[000]');

                                return (
                                    '<div class="a-cargo"><span class="fw-b">' +
                                    quantity +
                                    '</span> ' +
                                    cargo.unit +
                                    '</div><span><a class="a_grid_action fw-n" href="javascript:void(0)" data-commodityid="' +
                                    cargo.commodity_id +
                                    '">' +
                                    cargo.commodity +
                                    '</a></span>'
                                );
                            } else if (cargoes.length > 1) {
                                return (
                                    '<span class="a-cargo cargo-multiple">Multiple <span class="a-count-badge count-link">' +
                                    cargoes.length +
                                    '</span></span>'
                                );
                            }
                            return '<span class="a-cell-placeholder">---</span>';
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
            sorter: {
                sorterFn: function (a, b) {
                    let cargoes1 = a.cargoes().getRange();
                    let cargoes2 = b.cargoes().getRange();

                    let cargoName1 = AbraxaConstants.placeholders.emptyValue;
                    let cargoName2 = AbraxaConstants.placeholders.emptyValue;

                    if (cargoes1.length === 1) {
                        cargoName1 = cargoes1[0].get('commodity');
                    } else if (cargoes1.length > 1) {
                        cargoName1 = 'Multiple';
                    }

                    if (cargoes2.length === 1) {
                        cargoName2 = cargoes2[0].get('commodity');
                    } else if (cargoes2.length > 1) {
                        cargoName2 = 'Multiple';
                    }

                    return cargoName1 < cargoName2 ? -1 : cargoName1 > cargoName2 ? 1 : 0;
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                let cargoes = record.cargoes().getRange();
                if (cargoes) {
                    if (cargoes.length == 1) {
                        let cargo = cargoes[0],
                            bl_unit = '',
                            commodity = '',
                            quantity = numeral(cargo.get('quantity')).format('0,0.[000]');
                        if (cargo.get('bl_unit')) {
                            bl_unit = cargo.get('bl_unit');
                        }
                        if (cargo.get('commodity')) {
                            commodity = cargo.get('commodity');
                        }
                        return quantity + bl_unit + ' ' + commodity;
                    } else if (cargoes.length > 1) {
                        let str = '';
                        record.cargoes().each(function (rec, idx) {
                            let bl_unit = '',
                                commodity = '',
                                comma = ',',
                                quantity = numeral(rec.get('quantity')).format('0,0.[000]');
                            if (rec.get('bl_unit')) {
                                bl_unit = rec.get('bl_unit');
                            }
                            if (rec.get('commodity')) {
                                commodity = rec.get('commodity');
                            }
                            if (idx + 1 == cargoes.length) {
                                comma = '';
                            }
                            str += quantity + bl_unit + ' ' + commodity + comma;
                        });
                        return str;
                    }
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
                                email = el.currentTarget.getAttribute('data-email');

                            const organizationsStore = Ext.getStore('cdb');

                            if (!organizationsStore) return;

                            organizationsStore.setFilters({
                                id: 'company_id',
                                property: 'org_email',
                                value: email,
                            });

                            organizationsStore.load({
                                callback: function (records, operation, success) {
                                    if (records[0]) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showOrganizationTooltip(company_id, el);
                                    } else if (email) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showTenantByEmail(email, el);
                                    }
                                    this.removeFilter('company_id');
                                },
                            });
                        },
                    },
                },
                encodeHtml: false,
                renderer: function (value, record) {
                    if (record) {
                        var label =
                            '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            record.get('requesting_party_id') +
                            '" data-email="' +
                            record.get('requesting_party_email') +
                            '">' +
                            record.get('requesting_party_name') +
                            '</a>';

                        return label;
                    }
                    return '<span class="a-cell-placeholder">---</span>';
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                return value;
            },
        },
        {
            text: 'Estimates',
            dataIndex: 'offers',
            minWidth: 100,
            cls: 'a-column-bl a-column-br',
            align: 'center',
            cell: {
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                dataIndex: 'offers',
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    clearable: false,
                    placeholder: '0',
                    cls: 'a-filter-bl a-filter-br',
                },
            },
            renderer: function (value, record) {
                if (record && record.offers() && record.offers().count() > 0) {
                    return '<span class="a-badge-counter">' + record.offers().getCount() + '</span>';
                } else {
                    return '<span class="a-badge-counter a-empty">0</span>';
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (record && record.offers() && record.offers().count() > 0) {
                    return '<span class="a-badge-counter">' + record.offers().getCount() + '</span>';
                } else {
                    return '<span class="a-badge-counter a-empty">0</span>';
                }
            },
            sorter: {
                sorterFn: function (a, b) {
                    let estimateCount1 = a.offers().getCount(),
                        estimateCount2 = b.offers().getCount();

                    if ((estimateCount1 || estimateCount1 === 0) && (estimateCount2 || estimateCount2 === 0)) {
                        return estimateCount1 < estimateCount2 ? -1 : estimateCount1 > estimateCount2 ? 1 : 0;
                    }
                },
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
                                id: 1,
                                name: 'Draft',
                            },
                            {
                                id: 2,
                                name: 'In progress',
                            },
                            {
                                id: 3,
                                name: 'Submitted',
                            },
                            {
                                id: 4,
                                name: 'Appointed',
                            },
                            {
                                id: 5,
                                name: 'Canceled',
                            },
                            {
                                id: 6,
                                name: 'Lost',
                            },
                            {
                                id: 7,
                                name: 'Other',
                            },
                        ],
                    },
                    listeners: {
                        beforequery: function (me) {
                            let inquiryArchiveMode = this.up('grid').upVM().get('inquiryArchiveMode');
                            let store = this.getStore();
                            store.clearFilter();
                            const archiveStatuses = [4, 5, 6, 7];
                            const statuses = [1, 2, 3];
                            if (inquiryArchiveMode) {
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
                        record.get('status_string') +
                        '"><span class="text-truncate">' +
                        Ext.String.capitalize(record.get('status_string')) +
                        '</span></div>'
                    );
                } else {
                    return '';
                }
            },
            exportRenderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="a-status-badge a-status-md status-' +
                        record.get('status_string') +
                        '"><span class="text-truncate">' +
                        Ext.String.capitalize(record.get('status_string')) +
                        '</span></div>'
                    );
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Assigned to',
            dataIndex: 'assigned_to',
            minWidth: 180,
            bind: {
                permission: '{userPermissions}',
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
                cls: 'expand a-cell-person',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.person_details',
                        fn: function fn(el) {
                            var user = this.component.getRecord().get('assignee');
                            let tipExist = Ext.getCmp('createdByTool');
                            if (tipExist) {
                                tipExist.destroy();
                            }
                            var tooltip_el = Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                target: el.target,
                                id: 'createdByTool',
                                viewModel: {
                                    data: {
                                        user: user,
                                        clickedElement: el.target,
                                    },
                                },
                            }).showBy(el, 'bc-tc?');
                        },
                    },
                },
            },
            grouper: {
                groupFn: function (record) {
                    let type = record.get('assigned_type');
                    if (type) {
                        var first_name = record.get('assigned_to_first_name');
                        var last_name = record.get('assigned_to_last_name');
                        if (first_name && last_name) {
                            return first_name[0] + '. ' + last_name;
                        }
                    }
                },
            },
            renderer: function (val, record) {
                if (val) {
                    if (record.get('assignee')) {
                        var assigned_to = record.get('assignee').first_name[0] + '.' + record.get('assignee').last_name,
                            user_img = record.get('assignee').profile_image
                                ? '<img height="30" class="a_grid_action" src="' +
                                  record.get('assignee').profile_image +
                                  '"/>'
                                : '<i class="md-icon-outlined a_grid_action">person</i>';
                        return (
                            '<a class="a-person a-icon-round a_grid_action person_details" href="javascript:void(0)">' +
                            user_img +
                            assigned_to +
                            '</a>'
                        );
                    }
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (record.get('assignee')) {
                    return record.get('assignee').first_name[0] + '. ' + record.get('assignee').last_name;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Date created',
            dataIndex: 'created_at',
            minWidth: 140,
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            cell: {
                cls: 'expand a-cell-date',
            },
            exportRenderer: true,
            renderer: function renderer(value) {
                if (value) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(value, AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24);
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
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        tooltip: {
                            anchorToTarget: true,
                            anchor: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function handler(owner, tool, e) {
                            let record = tool.record,
                                vm = this.up('grid').upVM();
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
                        },
                    },
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
                                .redirectTo('inquiry/' + record.get('id'), {
                                    replace: true,
                                });
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
                // mixpanel.track(
                //     "Double click on grid active portcall"
                // );

                // Ext.ComponentQuery.query('portcalls\\.right\\.card')[0].hide();
                Ext.getCmp('main-viewport')
                    .getController()
                    .redirectTo('inquiry/' + record.get('id'));
                grid.deselectAll();
            }
        },
        childmouseenter: function (item, location) {
            if (location.column.getDataIndex() == 'cargoes') {
                let label_str = '';
                let cargoes = [];
                if (location.record.cargoes()) {
                    cargoes = location.record.cargoes().getRange();
                }
                let selected = Ext.getCmp(location.cell.getId());
                if (cargoes && cargoes.length > 1) {
                    cargoes.forEach(function (cargo) {
                        if (cargo) {
                            let str = '';
                            if (cargo.get('function')) {
                                switch (cargo.get('function')) {
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
                            label_str +=
                                '<div class="a-cargo-item"><div class="a-cargo-title"><span class="a-qty">' +
                                Ext.util.Format.number(cargo.get('quantity'), '0,000.000') +
                                ' ' +
                                cargo.get('unit') +
                                '</span><span class="a-commodity">' +
                                cargo.get('commodity') +
                                '</span><span class="a-function a-function-sm function-' +
                                cargo.get('function') +
                                '" title="' +
                                cargo.get('function') +
                                '">' +
                                str +
                                '</span></div></div>';
                        }
                    });
                    let tipExist = Ext.getCmp('cargoesLabelTooltip');
                    if (tipExist) {
                        tipExist.destroy();
                    }
                    Ext.create('Ext.tip.ToolTip', {
                        target: selected,
                        delegate: '.cargo-multiple',
                        ui: 'multiple',
                        manageBorders: false,
                        anchorToTarget: true,
                        id: 'cargoesLabelTooltip',
                        autoDestroy: true,
                        anchor: true,
                        autoHide: true,
                        allowOver: true,
                        closable: false,
                        showOnTap: true,
                        title: 'Cargoes',
                        listeners: {
                            beforeshow: function () {
                                this.setHtml(label_str);
                            },
                        },
                    });
                }
            }
        },
    },
});
