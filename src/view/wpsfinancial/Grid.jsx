Ext.define('Abraxa.view.wpsfinancial.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'wps.financial.grid',
    flex: 1,
    cls: 'a-detailed-grid a-disbursements-grid a-wps-financial-grid abraxa-grid',
    ui: 'bordered',
    stateful: ['plugins', 'columns', 'filters'],
    stateId: 'wps-financial-grid',
    itemId: 'wps-financial-grid',
    reference: 'wpsFinancialGrid',
    collapsible: {
        collapseToolText: 'Collapse group',
        tool: {
            ui: 'tool-md',
            zone: 'start',
        },
    },
    store: [],
    bind: {
        store: '{disbursementsStore}',
    },
    scrollToTopOnRefresh: false,
    grouped: true,
    groupHeader: {
        xtype: 'custom-financial-grouper',
        tpl: '<div class="a-group-header status-{[values.children[0].data.status]}">{[values.children[0].data.status]} ({count})</div>',
    },
    pinHeaders: false,
    plugins: {
        gridviewoptions: true,
        gridexporter: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
            loadPages: true,
            toolbar: {
                width: '50%',
                bordered: true,
                nextButton: {
                    ui: 'tool-sm round',
                },
                prevButton: {
                    ui: 'tool-sm round',
                },
                listeners: {
                    painted: function () {
                        let me = this,
                            grid = this.find('wps-financial-grid'),
                            store = grid.getStore();

                        store.on('load', function () {
                            if (Ext.getCmp('financialGridTotal')) me.remove(Ext.getCmp('financialGridTotal'));

                            me.add({
                                xtype: 'div',
                                margin: '0 16',
                                id: 'financialGridTotal',
                                cls: 'sm-title',
                                html: 'Total: <strong>' + store.getTotalCount() + '</strong>',
                            });
                        });

                        // Ext.util.Observable.capture(store, function (evname) {

                        //
                        // });
                    },
                },
            },
        },
        gridfilterbar: {
            hidden: true,
        },
    },
    selectable: {
        deselectable: true,
        toggleOnClick: false,
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No disbursements available</div></div>',
            },
        ],
    },
    itemConfig: {
        bind: {
            cls: 'a-detailed-item {record.status}',
        },
        viewModel: {},
    },
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
                            xtype: 'title',
                            title: 'Disbursements',
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'hovered-underline',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search...',
                            centered: true,
                            width: 280,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var store = this.up('grid').getStore();
                                    if (newValue == '') store.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                                    var store = this.up('grid').getStore();
                                    store.removeFilter('search');
                                    if (query.length > 2) {
                                        store.addFilter({
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
                            right: 16,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    enableToggle: true,
                                    iconCls: 'md-icon-filter-alt md-icon-outlined',
                                    text: 'Filter',
                                    handler: function () {
                                        let grid = this.find('wps-financial-grid'),
                                            toggled = this.getPressed();

                                        if (toggled) {
                                            grid.showFilterBar();
                                        } else {
                                            grid.hideFilterBar();
                                        }
                                    },
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    ui: 'tool-text-sm',
                                    arrow: false,
                                    text: 'Export',
                                    margin: '0 0 0 8',
                                    menu: {
                                        items: [
                                            {
                                                text: 'Export to Excel',
                                                separator: true,
                                                iconCls: 'md-icon-outlined md-icon-difference',
                                                handler: function (me) {
                                                    let grid = this.up('grid');
                                                    grid.saveDocumentAs({
                                                        type: 'xlsx', // exporter alias
                                                        title: 'Active disbursements',
                                                        showSummary: true,
                                                        fileName: 'Disbursements.xlsx',
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
                                        this.find('wps-financial-grid').getPlugin('gridviewoptions').showViewOptions();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    columns: [
        {
            dataIndex: 'group_id',
            text: 'DA',
            minWidth: 260,
            flex: 1,
            cell: {
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.disbursement_details',
                        fn: function (me) {
                            this.component.lookupViewModel().set('showDetails', true);
                        },
                    },
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    padding: '0 0 0 12',
                    ui: 'classic',
                    placeholder: 'DA type',
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (value, record) {
                if (record) {
                    return (
                        '<div class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="' +
                        record.get('type') +
                        '" data-icon="money"></span><div class="ml-12"><a class="fw-b cursor-pointer disbursement_details" javascript:void(0)>' +
                        record.get('name') +
                        '</a><div class="sm-title">' +
                        record.get('group_id') +
                        '</div></div>'
                    );
                }
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                return record.get('group_id') + ' / ' + record.get('type').toUpperCase() + ' / ' + record.get('name');
            },
        },
        {
            dataIndex: 'status',
            minWidth: 165,
            maxWidth: 165,
            text: 'Status',
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: '=',
                // optional configs
                operators: ['='],
                fieldDefaults: {
                    cls: 'a-filter-no-trigger',
                    xtype: 'selectfield',
                    ui: 'classic',
                    valueField: 'name',
                    displayField: 'name',
                    queryMode: 'local',
                    clearable: true,
                    placeholder: 'Status',
                    options: [
                        {
                            name: 'Submitted',
                        },
                        {
                            name: 'Draft',
                        },
                        {
                            name: 'Completed',
                        },
                        {
                            name: 'Settled',
                        },
                    ],
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="text-capitalize a-status-badge a-status-md status-' +
                        value +
                        '" style="width: 92px; text-align: center; display: grid;">' +
                        value +
                        '</div>'
                    );
                } else {
                    return '';
                }
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                return record.get('status').charAt(0).toUpperCase() + record.get('status').slice(1);
            },
        },
        {
            text: 'Amount',
            dataIndex: 'total_costs',
            minWidth: 180,
            align: 'right',
            cls: 'a-column-amount',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount',
                // zeroValue: '<span class="a-cell-placeholder">---</span>'
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-amount',
                    textAlign: 'right',
                    placeholder: '00.00',
                    clearable: false,
                    ui: 'classic',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            // formatter: 'number("0,000.00")',
            renderer: function (val, record) {
                if (val)
                    return (
                        '<b class="c-light-grey mr-8">' +
                        record.get('disbursement_currency') +
                        '</b><b class="fw-b">' +
                        Ext.util.Format.number(val, '0,000.00') +
                        '</b>'
                    );

                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                return record.get('disbursement_currency') + ' ' + Ext.util.Format.number(value, '0,000.00');
            },
        },
        {
            text: 'Billing party',
            dataIndex: 'organization_name',
            minWidth: 220,
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
                    if (value) {
                        let fileID = record.get('portcall').file_id;
                        var label =
                            '<div class="party-item">' +
                            '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                            '<div class="sm-company text-truncate"><a class="a_grid_action company_details fw-b" href="javascript:void(0)" data-company_id="' +
                            record.get('organization_id') +
                            '">' +
                            value +
                            '</a><div class="sm-title">' +
                            fileID +
                            '</div></div>' +
                            '</div>';

                        return label;
                    }
                    return '<span class="a-cell-placeholder">---</span>';
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
        },
        {
            text: 'Parent company',
            dataIndex: 'organization_parent',
            minWidth: 220,
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
                    if (record.get('organization') && record.get('organization').parent) {
                        var label =
                            '<div class="party-item">' +
                            '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                            '<div class="sm-company text-truncate"><a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            record.get('organization').parent.org_id +
                            '">' +
                            record.get('organization').parent.org_name +
                            '</a></div>' +
                            '</div>';

                        return label;
                    }
                    return '<span class="a-cell-placeholder">---</span>';
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                if (record.get('organization') && record.get('organization').parent) {
                    return record.get('organization').parent.org_name;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            dataIndex: 'vessel',
            text: 'Vessel',
            minWidth: 220,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                bind: {
                    tpl: '<a data-id="vessel_name" class="a_grid_action fw-b text-truncate a_vessel_name" href="javascript:void(0)" title="{record.portcall.voyage.vessel_name}">{record.portcall.voyage.vessel_name}</a><div class="sm-title">IMO: {record.portcall.voyage.vessel_imo}</div>',
                },
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.a_vessel_name',
                        fn: function fn() {
                            let imo,
                                record = this.component.getRecord().get('portcall');

                            window.location.hash = '#portcall/' + record.id + '/disbursements';
                        },
                    },
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter vessel',
                    // any Ext.form.field.Text configs accepted
                },
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                return Abraxa.utils.Functions.exportVesselNameFileId(record, 'portcall');
            },
        },
        {
            text: 'Port itinerary',
            dataIndex: 'port',
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
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter port',
                    // any Ext.form.field.Text configs accepted
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.get('port_eta') < b.get('port_eta') ? -1 : a.get('port_eta') > b.get('port_eta') ? 1 : 0;
                },
            },
            renderer: function (value, record) {
                return Abraxa.utils.Functions.portRendererType(record, 'portcall');
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                return Abraxa.utils.Functions.portRendererType(record, 'portcall', true);
            },
        },
        {
            text: 'ETA',
            dataIndex: 'portcall_eta',
            minWidth: 180,
            hidden: true,
            filterType: {
                // required configs
                type: 'date',
                operator: '>',
                // optional configs
                operators: ['>', '<='],
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
            renderer: function renderer(value) {
                if (value) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(value, 'D MMM YYYY - HH:mm');
                    // return moment(value).format("D MMM YY");
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (value) {
                    let date = moment(value).isValid()
                        ? moment(value).format(AbraxaConstants.formatters.date.dayMonYearTime24)
                        : AbraxaConstants.placeholders.emptyValue;
                    return date;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'ETD',
            dataIndex: 'portcall_etd',
            minWidth: 180,
            hidden: true,
            filterType: {
                // required configs
                type: 'date',
                operator: '>',
                // optional configs
                operators: ['>', '<='],
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
            renderer: function renderer(value) {
                if (value) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(value, 'D MMM YYYY - HH:mm');
                    // return moment(value).format("D MMM YY");
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (value) {
                    let date = moment(value).isValid()
                        ? moment(value).format(AbraxaConstants.formatters.date.dayMonYearTime24)
                        : AbraxaConstants.placeholders.emptyValue;
                    return date;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Agency type',
            dataIndex: 'agency_type',
            minWidth: 160,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: '=',
                // optional configs
                operators: ['='],
                fieldDefaults: {
                    xtype: 'selectfield',
                    cls: 'a-filter-no-trigger',
                    ui: 'classic',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    clearable: true,
                    placeholder: 'Choose',
                    bind: {
                        store: {
                            type: 'agency.types',
                        },
                    },
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (value) {
                if (value) {
                    return value;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Sub agent',
            dataIndex: 'sub_agent',
            minWidth: 220,
            hidden: true,
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
                    if (value && value.org_id) {
                        var label =
                            '<div class="party-item">' +
                            '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                            '<div class="sm-company text-truncate"><a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            value.org_id +
                            '">' +
                            value.org_name +
                            '</a></div>' +
                            '</div>';

                        return label;
                    }
                    return '<span class="a-cell-placeholder">---</span>';
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            exportRenderer: function (value, record) {
                if (value && value.org_id) {
                    return value.org_name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Voyage number',
            dataIndex: 'voyage_number',
            minWidth: 140,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Voy. num',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            renderer: function (value) {
                if (value) {
                    return value;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Date created',
            dataIndex: 'created_at',
            minWidth: 180,
            hidden: true,
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
            renderer: function renderer(value) {
                if (value) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(value, 'D MMM YYYY - HH:mm');
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (value) {
                    let date = moment(value).isValid()
                        ? moment(value).format(AbraxaConstants.formatters.date.dayMonYearTime24)
                        : AbraxaConstants.placeholders.emptyValue;
                    return date;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            dataIndex: '',
            minWidth: 96,
            // flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            // docked: "right",
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
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function handler(owner, tool, e) {
                            let record = this.upVM().get('record'),
                                vm = this.up('grid').upVM(),
                                disbursements = this.up('grid').getStore();

                            Ext.create('Abraxa.view.portcall.disbursements.DisbursementEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        disbursements: disbursements,
                                        disbursement: record,
                                        expenses: record.expenses(),
                                    },
                                    formulas: {
                                        disableDelete: {
                                            bind: {
                                                bindTo: '{disbursement}',
                                                deep: true,
                                            },
                                            get: function (disbursement) {
                                                if (disbursement) {
                                                    let owner =
                                                        disbursement.get('company_id') ==
                                                        this.get('currentUser').get('current_company_id')
                                                            ? true
                                                            : false;
                                                    if (owner) {
                                                        let object_record = disbursement.get('portcall');
                                                        if (object_record.is_archived) {
                                                            return false;
                                                        } else {
                                                            let type = disbursement.get('type'),
                                                                has_dda = disbursement.get('dda_id'),
                                                                has_fda = disbursement.get('fda_id');

                                                            if (type == 'pda' && (has_dda || has_fda)) return false;

                                                            if (type == 'dda' && has_fda) return false;

                                                            return true;
                                                        }
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                                return true;
                                            },
                                        },
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
        childtap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});
