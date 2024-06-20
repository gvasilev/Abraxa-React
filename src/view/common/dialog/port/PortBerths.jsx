import './BerthsGrid';

Ext.define('Abraxa.view.common.dialog.port.PortBerths', {
    extend: 'Ext.Container',
    xtype: 'port.dialog.berths',
    itemId: 'portBerthsMainContainerItemId',
    layout: {
        type: 'card',
        animation: 'slide',
    },

    viewModel: {
        selectedBerth: null,

        formulas: {
            getIsPortServed: function (get) {
                var me = this;
                return get('isPortServed');
            },
            berthTypeParse: {
                bind: {
                    bindTo: '{selectedBerth.type}',
                    deep: true,
                },
                get: function (type) {
                    if (type) {
                        return Ext.String.capitalize(type);
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
        },
    },

    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    ui: 'transparent',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            padding: '0 32',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'Berth',
                                            iconCls: 'md-icon-add',
                                            ui: 'action small',
                                            handler: function (item, el, eOpts) {
                                                // Ext.ComponentQuery.query('#mainleftmenuSlidepanelSearchId')[0].getViewModel().set('storeLoaded', false);
                                                let me = this,
                                                    dialog = this.up('dialog'),
                                                    vm = dialog.getViewModel();
                                                portRecord = vm.get('port');
                                                let portId = portRecord.get('id'),
                                                    portName = portRecord.get('name');

                                                Ext.create('Abraxa.view.common.port.AddEditBerth', {
                                                    title: 'Add Berth',
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            selectedBerth: Ext.create('Abraxa.model.common.Berth', {
                                                                port_id: portId,
                                                            }),
                                                            portId: portId,
                                                            portName: portName,
                                                            action: 'create',
                                                        },
                                                    },
                                                }).show();
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'searchfield',
                                    ui: 'hovered-underline',
                                    cls: 'a-field-icon icon-search',
                                    placeholder: 'Search berths',
                                    width: 280,
                                    listeners: {
                                        change: function (me, newValue, oldValue, eOpts) {
                                            var grid = Ext.ComponentQuery.query('#portBerthsGridItemId')[0];
                                            let storeBerths = grid.getStore();
                                            storeBerths.setRemoteFilter(false);
                                            storeBerths.removeFilter(1000);

                                            if (newValue) {
                                                storeBerths.addFilter({
                                                    id: 1000,
                                                    property: 'berths_searchfield_index',
                                                    operator: 'like',
                                                    value: newValue,
                                                });
                                            } else {
                                                storeBerths.clearFilter();
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                },
                            ],
                        },
                        {
                            xtype: 'common.port.berthsgrid',
                        },
                    ],
                },
                {
                    // BERTH DETAILS
                    xtype: 'container',
                    items: [
                        // HEADER
                        {
                            xtype: 'container',
                            padding: '0 16 0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
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
                                            margin: '0 16 0 0',
                                            ui: 'round',
                                            iconCls: 'md-icon-keyboard-backspace',
                                            handler: function (btn, el, eOpts) {
                                                var mainContainer = Ext.ComponentQuery.query(
                                                    '#portBerthsMainContainerItemId'
                                                )[0];
                                                mainContainer.setActiveItem(0);
                                                mainContainer.getViewModel().set('selectedBerth', null);
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            bind: {
                                                html: '<h2>{selectedBerth.name}</h2>',
                                            },
                                        },
                                    ],
                                },

                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        // EDIT BUTTON
                                        {
                                            xtype: 'button',
                                            iconCls: 'md-icon-outlined md-icon-edit',
                                            ui: 'tool-md round',
                                            tooltip: {
                                                anchorToTarget: true,
                                                html: 'Edit',
                                                align: 'bc-tc?',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                            },
                                            handler: function (item, el, eOpts) {
                                                let me = this,
                                                    dialog = this.up('dialog'),
                                                    vm = dialog.getViewModel(),
                                                    portRecord = vm.get('port'),
                                                    portId = portRecord.get('id'),
                                                    portName = portRecord.get('name'),
                                                    record = this.upVM().get('selectedBerth');
                                                if (record.get('company_id') == 0) {
                                                    let recordClone = record.clone(null),
                                                        recordData = recordClone.getData();
                                                    delete recordData['id'];
                                                    berth = new Abraxa.model.common.Berth(
                                                        Object.assign({}, recordData)
                                                    );
                                                    berth.set('parent_id', record.get('id'));
                                                } else {
                                                    berth = record;
                                                }
                                                Ext.create('Abraxa.view.common.port.AddEditBerth', {
                                                    title: 'Edit Berth',
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            selectedBerth: berth,
                                                            portId: portId,
                                                            portName: portName,
                                                            action: 'edit',
                                                        },
                                                    },
                                                }).show();
                                            },
                                        },

                                        // DELETE BUTTON
                                        {
                                            xtype: 'button',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            ui: 'tool-md round',
                                            bind: {
                                                hidden: '{selectedBerth.company_id == 0 ?  true:false}',
                                            },
                                            tooltip: {
                                                anchorToTarget: true,
                                                html: 'Delete',
                                                align: 'bc-tc?',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                            },
                                            handler: function (item, el, eOpts) {
                                                let record = this.upVM().get('selectedBerth'),
                                                    store = this.upVM().get('berths');
                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you would like to delete this record?',
                                                    function (answer) {
                                                        if (answer != 'yes') return;
                                                        store.remove(selectedRow);
                                                        store.sync({
                                                            success: function (batch) {
                                                                var mainContainer = Ext.ComponentQuery.query(
                                                                    '#portBerthsMainContainerItemId'
                                                                )[0];
                                                                mainContainer.setActiveItem(0);
                                                                Ext.toast('Record deleted', 1000);
                                                            },
                                                        });
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ]
                                                );
                                            },
                                        },
                                    ],
                                },
                            ],
                        },

                        // BODY
                        {
                            xtype: 'container',
                            margin: '24 0 0 0',
                            padding: '0 32',
                            items: [
                                // FIRST ROW (General data)
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    cls: 'a-vessel-data',

                                    items: [
                                        {
                                            xtype: 'container',
                                            margin: '0 24 0 0',
                                            flex: 1,
                                            defaults: {
                                                xtype: 'displayfield',
                                                ui: 'default',
                                                padding: 8,
                                                labelAlign: 'left',
                                                bodyAlign: 'end',
                                                labelWidth: 'auto',
                                            },
                                            items: [
                                                {
                                                    label: 'Berth',
                                                    bind: {
                                                        value: '{selectedBerth.name}',
                                                    },
                                                },
                                                {
                                                    label: 'IMO',
                                                    bind: {
                                                        value: '{(selectedBerth.imo) ? selectedBerth.imo : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Type',
                                                    bind: {
                                                        value: '{berthTypeParse}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            margin: '0 0 0 24',
                                            flex: 1,
                                            defaults: {
                                                xtype: 'displayfield',
                                                ui: 'default',
                                                padding: 8,
                                                labelAlign: 'left',
                                                bodyAlign: 'end',
                                                labelWidth: 'auto',
                                            },
                                            items: [
                                                {
                                                    label: 'Terminal/Region',
                                                    bind: {
                                                        value: '{(selectedBerth.terminal_name) ? selectedBerth.terminal_name : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'UN Locator code',
                                                    bind: {
                                                        value: '{(selectedBerth.un_locator_code) ? selectedBerth.un_locator_code : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Function',
                                                    bind: {
                                                        value: '{(selectedBerth.function) ? selectedBerth.function : "---"}',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },

                                // RESTRICTIONS
                                {
                                    xtype: 'container',
                                    margin: '24 0 0 0',
                                    html: '<h2>Restrictions</h2>',
                                },

                                // FIRST ROW (Restrictions)
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    cls: 'a-vessel-data',

                                    items: [
                                        {
                                            xtype: 'container',
                                            margin: '0 24 0 0',
                                            flex: 1,
                                            defaults: {
                                                xtype: 'displayfield',
                                                ui: 'default',
                                                padding: 8,
                                                labelAlign: 'left',
                                                bodyAlign: 'end',
                                                labelWidth: 'auto',
                                            },
                                            items: [
                                                {
                                                    label: 'Draft',
                                                    bind: {
                                                        value: '{(selectedBerth.draft) ? selectedBerth.draft : "---"} {(selectedBerth.draft) ? "m" : ""}',
                                                    },
                                                },
                                                {
                                                    label: 'Beam',
                                                    bind: {
                                                        value: '{(selectedBerth.beam ? selectedBerth.beam : "---")} {(selectedBerth.beam ? "m" : "")}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            margin: '0 0 0 24',
                                            flex: 1,
                                            defaults: {
                                                xtype: 'displayfield',
                                                ui: 'default',
                                                padding: 8,
                                                labelAlign: 'left',
                                                bodyAlign: 'end',
                                                labelWidth: 'auto',
                                            },
                                            items: [
                                                {
                                                    label: 'Air Draft',
                                                    bind: {
                                                        value: '{(selectedBerth.air_draft ? selectedBerth.air_draft : "---")} {(selectedBerth.air_draft ? "m" : "")}',
                                                    },
                                                },
                                                {
                                                    label: 'LOA',
                                                    bind: {
                                                        value: '{(selectedBerth.loa ? selectedBerth.loa : "---")} {(selectedBerth.loa ? "m" : "")}',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },

                                // DESCRIPTION
                                {
                                    xtype: 'container',
                                    margin: '24 0 0 0',
                                    html: '<h2>Description</h2>',
                                },
                                {
                                    xtype: 'container',
                                    autoSize: true,
                                    bind: {
                                        html: '<div class="hbox"><i class="material-icons mr-16">short_text</i><span class="c-grey">{(selectedBerth.description ? selectedBerth.description : "---")}</span></div>',
                                    },
                                },
                            ],
                        },
                        // FOOTER
                        {
                            xtype: 'container',
                            padding: '16 32',
                            cls: 'a-bt-100',
                            docked: 'bottom',
                            bind: {
                                html: '<span class="c-grey-500">Last updated:</span> <span class="a-date">{selectedBerth.updated_at:date("d M y - H:i")}</span>',
                            },
                        },
                    ],
                },
            ],
        },
    },
});
