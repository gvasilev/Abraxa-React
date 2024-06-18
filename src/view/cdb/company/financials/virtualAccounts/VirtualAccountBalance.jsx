Ext.define('Abraxa.view.cdb.company.virtualAccounts.VirtualAccountBalance', {
    extend: 'Ext.Container',
    xtype: 'virtual.accounts.balance',
    layout: 'hbox',
    height: 240,
    items: [
        {
            xtype: 'container',
            cls: 'a-card-container br-16',
            flex: 1,
            items: [
                {
                    xtype: 'title',
                    cls: 'fs-16 fw-b',
                    title: 'Balances',
                    top: 16,
                    left: 24,
                },
                {
                    xtype: 'fusionchart',
                    itemId: 'balanceChart',
                    renderAt: 'chart-container',
                    width: '100%',
                    height: '100%',
                    type: 'splinearea',
                    chart: {
                        numbersuffix: '',
                        showToolTip: '1',
                        drawAnchors: '1',
                        showHoverEffect: '1',
                        anchorHoverEffect: '1',
                        anchorHoverDip: '1',
                        anchorBorderThickness: '1.5',
                        anchorBgColor: 'FFFFFF',
                        anchorBorderColor: '00B6C8',
                        divLineThickness: '1',
                        showhovereffect: '1',
                        anchorRadius: '4',
                        canvasPadding: '0',
                        setAdaptiveYMin: '1',
                        showvalues: '0',
                        setadaptiveymin: '1',
                        canvasBgColor: '#66D3DE, #FFFFFF',
                        showPlotBorder: '1',
                        drawFullAreaBorder: '0',
                        plotFillColor: 'FFFFFF',
                        plotBorderColor: '00B6C8',
                        plotGradientColor: '66D3DE',
                        usePlotGradientColor: '1',
                        canvasBgColor: '#FFF',
                        plotBorderThickness: '2',
                        theme: 'fusion',
                        baseFontSize: '12',
                        baseFontColor: '6B7C93',
                        showLegend: '0',
                        chartTopMargin: '64',
                        chartLeftMargin: '24',
                        chartRightMargin: '24',
                        chartBottomMargin: '16',
                    },
                    bind: {
                        data: '{virtualAccountChartData}',
                    },
                    events: {
                        dataUpdated: function (e) {
                            let data = e.data.data;
                            let isEmpty = false;
                            if (data && data.data) {
                                isEmpty = Object.keys(data.data).length;
                            }
                            if (this.container && isEmpty) this.render();
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-card-container a-card-virtual-account br-16',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar a-bb-100',
                    minHeight: 64,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '<div class="hbox"><img src="https://static.abraxa.com/flags/1x1/{virtualAccountsGrid.selection.currency:substr(0, 2):lowercase()}.svg" alt="" class="a-flag-x32 a-flag-outlined a-img-round" /><div class="ml-16"><b class="d-inline-flex align-items-center">{virtualAccountsGrid.selection.name}</b><div class="sm-title">Account {virtualAccountsGrid.selection.account_number ? virtualAccountsGrid.selection.account_number : "---"}</div></div></div>',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'text-right',
                            bind: {
                                html: '<div class="a-balance-title">Threshold</div><div class="a-balance-threshold">{virtualAccountsGrid.selection.currency} {virtualAccountsGrid.selection.minimum_balance ? (virtualAccountsGrid.selection.minimum_balance:number("0,000.00")) : "---"}</div>',
                            },
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
                                bind: {
                                    html: '<strong><small>{virtualAccountsGrid.selection.currency}</small> {virtualAccountsGrid.selection.balance:number("0,000.00")}</strong>',
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'hbox justify-content-end',
                            bind: {
                                html: '<div class="a-balance-title">Latest transaction</div><div class="ml-8 c-white">{virtualAccountPayments.first.updated_at:date("d M Y")}</div>',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
