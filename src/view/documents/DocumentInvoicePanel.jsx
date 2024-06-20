Ext.define('Abraxa.view.documents.DocumentInvoicePanel', {
    extend: 'Ext.Panel',
    xtype: 'document-invoice-panel',
    cls: 'dark rotate_header collapsible_test a-docs-panel',
    bodyBorder: true,
    header: {
        title: {
            bind: {
                text: '{itemTemplate}',
            },
        },
    },
    viewModel: {
        stores: {
            objectPayments: {
                source: '{payments}',
                filters: '{paymentsFilter}',
            },
        },
        formulas: {
            paymentsFilter: {
                bind: {
                    bindTo: '{vouchersList.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('objectPayments');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('paymentable_type') == record.get('model_name') &&
                                rec.get('paymentable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            title: {
                bind: {
                    bindTo: '{vouchersList.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) return record.get('default_expense_item_name');

                    return 'No item selected';
                },
            },
            account: {
                bind: {
                    bindTo: '{service.account_id}',
                    deep: true,
                },
                get: function (id) {
                    if (id) {
                        let accounts = this.get('accounts');
                        let record = accounts.getById(id);
                        if (record) {
                            return record;
                        }
                    }
                },
            },
            showExchangeRate: {
                bind: {
                    voucher_currency: '{vouchersList.selection.currency}',
                    account_currency: '{account.account_currency}',
                },
                get: function (data) {
                    if (data.voucher_currency && data.account_currency) {
                        if (data.voucher_currency != data.account_currency) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return true;
                },
            },
            service: {
                bind: {
                    bindTo: '{vouchersList.selection.expense_id}',
                },
                get: function (id) {
                    if (id) {
                        let expenses = this.get('expenses');
                        let record = expenses.getById(id);
                        if (record) {
                            return record;
                        }
                    }
                    return false;
                },
            },
            itemTemplate: {
                bind: {
                    bindTo: '{service}',
                },
                get: function (record) {
                    if (record) {
                        return (
                            '<div class="hbox rotate_title"><div class="a-badge a-badge-' +
                            record.get('default_expense_item').category.name +
                            '"><i></i></div><div class="title_text ml-12"><div class="fw-b c-white">' +
                            record.get('default_expense_item_name') +
                            '</div><div class="sm-title">' +
                            Ext.String.capitalize(record.get('default_expense_item').type.name) +
                            '</div></div>'
                        );
                    }
                    return '<div class="fw-b c-white">Unassigned</div>';
                },
            },
        },
    },
    maxWidth: 480,
    zIndex: 998,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    hidden: true,
    bind: {
        hidden: '{vouchers.count ? false : true}',
        collapsible: {
            direction: 'right',
            collapseAnimation: false,
            expandAnimation: false,
            tool: {
                ui: 'dark',
            },
            drawer: {
                xtype: 'panel',
                top: 0,
                left: 0,
                cls: Ext.baseCSSPrefix + 'drawer dark collapsible_test a-docs-panel',
                header: false,
                title: {
                    text: '{itemTemplate}',
                },
            },
        },
    },
    weight: 1,
    flex: 1,
    scrollable: true,
    items: [
        {
            xtype: 'voucher-item-form',
        },
    ],
});
