import '../../store/dashboard/BalanceExposure';
import '../../store/dashboard/PortcallsMap';

Ext.define('Abraxa.view.dashboard.DashboardViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dashboard-viewmodel',
    stores: {
        balanceExposure: {
            type: 'balance.exposure',
            autoLoad: false,
        },
        portcallsMap: {
            type: 'portcalls.map',
            autoLoad: false,
        },
    },
    formulas: {
        disbursementsTotal: {
            bind: {
                bindTo: '{balanceExposure}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getAt(0);
                    if (data) {
                        return Ext.util.Format.number(data.get('total'), '0,000.00');
                    }
                }
            },
        },
        disbursementsTotalCls: {
            bind: {
                bindTo: '{balanceExposure}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getAt(0);
                    if (data) {
                        let currentUserType = this.get('currentUserType'),
                            colorCls = '';
                        if (currentUserType == 'agent') {
                            if (Ext.isNumber(data.get('total'))) {
                                if (Ext.Number.sign(data.get('total')) === -1) {
                                    colorCls = 'a-positive-value';
                                }
                                if (Ext.Number.sign(data.get('total')) === 1) {
                                    colorCls = 'a-negative-value';
                                }
                            }
                        } else {
                            if (Ext.isNumber(data.get('total'))) {
                                if (Ext.Number.sign(data.get('total')) === -1) {
                                    colorCls = 'a-negative-value';
                                }
                                if (Ext.Number.sign(data.get('total')) === 1) {
                                    colorCls = 'a-positive-value';
                                }
                            }
                        }
                        return colorCls;
                    }
                }
            },
        },
        disbursementsDebitCredit: {
            bind: {
                bindTo: '{balanceExposure}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getAt(0);
                    if (data) {
                        let currentUserType = this.get('currentUserType'),
                            value = 'debit';
                        if (currentUserType == 'agent') {
                            if (Ext.isNumber(data.get('total'))) {
                                if (Ext.Number.sign(data.get('total')) === -1) {
                                    value = 'credit';
                                }
                            }
                        } else {
                            if (Ext.isNumber(data.get('total'))) {
                                if (Ext.Number.sign(data.get('total')) === -1) {
                                    value = 'debit';
                                } else {
                                    value = 'credit';
                                }
                            }
                        }

                        return value;
                    }
                }
            },
        },
        disbursementsCount: {
            bind: {
                bindTo: '{balanceExposure}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getAt(0);
                    if (data) {
                        return data.get('count');
                    }
                }
            },
        },
        disbursementsCurrency: {
            bind: {
                bindTo: '{balanceExposure}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getAt(0);
                    if (data) {
                        return data.get('currency');
                    }
                }
            },
        },

        loadAverageChart: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash && hash == '#dashboard') {
                    let chart = Ext.ComponentQuery.query('[itemId=averageChart]')[0];
                    if (chart) {
                        let fusionchart = chart.getFusionChart();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'dashboard/average_port_stay/-1',
                            method: 'GET',
                            withCredentials: true,
                            success: function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (fusionchart && !fusionchart.disposed) {
                                    if (obj) {
                                        fusionchart.setJSONData(obj);
                                    }
                                }
                            },
                            failure: function failure(response) {},
                        });
                    }
                }
            },
        },
        loadChart: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash && hash == '#dashboard') {
                    let chart = Ext.ComponentQuery.query('[itemId=chart]')[0];
                    if (chart) {
                        let fusionchart = chart.getFusionChart();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'dashboard/appointments/month',
                            method: 'GET',
                            withCredentials: true,
                            success: function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (fusionchart && !fusionchart.disposed) {
                                    if (obj) {
                                        fusionchart.setJSONData(obj);
                                    }
                                }
                            },
                            failure: function failure(response) {},
                        });
                    }
                }
            },
        },
        loadAngulargaugeChart: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash && hash == '#dashboard') {
                    let chart = Ext.ComponentQuery.query('[itemId=angulargaugeChart]')[0];
                    if (chart) {
                        let fusionchart = chart.getFusionChart();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'dashboard/appointments_latest',
                            method: 'GET',
                            withCredentials: true,
                            success: function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (fusionchart && !fusionchart.disposed) {
                                    if (obj) {
                                        Ext.ComponentQuery.query('[xtype=dashboard\\.right\\.container]')[0].setMasked(
                                            false
                                        );
                                        fusionchart.setJSONData(obj);
                                    }
                                }
                            },
                            failure: function failure(response) {},
                        });
                    }
                }
            },
        },
        loadStackedChart: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash && hash == '#dashboard') {
                    let chart = Ext.ComponentQuery.query('[itemId=stackedChart]')[0];
                    if (chart) {
                        let fusionchart = chart.getFusionChart();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'dashboard/top_deals',
                            method: 'GET',
                            withCredentials: true,
                            success: function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (fusionchart && !fusionchart.disposed) {
                                    if (obj) {
                                        fusionchart.setJSONData(obj);
                                    }
                                }
                            },
                            failure: function failure(response) {},
                        });
                    }
                }
            },
        },
        loadBalanceStore: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash && hash == '#dashboard') {
                    let store = this.get('balanceExposure');
                    if (store) {
                        store.load();
                    }
                }
            },
        },
    },
});
