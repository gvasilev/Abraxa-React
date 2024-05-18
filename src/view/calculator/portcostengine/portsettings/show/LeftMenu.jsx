import '../../portsettings/show/_Page.jsx';
Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.LeftMenu', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.leftmenu',
    // layout: {
    //     type: 'vbox',
    //     align: 'stretch'
    // },
    scrollable: true,
    width: 320,
    cls: 'a-portcost-engine-left-menu',
    padding: '16 0',
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 64,
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            align: 'left',
                            iconCls: 'md-icon-keyboard-backspace',
                            ui: 'round default',
                            margin: '0 12 0 0',
                            handler: function (me) {
                                me.upVM().set('pageXtype', 'calculator.portcostengine.portsettings.index.page');
                                let grid = Ext.ComponentQuery.query(
                                    'calculator\\.portcostengine\\.portsettings\\.index\\.grid'
                                )[0];
                                grid.deselectAll();

                                let priceBooksList = Ext.ComponentQuery.query('list[reference=priceBooksList]')[0];
                                priceBooksList.deselectAll();

                                let tariffTablesList = Ext.ComponentQuery.query('list[reference=tariffTablesList]')[0];
                                tariffTablesList.deselectAll();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                        {
                            xtype: 'title',
                            bind: {
                                title: '{calculatorPortSettingsGrid.selection.name}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading',
                            padding: '0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Nomenclatures</h5>',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-menu-list calculator_list',
                            listId: 'nomenclatures',
                            reference: 'nomenclaturesList',
                            calculatorCardIndex: 0,
                            bind: {
                                store: '{calcnomenclature}',
                            },
                            selectable: {
                                deselectable: false,
                            },
                            itemConfig: {
                                viewModel: {},
                                cls: 'a-item',
                                xtype: 'container',
                                items: [
                                    {
                                        layout: {
                                            type: 'hbox',
                                        },
                                        bind: {
                                            html: '<div class="hbox"><i class="a-icon-dot">•</i><span style="text-transform: capitalize">{record.type}</span></div>',
                                            cls: 'a-tab',
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function (me, selection) {
                                    me.upVM().set(
                                        'subpageXtype',
                                        'calculator.portcostengine.portsettings.show.nomenclatures.nomenclaturetree'
                                    );
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading',
                            padding: '0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Offer data fields</h5>',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-menu-list calculator_list',
                            listId: 'calcdatafields',
                            reference: 'calcDataFieldsList',
                            calculatorCardIndex: 1,
                            height: 400,
                            infinite: true,
                            variableHeights: true,
                            itemsFocusable: true,
                            bind: {
                                store: '{calcdatafield}',
                            },
                            selectable: {
                                deselectable: false,
                            },
                            plugins: {
                                sortablelist: true,
                            },
                            itemConfig: {
                                viewModel: {},
                                cls: 'a-item x-list-sortablehandle grabbable',
                                xtype: 'container',
                                items: [
                                    {
                                        layout: {
                                            type: 'hbox',
                                        },
                                        bind: {
                                            html: '<div class="hbox"><i class="md-icon-outlined fs-16 cursor-drag" style="margin-right: 10px;">drag_indicator</i><span class="a-badge-clc">{record.slug}</span>{record.label}</div>',
                                            cls: 'a-tab',
                                        },
                                    },
                                ],
                                getRecordIndex: function () {
                                    return this.up('list').getStore().indexOf(this.upVM().get('record'));
                                },
                            },
                            onRowDrag: function (list, row, newIndex) {
                                let store = list.getStore();

                                store.getProxy().setBatchActions(true);
                                store.getProxy().setAppendId(false);
                                store.getProxy().setUrl(Env.ApiEndpoint + 'pc/${portSettingsId}/fields/orders');
                                store.getProxy().getWriter().setRootProperty('data');

                                store.each(function (val, index) {
                                    val.set('order', index + 1);
                                    val.dirty = true;
                                    store.addSorted(val);
                                });

                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated');
                                    },
                                });

                                store.getProxy().setBatchActions(false);
                                store.getProxy().setAppendId(true);
                                store.getProxy().setUrl(Env.ApiEndpoint + 'pc/${portSettingsId}/fields');
                                store.getProxy().getWriter().setRootProperty(null);
                            },
                            listeners: {
                                childtap: function (me) {
                                    me.upVM().set(
                                        'subpageXtype',
                                        'calculator.portcostengine.portsettings.show.datafields.show.subpage'
                                    );

                                    // Resets error div on data field change
                                    if (Ext.ComponentQuery.query('container[reference=numberForm]')[0]) {
                                        Ext.ComponentQuery.query('container[reference=numberForm]')[0]
                                            .down('form\\.error')
                                            .hide()
                                            .removeCls('error');
                                    }

                                    if (Ext.ComponentQuery.query('container[reference=choiceForm]')[0]) {
                                        Ext.ComponentQuery.query('container[reference=choiceForm]')[0]
                                            .down('form\\.error')
                                            .hide()
                                            .removeCls('error');
                                    }

                                    if (Ext.ComponentQuery.query('container[reference=complexForm]')[0]) {
                                        Ext.ComponentQuery.query('container[reference=complexForm]')[0]
                                            .down('form\\.error')
                                            .hide()
                                            .removeCls('error');
                                    }
                                },
                                initialize: function (list) {
                                    list.on('dragsort', 'onRowDrag', list);
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Data field',
                            margin: '0 16',
                            ui: 'normal small',
                            iconCls: 'md-icon-add',
                            handler: function (btn, e) {
                                let vm = this.upVM();
                                let dialog = Ext.create(
                                    'Abraxa.view.calculator.portcostengine.portsettings.show.DataFieldAddModal',
                                    {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                record: Ext.create('Abraxa.model.calculator.DataField', {}),
                                            },
                                        },
                                    }
                                );
                                dialog.show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading mt-16',
                            padding: '0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Global variables</h5>',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-menu-list calculator_list',
                            listId: 'calcglobalvariables',
                            reference: 'calcGlobalVariablesList',
                            calculatorCardIndex: 2,
                            bind: {
                                store: '{calcglobalvariable}',
                            },
                            selectable: {
                                deselectable: false,
                            },
                            itemConfig: {
                                viewModel: {},
                                cls: 'a-item',
                                xtype: 'container',
                                items: [
                                    {
                                        layout: {
                                            type: 'hbox',
                                        },
                                        bind: {
                                            html: '<div class="hbox"><span class="a-badge-clc">{record.slug}</span>{record.label}</div>',
                                            cls: 'a-tab',
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function (me) {
                                    me.upVM().set(
                                        'subpageXtype',
                                        'calculator.portcostengine.portsettings.show.globalvariables.show.subpage'
                                    );

                                    // Resets error div on variable change
                                    if (Ext.ComponentQuery.query('container[reference=globalVariableForm]')[0]) {
                                        Ext.ComponentQuery.query('container[reference=globalVariableForm]')[0]
                                            .down('form\\.error')
                                            .hide()
                                            .removeCls('error');
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Variable',
                            margin: '0 16',
                            ui: 'normal small',
                            iconCls: 'md-icon-add',
                            handler: function (btn, e) {
                                let vm = this.upVM();
                                let dialog = Ext.create(
                                    'Abraxa.view.calculator.portcostengine.portsettings.show.GlobalVariableAddModal',
                                    {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                record: Ext.create('Abraxa.model.calculator.Variable', {}),
                                            },
                                        },
                                    }
                                );
                                dialog.show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading mt-16',
                            padding: '0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Tariff tables</h5>',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-menu-list calculator_list tarifftable_list',
                            listId: 'tariffTables',
                            reference: 'tariffTablesList',
                            calculatorCardIndex: 2,
                            bind: {
                                store: '{tarifftable}',
                            },
                            selectable: {
                                deselectable: false,
                            },
                            itemConfig: {
                                viewModel: {},
                                cls: 'a-item',
                                xtype: 'container',
                                items: [
                                    {
                                        layout: {
                                            type: 'hbox',
                                        },
                                        bind: {
                                            html: '<div class="hbox"><span class="a-badge-clc">{record.slug}</span>{record.label}</div>',
                                            cls: 'a-tab',
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function (me) {
                                    me.upVM().set(
                                        'subpageXtype',
                                        'calculator.portcostengine.portsettings.show.tarifftables.grid'
                                    );
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Tariff table',
                            margin: '0 16',
                            ui: 'normal small',
                            iconCls: 'md-icon-add',
                            handler: function (btn, e) {
                                let vm = this.upVM();
                                let dialog = Ext.create(
                                    'Abraxa.view.calculator.portcostengine.portsettings.show.TariffTableAddModal',
                                    {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                record: Ext.create('Abraxa.model.calculator.TariffTable', {}),
                                            },
                                        },
                                    }
                                );
                                dialog.show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading mt-16',
                            padding: '0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Price books</h5>',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-menu-list calculator_list',
                            listId: 'priceBooks',
                            reference: 'priceBooksList',
                            bind: {
                                store: '{calcpricebook}',
                            },
                            selectable: {
                                deselectable: false,
                            },
                            itemConfig: {
                                viewModel: {},
                                cls: 'a-item',
                                xtype: 'container',
                                items: [
                                    {
                                        layout: {
                                            type: 'hbox',
                                        },
                                        bind: {
                                            html: '<div class="hbox"><i class="a-icon-dot">•</i><span>{record.name} ({record.serviceCount})</span></div>',
                                            cls: 'a-tab',
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function (me) {
                                    me.upVM().set(
                                        'subpageXtype',
                                        'calculator.portcostengine.portsettings.show.pricebooks.show.subpage'
                                    );

                                    // Resets error div on price book change
                                    if (Ext.ComponentQuery.query('container[reference=priceBookForm]')[0]) {
                                        Ext.ComponentQuery.query('container[reference=priceBookForm]')[0]
                                            .down('form\\.error')
                                            .hide()
                                            .removeCls('error');
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Price book',
                            margin: '0 16',
                            ui: 'normal small',
                            iconCls: 'md-icon-add',
                            handler: function (btn, e) {
                                let vm = this.upVM();
                                let dialog = Ext.create(
                                    'Abraxa.view.calculator.portcostengine.portsettings.show.PriceBookAddModal',
                                    {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                record: Ext.create('Abraxa.model.calculator.PriceBook', {}),
                                            },
                                        },
                                    }
                                );
                                dialog.show();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
