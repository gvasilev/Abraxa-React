Ext.define('Abraxa.view.portcall.accounts.AccountsMain', {
    extend: 'Ext.Container',
    xtype: 'accounts.main',
    viewModel: 'accounts-viewmodel',
    controller: 'AccountController',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    bodyCls: 'a-layout-card-wrap',
    reference: 'accountsMain',
    publishes: ['activeItemIndex'],
    cls: 'a-accounts-main',
    flex: 1,
    slug: 'portcallBillingParties',
    showNoPermissions: true,
    bind: {
        permission: '{userPermissions}',
        activeItem: '{selectedAccount ? 1 : 0}',
    },
    items: [
        {
            xtype: 'accounts.grid',
            flex: 1,
            bind: {
                hidden: '{selectedAccount ? true : false}',
            },
        },
        {
            xtype: 'account.details',
            flex: 1,
            hidden: true,
            bind: {
                hidden: '{selectedAccount ? false : true}',
            },
        },
    ],
});
