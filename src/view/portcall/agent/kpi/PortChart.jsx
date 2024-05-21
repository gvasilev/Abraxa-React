Ext.define('Abraxa.view.portcall.kpi.PortChart', {
    extend: 'Ext.Container',
    xtype: 'portcall.kpi.port.chart',
    flex: 1,
    layout: 'hbox',
    slug: 'portcallKPIsPort',
    showNoPermissions: true,
    bind: {
        permission: '{userPermissions}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-kpis-charts',
            hideMode: 'display',
            flex: 1,
            scrollable: true,
            items: [
                {
                    xtype: 'fusionchart',
                    cls: 'a-fusion-chart',
                    itemId: 'kpiChartDonut',
                    type: 'doughnut2d',
                    renderAt: 'chart-container',
                    width: 840,
                    height: 520,
                    dataFormat: 'json',
                    bind: {
                        chart: {
                            caption: 'Port {object_record.port_name}',
                            subcaption: 'All events',
                            showpercentvalues: '1',
                            defaultCenterLabel: 'Total port stay: <br>{new_kpi.portStay}',
                            centerLabelFontSize: '16',
                            centerLabelBold: '1',
                            centerLabelColor: '#6B7C93',
                            showPlotBorder: '1',
                            plotBorderThickness: '8',
                            plotBorderColor: '#ffffff',
                            aligncaptionwithcanvas: '0',
                            captionpadding: '16',
                            decimals: '1',
                            plottooltext: '<b>$percentValue</b> of <b>$label</b>',
                            centerlabel: '$label: $value %',
                            theme: 'fusion',
                            enableMultiSlicing: '1',
                            legendItemFontSize: '13',
                            legendIconSides: '12',
                            legendIconBgAlpha: '16',
                            legendIconBorderThickness: '1.5',
                        },
                        data: '{new_kpi.data}',
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
                        dataPlotClick: function (e) {
                            let view = this.component.upVM().get('activeView'),
                                selected,
                                list,
                                store,
                                itemIsSliced;
                            selected = this.component.upVM().get('new_kpi.portEvents')[e.data.index];
                            list = this.component.find('portCategoryList');
                            store = list.getStore();
                            itemIsSliced = this.component.getFusionChart().isPlotItemSliced(e.data.index);
                            if (store) {
                                let data = store.getRange(),
                                    storeRecord;
                                Ext.Array.each(data, function (value) {
                                    if (value.get('name') == selected.name) {
                                        storeRecord = value;
                                    }
                                });
                                if (storeRecord && !itemIsSliced) {
                                    switch (selected.name.toLowerCase()) {
                                        case 'stopped':
                                        case 'waiting':
                                        case 'shifting':
                                        case 'miscellaneous':
                                        case 'worked':
                                            list.select(storeRecord);
                                            break;
                                        default:
                                            Ext.ComponentQuery.query(
                                                '[reference=selectedPortCategory]'
                                            )[0].deselectAll();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].show();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port-category-details]')[0].hide();
                                            break;
                                    }
                                } else {
                                    Ext.ComponentQuery.query('[reference=selectedPortCategory]')[0].deselectAll();
                                    Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].show();
                                    Ext.ComponentQuery.query('[cls~=a-kpi-port-category-details]')[0].hide();
                                }
                            }
                        },
                        legendItemClicked: function (e) {
                            let view = this.component.upVM().get('activeView'),
                                selected,
                                list,
                                store,
                                itemIsSliced;
                            selected = this.component.upVM().get('new_kpi.portEvents')[e.data.datasetIndex];
                            list = this.component.find('portCategoryList');
                            store = list.getStore();
                            itemIsSliced = this.component.getFusionChart().isPlotItemSliced(e.data.datasetIndex);
                            if (store) {
                                let data = store.getRange(),
                                    storeRecord;
                                Ext.Array.each(data, function (value) {
                                    if (value.get('name') == selected.name) {
                                        storeRecord = value;
                                    }
                                });
                                if (storeRecord && !itemIsSliced) {
                                    switch (selected.name.toLowerCase()) {
                                        case 'stopped':
                                        case 'waiting':
                                        case 'shifting':
                                        case 'worked':
                                        case 'miscellaneous':
                                            list.select(storeRecord);
                                            break;
                                        default:
                                            Ext.ComponentQuery.query(
                                                '[reference=selectedPortCategory]'
                                            )[0].deselectAll();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].show();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port-category-details]')[0].hide();
                                            break;
                                    }
                                } else {
                                    Ext.ComponentQuery.query('[reference=selectedPortCategory]')[0].deselectAll();
                                    Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].show();
                                    Ext.ComponentQuery.query('[cls~=a-kpi-port-category-details]')[0].hide();
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
            items: [
                {
                    xtype: 'container',
                    cls: 'a-kpis-port',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-item a-item-port-stay',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'abraxa.panel',
                                    flex: 1,
                                    cls: 'a-kpis-sm-card a-kpi-port',
                                    shadow: false,
                                    margin: 0,
                                    padding: 0,
                                    bodyPadding: 0,
                                    showAnimation: {
                                        type: 'slide',
                                        direction: 'right',
                                    },
                                    bind: {
                                        title: '<div class="a-item-header"><i class="material-icons-outlined">timer</i><div class="a-item-title">Port stay</div><div class="a-item-value">{new_kpi.portStay}</div></div>',
                                    },
                                    items: [
                                        {
                                            xtype: 'list',
                                            itemId: 'portCategoryList',
                                            cls: 'a-kpis-port-category',
                                            itemTpl:
                                                '<div class="a-kpis-list"><div class="sm-header"><div class="sm-title">{name} <strong>({result}%)</strong></div><div class="sm-percent-badge" style="background-color: {color}; width:{result}%;"></div></div><div class="sm-time">{duration}</div></div>',
                                            reference: 'selectedPortCategory',
                                            bind: {
                                                store: '{new_kpi.portEvents}',
                                            },
                                            listeners: {
                                                select: function (cmp, record) {
                                                    switch (record.get('type')) {
                                                        case 'stopped':
                                                        case 'waiting':
                                                        case 'shifting':
                                                        case 'misc':
                                                        case 'worked':
                                                            Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].hide();
                                                            Ext.ComponentQuery.query(
                                                                '[cls~=a-kpi-port-category-details]'
                                                            )[0].show();
                                                            break;
                                                        default:
                                                        // code block
                                                    }
                                                },
                                                childtap: function (me, location) {
                                                    let donut = this.find('kpiChartDonut'),
                                                        list = this.find('portCategoryList'),
                                                        store = list.getStore(),
                                                        index = store.indexOf(location.record),
                                                        itemIsSliced = donut.getFusionChart().isPlotItemSliced(index);
                                                    if (!itemIsSliced) {
                                                        donut.getFusionChart().slicePlotItem(index, true);
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.panel',
                                    flex: 1,
                                    shadow: false,
                                    margin: 0,
                                    padding: 0,
                                    bodyPadding: 0,
                                    cls: 'a-kpis-sm-card a-kpi-port-category-details',
                                    hidden: true,
                                    showAnimation: 'slideIn',

                                    toolDefaults: {
                                        xtype: 'tool',
                                        zone: 'start',
                                    },
                                    header: {
                                        padding: '0 16 0 52',
                                    },
                                    tools: [
                                        {
                                            ui: 'tool round',
                                            xtype: 'button',
                                            left: 8,
                                            iconCls: 'md-icon-keyboard-backspace',
                                            docked: 'left',
                                            handler: function () {
                                                let donut = this.find('kpiChartDonut'),
                                                    list = this.find('portCategoryList'),
                                                    store = list.getStore(),
                                                    index = store.indexOf(list.getSelection());
                                                donut.getFusionChart().slicePlotItem(index, false);
                                                Ext.ComponentQuery.query(
                                                    '[reference=selectedPortCategory]'
                                                )[0].deselectAll();
                                                Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].show();
                                                Ext.ComponentQuery.query(
                                                    '[cls~=a-kpi-port-category-details]'
                                                )[0].hide();
                                            },
                                        },
                                    ],
                                    bind: {
                                        title: '<div class="a-item-header"><div class="a-title">{selectedPortCategory.selection.name} ({selectedPortCategory.selection.result}%)</div><div class="a-item-value">{selectedPortCategory.selection.duration}</div></div>',
                                    },
                                    items: [
                                        {
                                            xtype: 'list',
                                            cls: 'a-port-detailed-list a-kpis-detailed-list',
                                            itemTpl:
                                                '<div class="a-kpis-list"><div class="e-event event-color {event_category_name}"><span class="text-truncate">{event_name}</span></div><div class="a-date">{event_date:date("d M")}</div><div class="a-time">{event_from:date("H:i")} - {event_to:date("H:i")}</div></div>',
                                            bind: {
                                                store: '{selectedPortCategory.selection.events}',
                                            },
                                        },
                                        // {
                                        //     xtype: 'container',
                                        //     bind:{
                                        //         html: '<div class="a-kpis-total"><div class="sm-title">Total stay:</div><div class="sm-value">{new_kpi.total}</div></div>'
                                        //     }
                                        // }
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-item a-item-berth-stay',
                            bind: {
                                html: '<div class="a-item-header"><i class="material-icons-outlined">timer</i><div class="a-item-title">Berth stay</div><div class="a-item-value">{new_kpi.berthStay}</div></div>',
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-item a-item-non-berth-stay',
                            bind: {
                                html: '<div class="a-item-header"><i class="material-icons-outlined">timer</i><div class="a-item-title">Non-Berth stay</div><div class="a-item-value">{new_kpi.otherStay}</div></div>',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
