Ext.define('Abraxa.view.portcall.payments.PaymentsListRightCardsDisbursement', {
    extend: 'Abraxa.core.AbraxaFormList',
    xtype: 'PaymentsListRightCardsDisbursement',
    cls: 'a-payments-list',
    scrollable: true,
    selectable: {
        deselectable: true,
    },
    emptyText:
        '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No payments available</span></div></div>',
    itemConfig: {
        xtype: 'container',
        cls: 'a-payment-row-right-card',
        viewModel: {
            formulas: {},
        },
        layout: {
            type: 'vbox',
        },
        items: [
            {
                xtype: 'container',
                padding: '8 24',
                layout: {
                    type: 'hbox',
                    pack: 'space-between',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-payment-name',
                        flex: 1,
                        bind: {
                            html: '<div class="a-badge a-badge-payment-{record.kind} small"><i class="md-icon-outlined"></i></div><div class="ml-12 fw-b text-truncate">{record.kind:capitalize} payment</div>',
                        },
                    },
                    {
                        xtype: 'component',
                        viewModel: {
                            formulas: {
                                setHtml: {
                                    bind: {
                                        bindTo: '{record}',
                                    },
                                    get: function (record) {
                                        const paymentableId = record.get('paymentable_id');
                                        const connectedDisb = this.get('disbursements').getById(paymentableId);
                                        const connecteDisbType = connectedDisb.get('type');
                                        const connecteDisbName = connectedDisb.get('name');
                                        let html = AbraxaConstants.placeholders.emptyValue;
                                        if (record) {
                                            html =
                                                '<div class="a-disbursement-name "><span class="file-icon-badge file-icon-x32" data-type="' +
                                                connecteDisbType +
                                                '" data-icon="money"></span><span class="ml-12">' +
                                                connecteDisbName +
                                                '</span></div>';
                                        }
                                        this.getView().setHtml(html);
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            {
                xtype: 'component',
                html: '<hr>',
            },
            {
                xtype: 'container',
                padding: '15 24',
                layout: {
                    type: 'hbox',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-payment-name',
                        flex: 1,
                        bind: {
                            html: '<div class="text-truncate"><div class="sm-title">{record.kind === "requested" ? "Requested" : "Payment"} {record.kind === "outgoing" ? "to" : "from"}</div><div class="fw-b text-truncate">{record.kind === "outgoing" ? record.to_org_name:record.from_org_name}</div><div>',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'a-payment-status',
                        flex: 1,
                        bind: {
                            html: '<div class="a-status-badge a-status-sm status-{record.type}">{record.type:capitalize}</div>',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'a-payment-date',
                        flex: 1,
                        bind: {
                            html: '<div class="sm-title">{record.kind === "requested" ? "Due date" : "Date"}</div><div class="c-grey">{record.kind === "requested" ? (record.due_date:date("d M y")) : (record.payment_date:date("d M y"))}</div>',
                        },
                    },
                    {
                        xtype: 'div',
                        flex: 1,
                        cls: 'a-payment-amount',
                        minWidth: 100,
                        slug: 'portcallPaymentAmount',
                        bind: {
                            permission: '{userPermissions}',
                            html: '<div class="sm-title">{record.account_currency}</div><div class="fw-b">{record.calculated_amount:number("0,000.00")}</div>',
                        },
                    },
                ],
            },
        ],
    },
});
