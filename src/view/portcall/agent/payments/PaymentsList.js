Ext.define('Abraxa.view.portcall.payments.PaymentsList', {
    extend: 'Abraxa.core.AbraxaFormList',
    xtype: 'payments.list',
    // variableHeights: true,
    cls: 'a-payments-list',
    scrollable: true,
    selectable: {
        deselectable: true,
    },
    // infinite: true,
    emptyText:
        '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No payments available</span></div></div>',
    itemConfig: {
        xtype: 'container',
        // flex: 1,
        // width: '100%',
        padding: '8 24',
        cls: 'a-payment-row',
        viewModel: {
            formulas: {},
        },
        layout: {
            type: 'hbox',
            align: 'middle',
        },
        items: [
            {
                xtype: 'div',
                cls: 'a-payment-name',
                flex: 1,
                bind: {
                    html: '<div class="a-badge a-badge-payment-{record.kind} small"><i class="md-icon-outlined"></i></div><div class="ml-12 text-truncate"><div class="sm-title">{record.kind == "requested" ? "Requested" : "Payment"} {record.kind == "outgoing" ? "to" : "from"}</div><div class="fw-b text-truncate">{record.kind == "outgoing" ? record.to_org_name:record.from_org_name}</div><div>',
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
                    html: '<div class="sm-title">{record.kind == "requested" ? "Due date" : "Date"}</div><div class="c-grey">{record.kind == "requested" ? (record.due_date:date("d M y")) : (record.payment_date:date("d M y"))}</div>',
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
    listeners: {},
});
