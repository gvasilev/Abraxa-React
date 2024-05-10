Ext.define('Abraxa.view.portcall.kpi.BerthChart', {
    extend: 'Ext.Container',
    xtype: 'portcall.kpi.berth.chart',
    flex: 1,
    layout: 'hbox',
    slug: 'portcallKPIsBerth',
    showNoPermissions: true,
    bind: {
        permission: '{userPermissions}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-kpis-charts',
            flex: 1,
            scrollable: true,
            items: [
                {
                    xtype: 'fusionchart',
                    cls: 'a-fusion-chart',
                    hideMode: 'display',
                    itemId: 'kpiBerthChartDonut',
                    type: 'doughnut2d',
                    renderAt: 'chart-container',
                    width: 840,
                    height: 520,
                    dataFormat: 'json',
                    bind: {
                        chart: {
                            caption: 'Port {object_record.port_name}',
                            subcaption: 'All berths',
                            showpercentvalues: '1',
                            defaultCenterLabel: 'Total berth stay: <br>{new_kpi.berthStay}',
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
                        data: '{new_kpi.berthStats}',
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

                            switch (view) {
                                case 'berth':
                                    selected = this.component.upVM().get('new_kpi.berthStats')[e.data.index];
                                    list = this.component.find('berthList');
                                    store = list.getStore();
                                    itemIsSliced = this.component.getFusionChart().isPlotItemSliced(e.data.index);
                                    if (store) {
                                        let data = store.getRange(),
                                            storeRecord;
                                        Ext.Array.each(data, function (value) {
                                            if (value.get('berth_id') == selected.berth_id) {
                                                storeRecord = value;
                                            }
                                        });
                                        if (storeRecord && !itemIsSliced) {
                                            list.select(storeRecord);
                                        } else {
                                            Ext.ComponentQuery.query('[reference=activeBerthKpi]')[0].deselectAll();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].show();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port-category-details]')[0].hide();
                                        }
                                    }
                                    break;
                                case 'berthEvents':
                                    selected = this.component.upVM().get('new_kpi.berthStats')[e.data.index];
                                    list = this.component.find('berthCategoryList');
                                    store = list.getStore();
                                    itemIsSliced = this.component.getFusionChart().isPlotItemSliced(e.data.index);
                                    if (store) {
                                        let storeRecord = store.getAt(e.data.index);
                                        if (storeRecord && !itemIsSliced) {
                                            this.component.getFusionChart().slicePlotItem(e.data.index, false);
                                            switch (e.data.categoryLabel.toLowerCase()) {
                                                case 'stopped':
                                                case 'waiting':
                                                case 'shifting':
                                                case 'miscellaneous':
                                                case 'cargo ops':
                                                    list.select(storeRecord);
                                                    break;
                                                default:
                                                    Ext.ComponentQuery.query(
                                                        '[reference=selectedCategory]'
                                                    )[0].deselectAll();
                                                    Ext.ComponentQuery.query('[cls~=a-kpi-berth-details]')[0].show({
                                                        type: 'slideIn',
                                                        direction: 'right',
                                                    });
                                                    Ext.ComponentQuery.query('[cls~=a-kpi-category-details]')[0].hide(
                                                        null
                                                    );
                                                    break;
                                            }
                                        } else {
                                            Ext.ComponentQuery.query('[reference=selectedCategory]')[0].deselectAll();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-berth-details]')[0].show({
                                                type: 'slideIn',
                                                direction: 'right',
                                            });
                                            Ext.ComponentQuery.query('[cls~=a-kpi-category-details]')[0].hide(null);
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        },
                        legendItemClicked: function (e) {
                            let view = this.component.upVM().get('activeView'),
                                selected,
                                list,
                                store,
                                itemIsSliced;
                            switch (view) {
                                case 'berth':
                                    selected = this.component.upVM().get('new_kpi.berthStats')[e.data.datasetIndex];
                                    list = this.component.find('berthList');
                                    store = list.getStore();
                                    itemIsSliced = this.component
                                        .getFusionChart()
                                        .isPlotItemSliced(e.data.datasetIndex);
                                    if (store) {
                                        let data = store.getRange(),
                                            storeRecord;
                                        Ext.Array.each(data, function (value) {
                                            if (value.get('berth_id') == selected.berth_id) {
                                                storeRecord = value;
                                            }
                                        });
                                        if (storeRecord && !itemIsSliced) {
                                            list.select(storeRecord);
                                        } else {
                                            Ext.ComponentQuery.query('[reference=activeBerthKpi]')[0].deselectAll();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port]')[0].show();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-port-category-details]')[0].hide();
                                        }
                                    }
                                    break;
                                case 'berthEvents':
                                    selected = this.component.upVM().get('new_kpi.berthStats')[e.data.datasetIndex];
                                    list = this.component.find('berthCategoryList');
                                    store = list.getStore();
                                    itemIsSliced = this.component
                                        .getFusionChart()
                                        .isPlotItemSliced(e.data.datasetIndex);
                                    if (store) {
                                        let storeRecord = store.getAt(e.data.datasetIndex);
                                        if (storeRecord && !itemIsSliced) {
                                            switch (e.data.label.toLowerCase()) {
                                                case 'stopped':
                                                case 'waiting':
                                                case 'shifting':
                                                case 'miscellaneous':
                                                case 'cargo ops':
                                                    list.select(storeRecord);
                                                    break;
                                                default:
                                                    Ext.ComponentQuery.query(
                                                        '[reference=selectedCategory]'
                                                    )[0].deselectAll();
                                                    Ext.ComponentQuery.query('[cls~=a-kpi-berth-details]')[0].show({
                                                        type: 'slideIn',
                                                        direction: 'right',
                                                    });
                                                    Ext.ComponentQuery.query('[cls~=a-kpi-category-details]')[0].hide(
                                                        null
                                                    );
                                                    break;
                                            }
                                        } else {
                                            Ext.ComponentQuery.query('[reference=selectedCategory]')[0].deselectAll();
                                            Ext.ComponentQuery.query('[cls~=a-kpi-berth-details]')[0].show({
                                                type: 'slideIn',
                                                direction: 'right',
                                            });
                                            Ext.ComponentQuery.query('[cls~=a-kpi-category-details]')[0].hide(null);
                                        }
                                    }
                                    break;
                                default:
                                    break;
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
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-item a-item-port-stay',
                            items: [
                                {
                                    xtype: 'abraxa.panel',
                                    shadow: false,
                                    margin: 0,
                                    padding: 0,
                                    bodyPadding: 0,
                                    cls: 'a-kpis-sm-card a-kpi-berth a-kpi-port',
                                    bind: {
                                        title: '<div class="a-item-header"><i class="material-icons-outlined">timer</i><div class="a-item-title">Total Berth stay</div><div class="a-item-value">{new_kpi.berthStay}</div></div>',
                                    },

                                    showAnimation: {
                                        type: 'slide',
                                        direction: 'right',
                                    },
                                    items: [
                                        {
                                            xtype: 'list',
                                            itemTpl:
                                                '<div class="a-kpis-list"><div class="sm-header"><div class="sm-title">{label} <strong>({result}%)</strong></div><div class="sm-percent-badge" style="background-color: {color}; width:{result}%;"></div></div><div class="sm-time">{duration}</div></div>',
                                            reference: 'activeBerthKpi',
                                            itemId: 'berthList',
                                            publishes: 'record',
                                            bind: {
                                                store: '{new_kpi.berthStats}',
                                            },
                                            listeners: {
                                                select: function (cmp, record) {
                                                    let donut =
                                                            Ext.ComponentQuery.query('[itemId=kpiBerthChartDonut]')[0],
                                                        label = cmp.upVM().get('activeBerthKpi.selection.label'),
                                                        totalStay = cmp.upVM().get('activeBerthKpi.selection.duration');
                                                    if (donut) {
                                                        donut.setData(record.get('data'));
                                                        donut
                                                            .getFusionChart()
                                                            .setChartAttribute(
                                                                'defaultCenterLabel',
                                                                label + ':<br>' + totalStay
                                                            );
                                                    }
                                                    this.upVM().set('activeView', 'berthEvents');
                                                    Ext.ComponentQuery.query('[cls~=a-kpi-berth]')[0].hide();
                                                    Ext.ComponentQuery.query('[cls~=a-kpi-berth-details]')[0].show();
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
                                    cls: 'a-kpis-sm-card a-kpi-berth-details',
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
                                                Ext.ComponentQuery.query('[reference=activeBerthKpi]')[0].deselectAll();
                                                Ext.ComponentQuery.query('[cls~=a-kpi-berth]')[0].show();
                                                Ext.ComponentQuery.query('[cls~=a-kpi-berth-details]')[0].hide();
                                                let donut = Ext.ComponentQuery.query('[itemId=kpiBerthChartDonut]')[0],
                                                    store = this.upVM().get('new_kpi.berthStats');
                                                this.upVM().set('activeView', 'berth');
                                                donut.setData(store);
                                                donut.getFusionChart().render();
                                                // var store = this.upVM().get('new_kpi.berthStats');
                                                // if (store.length > 0) {
                                                //     Ext.ComponentQuery.query('container[cls=a-kpis-card]')[0].setActiveItem(1);
                                                //     Ext.ComponentQuery.query('polar[cls=a-kpis-polar]')[0].setStore(store);
                                                //     Ext.ComponentQuery.query('polar[cls=a-kpis-polar]')[0]._series[0].setColors(this.upVM().get('new_kpi.berthColors'));
                                                // }
                                            },
                                        },
                                    ],
                                    bind: {
                                        title: '<div class="a-item-header"><div class="a-title">{activeBerthKpi.selection.label}</div><div class="a-item-value">{activeBerthKpi.selection.duration}</div></div>',
                                    },
                                    items: [
                                        {
                                            xtype: 'list',
                                            reference: 'selectedCategory',
                                            itemId: 'berthCategoryList',
                                            publishes: 'record',
                                            itemTpl:
                                                '<div class="a-kpis-list"><div class="sm-header"><div class="sm-title">{name} <strong>({result}%)</strong></div><div class="sm-percent-badge" style="background-color: {color}; width:{result}%;"></div></div><div class="sm-time">{duration}</div></div>',
                                            bind: {
                                                store: '{activeBerthKpi.selection.data}',
                                            },
                                            listeners: {
                                                select: function (cmp, record) {
                                                    switch (record.get('type')) {
                                                        case 'stopped':
                                                        case 'waiting':
                                                        case 'shifting':
                                                        case 'worked':
                                                        case 'misc':
                                                            Ext.ComponentQuery.query(
                                                                '[cls~=a-kpi-berth-details]'
                                                            )[0].hide();
                                                            Ext.ComponentQuery.query(
                                                                '[cls~=a-kpi-category-details]'
                                                            )[0].show();
                                                            break;
                                                        default:
                                                        // code block
                                                    }
                                                },
                                                childtap: function (me, location) {
                                                    let donut = this.find('kpiBerthChartDonut'),
                                                        list = this.find('berthCategoryList'),
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
                                    cls: 'a-kpis-sm-card a-kpi-category-details',
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
                                                let donut = this.find('kpiBerthChartDonut'),
                                                    list = this.find('berthCategoryList'),
                                                    store = list.getStore(),
                                                    index = store.indexOf(list.getSelection());
                                                donut.getFusionChart().slicePlotItem(index, false);
                                                Ext.ComponentQuery.query(
                                                    '[reference=selectedCategory]'
                                                )[0].deselectAll();
                                                Ext.ComponentQuery.query('[cls~=a-kpi-berth-details]')[0].show({
                                                    type: 'slideIn',
                                                    direction: 'right',
                                                });
                                                Ext.ComponentQuery.query('[cls~=a-kpi-category-details]')[0].hide(null);
                                            },
                                        },
                                    ],
                                    bind: {
                                        title: '<div class="a-item-header"><div class="a-title">{selectedCategory.selection.name} ({selectedCategory.selection.result}%)</div><div class="a-item-value">{selectedCategory.selection.duration}</div></div>',
                                    },
                                    items: [
                                        {
                                            xtype: 'list',
                                            cls: 'a-berth-detailed-list a-kpis-detailed-list',
                                            itemTpl:
                                                '<div class="a-kpis-list"><div class="e-event event-color {event_category_name}"><span class="text-truncate">{event_name}</span></div><div class="a-date">{event_date:date("d M")}</div><div class="a-time">{event_from:date("H:i")} - {event_to:date("H:i")}</div></div>',
                                            bind: {
                                                store: '{selectedCategory.selection.events}',
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
});
