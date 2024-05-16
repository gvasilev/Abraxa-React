Ext.define('Abraxa.view.portcall.principal.DisbursementsViewModelPrincipal', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.DisbursementsViewModelPrincipal',
    data: {
        selectedDisbursement: null,
        selectedBillingParty: null,
    },
    stores: {
        billingPartyStore: {
            source: '{portCallRecord.accounts}',
            extraParams: {
                portcall_id: '{portCallRecord.id}',
            },
        },
        billingPartyInvoices: {
            source: '{portCallRecord.vouchers}',
            filters: '{accountInvoiceFilter}',
        },
        billingPartyDisbursements: {
            source: '{portCallRecord.disbursements}',
            filters: '{disbursementsFilter}',
            sorters: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
            grouper: {
                groupFn: function (record) {
                    return record.get('group_id');
                },
            },
        },
        payments: {
            source: '{portCallRecord.payments}',
        },
        disbursementServicesStore: {
            source: '{selectedDisbursement.expenses}',
            extraParams: {
                portcall_id: '{portCallRecord.id}',
            },
        },
        disbursementServicesStoreGrouped: {
            source: '{selectedDisbursement.expenses}',
            extraParams: {
                portcall_id: '{portCallRecord.id}',
            },
            grouper: {
                groupFn: function (record) {
                    const expenseItem = record ? record.get('default_expense_item') : null;
                    if (record && expenseItem) {
                        return expenseItem.cost_center_name ? expenseItem.cost_center_name : 100;
                    } else {
                        return 100;
                    }
                },
            },
        },
    },
    formulas: {
        disbursementInvoices: {
            bind: {
                bindTo: '{disbursementServicesStore}',
                deep: true,
            },
            get: function (store) {
                let data = [];
                if (store) {
                    store.each(function (rec) {
                        if (rec.vouchers().count()) {
                            rec.vouchers().each(function (voucher) {
                                data.push(voucher);
                            });
                        }
                    });
                }
                return Ext.create('Ext.data.Store', {
                    data: data,
                });
            },
        },
        setSelectedBillingPartyOnInit: {
            bind: {
                bindTo: '{portCallRecord.id}',
            },
            get: function (id) {
                if (!this.get('selectedBillingParty')) {
                    let store = this.get('portCallRecord.accounts');
                    this.set('selectedBillingParty', store.first());
                }
            },
        },
        setSelectedDisbursement: {
            bind: {
                bindTo: '{disbursementDetailsView.record}',
            },
            get: function (record) {
                this.set('selectedDisbursement', record);
            },
        },
        disbursementApproval: {
            bind: {
                bindTo: '{selectedDisbursement.approvals}',
                deep: true,
            },
            get: function (store) {
                let me = this;
                if (store && store.count()) {
                    let approval = store.findRecord('to_company_id', window.CurrentUser.get('current_company_id'));
                    if (approval) {
                        approval.set('current_approval_data', me.get('selectedDisbursement.current_approval_data'));
                        return approval;
                    }
                }
                return false;
            },
        },
        accountInvoiceFilter: {
            bind: {
                bindTo: '{selectedBillingParty}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('billingPartyInvoices');

                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get('account_id') == record.get('id')) {
                            return true;
                        }
                    };
                } else {
                    return function (item) {
                        return false;
                    };
                }
            },
        },
        disbursementsFilter: {
            bind: {
                bindTo: '{selectedBillingParty}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('billingPartyDisbursements');

                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get('account_id') == record.get('id')) {
                            return true;
                        }
                    };
                } else {
                    return function (item) {
                        return false;
                    };
                }
            },
        },
        billingPartyTotalCosts: {
            bind: {
                bindTo: '{billingPartyDisbursements}',
                deep: true,
            },
            get: function (disbursements) {
                let total = 0,
                    account = this.get('selectedBillingParty');
                if (disbursements && disbursements.count()) {
                    let disbursementsForTotal = new Ext.util.Collection(),
                        sdaDisbursements = disbursements.queryBy(function (disbursement) {
                            if (disbursement.get('status') != 'draft' && disbursement.get('type') == 'sda')
                                return disbursement.get('account_id') == account.get('id');
                        });

                    disbursements.getGroups().each(function (group) {
                        var collection = new Ext.util.Collection();

                        group.each(function (disbursement) {
                            if (disbursement.get('type') != 'sda' && disbursement.get('status') != 'draft') {
                                collection.add(disbursement);
                            }
                        });
                        if (collection.length) disbursementsForTotal.add(collection.last());
                    });

                    sdaDisbursements.each(function (disbursement) {
                        disbursementsForTotal.add(disbursement);
                    });
                    disbursementsForTotal.each(function (disbursement) {
                        total += parseFloat(disbursement.get('total_costs'));
                    });
                    if (account) {
                        account.set('total_costs', total);
                    }
                    if (account && account.dirty) account.save();
                }
                return total;
            },
        },
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
        receivedPayments: {
            bind: {
                account: '{selectedBillingParty}',
                total_payment: '{totalPayments}',
            },
            get: function (data) {
                let totalReceived = 0,
                    totalOutgoing = 0;
                if (data.account) {
                    let payments = this.get('payments');
                    if (payments) {
                        let receivedPayments = payments.queryBy(function (rec, id) {
                            if (rec.get('kind') == 'incoming' && rec.get('org_id') == data.account.get('org_id')) {
                                return rec;
                            }
                        });
                        receivedPayments.each(function (rec) {
                            totalReceived += rec.get('calculated_amount');
                        });
                    }
                }
                return totalReceived;
            },
        },
        receivedPercent: {
            bind: {
                receivedPayments: '{receivedPayments}',
                billingPartyTotalCosts: '{billingPartyTotalCosts}',
            },
            get: function (data) {
                let balance = 0;
                if (data) {
                    if (data.billingPartyTotalCosts)
                        balance = parseFloat(
                            Math.abs(data.receivedPayments / data.billingPartyTotalCosts) * 100
                        ).toFixed();
                }
                return balance;
            },
        },
        outGoingPayments: {
            bind: {
                account: '{selectedBillingParty}',
                total_payment: '{totalPayments}',
            },
            get: function (data) {
                let totalOutgoing = 0;
                if (data.account) {
                    let payments = this.get('payments');
                    if (payments) {
                        let outGoing = payments.queryBy(function (rec, id) {
                            if (rec.get('kind') == 'outgoing' && rec.get('to_org_id') == data.account.get('org_id')) {
                                return rec;
                            }
                        });
                        outGoing.each(function (rec) {
                            totalOutgoing += rec.get('calculated_amount');
                        });
                    }
                }
                return totalOutgoing;
            },
        },
        finalBalance: {
            bind: {
                totalBilled: '{billingPartyTotalCosts}',
                totalPayments: '{receivedPayments}',
                totalOutgoing: '{outGoingPayments}',
            },
            get: function (data) {
                let balance = 0,
                    account = this.get('selectedBillingParty');
                if (data) {
                    balance = data.totalBilled - data.totalPayments + data.totalOutgoing;
                }
                if (account) {
                    account.set('balance', balance);
                    if (account.dirty) account.save();
                }
                return balance;
            },
        },
        disbursementSplit: {
            bind: {
                bindTo: '{billingPartyDisbursements}',
                deep: true,
            },
            get: function (disbursements) {
                let groups = disbursements.getGroups(),
                    data = [];

                groups.each(function (group) {
                    data.push({
                        name: group.getGroupKey(),
                        disbursements: group.items,
                    });
                });
                return data;
            },
        },
        disbursementTotalVariance: {
            bind: {
                bindTo: '{selectedDisbursement.expenses}',
            },
            get: function (store) {
                if (store) {
                    let pda_price = store.sum('pda_final_price'),
                        dda_price = store.sum('dda_final_price'),
                        final_price = store.sum('fda_final_price')
                            ? store.sum('fda_final_price')
                            : store.sum('dda_final_price');

                    let start_price = pda_price ? pda_price : dda_price;

                    if (!start_price && !final_price) return;

                    if (final_price == 0 && start_price) final_price = start_price;

                    if (start_price == 0 && final_price) start_price = final_price;

                    const reDiff = function relDiff(a, b) {
                        return Math.abs((b - a) / a) * 100;
                    };

                    let variance = parseFloat(reDiff(start_price, final_price)).toFixed(1),
                        sign = start_price > final_price ? '-' : start_price < final_price ? '+' : '',
                        cls = start_price > final_price ? 'c-red' : start_price < final_price ? 'c-green' : 'c-blue',
                        icon =
                            start_price > final_price
                                ? 'trending_down'
                                : start_price < final_price
                                  ? 'trending_up'
                                  : 'trending_flat';

                    return (
                        '<div class="hbox ' +
                        cls +
                        '"><i class="material-icons-outlined md-16 ' +
                        cls +
                        '">' +
                        icon +
                        '</i><span class="ml-8">' +
                        sign +
                        '' +
                        variance +
                        '%</span></div>'
                    );
                }
            },
        },
        pdaPriceProgressBar: {
            bind: {
                bindTo: '{selectedDisbursement}',
            },
            get: function (disbursement) {
                if (disbursement) {
                    let ddaPrice = disbursement.get('dda_final_price'),
                        fdaPrice = disbursement.get('fda_final_price'),
                        pdaPrice = disbursement.get('pda_final_price');

                    const numbers = [fdaPrice, ddaPrice, pdaPrice];
                    const highestNumber = Math.max(...numbers);

                    if (highestNumber == pdaPrice) return 1;

                    return pdaPrice / highestNumber;
                }
            },
        },
        ddaPriceProgressBar: {
            bind: {
                bindTo: '{selectedDisbursement}',
            },
            get: function (disbursement) {
                if (disbursement) {
                    let ddaPrice = disbursement.get('dda_final_price'),
                        fdaPrice = disbursement.get('fda_final_price'),
                        pdaPrice = disbursement.get('pda_final_price');

                    const numbers = [fdaPrice, ddaPrice, pdaPrice];
                    const highestNumber = Math.max(...numbers);

                    if (highestNumber == ddaPrice) return 1;

                    return ddaPrice / highestNumber;
                }
            },
        },
        fdaPriceProgressBar: {
            bind: {
                bindTo: '{selectedDisbursement}',
            },
            get: function (disbursement) {
                if (disbursement) {
                    let ddaPrice = disbursement.get('dda_final_price'),
                        fdaPrice = disbursement.get('fda_final_price'),
                        pdaPrice = disbursement.get('pda_final_price');

                    const numbers = [fdaPrice, ddaPrice, pdaPrice];
                    const highestNumber = Math.max(...numbers);

                    if (highestNumber == fdaPrice) return 1;

                    return fdaPrice / highestNumber;
                }
            },
        },
    },
});
