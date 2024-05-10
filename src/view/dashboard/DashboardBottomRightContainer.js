Ext.define('Abraxa.view.dashboard.DashboardBottomRightContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboard.bottom.right.container',
    cls: 'a-card-container bordered',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    hideMode: 'opacity',
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
                            title: 'Average port stay index',
                        },
                        {
                            xtype: 'infoicon',
                            infoText:
                                'Averaged port stay period basis all your individual appointments per individual port',
                        },
                    ],
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
                            text: 'All',
                            itemId: 'portFilterButton',
                            arrow: true,
                            slug: 'dashboardAveragePortStay',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{currentUserType == "agent" ? false:true}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                align: 'bc-tc?',
                                html: 'Filter',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                            menu: {
                                maxHeight: 336,
                                scrollable: true,
                                listeners: {
                                    initialize: function (me) {
                                        let store = me.upVM().get('portsServed'),
                                            data = store.getData().getRange(),
                                            items = [];
                                        let defaultTitem = {
                                            text: 'All',
                                            handler: function () {
                                                this.find('portFilterButton').setText('All');
                                                let chart = this.find('averageChart');
                                                Ext.Ajax.request({
                                                    url: Env.ApiEndpoint + 'dashboard/average_port_stay/-1',
                                                    method: 'GET',
                                                    success: function (response) {
                                                        var obj = Ext.decode(response.responseText);
                                                        chart.getFusionChart().setJSONData(obj);
                                                    },
                                                    failure: function failure(response) {},
                                                });
                                            },
                                        };
                                        items.push(defaultTitem);
                                        Ext.each(data, function (value) {
                                            let item = {
                                                text: value.get('port_name'),
                                                record: value,
                                                handler: function () {
                                                    this.find('portFilterButton').setText(value.get('port_name'));
                                                    let chart = this.find('averageChart');
                                                    Ext.Ajax.request({
                                                        url:
                                                            Env.ApiEndpoint +
                                                            'dashboard/average_port_stay/' +
                                                            value.get('port_id'),
                                                        method: 'GET',
                                                        success: function (response) {
                                                            var obj = Ext.decode(response.responseText);
                                                            chart.getFusionChart().setJSONData(obj);
                                                        },
                                                        failure: function failure(response) {},
                                                    });
                                                },
                                            };
                                            items.push(item);
                                        });
                                        me.setItems(items);
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            bind: {
                                hidden: '{currentUserType == "agent" ? true:false}',
                            },
                            items: [
                                {
                                    xtype: 'tool',
                                    iconCls: 'md-icon-outlined md-icon-clear-all',
                                    ui: 'tool-md',
                                    tooltip: {
                                        anchorToTarget: true,
                                        html: 'Clear filter',
                                        align: 't50-b50',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                    },

                                    handler: function () {
                                        let chart = this.find('averageChart');
                                        Ext.Ajax.request({
                                            url: Env.ApiEndpoint + 'dashboard/average_port_stay/-1',
                                            method: 'GET',
                                            success: function (response) {
                                                var obj = Ext.decode(response.responseText);
                                                chart.getFusionChart().setJSONData(obj);
                                            },
                                            failure: function failure(response) {},
                                        });
                                        this.up('container').find('portCombo').clearValue();
                                    },
                                },
                                {
                                    xtype: 'port.combo',
                                    ui: 'classic hovered-border',
                                    itemId: 'portCombo',
                                    cls: 'a-field-icon icon-port icon-rounded',
                                    placeholder: 'Choose port',
                                    label: null,
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection && Ext.isNumeric(parseInt(selection.get('port_id')))) {
                                                let chart = this.find('averageChart');
                                                Ext.Ajax.request({
                                                    url:
                                                        Env.ApiEndpoint +
                                                        'dashboard/average_port_stay/' +
                                                        selection.get('port_id'),
                                                    method: 'GET',
                                                    success: function (response) {
                                                        var obj = Ext.decode(response.responseText);
                                                        chart.getFusionChart().setJSONData(obj);
                                                    },
                                                    failure: function failure(response) {},
                                                });
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
        {
            xtype: 'container',
            showNoPermissions: true,
            slug: 'dashboardAveragePortStay',
            height: '100%',
            bind: {
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'fusionchart',
                    type: 'MSArea',
                    width: '100%',
                    height: '100%',
                    itemId: 'averageChart',
                    flex: 1,
                    // dataFormat: 'jsonurl',
                    // dataSource: Env.ApiEndpoint + 'dashboard/average_port_stay/-1',
                    // listeners: {
                    //     painted: function () {
                    //         let chart = this.getFusionChart();
                    //         Ext.Ajax.request({
                    //             url: Env.ApiEndpoint + 'dashboard/average_port_stay/-1',
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
