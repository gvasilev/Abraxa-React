Ext.define('Abraxa.view.cdb.company.financials.overview.Overview', {
    extend: 'Ext.Container',
    xtype: 'cdb.financials.overview',
    margin: 0,
    flex: 1,
    scrollable: 'y',
    layout: 'hbox',
    weighted: true,
    items: [
        {
            xtype: 'container',
            docked: 'top',
            flex: 1,
            cls: 'a-titlebar a-bb-100',
            weight: 2,
            height: 65,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<span>{financials_menu.selection.title}</span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'cdbFinancialOverview',
            bind: {
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-cdb-overview',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'financials.overview.balance',
                            margin: 16,
                        },
                        {
                            xtype: 'financials.open.balances',
                        },
                        {
                            docked: 'bottom',
                            padding: '8 24',
                            cls: 'a-bt-100',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-total-billed-docked text-right',
                                    style: 'margin-right: 258px;',
                                    bind: {
                                        html: '<div class="h5">Balance</div><div class="a-billed-price"><span class="a-billed-currency">{balanceCurrency}</span><span class="a-billed-amount">{formatBalance}</span></div>',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
