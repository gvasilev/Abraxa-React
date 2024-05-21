Ext.define('Abraxa.view.portcall.principal.disbursements.BillingPartyDisbursementsList', {
    extend: 'Abraxa.core.ComponentDataview',
    xtype: 'BillingPartyDisbursementsList',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    cls: 'a-bgr-transparent',
    bind: {
        store: '{disbursementSplit}',
    },
    itemConfig: {
        xtype: 'grid',
        selectable: false,
        cls: 'a-card-container abraxa-grid a-detailed-grid a-timeline-grid',
        minHeight: 100,
        maxHeight: 1000,
        infinite: false,
        viewModel: {
            formulas: {
                lastDisbursement: {
                    bind: {
                        bindTo: '{record}',
                    },
                    get: function (record) {
                        let lastRecord = record.get('disbursements')[record.get('disbursements').length - 1];
                        return lastRecord;
                    },
                },
            },
        },
        itemConfig: {
            viewModel: {
                formulas: {
                    totalPayments: {
                        bind: {
                            bindTo: '{record.payments}',
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
                                }
                                data.disbursement.set('total_payments', disbursementPaymentsTotal);
                            }
                        },
                    },
                    recordApproval: {
                        bind: {
                            bindTo: '{record.approvals}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store) {
                                return store.findRecord('to_company_id', this.get('currentUser.current_company_id'));
                            }
                        },
                    },
                },
            },
        },
        items: [
            {
                xtype: 'container',
                cls: 'a-titlebar a-bb-100',
                docked: 'top',
                height: 64,
                items: [
                    {
                        xtype: 'title',
                        bind: {
                            title: '<div class="hbox"><span>{record.name}</span><span class="a-subtitle-dashed hbox"><div class="a-badge-da-stage a-badge-da-stage-{lastDisbursement.status}"></div></span><span class="fs-14 mx-6">{lastDisbursement.type:uppercase}</span><span class="fw-n fs-14">{lastDisbursement.status:capitalize}</span></div>',
                        },
                    },
                ],
            },
        ],
        bind: {
            store: '{record.disbursements}',
        },
        columns: [
            {
                dataIndex: 'id',
                text: '',
                width: 60,
                sortable: false,
                menuDisabled: true,
                resizable: false,
                cell: {
                    cls: 'a-timeline-cell',
                    encodeHtml: false,
                },
                renderer: function (value, record) {
                    if (record) {
                        return (
                            '<span class="file-icon-badge file-icon-x32" data-type="' +
                            record.get('type') +
                            '" data-icon="money"></span>'
                        );
                    }
                },
            },
            {
                dataIndex: 'name',
                text: 'Disbursement',
                minWidth: 200,
                sortable: false,
                menuDisabled: true,
                flex: 4,
                cell: {
                    encodeHtml: false,
                    cls: 'a-bb-100',
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
                            '<div class="a-disbursement-name"><div><a class="fw-b cursor-pointer disbursement_details" javascript:void(0)>' +
                            record.get('name') +
                            '</a></div>'
                        );
                    }
                },
            },
            {
                dataIndex: 'status',
                minWidth: 160,
                text: 'Status',
                sortable: false,
                menuDisabled: true,
                cell: {
                    cls: 'expand a-bb-100',
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
                dataIndex: 'total_costs',
                text: 'DA costs',
                minWidth: 160,
                align: 'right',
                cls: 'a-column-bl',
                sortable: false,
                menuDisabled: true,
                cell: {
                    encodeHtml: false,
                    align: 'right',
                    cls: 'a-cell-amount a-bb-100',
                    zeroValue: '<span class="a-cell-placeholder">---</span>',
                    tpl: '<div><span class="mr-8 fw-n c-grey">{disbursement_currency}</span>{total_costs:number("0,000.00")}</div>',
                },
            },
            {
                text: 'Payments',
                dataIndex: 'total_payments',
                minWidth: 160,
                align: 'right',
                cls: 'a-column-bl a-column-br',
                sortable: false,
                menuDisabled: true,
                cell: {
                    encodeHtml: false,
                    align: 'right',
                    cls: 'a-cell-amount a-cell-br a-bb-100',
                    zeroValue: '<span class="a-cell-placeholder">---</span>',
                    tpl: '<div><span class="mr-8 fw-n c-grey">{disbursement_currency}</span>{total_payments:number("0,000.00")}</div>',
                },
            },
            {
                dataIndex: 'tags',
                minWidth: 180,
                text: 'Labels',
                hidden: false,
                sortable: false,
                menuDisabled: true,
                cell: {
                    cls: 'expand a-bb-100',
                    bodyCls: 'a-cell-status',
                    encodeHtml: false,
                },
                renderer: function (value, record) {
                    return Abraxa.utils.Functions.renderDisbursementLabels(value);
                },
            },
            {
                text: 'Updated at',
                minWidth: 160,
                sortable: false,
                menuDisabled: true,
                cell: {
                    cls: 'a-cell-date a-bb-100',
                    encodeHtml: false,
                    tpl: '<div class="a-cell-date hbox"><i class="md-icon-outlined md-16 mr-8">calendar_today</i>{updated_at:date("d M -  H:i")}</div>',
                },
            },
            {
                text: 'Approvals',
                minWidth: 220,
                sortable: false,
                menuDisabled: true,
                cell: {
                    encodeHtml: false,
                    xtype: 'widgetcell',
                    selectable: true,
                    cls: 'a-bb-100',
                    widget: {
                        xtype: 'container',
                        hidden: true,
                        hideMode: 'clip',
                        bind: {
                            hidden: '{recordApproval ? false : true}',
                            html: '<div class="a-approval-status"><i class="md-icon a-approval-icon-{recordApproval.status}"></i><span class="a-subtitle">{recordApproval.status:capitalize} {recordApproval.status === "pending" ? "your approval" : "by you"}</span></div>',
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
                    cls: 'a-bb-100',
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
                                // subObject: 'disbursements',
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
                            },
                            {
                                xtype: 'button',
                                iconCls: 'md-icon-navigate-next',
                                ui: 'tool-sm round normal raised',
                                margin: '8 16 8 8',
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
                                handler: function () {},
                            },
                        ],
                    },
                },
            },
        ],
        listeners: {
            childsingletap: function (row, location) {
                let disbursementViewModel = this.find('disbursementsMainPrincipal').getViewModel();
                disbursementViewModel.set('selectedDisbursement', location.record);
                Ext.getCmp('main-viewport')
                    .getController()
                    .redirectTo(window.location.hash + '/' + location.record.get('id'));
            },
        },
    },
});
