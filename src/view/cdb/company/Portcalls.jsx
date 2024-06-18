import '../../../core/components/charts/Abraxa.Chart';

Ext.define('Abraxa.view.cdb.company.Portcalls', {
    extend: 'Ext.Container',
    xtype: 'cdb.portcalls',
    cls: 'a-card-container a-card-portcalls',
    margin: '0 24 24',
    height: '100%',
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    height: 280,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            height: 64,
                            cls: 'a-titlebar',
                            docked: 'top',
                            items: [
                                {
                                    xtype: 'title',
                                    bind: {
                                        title: '<div><span class="a-panel-title">Appointments per month</span></div><div><span class="sm-title">{periodString}</span></div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: '0 8',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'fusionchart',
                                    flex: 1,
                                    cls: 'abraxa-chart a-stakedcolumn a-cdb-chart',
                                    type: 'stackedcolumn2d',
                                    itemId: 'companyPortcallsChart',
                                    height: '100%',
                                    width: '100%',
                                    events: {
                                        dataPlotClick: function(e) {
                                            let vm = this.component.upVM(),
                                                months = vm.get('months');
                                            if (months) {
                                                vm.set('currentMonth', months[e.data.index]);
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
