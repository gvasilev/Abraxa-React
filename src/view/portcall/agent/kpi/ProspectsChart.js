Ext.define('Abraxa.view.portcall.kpi.ProspectsChart', {
    extend: 'Ext.Container',
    xtype: 'portcall.kpi.prospects.chart',
    flex: 1,
    layout: 'hbox',
    slug: 'portcallKPIsProspects',
    showNoPermissions: true,
    bind: {
        permission: '{userPermissions}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-kpis-charts a-chart-prospects',
            itemId: 'prospectChartContainer',
            flex: 1,
            scrollable: true,
            items: [
                {
                    xtype: 'fusionchart',
                    cls: 'a-fusion-chart',
                    type: 'gantt',
                    renderAt: 'chart-container',
                    width: 840,
                    height: 520,
                    itemId: 'prospectChart',
                    events: {
                        dataUpdated: function (e) {
                            let data = e.data.data;
                            let isEmpty = false;
                            let vm = this.component && this.component.upVM();

                            if (data && data.data) {
                                isEmpty = Object.keys(data.data).length;
                            }

                            if (data && data.prospects_duration && data.prospects_duration.length > 0 && vm) {
                                vm.set('prospectDays', data.prospects_duration[1].prospect_days);
                                vm.set('currentDays', data.prospects_duration[1].current_days);
                                vm.set('days', data.prospects_duration[0].days);
                                if (this.container && isEmpty) {
                                    this.render();
                                }
                            }
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-kpis-card',
            width: 420,
            // docked: 'right',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-kpis-prospects',
                    layout: 'vbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-item a-item-prospects',
                            bind: {
                                html: '<div class="a-item-title">Prospects</div><div class="a-item-body"><div class="a-item-value">{currentDays} <small>days</small></div><div class="cursor-pointer a-item-sm-value {prospectsColor}">{calculateProspects} day</div></div>',
                            },
                            listeners: {
                                mouseenter: {
                                    element: 'element',
                                    delegate: 'div.a-item-sm-value',
                                    fn: function (item) {
                                        let tipExist = Ext.getCmp('prospectToolTip');
                                        if (tipExist) {
                                            tipExist.destroy();
                                        }
                                        var tip = Ext.create('Ext.tip.ToolTip', {
                                            target: item,
                                            manageBorders: false,
                                            anchorToTarget: true,
                                            id: 'prospectToolTip',
                                            autoDestroy: true,
                                            anchor: true,
                                            autoHide: true,
                                            showOnTap: true,
                                            allowOver: true,
                                            dismissDelay: 1000,
                                            html: 'Difference between first<br>and latest reported<br>prospects',
                                        });
                                        tip.showBy(item, 'tc-bc?');
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-item a-item-actual',
                            bind: {
                                html: '<div class="a-item-title">Actual</div><div class="a-item-body"><div class="a-item-value">{days} <small>days</small><div></div>',
                            },
                        },
                        {
                            xtype: 'div',
                            bind: {
                                cls: 'a-item a-item-variation {durationColor}',
                                html: '<div class="a-item-title">Variation</div><div class="a-item-body"><div class="a-item-value">{calculateDuration} <small>days</small></div></div>',
                            },
                            listeners: {
                                mouseenter: {
                                    element: 'element',
                                    delegate: 'div.a-item-value',
                                    fn: function (item) {
                                        let tipExist = Ext.getCmp('variationToolTip');
                                        if (tipExist) {
                                            tipExist.destroy();
                                        }
                                        var tip = Ext.create('Ext.tip.ToolTip', {
                                            target: item,
                                            manageBorders: false,
                                            anchorToTarget: true,
                                            id: 'variationToolTip',
                                            autoDestroy: true,
                                            anchor: true,
                                            autoHide: true,
                                            showOnTap: true,
                                            allowOver: true,
                                            dismissDelay: 1000,
                                            html: 'Difference between actual and prospects',
                                        });
                                        tip.showBy(item, 'tc-bc?');
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
