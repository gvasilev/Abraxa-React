import './AccountsGrid';
import './AccountDetails';
import './AccountsViewModel';
import './AccountController';

Ext.define('Abraxa.view.portcall.accounts.AccountsMain', {
    extend: 'Ext.Container',
    xtype: 'accounts.main',
    viewModel: 'accounts-viewmodel',
    controller: 'AccountController',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    bodyCls: 'a-layout-card-wrap',
    items: [
        {
            xtype: 'container',
            reference: 'accountsMain',
            publishes: ['activeItemIndex'],
            layout: 'card',
            cls: 'a-accounts-main a-bgr-white',
            flex: 1,
            slug: 'portcallBillingParties',
            showNoPermissions: true,
            bind: {
                layout: {
                    type: 'card',
                    animation: '{selectedAccount ? "cover" : "reveal"}',
                },
                permission: '{userPermissions}',
                activeItem: '{selectedAccount ? 1 : 0}',
            },
            items: [
                {
                    xtype: 'accounts.grid',
                    flex: 1,
                },
                {
                    xtype: 'account.details',
                    flex: 1,
                    hidden: true,
                },
            ],
        },
    ],
});
