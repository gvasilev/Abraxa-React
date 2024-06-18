Ext.define('Abraxa.view.financial.FinancialMainView', {
    extend: 'Ext.Container',
    xtype: 'financial.main',
    cls: 'a-main-container',
    flex: 1,
    layout: {
        type: 'card',
    },
    bind: {
        activeItemIndex: '{financialMainTabbar.activeTabIndex}',
    },
    viewModel: {
        stores: {
            balanceExposure: {
                type: 'balance.exposure',
                autoLoad: true,
            },
        },
        formulas: {
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
        },
    },
    items: [
        {
            xtype: 'financial.accounts.view',
        },
        {
            xtype: 'financial.disbursements.view',
            hidden: true,
        },
        {
            xtype: 'financial.transactions.view',
            hidden: true,
        },
    ],
});
