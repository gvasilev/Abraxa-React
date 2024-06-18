Ext.define('Abraxa.view.financial.FinancialDisbursementsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'financial.disbursement.grid',
    flex: 1,
    cls: 'a-wps-financial-grid a-disbursements-grid a-offset-grid abraxa-grid',
    ui: 'bordered',
    stateful: ['plugins', 'columns', 'filters'],
    stateId: 'financial-disbursement-grid',
    itemId: 'financial-disbursement-grid',
    reference: 'financialDisbursementGrid',
    infinite: false,
    store: [],
    bind: {
        store: '{disbursementsStore}',
    },
    scrollToTopOnRefresh: false,
    pinHeaders: false,
    grouped: true,
    groupHeader: {
        tpl: '<div class="a-group-header status-{[values.children[0].data.status]}">{[values.children[0].data.status]} ({count})</div>',
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
                                html: '<strong>{totalDisbursementRecords}</strong> records',
                            },
                        });
                        this.add({
                            xtype: 'div',
                            width: '60%',
                            bind: {
                                html: '<div class="h5">Total open balance</div><div class="a-billed-price {totalBalanceColor > 0 ? "c-red" : (totalBalanceColor < 0 ? "c-green-500" : "")}"><span class="a-billed-currency">{currentCompany.default_currency}</span><span class="a-billed-amount">{totalBalance}</span></div>',
                            },
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
        viewModel: {
            formulas: {
                receivedPaymentsTotal: {
                    bind: {
                        bindTo: '{record.account.payments}',
                    },
                    get: function (payments) {
                        let record = this.get('record'),
                            total = 0,
                            account = this.get('record').getAccount();

                        if (payments) {
                            payments.each(function (payment) {
                                if (
                                    payment.get('from_org_id') === account.get('org_id') &&
                                    payment.get('paymentable_type') === record.get('model_name') &&
                                    payment.get('paymentable_id') === record.get('id')
                                ) {
                                    total += payment.get('calculated_amount');
                                }
                            });
                        }
                        record.set('received_payments', total);
                    },
                },
                receivedPaymentsGroupTotal: {
                    bind: {
                        bindTo: '{record.payments}',
                    },
                    get: function (payments) {
                        let record = this.get('record'),
                            total = 0,
                            account = this.get('record').getAccount();

                        if (payments) {
                            payments.each(function (payment) {
                                if (
                                    // payment.get('from_org_id') === account.get('org_id') &&
                                    payment.get('kind') === 'incoming'
                                ) {
                                    total += parseFloat(payment.get('calculated_amount'));
                                }
                            });
                        }
                        record.set('received_group_payments', total);
                    },
                },
                outgoingPaymentsTotal: {
                    bind: {
                        bindTo: '{record.account.payments}',
                    },
                    get: function (payments) {
                        let record = this.get('record'),
                            total = 0,
                            account = this.get('record').getAccount();

                        if (payments) {
                            payments.each(function (payment) {
                                if (
                                    payment.get('kind') === 'outgoing' &&
                                    payment.get('to_org_id') != account.get('org_id')
                                ) {
                                    total += payment.get('calculated_amount');
                                }
                            });
                        }
                        record.set('outgoing_payments', total);
                    },
                },
                agencyBalance: {
                    bind: {
                        totalCosts: '{record.account.total_costs}',
                        outgoingPayments: '{record.outgoing_payments}',
                    },
                    get: function (data) {
                        let record = this.get('record');
                        record.set('agency_balance', data.totalCosts - data.outgoingPayments);
                    },
                },
            },
        },
    },
    columns: [
        {
            dataIndex: 'group_id',
            text: 'DA type / ID',
            minWidth: 180,
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
            grouper: {
                groupFn: function (record) {
                    return record.get('group_id');
                },
            },
            groupHeaderTpl: '{name}',
            renderer: function (value, record) {
                if (record) {
                    return (
                        '<div class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="' +
                        record.get('type') +
                        '" data-icon="money"></span><div class="ml-12 text-truncate"><a class="fw-b cursor-pointer disbursement_details" javascript:void(0)>' +
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
            minWidth: 100,
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
                    cls: '',
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
            groupHeaderTpl:
                '<div class="a-group-header status-{[values.children[0].data.status]}">{[values.children[0].data.status]} ({count})</div>',
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="text-capitalize a-status-badge a-status-md status-' +
                        value +
                        '"><span class="text-truncate">' +
                        value +
                        '</span></div>'
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
            dataIndex: 'vessel',
            text: 'Vessel',
            minWidth: 180,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                bind: {
                    tpl: '<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate a_vessel_name" href="javascript:void(0)" title="{record.portcall.voyage.vessel_name}">{record.portcall.voyage.vessel_name}</a><div class="sm-title">{record.portcall.file_id}</div>',
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
            grouper: {
                groupFn: function (record) {
                    let val = record.get('portcall').voyage.vessel_name;
                    if (val) {
                        return val;
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
            groupHeaderTpl:
                '<div class="hbox"><i class="md-icon-outlined mr-12">directions_boat</i><a href="javascript.void(0)" class="fw-b">{name:uppercase}</a></div>',
            sorter: {
                sorterFn: function (a, b) {
                    let val1 = a.get('portcall').voyage.vessel_name,
                        val2 = b.get('portcall').voyage.vessel_name;

                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                return Abraxa.utils.Functions.exportVesselNameFileId(record, 'portcall');
            },
        },
        {
            text: 'File ID',
            dataIndex: 'file_id',
            minWidth: 120,
            hidden: true,
            cell: {
                cls: 'a-cell-file-id',
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
                    placeholder: 'File ID',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            grouper: {
                groupFn: function (record) {
                    let val = record.get('portcall').file_id;
                    if (val) {
                        return val;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '{name}',
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = record1.get('portcall').file_id;
                    let val2 = record2.get('portcall').file_id;
                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            renderer: function (value, record) {
                if (record.get('portcall') && record.get('portcall').file_id) {
                    return record.get('portcall').file_id;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record) {
                if (record.get('portcall') && record.get('portcall').file_id) {
                    return record.get('portcall').file_id;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Reference',
            dataIndex: 'customer_reference',
            minWidth: 120,
            groupable: false,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: [],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Voy. num',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = record1.getAccount().get('customer_reference');
                    let val2 = record2.getAccount().get('customer_reference');
                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            renderer: function (value, record) {
                if (record.getAccount() && record.getAccount().get('customer_reference')) {
                    return record.getAccount().get('customer_reference');
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record) {
                if (record.getAccount() && record.getAccount().get('customer_reference')) {
                    return record.getAccount().get('customer_reference');
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'HUB reference',
            dataIndex: 'hub_reference',
            minWidth: 120,
            groupable: false,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: [],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Voy. num',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = record1.get('portcall').nomination.hub_reference,
                        val2 = record2.get('portcall').nomination.hub_reference;
                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            renderer: function (value, record) {
                if (record.get('portcall').nomination && record.get('portcall').nomination.hub_reference) {
                    return record.get('portcall').nomination.hub_reference;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record) {
                if (record.get('portcall').nomination && record.get('portcall').nomination.hub_reference) {
                    return record.get('portcall').nomination.hub_reference;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Port',
            dataIndex: 'port',
            minWidth: 150,
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
                    if (a.get('portcall') && b.get('portcall')) {
                        return a.get('portcall').port_eta < b.get('portcall').port_eta
                            ? -1
                            : a.get('portcall').port_eta > b.get('portcall').port_eta
                              ? 1
                              : 0;
                    }
                    return 0;
                },
            },
            grouper: {
                groupFn: function (record) {
                    if (record.get('portcall') && record.get('portcall').port_name) {
                        return record.get('portcall').port_name;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
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
            minWidth: 160,
            groupable: false,
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
            groupable: false,
            minWidth: 160,
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
            sorter: {
                sorterFn: function (a, b) {
                    if (a.get('portcall') && b.get('portcall')) {
                        return a.get('portcall').port_etd < b.get('portcall').port_etd
                            ? -1
                            : a.get('portcall').port_etd > b.get('portcall').port_etd
                              ? 1
                              : 0;
                    }
                    return 0;
                },
            },
            renderer: function renderer(value, record) {
                if (record && record.get('portcall')) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(record.get('portcall').port_etd, 'D MMM YYYY - HH:mm');
                    // return moment(value).format("D MMM YY");
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (record && record.get('portcall')) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(record.get('portcall').port_etd, 'D MMM YYYY - HH:mm');
                }
            },
        },
        {
            text: 'Billing party',
            dataIndex: 'organization_name',
            minWidth: 180,
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
            grouper: {
                groupFn: function (record) {
                    return record.get('organization_name');
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
        },
        {
            text: 'Parent company',
            dataIndex: 'organization_parent',
            minWidth: 180,
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
            grouper: {
                groupFn: function (record) {
                    if (record.get('organization') && record.get('organization').parent) {
                        return record.get('organization').parent.org_name;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
            sorter: {
                sorterFn: function (record1, record2) {
                    if (
                        record1.get('organization') &&
                        record1.get('organization').parent &&
                        record2.get('organization') &&
                        record2.get('organization').parent
                    ) {
                        return record1.get('organization').parent.org_name > record2.get('organization').parent.org_name
                            ? 1
                            : -1;
                    }
                    return 0;
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
            text: 'Sub agent',
            dataIndex: 'sub_agent',
            minWidth: 180,
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
                    if (record && record.get('portcall').nomination && record.get('portcall').nomination.sub_agent_id) {
                        var label =
                            '<div class="party-item">' +
                            '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                            '<div class="sm-company text-truncate"><a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            record.get('portcall').nomination.sub_agent_id +
                            '">' +
                            record.get('portcall').nomination.sub_agent_name +
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
            grouper: {
                groupFn: function (record) {
                    if (record.get('portcall').nomination && record.get('portcall').nomination.sub_agent_name) {
                        return record.get('portcall').nomination.sub_agent_name;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
            sorter: {
                sorterFn: function (a, b) {
                    if (
                        a.get('portcall').nomination &&
                        a.get('portcall').nomination.sub_agent_name &&
                        b.get('portcall').nomination &&
                        b.get('portcall').nomination.sub_agent_name
                    ) {
                        return a.get('portcall').nomination.sub_agent_name > b.get('portcall').nomination.sub_agent_name
                            ? 1
                            : -1;
                    }
                    return 0;
                },
            },
            exportRenderer: function (value, record) {
                if (record.get('portcall').nomination && record.get('portcall').nomination.sub_agent_name) {
                    return record.get('portcall').nomination.sub_agent_name;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Lead agent',
            dataIndex: 'lead_agent',
            minWidth: 180,
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
                    if (
                        record &&
                        record.get('portcall').nomination &&
                        record.get('portcall').nomination.lead_agent_name
                    ) {
                        var label =
                            '<div class="party-item">' +
                            '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                            '<div class="sm-company text-truncate"><a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            record.get('portcall').nomination.lead_agent_id +
                            '">' +
                            record.get('portcall').nomination.lead_agent_name +
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
            grouper: {
                groupFn: function (record) {
                    if (record.get('portcall').nomination && record.get('portcall').nomination.lead_agent_name) {
                        return record.get('portcall').nomination.lead_agent_name;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
            sorter: {
                sorterFn: function (a, b) {
                    if (
                        a.get('portcall').nomination &&
                        a.get('portcall').nomination.lead_agent_name &&
                        b.get('portcall').nomination &&
                        b.get('portcall').nomination.lead_agent_name
                    ) {
                        return a.get('portcall').nomination.lead_agent_name >
                            b.get('portcall').nomination.lead_agent_name
                            ? 1
                            : -1;
                    }
                    return 0;
                },
            },
            exportRenderer: function (value, record) {
                if (record.get('portcall').nomination && record.get('portcall').nomination.lead_agent_name) {
                    return record.get('portcall').nomination.lead_agent_name;
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
                    cls: '',
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
            grouper: {
                groupFn: function (record) {
                    if (record && record.get('portcall').nomination) {
                        return record.get('portcall').nomination.agency_type_name;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '{name}',
            sorter: {
                sorterFn: function (a, b) {
                    if (a.get('portcall') && b.get('portcall')) {
                        return a.get('portcall').nomination.agency_type_name <
                            b.get('portcall').nomination.agency_type_name
                            ? -1
                            : a.get('portcall').nomination.agency_type_name >
                                b.get('portcall').nomination.agency_type_name
                              ? 1
                              : 0;
                    }
                    return 0;
                },
            },
            renderer: function (value, record) {
                if (record && record.get('portcall').nomination) {
                    return record && record.get('portcall').nomination.agency_type_name;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: 'disbursement_currency',
            text: 'Currency',
            minWidth: 100,
            groupable: false,
            sortable: false,
            align: 'center',
            cls: 'a-column-bl',
            cell: {
                cls: 'a-cell-bl',
                align: 'center',
            },
            filterType: {
                // required configs
                type: 'string',
                operator: '=',
                // optional configs
                operators: [],
                fieldDefaults: {
                    xtype: 'common-combo-currency',
                    cls: 'a-filter-bl',
                    ui: 'classic',
                    clearable: true,
                    placeholder: 'Choose',
                    // any Ext.form.field.Text configs accepted
                },
            },
        },
        {
            text: 'DA costs',
            dataIndex: 'total_costs',
            minWidth: 120,
            align: 'right',
            cls: 'a-column-amount a-column-bgr',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount a-cell-bgr',
                // zeroValue: '<span class="a-cell-placeholder">---</span>'
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-amount a-filter-bgr',
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
                return '<b class="fw-b">' + Ext.util.Format.number(val, '0,000.00') + '</b>';
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                return Ext.util.Format.number(value, '0,000.00');
            },
        },
        {
            dataIndex: 'received_payments',
            groupable: false,
            bind: {
                text: '{currentUserType != "principal" ? "DA payments" : "DA funded"}',
            },
            minWidth: 150,
            align: 'right',
            cls: 'a-column-amount a-column-br',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount a-cell-br',
                bind: {
                    tpl: '{record.received_payments:number("0,000.00")}',
                },
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-amount a-filter-br',
                    textAlign: 'right',
                    placeholder: '00.00',
                    clearable: true,
                    ui: 'classic',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
        },
        {
            dataIndex: 'received_group_payments',
            groupable: false,
            hidden: true,
            bind: {
                text: '{currentUserType != "principal" ? "Total payments" : "Total funded"}',
            },
            minWidth: 150,
            align: 'right',
            cls: 'a-column-amount a-column-br',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount a-cell-br',
                bind: {
                    tpl: '{record.received_group_payments:number("0,000.00")}',
                },
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-amount a-filter-br',
                    textAlign: 'right',
                    placeholder: '00.00',
                    clearable: true,
                    ui: 'classic',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
        },
        {
            dataIndex: 'client_balance',
            groupable: false,
            minWidth: 120,
            hidden: true,
            bind: {
                text: '{currentUserType != "principal" ? "Client balance" : "Open balance"}',
            },
            align: 'right',
            cls: 'a-column-br a-column-bgr',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-br a-cell-bgr fw-b',
                bind: {
                    tpl: '<div class="{record.account.balance:sign("c-green","c-red")}">{record.account.balance:number("0,000.00")}</div>',
                },
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-br a-filter-bgr',
                    textAlign: 'right',
                    placeholder: '00.00',
                    clearable: true,
                    ui: 'classic',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            sorter: {
                sorterFn: function (o1, o2) {
                    var v1 = o1.getAccount().get('balance'),
                        v2 = o2.getAccount().get('balance');
                    return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
                },
            },
            renderer: function (val, record) {
                if (record.getAccount()) {
                    return (
                        '<b class="fw-b">' +
                        Ext.util.Format.number(record.getAccount().get('balance'), '0,000.00') +
                        '</b>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                if (record.getAccount()) {
                    return (
                        '<b class="fw-b">' +
                        Ext.util.Format.number(record.getAccount().get('balance'), '0,000.00') +
                        '</b>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Agency cash',
            dataIndex: 'outgoing_payments',
            groupable: false,
            minWidth: 120,
            hidden: true,
            bind: {
                hideable: '{currentUserType != "principal" ? true : false}',
                // displayed: '{currentUserType != "principal" ? true : false}',
                ignore: '{currentUserType != "principal" ? false : true}',
            },
            align: 'right',
            cls: 'a-column-br',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-br fw-b',
                bind: {
                    tpl: '{record.outgoing_payments:number("0,000.00")}',
                },
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-br',
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
            exportRenderer: function (value, record) {
                return Ext.util.Format.number(value, '0,000.00');
            },
        },
        {
            text: 'Agency balance',
            dataIndex: 'agency_balance',
            groupable: false,
            minWidth: 120,
            hidden: true,
            bind: {
                hideable: '{currentUserType != "principal" ? true : false}',
                // displayed: '{currentUserType != "principal" ? true : false}',
                ignore: '{currentUserType != "principal" ? false : true}',
            },
            align: 'right',
            cls: 'a-column-br a-column-bgr',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-br a-cell-bgr fw-b',
                bind: {
                    tpl: '{record.agency_balance:number("0,000.00")}',
                },
            },
            filterType: {
                // required configs
                type: 'number',
                operator: 'like',
                // optional configs
                operators: [],
                fieldDefaults: {
                    cls: 'a-filter-br a-filter-bgr',
                    textAlign: 'right',
                    placeholder: '00.00',
                    clearable: false,
                    ui: 'classic',
                    disabled: true,
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            exportRenderer: function (value, record) {
                return Ext.util.Format.number(value, '0,000.00');
            },
        },
        {
            text: 'Updated',
            minWidth: 180,
            dataIndex: 'updated_at',
            hidden: true,
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
        // {
        //     dataIndex: '',
        //     minWidth: 64,
        //     flex: 1,
        //     sortable: false,
        //     menuDisabled: true,
        //     resizable: false,
        //     hideable: false,
        //     editable: false,
        //     ignore: true,
        //     // docked: "right",
        //     toolDefaults: {
        //         xtype: 'tool',
        //     },
        //     tools: [
        //         {
        //             type: 'gear',
        //             hidden: true,
        //             ui: 'tool-md',
        //             right: 4,
        //             handler: function () {
        //                 this.up('grid').getPlugin('gridviewoptions').showViewOptions();
        //             },
        //             tooltip: {
        //                 anchorToTarget: true,
        //                 html: 'Customize',
        //                 align: 'bc-tc?',
        //             },
        //         },
        //     ],
        //     cell: {
        //         cls: 'no_expand a_grid_action a-cell-more',
        //         align: 'right',
        //         toolDefaults: {
        //             zone: 'end',
        //         },
        //         tools: [
        //             // {
        //             //     iconCls: 'md-icon-more-horiz',
        //             //     ui: 'tool-md round',
        //             //     tooltip: {
        //             //         anchorToTarget: true,
        //             //         align: 'bc-tc?',
        //             //         html: 'More actions',
        //             //         showDelay: 0,
        //             //         hideDelay: 0,
        //             //         dismissDelay: 0,
        //             //         closeAction: 'destroy',
        //             //     },
        //             //     handler: function handler(owner, tool, e) {
        //             //         let record = this.upVM().get('record'),
        //             //             vm = this.up('grid').upVM(),
        //             //             disbursements = this.up('grid').getStore();

        //             //         Ext.create('Abraxa.view.portcall.disbursements.DisbursementEditMenu', {
        //             //             viewModel: {
        //             //                 parent: vm,
        //             //                 data: {
        //             //                     disbursements: disbursements,
        //             //                     disbursement: record,
        //             //                     expenses: record.expenses(),
        //             //                 },
        //             //                 formulas: {
        //             //                     disableDelete: {
        //             //                         bind: {
        //             //                             bindTo: '{disbursement}',
        //             //                             deep: true,
        //             //                         },
        //             //                         get: function (disbursement) {
        //             //                             if (disbursement) {
        //             //                                 let owner =
        //             //                                     disbursement.get('company_id') ==
        //             //                                     this.get('currentUser').get('current_company_id')
        //             //                                         ? true
        //             //                                         : false;
        //             //                                 if (owner) {
        //             //                                     let object_record = disbursement.get('portcall');
        //             //                                     if (object_record.is_archived) {
        //             //                                         return false;
        //             //                                     } else {
        //             //                                         let type = disbursement.get('type'),
        //             //                                             has_dda = disbursement.get('dda_id'),
        //             //                                             has_fda = disbursement.get('fda_id');

        //             //                                         if (type == 'pda' && (has_dda || has_fda)) return false;

        //             //                                         if (type == 'dda' && has_fda) return false;

        //             //                                         return true;
        //             //                                     }
        //             //                                 } else {
        //             //                                     return false;
        //             //                                 }
        //             //                             }
        //             //                             return true;
        //             //                         },
        //             //                     },
        //             //                 },
        //             //             },
        //             //         }).showBy(this);
        //             //     },
        //             // },
        //             {
        //                 xtype: 'button',
        //                 iconCls: 'md-icon-navigate-next',
        //                 ui: 'tool-sm round normal raised',
        //                 cls: 'chameleon_view_details_portcall',
        //                 tooltip: {
        //                     anchorToTarget: true,
        //                     align: 'bc-tc?',
        //                     html: 'View details',
        //                     showDelay: 0,
        //                     hideDelay: 0,
        //                     dismissDelay: 0,
        //                     closeAction: 'destroy',
        //                 },
        //             },
        //         ],
        //     },
        // },
    ],
    listeners: {
        childtap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
        childdoubletap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
            let record = location.record;
            window.location.hash = '#portcall/' + record.get('portcall').id + '/disbursements';
        },
    },
});
