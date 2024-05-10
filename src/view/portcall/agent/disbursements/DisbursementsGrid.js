Ext.define('Abraxa.view.portcall.disbursements.DisbursementsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'disbursements.grid',
    cls: 'a-detailed-grid a-disbursements-grid abraxa-grid',
    ui: 'bordered',
    scrollable: true,
    itemId: 'disbursementsGrid',
    testId: 'disbursementsGrid',
    showNoPermissions: true,
    skipEditPermission: true,
    slug: 'portcallDisbursements',
    bind: {
        permission: '{userPermissions}',
        store: '{accountDisbursements}',
        hideHeaders: '{accountDisbursements.count ? false : true}',
    },
    reference: 'disbursementsGrid',
    stateful: ['plugins', 'columns'],
    stateId: 'disbursementsGrid-state',
    plugins: {
        gridviewoptions: true,
    },
    itemConfig: {
        viewModel: {
            formulas: {
                totalPayments: {
                    bind: {
                        bindTo: '{payments}',
                        deep: true,
                    },
                    get: function (store) {
                        total = 0;
                        if (store) {
                            total = store.sum('calculated_amount');
                        }
                        return total;
                    },
                },
                disbursementPayment: {
                    bind: {
                        disbursement: '{record}',
                        totalPayments: '{totalPayments}',
                    },
                    get: function (data) {
                        if (data) {
                            let payments = this.get('payments');
                            let disbursementPaymentsTotal = 0;
                            if (payments) {
                                let disbursementPayments = payments.queryBy(function (rec, id) {
                                    return (
                                        rec.get('paymentable_id') == data.disbursement.get('id') &&
                                        rec.get('paymentable_type') == data.disbursement.get('model_name') &&
                                        rec.get('kind') != 'requested' &&
                                        rec.get('status') != 'draft' &&
                                        (rec.get('from_org_id') == data.disbursement.get('organization_id') ||
                                            rec.get('to_org_id') == data.disbursement.get('organization_id'))
                                    );
                                });

                                disbursementPayments.each(function (payment) {
                                    if (payment.get('kind') == 'incoming') {
                                        disbursementPaymentsTotal += payment.get('calculated_amount');
                                    } else if (payment.get('kind') == 'outgoing' && payment.get('is_refund')) {
                                        disbursementPaymentsTotal -= payment.get('calculated_amount');
                                    }
                                });
                                data.disbursement.set('total_payments', disbursementPaymentsTotal);
                            }
                        }
                    },
                },
                recordApprovals: {
                    bind: {
                        bindTo: '{record.approvals}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            let member = this.get('member'),
                                members = this.get('members'),
                                filteredApprovals = Ext.create('Ext.data.Store', {
                                    autoSort: true,
                                    sorters: [
                                        {
                                            property: 'created_at',
                                            direction: 'ASC',
                                        },
                                    ],
                                });
                            if (member) {
                                members.each(function (member) {
                                    if (member.get('tenant_id')) {
                                        let memberApproval = store
                                            .queryBy(function (approval) {
                                                return approval.get('to_company_id') == member.get('tenant_id');
                                            })
                                            .last();

                                        if (memberApproval) filteredApprovals.add(memberApproval);
                                    }
                                });
                            } else {
                                filteredApprovals.add(store.first());
                            }

                            return filteredApprovals.queryBy(function (rec) {
                                return rec.get('status') != 'canceled';
                            }).items[0];
                        }
                    },
                },
            },
        },
    },
    grouped: true,
    groupHeader: {
        tpl: '<div class="c-blue">#{name}</div>',
        disabled: true,
        style: 'pointer-events:none;',
        padding: '16 24',
    },
    weighted: true,
    columns: [
        {
            dataIndex: 'id',
            text: 'DA',
            minWidth: 280,
            flex: 4,
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
            renderer: function (value, record) {
                if (record) {
                    return (
                        '<div class="a-disbursement-name"><i class="md-icon-outlined">subdirectory_arrow_right</i><span class="file-icon-badge file-icon-x32" data-type="' +
                        record.get('type') +
                        '" data-icon="money"></span><div class="ml-12"><a class="fw-b cursor-pointer disbursement_details" javascript:void(0)>' +
                        record.get('name') +
                        '</a><div class="sm-title">#' +
                        record.get('group_id') +
                        '</div></div>'
                    );
                }
            },
            summaryRenderer: function () {
                return '';
            },
        },
        {
            dataIndex: 'status',
            minWidth: 160,
            text: 'Status',
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            summaryRenderer: function (val) {
                return '<span style="display:block; text-align: right;">Total</span>';
            },
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
        },
        {
            dataIndex: 'disbursement_currency',
            text: 'Currency',
            minWidth: 100,
            groupable: false,
            sortable: false,
            align: 'center',
            cell: {
                cls: 'a-cell-bl',
                align: 'center',
            },
        },
        {
            dataIndex: 'total_costs',
            bind: {
                text: 'DA costs',
            },
            minWidth: 120,
            align: 'right',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount',
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            summary: 'sum',
            formatter: 'number("0,000.00")',
            summaryRenderer: function (val, options) {
                let selectedAccount = options.grid.upVM().get('selectedAccount');

                if (selectedAccount) {
                    return (
                        '<b class="c-light-grey mr-8">' +
                        selectedAccount.get('account_currency') +
                        '</b><b class="fw-b">' +
                        Ext.util.Format.number(val, '0,000.00') +
                        '</b>'
                    );
                }
            },
        },
        {
            text: 'Payments',
            dataIndex: 'total_payments',
            minWidth: 120,
            align: 'right',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount a-cell-br',
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            summary: 'sum',
            formatter: 'number("0,000.00")',
            summaryRenderer: function (val, options) {
                let selectedAccount = options.grid.upVM().get('selectedAccount');

                if (selectedAccount) {
                    return (
                        '<b class="c-light-grey mr-8">' +
                        selectedAccount.get('account_currency') +
                        '</b><b class="fw-b">' +
                        Ext.util.Format.number(val, '0,000.00') +
                        '</b>'
                    );
                }
            },
        },
        {
            dataIndex: 'tags',
            minWidth: 200,
            text: 'Labels',
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
            text: 'Approvals',
            minWidth: 320,
            hidden: true,
            sortable: false,
            menuDisabled: true,
            cell: {
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'container',
                    hidden: true,
                    hideMode: 'clip',
                    bind: {
                        hidden: '{recordApprovals ? false : true}',
                        html: '<div class="a-approval-status"><i class="md-icon a-approval-icon-{recordApprovals.status}"></i><span class="a-subtitle mr-6">{recordApprovals.status:capitalize} {recordApprovals.status === "pending" ? "approval from" : "by"}</span><span class="fw-b a-link">{recordApprovals.to_company.name}</span></div>',
                    },
                },
            },
        },
        {
            text: 'Updated by',
            minWidth: 180,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.updated_by_user}',
                            updated_at: '{record.updated_at}',
                        },
                    },
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            summaryRenderer: function (val) {
                return '';
            },
            cell: {
                xtype: 'widgetcell',
                align: 'right',
                focusable: false,
                widget: {
                    xtype: 'container',
                    focusable: false,
                    layout: {
                        type: 'hbox',
                        pack: 'end',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-more-horiz',
                            ui: 'tool-md round',
                            margin: '0 8 0 0',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
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
                                    vm = this.up('grid').upVM();
                                Ext.create('Abraxa.view.portcall.disbursements.DisbursementEditMenu', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            disbursement: record,
                                        },
                                        formulas: {
                                            disableDelete: {
                                                bind: {
                                                    bindTo: '{disbursement}',
                                                    deep: true,
                                                },
                                                get: function (disbursement) {
                                                    if (disbursement) {
                                                        let owner = this.get('is_owner');
                                                        if (owner) {
                                                            let object_record = this.get('object_record');
                                                            if (object_record.get('is_archived')) {
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
                            cls: 'mr-16',
                            tooltip: {
                                anchorToTarget: true,
                                align: 'bc-tc?',
                                html: 'View details',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let grid = this.up('grid'),
                                    record = this.upVM().get('record');

                                grid.select(record);
                                this.upVM().set('showDetails', true);
                            },
                        },
                    ],
                },
            },
        },
    ],
    items: [
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    subObject: 'disbursements',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'action small',
                            iconCls: 'md-icon-add',
                            slug: 'portcallDisbursementAdd',
                            testId: 'portcallDisbursementsGridAddSmallBtn',
                            subObject: 'disbursements',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                hidden: '{!accountDisbursements.count}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            text: 'Disbursement',
                            handler: function (me) {
                                let currentUser = me.upVM().get('currentUser'),
                                    dialog = Ext.create('Abraxa.view.portcall.disbursements.CreateDisbursement', {
                                        viewModel: {
                                            parent: me.upVM(),
                                            data: {
                                                record: Ext.create('Abraxa.model.disbursement.Disbursement', {
                                                    account_id: me.upVM().get('selectedAccount').get('id'),
                                                    organization_id: me.upVM().get('selectedAccount').get('org_id'),
                                                    organization_name: me.upVM().get('selectedAccount').get('org_name'),
                                                    portcall_id: me.upVM().get('selectedAccount').get('portcall_id'),
                                                    base_currency: me
                                                        .upVM()
                                                        .get('selectedAccount')
                                                        .get('base_currency'),
                                                    disbursement_currency: me
                                                        .upVM()
                                                        .get('selectedAccount')
                                                        .get('account_currency'),
                                                    exchange_rate: me
                                                        .upVM()
                                                        .get('selectedAccount')
                                                        .get('exchange_rate'),
                                                }),
                                                editMode: false,
                                            },
                                            stores: {
                                                taskTemplates: {
                                                    type: 'templates',
                                                    autoLoad: true,
                                                    filters: [
                                                        {
                                                            property: 'type',
                                                            operator: '=',
                                                            value: 'disbursement',
                                                            exactMatch: true,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    });
                                mixpanel.track('Disbursement button');
                                dialog.show();
                            },
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'end',
                            },
                            flex: 1,
                            bind: {
                                hidden: '{accountDisbursements.count ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-settings',
                                    text: 'Customize',
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        this.find('disbursementsGrid').getPlugin('gridviewoptions').showViewOptions();
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No disbursements available</div></div>',
            },
            {
                xtype: 'button',
                cls: 'a-no-content-btn chameleon_disbursements_add_button_grid',
                text: 'Disbursement',
                ui: 'normal-light medium',
                slug: 'portcallDisbursementAdd',
                testId: 'portcallDisbursementsGridAddBtn',
                subObject: 'disbursements',
                bind: {
                    cls: '{nonEditable ? "hidden a-no-content-btn chameleon_disbursements_add_button_grid" : "a-no-content-btn chameleon_disbursements_add_button_grid"}',
                    permission: '{userPermissions}',
                    objectPermission: '{objectPermissions}',
                },
                iconCls: 'md-icon-add',
                handler: function (me) {
                    let currentUser = me.upVM().get('currentUser'),
                        dialog = Ext.create('Abraxa.view.portcall.disbursements.CreateDisbursement', {
                            viewModel: {
                                parent: me.upVM(),
                                data: {
                                    record: Ext.create('Abraxa.model.disbursement.Disbursement', {
                                        account_id: me.upVM().get('selectedAccount').get('id'),
                                        organization_id: me.upVM().get('selectedAccount').get('org_id'),
                                        organization_name: me.upVM().get('selectedAccount').get('org_name'),
                                        portcall_id: me.upVM().get('selectedAccount').get('portcall_id'),
                                        base_currency: me.upVM().get('selectedAccount').get('base_currency'),
                                        disbursement_currency: me.upVM().get('selectedAccount').get('account_currency'),
                                        exchange_rate: me.upVM().get('selectedAccount').get('exchange_rate'),
                                    }),
                                    editMode: false,
                                },
                                stores: {
                                    taskTemplates: {
                                        type: 'templates',
                                        autoLoad: true,
                                        filters: [
                                            {
                                                property: 'type',
                                                operator: '=',
                                                value: 'disbursement',
                                                exactMatch: true,
                                            },
                                        ],
                                    },
                                },
                            },
                        });
                    dialog.show();
                },
            },
        ],
    },
    listeners: {
        childtap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
        childdoubletap: function (element, location, eOpts) {
            this.upVM().set('showDetails', true);
        },
    },
});
