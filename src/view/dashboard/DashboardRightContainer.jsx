import '../../core/components/InfoIcon';
import '../../core/components/charts/Abraxa.Chart.jsx';

Ext.define('Abraxa.view.dashboard.DashboardRightContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboard.right.container',
    cls: 'a-card-container a-dashboard-new-appointments bordered',
    hideMode: 'opacity',

    layout: 'fit',
    masked: {
        xtype: 'loadmask',
        message: 'Loading',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar',
            docked: 'top',
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
                            title: 'Weekly performance indicator',
                        },
                        {
                            xtype: 'infoicon',
                            infoText: 'Your appointments for this week vs number of appointments made last week',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            showNoPermissions: true,
            slug: 'dashboardWeeklyPerformance',
            bind: {
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'fusionchart',
                    type: 'angulargauge',
                    width: '100%',
                    height: 225,
                    itemId: 'angulargaugeChart',
                    chart: {
                        lowerlimit: '0',
                        showvalue: '1',
                        theme: 'fusion',
                        baseFontSize: '13',
                        baseFontColor: '#6B7C93',
                        pivotFillColor: '#6B7C93',
                        showHoverEffect: '1',
                        // 'gaugeFillMix': '{light-50},{light-50},{dark-0}',
                        // 'gaugeFillRatio': '6,0,0',
                        gaugeOuterRadius: '140',
                        gaugeInnerRadius: '85',
                        showGaugeBorder: '1',
                        gaugeBorderThickness: '2',
                        gaugeBorderColor: '#ffffff',
                        minorTMNumber: '0',
                        placeTicksInside: '1',
                    },
                    // events: {
                    //     chartMouseMove: function (e) {

                    //         return false;
                    //     }
                    // },
                    // dataFormat: 'jsonurl',
                    // dataSource: Env.ApiEndpoint + 'dashboard/appointments_latest',
                    // listeners: {
                    //     painted: function () {
                    //         let chart = this.getFusionChart();
                    //         Ext.Ajax.request({
                    //             url: Env.ApiEndpoint + 'dashboard/appointments_latest',
                    //             method: 'GET',
                    //             success: function (response) {
                    //                 var obj = Ext.decode(response.responseText);
                    //                 if (chart && !chart.disposed) {
                    //                     if (obj) {
                    //                         Ext.ComponentQuery.query('[xtype=dashboard\\.right\\.container]')[0].setMasked(false);
                    //                         chart.setJSONData(obj);
                    //                     }
                    //                 }
                    //             },
                    //             failure: function failure(response) {

                    //             }
                    //         });
                    //     }
                    // }
                },
            ],
        },
    ],
});