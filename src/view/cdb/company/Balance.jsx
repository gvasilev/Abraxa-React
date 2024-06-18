Ext.define('Abraxa.view.cdb.company.Balance', {
    extend: 'Ext.Container',

    xtype: 'cdb.balance',
    layout: 'hbox',
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-card-container a-card-balance br-16',
                    hideMode: 'opacity',
                    minHeight: 120,
                    flex: 6,
                    bind: {
                        cls: 'a-card-container a-card-balance br-16 {balanceTotalCls}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Open balance',
                                        },
                                        {
                                            xtype: 'infoicon',
                                            infoText: 'Outstanding amount basis all active appointments',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: '8 24',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-balance',
                                    bind: {
                                        cls: 'a-balance {balanceTotalCls}',
                                        html: '<strong><small>{balanceCurrency}</small> {balance.total:number("0,000.00")}</strong>',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    margin: '12 0 0 0',
                                    bind: {
                                        html: '<div class="sm-title"><strong>Total:</strong> {totalBalanceRecords} appointments</div>',
                                    },
                                },
                            ],
                        },
                    ],
                },
                // TODO: CORE-2884: Refactor Appointed and Nominated containers
                {
                    xtype: 'container',
                    cls: 'a-card-container a-card-total-deals a-card-total-appointed br-16',
                    hideMode: 'opacity',
                    minHeight: 140,
                    flex: 6,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            flex: 1.5,
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Appointed',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: '8 24',
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'a-total-deals',
                                            bind: {
                                                html: '{activeAppointmentsHtml}',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'center',
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    flex: 2,
                                                    margin: '12 0 0 0',
                                                    bind: {
                                                        html: '{totalAppointmentsHtml}',
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    margin: '12 0 0 0',
                                                    html: '<div><a href="javascript:void(0);" class="appointments-link c-link"><strong>view all </strong><i class="material-icons-outlined md-16 open-new-link-icon">open_in_new</i></a></div>',
                                                    bind: {
                                                        hidden: '{viewAllAppointmentsLinkHidden}',
                                                    },
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            delegate: 'a.appointments-link',
                                                            fn: 'onBalanceLinkClick',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-card-container a-card-total-deals a-card-total-nominated br-16',
                    hideMode: 'opacity',
                    minHeight: 140,
                    flex: 6,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            flex: 1.5,
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Nominated',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: '8 24',
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'a-total-deals',
                                            bind: {
                                                html: '{activeNominationsHtml}',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'center',
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    flex: 2,
                                                    margin: '12 0 0 0',
                                                    bind: {
                                                        html: '{totalNominationsHtml}',
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    margin: '12 0 0 0',
                                                    html: '<div><a href="javascript:void(0);" class="nominations-link c-link"><strong>view all </strong><i class="material-icons-outlined md-16 open-new-link-icon">open_in_new</i></a></div>',
                                                    bind: {
                                                        hidden: '{viewAllNominationsLinkHidden}',
                                                    },
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            delegate: 'a.nominations-link',
                                                            fn: 'onBalanceLinkClick',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
