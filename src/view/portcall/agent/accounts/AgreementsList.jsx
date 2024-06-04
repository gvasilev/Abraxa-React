Ext.define('Abraxa.view.portcall.accounts.AgreementsList', {
    extend: 'Ext.dataview.List',
    xtype: 'agreements.list',
    maxHeight: 416,
    ripple: true,
    itemRipple: true,
    reference: 'availableExpensesList',
    cls: 'availableExpensesList a-agreements-list',
    selectable: false,
    itemConfig: {
        xtype: 'container',
        flex: 1,
        padding: 6,
        margin: 4,
        cls: 'cursor-pointer a-item',
        viewModel: {
            formulas: {
                nameRender: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let html = {
                            name: '',
                            value: '',
                        };
                        if (record) {
                            let agreement = record.get('agreementable');
                            switch (record.get('type')) {
                                case 'discount':
                                    html.name =
                                        '<div><div class="fw-b">' +
                                        agreement.discount_name +
                                        '</div><div class="sm-title">' +
                                        agreement.default_expense_item_name +
                                        '</div></div>';
                                    if (agreement.type == 'percent') {
                                        html.value =
                                            '<b class="fw-b">' +
                                            agreement.percentage +
                                            '</b><b class="c-light-grey mr-8">&nbsp;%</b>';
                                    } else {
                                        html.value =
                                            '<b class="c-light-grey mr-8">' +
                                            agreement.currency +
                                            '</b><b class="fw-b mr-8">' +
                                            Ext.util.Format.number(agreement.amount, '0,000.00') +
                                            '</b>';
                                    }
                                    break;
                                case 'prefunding':
                                    html.name =
                                        '<div><div class="fw-b">' + agreement.payment_term_name + '</div></div>';
                                    html.value =
                                        '<b class="fw-b">' +
                                        agreement.percentage +
                                        '</b><b class="c-light-grey mr-8">&nbsp;%</b>';
                                    break;
                                case 'direct billing':
                                    html.name =
                                        '<div><div class="fw-b">' +
                                        agreement.billing_name +
                                        '</div><div class="sm-title">' +
                                        agreement.default_expense_item_name +
                                        '</div></div>';
                                    html.value =
                                        '<b class="fw-b">' +
                                        agreement.percentage +
                                        '</b><b class="c-light-grey mr-8">&nbsp;%</b>';
                                    break;
                                default:
                                    break;
                            }
                        }
                        return html;
                    },
                },
            },
        },
        layout: {
            type: 'hbox',
            align: 'middle',
        },
        items: [
            {
                xtype: 'div',
                margin: '0 8 0 4',
                bind: {
                    html: '<div class="a-badge a-badge-{record.type} a-pseudo-{record.type}"><i class="md-icon-outlined"></i></div>',
                },
            },
            {
                xtype: 'div',
                cls: 'a-cell-amount',
                margin: '0 8',
                hidden: true,
                flex: 1,
                bind: {
                    hidden: '{record.agreementable ? false : true}',
                    html: '{nameRender.name}',
                },
            },
            {
                xtype: 'div',
                cls: 'a-cell-amount',
                // margin: '0 0 8 0',
                hidden: true,
                bind: {
                    hidden: '{record.agreementable ? false : true}',
                    html: '{nameRender.value}',
                },
            },
        ],
    },
});
