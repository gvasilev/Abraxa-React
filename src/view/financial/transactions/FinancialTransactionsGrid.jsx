Ext.define('Abraxa.view.financial.accounts.FinancialTransactionsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'financial.transactions.grid',
    testId: 'financialTransactionsGrid',
    flex: 1,
    cls: 'a-disbursements-grid a-wps-financial-grid abraxa-grid',
    ui: 'bordered',
    stateful: ['plugins', 'columns', 'filters'],
    stateId: 'financial-transactions-grid',
    itemId: 'financial-transactions-grid',
    reference: 'financialTransactionsGrid',
    infinite: false,
    store: [],
    collapsible: false,
    bind: {
        store: '{paymentsStore}',
    },
    scrollToTopOnRefresh: false,
    pinHeaders: false,
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
                                html: '<strong>{totalTransactionsRecords}</strong> records',
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
            nonStatefulFilters: ['search', 'archived', 'archived_at'],
        },
    },
    selectable: {
        deselectable: true,
        // toggleOnClick: false,
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No transactions available</div></div>',
            },
        ],
    },
    itemConfig: {
        bind: {
            cls: 'a-detailed-item',
        },
        viewModel: {
            formulas: {
                agencyCash: {
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
                        record.set('agency_cash', total);
                    },
                },
                clientCash: {
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
                                    payment.get('kind') === 'incoming' &&
                                    payment.get('from_org_id') === account.get('org_id')
                                ) {
                                    total += payment.get('calculated_amount');
                                }
                            });
                        }
                        record.set('client_cash', total);
                    },
                },
                agencyBalance: {
                    bind: {
                        totalCosts: '{record.account.total_costs}',
                        outgoingPayments: '{record.account.outgoing_payments}',
                    },
                    get: function (data) {
                        let record = this.get('record'),
                            balance = 0;

                        if (data.totalCosts && data.outgoingPayments)
                            balance =
                                data.totalCosts -
                                data.outgoingPayments.reduce((total, obj) => parseFloat(obj.amount) + total, 0);

                        record.set('agency_balance', balance);
                    },
                },
            },
        },
    },
    columns: [
        {
            text: 'From/To',
            dataIndex: 'updated_at',
            cls: 'a-column-offset-x24',
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            flex: 1,
            minWidth: 220,
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: [],
                dataIndex: 'from_to',
                fieldDefaults: {
                    padding: '0 0 0 12',
                    ui: 'classic',
                    placeholder: 'From/to',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            grouper: {
                groupFn: function (record) {
                    return record.get('org_name');
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)" class="a-link">{name}</a>',
            renderer: function (val, record) {
                let type = record.get('kind'),
                    badge = type,
                    category = '',
                    icon = '';
                if (type == 'incoming') {
                    icon = '<i class="md-icon-outlined">add</i>';
                    val = record.get('from_org_name');
                    category = 'Payment from';
                } else if (type == 'outgoing') {
                    icon = '<i class="md-icon-outlined">remove</i>';
                    val = record.get('to_org_name');
                    category = 'Payment to';
                }
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-' +
                        badge +
                        '">' +
                        icon +
                        '</div><div class="ml-12 text-truncate"><div class="sm-title">' +
                        category +
                        '</div><div class="fw-b text-truncate">' +
                        val +
                        '</div></div>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
            exportRenderer: function (val, record) {
                let type = record.get('kind'),
                    category = '';
                if (type == 'incoming') {
                    val = record.get('from_org_name');
                    category = 'Payment from';
                } else if (type == 'outgoing') {
                    val = record.get('to_org_name');
                    category = 'Payment to';
                }
                if (val) {
                    return category + ' ' + val;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Related to',
            dataIndex: 'paymentable_id',
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            minWidth: 180,
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: [],
                dataIndex: 'related_to',
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Related to',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            grouper: {
                groupFn: function (record) {
                    return record.get('paymentable_id');
                },
            },
            groupHeaderTpl: Ext.create('Ext.XTemplate', '{[this.parseData(values)]}', {
                parseData: function (values) {
                    if (values.children[0]) {
                        let record = values.children[0],
                            html = '<span class="a-cell-placeholder">---</span>';

                        switch (record.get('paymentable_type')) {
                            case 'App\\Models\\Disbursement\\Disbursement':
                                html =
                                    '<div class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="' +
                                    record.get('paymentable').type +
                                    '" data-icon="money"></span><div class="ml-12"><a class="fw-b cursor-pointer disbursement_details" javascript:void(0)>' +
                                    record.get('paymentable').name +
                                    '</a><div class="sm-title">' +
                                    record.get('paymentable').group_id +
                                    '</div></div>';
                                break;
                            case 'App\\Models\\Disbursement\\Voucher':
                                html =
                                    '<div class="hbox"><span class="file-icon-new file-icon-xs-new" data-type="pdf"></span>' +
                                    '<span class="fw-b ml-12 text-truncate">' +
                                    Ext.String.capitalize(record.get('paymentable').name) +
                                    '</span></div>';
                                break;
                        }
                        return html;
                    }
                },
            }),
            renderer: function renderer(val, record) {
                if (val && record.get('paymentable')) {
                    let html;
                    switch (record.get('paymentable_type')) {
                        case 'App\\Models\\Disbursement\\Disbursement':
                            html =
                                '<div class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="' +
                                record.get('paymentable').type +
                                '" data-icon="money"></span><div class="ml-12"><a class="fw-b cursor-pointer disbursement_details" javascript:void(0)>' +
                                record.get('paymentable').name +
                                '</a><div class="sm-title">' +
                                record.get('paymentable').group_id +
                                '</div></div>';
                            break;
                        case 'App\\Models\\Disbursement\\Voucher':
                            html =
                                '<div class="hbox"><span class="file-icon-new file-icon-xs-new" data-type="pdf"></span>' +
                                '<span class="fw-b ml-12 text-truncate">' +
                                Ext.String.capitalize(record.get('paymentable').name) +
                                '</span></div>';
                            break;
                    }
                    return html;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function (val, record) {
                if (val) {
                    return record.get('paymentable').name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            dataIndex: 'vessel_name',
            text: 'Vessel',
            minWidth: 180,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.a_vessel_name',
                        fn: function fn() {
                            let imo,
                                record = this.component.getRecord().get('owner');

                            if (record.id) window.location.hash = '#portcall/' + record.id + '/payments';
                        },
                    },
                },
                renderer: function (value, record) {
                    if (record.get('owner').voyage) {
                        return (
                            '<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate a_vessel_name" href="javascript:void(0)">' +
                            record.get('owner').voyage.vessel_name +
                            '</a><div class="sm-title">' +
                            (record.get('owner').file_id
                                ? record.get('owner').file_id
                                : AbraxaConstants.placeholders.emptyValue) +
                            '</div>'
                        );
                    }
                    return AbraxaConstants.placeholders.emptyValue;
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
                    let val = record.get('owner').voyage.vessel_name;
                    if (val) {
                        return val;
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
            groupHeaderTpl:
                '<div class="hbox ml-24"><i class="md-icon-outlined mr-12">directions_boat</i><a href="javascript.void(0)" class="fw-b">{name}</a></div>',
            sorter: {
                sorterFn: function (a, b) {
                    let val1 = a.get('owner').voyage.vessel_name,
                        val2 = b.get('owner').voyage.vessel_name;

                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            exportRenderer: function (value, record, dataIndex, cell, column) {
                return Abraxa.utils.Functions.exportVesselNameFileId(record, 'owner');
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
                    if (a.get('owner') && b.get('owner')) {
                        return a.get('owner').port_eta < b.get('owner').port_eta
                            ? -1
                            : a.get('owner').port_eta > b.get('owner').port_eta
                              ? 1
                              : 0;
                    }
                    return 0;
                },
            },
            grouper: {
                groupFn: function (record) {
                    if (record.get('owner') && record.get('owner').port_name) {
                        return record.get('owner').port_name;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
            renderer: function (value, record) {
                return Abraxa.utils.Functions.portRendererType(record, 'owner');
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                return Abraxa.utils.Functions.portRendererType(record, 'owner', true);
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
                    let val = record.get('owner').file_id;
                    if (val) {
                        return val;
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '{name}',
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = record1.get('owner').file_id;
                    let val2 = record2.get('owner').file_id;
                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            renderer: function (value, record) {
                if (record.get('owner') && record.get('owner').file_id) {
                    return record.get('owner').file_id;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record) {
                if (record.get('owner') && record.get('owner').file_id) {
                    return record.get('owner').file_id;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Billing party',
            dataIndex: 'org_name',
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
                        var label =
                            '<div class="party-item">' +
                            '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                            '<div class="sm-company text-truncate"><a class="a_grid_action company_details fw-b" href="javascript:void(0)" data-company_id="' +
                            record.get('org_id') +
                            '">' +
                            value +
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
                operators: [],
                dataIndex: 'billing_party',
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            grouper: {
                groupFn: function (record) {
                    return record.get('org_name');
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
        },
        {
            text: 'Voy. number',
            dataIndex: 'voyage_number',
            minWidth: 120,
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
            grouper: {
                groupFn: function (record) {
                    let val = record.get('owner').nomination.voyage_number
                        ? record.get('owner').nomination.voyage_number
                        : AbraxaConstants.placeholders.emptyValue;
                    return val;
                },
            },
            groupHeaderTpl: '{name}',
            sorter: {
                sorterFn: function (a, b) {
                    let aVal = a.get('owner').nomination.voyage_number,
                        bVal = b.get('owner').nomination.voyage_number;
                    if (aVal > bVal) {
                        return 1;
                    } else if (aVal < bVal) {
                        return -1;
                    } else {
                        return 0;
                    }
                },
            },
            renderer: function (value, record) {
                if (record.get('owner').nomination) {
                    return record.get('owner').nomination.voyage_number
                        ? record.get('owner').nomination.voyage_number
                        : '<span class="a-cell-placeholder">---</span>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record) {
                if (record.get('owner').nomination) {
                    return record.get('owner').nomination.voyage_number
                        ? record.get('owner').nomination.voyage_number
                        : '<span class="a-cell-placeholder">---</span>';
                }
                return '<span class="a-cell-placeholder">---</span>';
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
            hidden: true,
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
                    placeholder: 'HUB ref.',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = record1.get('owner').nomination.hub_reference,
                        val2 = record2.get('owner').nomination.hub_reference;
                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            renderer: function (value, record) {
                if (record.get('owner').nomination && record.get('owner').nomination.hub_reference) {
                    return record.get('owner').nomination.hub_reference;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record) {
                if (record.get('owner').nomination && record.get('owner').nomination.hub_reference) {
                    return record.get('owner').nomination.hub_reference;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            dataIndex: 'account_currency',
            text: 'Currency',
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
            text: 'Incoming',
            dataIndex: 'incoming_amount',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            minWidth: 120,
            formatter: 'number("0,000.00")',
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-bl c-teal fw-b',
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                dataIndex: 'incoming_amount',
                fieldDefaults: {
                    cls: 'a-filter-amount a-filter-bl',
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
        },
        {
            text: 'Outgoing',
            dataIndex: 'outgoing_amount',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            minWidth: 120,
            formatter: 'number("0,000.00")',
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-bl c-red fw-b',
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                dataIndex: 'outgoing_amount',
                fieldDefaults: {
                    cls: 'a-filter-amount a-filter-bl',
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
        },
        {
            text: 'Payment currency',
            dataIndex: 'currency',
            groupable: false,
            sortable: false,
            hidden: true,
            align: 'center',
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'center',
                cls: 'a-cell-bl',
            },
        },
        {
            text: 'ROE',
            dataIndex: 'exchange_rate',
            sortable: false,
            menuDisabled: true,
            groupable: false,
            hidden: true,
            align: 'center',
            cls: 'a-column-bl',
            minWidth: 100,
            cell: {
                encodeHtml: false,
                align: 'center',
                cls: 'a-cell-bl',
            },
            renderer: function (value, record) {
                return Abraxa.utils.Functions.formatROE(value);
            },
        },
        {
            text: 'Payment amount',
            dataIndex: 'amount',
            sortable: false,
            menuDisabled: true,
            groupable: false,
            hidden: true,
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-bl fw-b',
                bind: {
                    tpl: '{record.amount:number("0,000.00")}',
                },
            },
        },
        {
            text: 'Agency cash',
            dataIndex: 'agency_cash',
            groupable: false,
            minWidth: 120,
            hidden: true,
            align: 'right',
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-bl fw-b',
                bind: {
                    tpl: '{record.agency_cash:number("0,000.00")}',
                },
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-amount a-filter-bl',
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
            align: 'right',
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-bl fw-b',
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
                    cls: 'a-filter-amount a-filter-bl',
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
            text: 'Client cash',
            dataIndex: 'client_cash',
            groupable: false,
            minWidth: 120,
            hidden: true,
            align: 'right',
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-bl fw-b',
                bind: {
                    tpl: '{record.client_cash:number("0,000.00")}',
                },
            },
            filterType: {
                // required configs
                type: 'number',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-amount a-filter-bl',
                    textAlign: 'right',
                    placeholder: '00.00',
                    clearable: true,
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
            text: 'Client balance',
            dataIndex: 'client_balance',
            groupable: false,
            minWidth: 120,
            hidden: true,
            align: 'right',
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-bl fw-b',
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
                    cls: 'a-filter-amount a-filter-bl',
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
            text: 'Payment date',
            dataIndex: 'payment_date',
            groupable: false,
            minWidth: 120,
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl a-cell-date',
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '>',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    cls: 'a-filter-bl',
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    placeholder: 'Enter date',
                    // any Ext.form.field.Text configs accepted
                },
                // serializer: function (value) {

                //     return;
                // }
            },
            formatter: 'date("d M y")',
        },
        {
            text: 'Created',
            minWidth: 180,
            dataIndex: 'updated_at',
            cls: 'a-column-bl',
            hidden: true,
            cell: {
                cls: 'a-cell-bl a-cell-date',
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
                    cls: 'a-filter-amount a-filter-bl',
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
    ],
    listeners: {
        childtap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
        childdoubletap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
            let record = location.record;
            if (record.get('owner').id) window.location.hash = '#portcall/' + record.get('owner').id + '/disbursements';
        },
    },
});
