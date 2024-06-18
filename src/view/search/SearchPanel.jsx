Ext.define('Abraxa.view.search.SearchPanel', {
    extend: 'Ext.Dialog',
    xtype: 'search.panel',
    ui: 'slide-search',
    cls: 'border-radius a-bgr-white a-global-search',
    width: 640,
    maxHeight: '92%',
    top: 32,
    left: 0,
    right: 0,
    scrollable: 'y',
    closable: true,
    header: false,
    hideOnMaskTap: true,
    bodyPadding: 0,
    id: 'searchPanel',
    viewModel: {
        storeLoaded: false,
        stores: {
            vesselsStore: {
                type: 'vessel',
            },
            portsStore: {
                type: 'port',
            },
            berths: {
                type: 'berth',
            },
            commoditiesStore: {
                type: 'commodity',
            },
            terminals: {
                type: 'port.terminals',
                autoLoad: false,
            },
        },

        formulas: {
            vesselsCount: {
                bind: {
                    bindTo: '{vesselsStore}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        return store.getCount().toString();
                    }
                    return '0';
                },
            },
            portsCount: {
                bind: {
                    bindTo: '{portsStore}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        return store.getCount().toString();
                    }
                    return '0';
                },
            },
            berthsCount: {
                bind: {
                    bindTo: '{berths}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        return store.getCount().toString();
                    }
                    return '0';
                },
            },
            commoditiesCount: {
                bind: {
                    bindTo: '{commoditiesStore}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        return store.getCount().toString();
                    }
                    return '0';
                },
            },
        },
    },
    items: [
        // Search input
        {
            docked: 'top',
            xtype: 'searchfield',
            ui: 'field-xl no-border classic',
            itemId: 'searchField',
            cls: 'a-field-icon icon-search vessel_combo_create',
            margin: '12 8',
            label: false,
            placeholder: 'Search vessels, berths, ports, commodities',
            listeners: {
                painted: function (me) {
                    me.focus();
                },
                change: function (me, newValue, oldValue, eOpts) {
                    var searchTermLength = parseInt(newValue.length);

                    // Stores
                    if (searchTermLength > 2) {
                        Ext.ComponentQuery.query('#emptySearchText')[0].setHidden(true);
                        Ext.ComponentQuery.query('#searchResultsContainerItemId')[0].setHidden(false);

                        // Vessels
                        this.upVM().get('vesselsStore').getProxy().extraParams = {
                            query: newValue,
                        };
                        this.upVM()
                            .get('vesselsStore')
                            .load({
                                params: {
                                    query: newValue,
                                },
                                //callback: function(records, operation, success) {}
                            });

                        // Ports
                        this.upVM().get('portsStore').getProxy().extraParams = {
                            query: newValue,
                        };
                        this.upVM()
                            .get('portsStore')
                            .load({
                                params: {
                                    query: newValue,
                                },
                                //callback: function(records, operation, success) {}
                            });

                        // Berths
                        this.upVM().get('berths').getProxy().extraParams = {
                            query: newValue,
                        };
                        this.upVM()
                            .get('berths')
                            .load({
                                params: {
                                    query: newValue,
                                },
                            });

                        // Commodities
                        this.upVM().get('commoditiesStore').getProxy().extraParams = {
                            query: newValue,
                        };
                        this.upVM()
                            .get('commoditiesStore')
                            .load({
                                params: {
                                    query: newValue,
                                },
                            });
                    } else {
                        Ext.ComponentQuery.query('#vesselComponentItemId')[0].getStore().removeAll();
                        Ext.ComponentQuery.query('#portComponentItemId')[0].getStore().removeAll();
                        Ext.ComponentQuery.query('#berthsComponentItemId')[0].getStore().removeAll();
                        Ext.ComponentQuery.query('#commodityComponentItemId')[0].getStore().removeAll();
                        Ext.ComponentQuery.query('#searchResultsContainerItemId')[0].setHidden(true);
                        Ext.ComponentQuery.query('#emptySearchText')[0].setHidden(false);
                    }
                },
            },
        },

        // Results container
        {
            xtype: 'container',
            cls: 'a-search-results',
            itemId: 'searchResultsContainerItemId',
            hidden: true,
            hideMode: 'display',
            padding: 24,
            items: [
                // VESSELS
                {
                    xtype: 'container',
                    cls: 'a-search-header mt-0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'container',
                            bind: {
                                html: '<div>Vessels <span class="a-count">({vesselsCount})</span></div>',
                            },
                        },
                    ],
                },
                {
                    // Vessels Component
                    xtype: 'abraxa.componentdataview',
                    itemId: 'vesselComponentItemId',
                    emptyText: true,
                    bind: {
                        store: {
                            bindTo: '{vesselsStore}',
                            deep: true,
                        },
                    },
                    ripple: true,
                    itemRipple: true,
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                vesselType: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        if (record && record.get('general_type_id')) {
                                            return '(' + record.get('general_type').name + ')';
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                            },
                        }, // enable per-item record binding
                        items: [
                            {
                                xtype: 'container',
                                style: {
                                    cursor: 'pointer',
                                },
                                bind: {
                                    html: '<div class="combo-item combo_vessel a-verification a-verified" data-vesselimo="{record.imo}"><div class="sm-icon"><i class="md-icon-outlined md-18">directions_boat</i></div><label class="sm-type">IMO: {record.imo} {vesselType} </label><div class="sm-value hbox">{record.name}<i class="md-icon-outlined {record.compliance ? "a-verification-icon" : ""} ml-2 fs-16"></i></div></div>',
                                    record: '{record}',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: '.combo_vessel',
                                        fn: function (item) {
                                            var me = this;
                                            var cmp = me.component;
                                            var record = cmp.getBind().record.lastValue;
                                            var id = record.get('id');
                                            if (id) {
                                                Abraxa.getApplication()
                                                    .getController('AbraxaController')
                                                    .showVesselDialog(id);
                                            }
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },

                // PORTS
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    cls: 'a-search-header',
                    bind: {
                        html: '<div>Ports <span class="a-count">({portsCount})</span></div>',
                    },
                },
                {
                    // Ports Component
                    xtype: 'abraxa.componentdataview',
                    itemId: 'portComponentItemId',
                    emptyText: true,
                    bind: {
                        store: {
                            bindTo: '{portsStore}',
                            deep: true,
                        },
                    },
                    ripple: true,
                    itemRipple: true,
                    itemConfig: {
                        viewModel: true, // enable per-item record binding
                        items: [
                            {
                                xtype: 'container',
                                style: {
                                    cursor: 'pointer',
                                },
                                bind: {
                                    html: '<div class="combo-item combo_port" data-portid="{record.id}"><div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div><label class="sm-type">{record.country}</label><div class="sm-value">{record.port_name}</div></div>',
                                    record: '{record}',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: '.combo_port',
                                        fn: function (item) {
                                            var me = this;
                                            var cmp = me.component;
                                            var record = cmp.getBind().record.lastValue;
                                            var portId = record.get('id');
                                            if (portId) {
                                                Abraxa.getApplication()
                                                    .getController('AbraxaController')
                                                    .showPortDialogById(portId);
                                            }
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },

                // BERTHS
                {
                    xtype: 'container',
                    cls: 'a-search-header mt-0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'container',
                            bind: {
                                html: '<div class="">Berths <span class="a-count">({berthsCount})</span></div>',
                            },
                        },
                    ],
                },
                {
                    // Berths Component
                    xtype: 'abraxa.componentdataview',
                    emptyText: true,
                    itemId: 'berthsComponentItemId',
                    bind: {
                        store: {
                            bindTo: '{berths}',
                            deep: true,
                        },
                    },
                    ripple: true,
                    itemRipple: true,
                    itemConfig: {
                        viewModel: true, // enable per-item record binding
                        items: [
                            {
                                xtype: 'container',
                                bind: {
                                    html: '<div class="combo-item combo_berth" data-berthid="{record.id}" data-portid="{record.port_id}"><div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div><label class="sm-type">{record.port_name}</label><div class="sm-value"><span class="berth_name">{record.name}</span></div></div>',
                                    record: '{record}',
                                },
                            },
                        ],
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: '.combo_berth',
                                fn: function (item) {
                                    var me = this;
                                    // var MAIN = Ext.ComponentQuery.query('#mainleftmenuSlidepanelSearchId')[0];
                                    // var vm = MAIN.getViewModel();
                                    var record = me.component.getViewModel().getData().record;
                                    var bertId = record.id;
                                    if (record) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showBerthDialogById(bertId);
                                    }
                                },
                            },
                        },
                    },
                },

                // COMMODITIES
                {
                    xtype: 'container',
                    cls: 'a-search-header mt-0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'container',
                            bind: {
                                html: '<div>Commodities <span class="a-count">({commoditiesCount})</span></div>',
                            },
                        },
                    ],
                },
                {
                    // Commodity Component
                    xtype: 'abraxa.componentdataview',
                    itemId: 'commodityComponentItemId',
                    emptyText: true,
                    bind: {
                        store: {
                            bindTo: '{commoditiesStore}',
                            deep: true,
                        },
                    },
                    ripple: true,
                    itemRipple: true,
                    itemConfig: {
                        viewModel: true, // enable per-item record binding
                        items: [
                            {
                                xtype: 'container',
                                style: {
                                    cursor: 'pointer',
                                },
                                bind: {
                                    html: '<div class="combo-item element_commodity" data-commodityid="{record.id}"><div class="sm-icon"><i class="md-icon-outlined md-18">view_agenda</i></div><label class="sm-type">{record.type}</label><div class="sm-value">{record.name}</div></div>',
                                    record: '{record}',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: '.element_commodity',
                                        fn: function (item) {
                                            var me = this;
                                            var cmp = me.component;
                                            var record = cmp.getBind().record.lastValue;

                                            Abraxa.Global.showCommodityDialog(record);
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        },

        // Empty text on initial loading
        {
            xtype: 'container',
            cls: 'a-search-no-results',
            itemId: 'emptySearchText',
            // html: 'Start searching to get results ...'
        },
    ],
    listeners: {
        hide: function () {
            this.down('#searchField').clearValue();
        },
    },
});
