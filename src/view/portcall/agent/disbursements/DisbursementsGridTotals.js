Ext.define('Abraxa.view.portcall.disbursements.DisbursementsGridTotals', {
    extend: 'Ext.Container',
    xtype: 'disbursements.grid.totals',
    cls: 'a-disbursements-totals',
    hidden: false,
    flex: 1,
    layout: 'hbox',
    // bind: {
    //     hidden: '{disbItemsStore.count ? false : true}'
    // },
    cls: 'a-disb-total',
    padding: '12 0 48',
    defaults: {
        xtype: 'div',
    },
    items: [
        {
            width: 60,
        },
        {
            width: 260,
            html: '',
        },
        {
            width: 120,
            html: '',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.pda_id && (selectedDisbursement.type == "dda" || selectedDisbursement.type == "fda" && selectedDisbursement.type != "sda") ? false : true}',
            },
        },
        {
            width: 120,
            html: '',
            hidden: true,
            bind: {
                hidden: '{(selectedDisbursement.dda_id && (selectedDisbursement.type != "pda" )) && selectedDisbursement.type != "sda" ? false : true}',
            },
        },
        {
            width: 90,
            html: '',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.show_accounting ? false : true}',
            },
        },
        {
            width: 100,
        },
        {
            width: 200,
        },
        {
            width: 82,
            html: '',
        },
        {
            width: 66,
            html: '',
            bind: {
                hidden: '{selectedDisbursement.multi_currency ? false : true}',
            },
        },
        {
            width: 120,
            html: '',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.multi_currency ? false : true}',
            },
        },
        {
            width: 120,
            html: '',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.show_discount ? false : true}',
            },
        },
        {
            width: 80,
            html: '',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.show_discount ? false : true}',
            },
        },
        {
            width: 90,
            xtype: 'container',
            padding: 0,
            defaults: {
                xtype: 'div',
                cls: 'text_right',
                padding: '6 12 6 0',
            },
            items: [
                {
                    html: '<div class="a-cell-title">Discount:</div>',
                },
                {
                    html: '<div class="a-cell-title">VAT:</div>',
                },
                {
                    padding: '20 12 12 0',
                    html: '<div class="a-cell-title">Final price:</div>',
                },
            ],
        },
        {
            width: 80,
            html: '',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.show_vat ? false : true}',
            },
        },
        {
            xtype: 'container',
            width: 150,
            defaults: {
                xtype: 'div',
                textAlign: 'right',
                cls: 'a-data-right text_right hbox',
                padding: '6 12 6 0',
            },
            items: [
                {
                    bind: {
                        html: '<b class="c-light-grey fs-12 mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b c-yellow">-{totalDiscount:number("0,000.00")}</b>',
                    },
                },
                {
                    bind: {
                        padding: '6 12 12 0',
                        html: '<b class="c-light-grey fs-12 mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{totalVAT:number("0,000.00")}</b>',
                    },
                },
                {
                    cls: 'a-data-right a-bt-100 text_right hbox',
                    padding: '12 12 12 0',
                    bind: {
                        html: '<b class="c-light-grey fs-12 mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-700 fs-16 c-blue">{totalFinal:number("0,000.00")}</b>',
                    },
                },
            ],
        },
        {
            width: 120,
        },
        {
            flex: 1,
        },
    ],
});
