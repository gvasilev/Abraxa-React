Ext.define('Abraxa.view.cdb.company.financials.FinancialsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.financials-viewmodel',
    data: {
        selectedVa: null,
    },
    stores: {
        banks: {
            source: '{object_record.virtual_accounts}',
            extraParams: {
                org_id: '{object_record.org_id}',
            },
            filters: [
                {
                    filterFn: function (record) {
                        return record.get('type') == 'bank';
                    },
                },
            ],
        },
        virtualAccounts: {
            source: '{object_record.virtual_accounts}',
            // autoLoad: true,
            extraParams: {
                org_id: '{object_record.org_id}',
            },
            filters: [
                {
                    filterFn: function (record) {
                        return record.get('type') == 'virtual_account';
                    },
                },
            ],
            grouper: {
                property: 'disabled',
                direction: 'ASC',
            },
        },
        virtualAccountPayments: {
            source: '{virtualAccountsGrid.selection.payments}',
            sorters: [
                {
                    property: 'id',
                    direction: 'DESC',
                },
            ],
            filters: [
                {
                    filterFn: function (record) {
                        if (record.get('owner_id') && record.get('owner_type') && !record.get('owner')) {
                            return false;
                        }
                        return true;
                    },
                },
            ],
        },
        virtualAccountPaymentsChartStore: {
            source: '{virtualAccountsGrid.selection.payments}',
            sorters: [
                {
                    property: 'created_at',
                    direction: 'ASC',
                },
            ],
        },
    },
    formulas: {
        selectedVa: {
            bind: {
                bindTo: '{virtualAccountsGrid.selection}',
                deep: true,
            },
            get: function (selection) {
                return selection;
            },
        },
        reportingCurrency: {
            bind: {
                bindTo: '{object_record.preferred_currency}',
                deep: true,
            },
            get: function (currency) {
                // this.get('virtualAccounts').load();
                if (currency) {
                    let companyCurrencies = this.get('companyCurrencies');
                    let currencyRecord = companyCurrencies.findRecord('currency', currency, 0, false, false, true);
                    if (currencyRecord) {
                        return currencyRecord;
                    }
                }
            },
        },
        dialogTitle: {
            bind: {
                bindTo: '{virtualAccountsGrid.selection}',
                deep: true,
            },
            get: function (selection) {
                if (selection) {
                    return (
                        '<div><span class="a-panel-title">' +
                        selection.get('name') +
                        '</span><span class="a-panel-id c-grey"> (' +
                        selection.get('account_number') +
                        ')</span></div>'
                    );
                }
            },
        },
        virtualAccountChartData: {
            bind: {
                bindTo: '{virtualAccountPaymentsChartStore}',
                deep: true,
            },
            get: function (store) {
                let grouped = [],
                    clean = [];

                store.each(function (record) {
                    let month = moment(record.get('created_at')).format('MMM D');
                    grouped[month] = {
                        label: month,
                        value: record.get('balance_after_transaction'),
                    };
                });
                for (var i in grouped) {
                    clean.push(grouped[i]);
                }
                return clean;
                // Ext.ComponentQuery.query('balanceChart').fusionChart.data = clean;
            },
        },
        virtualBalanceTotal: {
            bind: {
                bindTo: '{object_record.virtual_accounts}',
                deep: true,
            },
            get: function (store) {
                let balance = 0,
                    companyCurrencies = this.get('companyCurrencies');

                // companyCurrencies.queryBy(function (rec) {

                // })
                if (store) {
                    store.each(function (va) {
                        let currency = companyCurrencies.queryBy(function (rec) {
                            return rec.get('currency') == va.get('currency');
                        }).items[0];
                        if (currency) balance += va.get('balance') * currency.get('exchange_rate');
                    });
                }
                return balance;
            },
        },
        latestTransaction: {
            bind: {
                bindTo: '{object_record.virtual_accounts}',
                deep: true,
            },
            get: function (store) {
                let fakeStore = new Ext.data.Store(),
                    companyCurrencies = this.get('companyCurrencies');

                // companyCurrencies.queryBy(function (rec) {

                // })
                if (store) {
                    store.each(function (va) {
                        fakeStore.add(va.payments().getRange());
                    });
                }
                fakeStore.sort({
                    property: 'id',
                    direction: 'DESC',
                });
                return fakeStore.first();
            },
        },
    },
});
