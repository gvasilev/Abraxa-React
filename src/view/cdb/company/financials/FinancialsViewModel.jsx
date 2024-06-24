import '../../../../store/cdb/OrganizationVirtualAccounts';
import '../../../../store/cdb/OrganizationVirtualAccountPayments';
import '../../../../store/cdb/OrganizationVirtualAccountChart';

Ext.define('Abraxa.view.cdb.company.financials.FinancialsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.financials-viewmodel',
    data: {
        selectedVa: null,
    },
    stores: {
        banks: {
            type: 'organizationVirtualAccounts',
            autoLoad: true,
            remoteFilter: true,
            filters: [
                {
                    property: 'accountType',
                    value: 'bank',
                },
            ],
            proxy: {
                extraParams: {
                    org_id: '{object_record.org_id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().org_id) this.load();
                        },
                        this
                    );
                }
            },
        },
        virtualAccounts: {
            type: 'organizationVirtualAccounts',
            remoteFilter: true,
            autoLoad: true,
            proxy: {
                extraParams: {
                    org_id: '{object_record.org_id}',
                },
            },
            filters: [
                {
                    property: 'accountType',
                    value: 'virtual_account',
                },
            ],
            grouper: {
                property: 'disabled',
                direction: 'ASC',
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().org_id) this.load();
                        },
                        this
                    );
                }
            },
        },
        virtualAccountPayments: {
            type: 'organizationVirtualAccountPayments',
            autoLoad: true,
            proxy: {
                extraParams: {
                    virtual_account: '{virtualAccountsGrid.selection.id}',
                    organization: '{object_record.org_id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().virtual_account) this.load();
                        },
                        this
                    );
                }
            },
        },

        virtualAccountPaymentsChartStore: {
            type: 'organizationVirtualAccountChart',
            autoLoad: true,
            proxy: {
                extraParams: {
                    virtual_account: '{virtualAccountsGrid.selection.id}',
                    organization: '{object_record.org_id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().virtual_account) this.load();
                        },
                        this
                    );
                }
            },
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
            },
        },
        latestTransaction: {
            bind: {
                bindTo: '{organizationVirtualAccounts}',
                deep: true,
            },
            get: function (store) {
                let fakeStore = new Ext.data.Store();
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
        totalVirtualPaymentsRecords: {
            bind: {
                bindTo: '{virtualAccountPayments}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
    },
});
