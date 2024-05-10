Ext.define('Abraxa.view.operations.DisbursementsPrincipal.grids.DisbursementsPrincipalGridsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.DisbursementsPrincipalGridsViewModel',
    formulas: {
        totalRecords: {
            bind: {
                bindTo: '{disbursementsPrincipal}',
                deep: true,
            },
            get: function (disbursementsPrincipal) {
                if (disbursementsPrincipal) {
                    return disbursementsPrincipal.getTotalCount();
                }
                return 0;
            },
        },
        totalBalance: {
            bind: {
                bindTo: '{balanceExposure}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getAt(0);
                    if (data) {
                        return numeral(Math.abs(data.get('total'))).format('0,000');
                    }
                }
                return 0;
            },
        },
        totalBalanceColor: {
            bind: {
                bindTo: '{balanceExposure}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getAt(0);
                    if (data) {
                        return Math.abs(data.get('total'));
                    }
                }
                return 0;
            },
        },
    },
});
