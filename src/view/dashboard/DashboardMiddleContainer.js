Ext.define('Abraxa.view.dashboard.DashboardMiddleContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboard.middle.container',
    cls: 'a-card-container bordered',
    layout: 'fit',
    hideMode: 'opacity',
    padding: '16 16 0 16',
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar',
            docked: 'top',
            items: [
                {
                    xtype: 'title',
                    title: 'My appointments',
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-filter-alt',
                            cls: 'non-editable',
                            ui: 'default btn-sm fw-n',
                            itemId: 'filterButtonAppointments',
                            text: 'Month',
                            arrow: true,
                            slug: 'dashboardMyPortcalls',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            menu: {
                                minWidth: '160px',
                                items: [
                                    {
                                        text: 'Month',
                                        iconCls: 'md-icon-date-range',
                                        handler: function () {
                                            this.find('filterButtonAppointments').setText('Month');
                                            let chart = this.find('chart'),
                                                url = Env.ApiEndpoint + 'dashboard/appointments/month';
                                            Ext.Ajax.request({
                                                url: url,
                                                method: 'GET',
                                                success: function (response) {
                                                    var obj = Ext.decode(response.responseText);
                                                    chart.getFusionChart().setJSONData(obj);
                                                },
                                                failure: function failure(response) {},
                                            });
                                        },
                                    },
                                    {
                                        text: 'Annual',
                                        iconCls: 'md-icon-date-range',
                                        handler: function () {
                                            this.find('filterButtonAppointments').setText('Annual');
                                            let chart = this.find('chart'),
                                                url = Env.ApiEndpoint + 'dashboard/appointments/annual';
                                            Ext.Ajax.request({
                                                url: url,
                                                method: 'GET',
                                                success: function (response) {
                                                    var obj = Ext.decode(response.responseText);
                                                    chart.getFusionChart().setJSONData(obj);
                                                },
                                                failure: function failure(response) {},
                                            });
                                        },
                                    },
                                    {
                                        text: 'Quarter',
                                        iconCls: 'md-icon-date-range',
                                        handler: function () {
                                            this.find('filterButtonAppointments').setText('Quarter');
                                            let chart = this.find('chart'),
                                                url = Env.ApiEndpoint + 'dashboard/appointments/quarter';
                                            Ext.Ajax.request({
                                                url: url,
                                                method: 'GET',
                                                success: function (response) {
                                                    var obj = Ext.decode(response.responseText);
                                                    chart.getFusionChart().setJSONData(obj);
                                                },
                                                failure: function failure(response) {},
                                            });
                                        },
                                    },
                                    {
                                        text: 'Date',
                                        iconCls: 'md-icon-date-range',
                                        menu: {
                                            items: [
                                                {
                                                    xtype: 'formpanel',
                                                    items: [
                                                        {
                                                            label: 'From:',
                                                            labelAlign: 'top',
                                                            itemId: 'fromField',
                                                            required: true,
                                                            name: 'from',
                                                            xtype: 'abraxa.datefield',
                                                        },
                                                        {
                                                            label: 'To:',
                                                            labelAlign: 'top',
                                                            itemId: 'toField',
                                                            name: 'to',
                                                            xtype: 'abraxa.datefield',
                                                        },
                                                        {
                                                            xtype: 'selectfield',
                                                            label: 'Type',
                                                            labelAlign: 'top',
                                                            ui: 'modern',
                                                            required: true,
                                                            name: 'type',
                                                            options: [
                                                                {
                                                                    text: 'Daily',
                                                                    value: 'daily',
                                                                },
                                                                {
                                                                    text: 'Weekly',
                                                                    value: 'weekly',
                                                                },
                                                                {
                                                                    text: 'Monthly',
                                                                    value: 'monthly',
                                                                },
                                                                {
                                                                    text: 'Yearly',
                                                                    value: 'yearly',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: 'Apply',
                                                    seperator: true,
                                                    hideOnClick: false,
                                                    handler: function () {
                                                        let form = this.up('menu').down('formpanel');
                                                        if (form.validate()) {
                                                            let values = form.getValues();
                                                            if (values.to === null) {
                                                                values.to = moment().format('YYYY-MM-DD');
                                                            } else {
                                                                values.to = moment(values.to).format('YYYY-MM-DD');
                                                            }
                                                            let chart = this.find('chart'),
                                                                url =
                                                                    Env.ApiEndpoint +
                                                                    'dashboard/appointments/custom?from=' +
                                                                    moment(values.from).format('YYYY-MM-DD') +
                                                                    '&to=' +
                                                                    values.to +
                                                                    '&view=' +
                                                                    values.type;
                                                            Ext.Ajax.request({
                                                                url: url,
                                                                method: 'GET',
                                                                success: function (response) {
                                                                    var obj = Ext.decode(response.responseText);
                                                                    if (obj.statusCode === 500)
                                                                        Ext.Msg.warning(
                                                                            'Warning',
                                                                            'You have selected too wide time frame period.'
                                                                        );
                                                                    chart.getFusionChart().setJSONData(obj);
                                                                },
                                                                failure: function failure(response) {
                                                                    var obj = Ext.decode(response.responseText);
                                                                    Ext.Msg.alert('Warning', obj.message);
                                                                },
                                                            });
                                                        }
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                            // ui: 'tool-text-sm',
                            ui: 'default btn-sm fw-n',
                            arrow: false,
                            text: 'Export',
                            margin: '0 0 0 8',
                            slug: 'dashboardMyPortcalls',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM(),
                                    dialog = Ext.create('Abraxa.view.Dashboard.KPIExport', {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                required: false,
                                                nonEditable: false,
                                                is_custom: false,
                                            },
                                            stores: {
                                                vesselTypes: {
                                                    type: 'vesselTypeStore',
                                                },
                                            },
                                            formulas: {
                                                typeWithAll: {
                                                    bind: {
                                                        bindTo: '{vesselTypes}',
                                                        deep: true,
                                                    },
                                                    get: function (store) {
                                                        if (store) {
                                                            let data = store.getData().getRange();
                                                            let newData = [];
                                                            let allRecord = {
                                                                id: -1,
                                                                name: 'All',
                                                            };
                                                            newData.push(allRecord);
                                                            Ext.each(data, function (value, index) {
                                                                newData.push(value.getData());
                                                            });
                                                            return newData;
                                                        }
                                                    },
                                                },
                                                portServerWithAll: {
                                                    bind: {
                                                        bindTo: '{portsServed}',
                                                        deep: true,
                                                    },
                                                    get: function (store) {
                                                        if (store) {
                                                            let data = store.getData().getRange();
                                                            let newData = [];
                                                            let allRecord = {
                                                                port_id: -1,
                                                                port_name: 'All ports',
                                                            };
                                                            newData.push(allRecord);
                                                            Ext.each(data, function (value, index) {
                                                                newData.push(value.getData());
                                                            });
                                                            return newData;
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    }).show();
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            showNoPermissions: true,
            slug: 'dashboardMyPortcalls',
            bind: {
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'fusionchart',
                    cls: 'abraxa-chart a-stakedcolumn',
                    type: 'stackedcolumn2d',
                    itemId: 'chart',
                    layout: 'fit',
                    width: '100%',
                    height: '100%',
                    // dataFormat: 'jsonurl',
                    // dataSource: Env.ApiEndpoint + 'dashboard/appointments/month',
                    // listeners: {
                    //     painted: function () {
                    //         let chart = this.getFusionChart();
                    //         Ext.Ajax.request({
                    //             url: Env.ApiEndpoint + 'dashboard/appointments/month',
                    //             method: 'GET',
                    //             success: function (response) {
                    //                 var obj = Ext.decode(response.responseText);
                    //                 if (chart && !chart.disposed) {
                    //                     if (obj) {
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
