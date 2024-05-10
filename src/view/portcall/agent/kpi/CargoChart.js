Ext.define('Abraxa.view.portcall.kpi.CargoChart', {
    extend: 'Ext.Container',
    xtype: 'portcall.kpi.cargo.chart',
    flex: 1,
    layout: 'hbox',
    slug: 'portcallKPIsCargo',
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
                    itemId: 'cargoChart',
                    type: 'MSArea',
                    renderAt: 'chart-container',
                    width: 840,
                    height: 520,
                    itemId: 'cargoChart',
                    // bind: {
                    //     dataSource: '{cargoUrl}'
                    // },
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
            cls: 'a-kpis-card',
            width: 420,
            items: [
                {
                    xtype: 'abraxa.formlist',
                    cls: 'a-portcall-data a-cargo-data a-kpis-cargoes',
                    bind: {
                        store: '{cargoesTotal}',
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                recordIndex: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        if (record) {
                                            let store = record.store;
                                            return store.indexOf(record);
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'div',
                        bind: {
                            cls: 'a-item a-item-cargo {record.days == 0 ? "a-item-disabled":""}',
                            html: '<div class="a-cargo {record.days == 0 ? "c-grey":""}"><span class="text-truncate">Cargo {recordIndex + 1} - {record.quantity:number("0,000.###")} {record.unit} - {record.commodity}</span><span class="a-function a-function-sm function-{record.function}" title="{record.function}">{record.function_abbr}</span></div><div class="a-item-value">{record.days} <small>days</small></div>',
                        },
                    },
                },
                {
                    xtype: 'container',
                    docked: 'bottom',
                    cls: 'a-kpis-total',
                    // bind: {
                    //     hidden: '{activeBerth.selection.function == "Cargo operations" ? false : true}'
                    // },
                    layout: {
                        type: 'vbox',
                        align: 'right',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            html: '',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-total',
                            bind: {
                                html: '<div class="h5">TOTAL QUANTITY</div><div class="a-qty">{totalCargoOps}</div>',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
