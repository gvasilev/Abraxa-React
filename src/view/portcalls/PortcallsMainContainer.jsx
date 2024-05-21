import '../../store/dashboard/BalanceExposure';
import './agent/PortcallsAgentMain';
import '../financial/accounts/FinancialAccountsView';
import '../financial/disbursements/FinancialDisbursementsView';
import '../financial/transactions/FinancialTransactionsView';
import './PortcallsHeader';

Ext.define('Abraxa.view.portcalls.PortcallsMainContainer', {
    extend: 'Ext.Container',
    xtype: 'portcalls.main.container',
    flex: 1,
    bodyCls: 'a-layout-card-wrap',
    layout: {
        type: 'card',
    },
    bind: {
        activeItemIndex: '{portcallsMainTabbar.activeTabIndex}',
    },
    viewModel: {
        stores: {
            balanceExposure: {
                type: 'balance.exposure',
                autoLoad: false,
                id: 'balanceExposure',
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
            portcallsMainContainer: {
                bind: {
                    bindTo: '{currentUserType}',
                    deep: true,
                },
                get: function (type) {
                    if (type) {
                        if (type == 'agent') {
                            return [
                                {
                                    xtype: 'portcalls.agent.main',
                                },
                            ];
                        } else {
                            return [
                                {
                                    xtype: 'portcalls.principal.main',
                                },
                            ];
                        }
                    }
                },
            },
            hasPortcallRights: {
                bind: {
                    bindTo: '{userPermissions}',
                    deep: true,
                },
                get: function (permissions) {
                    if (permissions) {
                        Ext.getCmp('main-viewport')
                            .upVM()
                            .set('hasPortcallRights', Object.keys(permissions).includes('portcall'));
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'portcalls.agent.main',
        },
        {
            xtype: 'financial.accounts.view',
            hidden: true,
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
