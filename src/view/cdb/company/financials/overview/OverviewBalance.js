Ext.define('Abraxa.view.cdb.company.financials.overview.OverviewBalance', {
    extend: 'Ext.Container',
    xtype: 'financials.overview.balance',
    layout: 'hbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-card-container br-16',
            hideMode: 'opacity',
            minHeight: 160,
            flex: 6,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Reporting currency',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '8 24',
                    items: [
                        {
                            xtype: 'div',
                            margin: '0 0 16 0',
                            bind: {
                                html: '<small class="c-grey fw-n">Set preferred reporting currency of your client.</small>',
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Set reporting currency',
                            iconCls: 'md-icon-check',
                            ui: 'action small',
                            hidden: true,
                            showNoPermissions: true,
                            slug: 'cdbFinancialOverviewSetCurrency',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{object_record.preferred_currency ? true : false}',
                            },
                            height: 30,
                            handler: function (me) {
                                Ext.create('Abraxa.view.cdb.company.financials.overview.CreateReportingCurrency', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            editMode: false,
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            minHeight: 56,
                            cls: 'a-list-item a-bb-0',
                            bind: {
                                hidden: '{object_record.preferred_currency ? false:true}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    flex: 1,
                                    cls: 'a-list-values',
                                    bind: {
                                        html: '<div class="flex-1 hbox"><img src="https://static.abraxa.com/flags/1x1/{reportingCurrency.currency:substr(0, 2):lowercase()}.svg" alt="" class="a-flag-x32 a-flag-outlined a-img-round" /><div class="fs-16 ml-16"><b class="d-inline-flex align-items-center">{reportingCurrency.currency}<i class="md-icon c-teal ml-8 fs-18">check</i></b><div class="sm-title">{reportingCurrency.exchange_rate} {reportingCurrency.base_currency}</div></div></div>',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-actions-hover',
                                    items: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'md-icon-outlined md-icon-edit',
                                            ui: 'round tool-round-md',
                                            slug: 'cdbFinancialOverview',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            tooltip: {
                                                anchorToTarget: true,
                                                html: 'Edit',
                                                align: 'bc-tc?',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                            },
                                            handler: function (me) {
                                                Ext.create(
                                                    'Abraxa.view.cdb.company.financials.overview.CreateReportingCurrency',
                                                    {
                                                        viewModel: {
                                                            parent: me.upVM(),
                                                            data: {
                                                                editMode: true,
                                                            },
                                                        },
                                                    }
                                                ).show();
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'round tool-round',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            slug: 'cdbFinancialOverviewDeleteCurrency',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            tooltip: {
                                                anchorToTarget: true,
                                                html: 'Delete',
                                                align: 'bc-tc?',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                            },
                                            handler: function (me) {
                                                let company = me.upVM().get('object_record'),
                                                    currentUser = me.upVM().get('currentUser');
                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you would like to delete this entry?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            company.set('preferred_currency', null);
                                                            company.set('updated_by_user', currentUser.getData());
                                                            company.set('updated_at', new Date());
                                                            if (company.dirty) {
                                                                company.save({
                                                                    success: function (rec) {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                });
                                                            }
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ]
                                                );
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
            cls: 'a-card-container a-card-virtual-account br-16',
            hideMode: 'opacity',
            minHeight: 160,
            flex: 6,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Virtual balance',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: 24,
                    cls: 'text-right',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-balance-title',
                            html: 'Total balance',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-balance',
                            bind: {
                                cls: 'a-balance {balanceTotalCls}',
                                html: '<strong><small>{balanceCurrency}</small> {virtualBalanceTotal:number("0,000.00")}</strong>',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'hbox justify-content-end',
                            bind: {
                                html: '<div class="a-balance-title">Latest funding</div><div class="ml-8 c-white">{latestTransaction.created_at:date("d M Y")}</div>',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
