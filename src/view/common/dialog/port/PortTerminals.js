Ext.define('Abraxa.view.common.dialog.port.PortTerminals', {
    extend: 'Ext.Container',
    xtype: 'port.dialog.terminals',
    itemId: 'portTerminalssMainContainerItemId',
    layout: {
        type: 'card',
        animation: 'slide',
    },
    viewModel: {
        selectedTerminal: null,

        formulas: {
            getIsPortServed: function (get) {
                var me = this;
                return get('isPortServed');
            },
            parsedTypeName: {
                bind: {
                    bindTo: '{selectedTerminal.type}',
                    deep: true,
                },
                get: function (name) {
                    if (name) {
                        if (name == 'ro-ro') {
                            return 'Ro-Ro';
                        } else {
                            return Ext.String.capitalize(name);
                        }
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
        },
    },

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
                                    text: 'Terminal',
                                    iconCls: 'md-icon-add',
                                    ui: 'action small',
                                    handler: function (btn, e) {
                                        let me = this,
                                            dialog = me.up('dialog'),
                                            vm = dialog.getViewModel(),
                                            portRecord = vm.get('port'),
                                            terminals = vm.get('terminals');
                                        Ext.create('Abraxa.view.settings.library.ports.AddTerminal', {
                                            viewModel: {
                                                parent: btn.upVM(),
                                                data: {
                                                    editMode: false,
                                                    store: terminals,
                                                    terminal: Ext.create('Abraxa.model.common.Terminal', {
                                                        port_id: portRecord.get('id'),
                                                    }),
                                                },
                                            },
                                        }).show();
                                    },
                                    // handler: function (item, el, eOpts) {
                                    //     // Ext.ComponentQuery.query('#mainleftmenuSlidepanelSearchId')[0].getViewModel().set('storeLoaded', false);
                                    //     let me = this,
                                    //         dialog = this.up('dialog'),
                                    //         vm = dialog.getViewModel();
                                    //     portRecord = vm.get('port');
                                    //     let portId = portRecord.get('id'),
                                    //         portName = portRecord.get('name');
                                    //     Ext.create("Abraxa.view.common.port.AddEditTerminal", {
                                    //         title: 'Add Terminal',
                                    //         viewModel: {
                                    //             parent: vm,
                                    //             data: {
                                    //                 action: 'create',
                                    //                 portName: portName,
                                    //                 portId: portId,
                                    //                 port: portRecord,
                                    //                 terminal: Ext.create('Abraxa.model.common.Terminal', {
                                    //                     port_id: portId
                                    //                 })
                                    //             }
                                    //         }
                                    //     }).showBy(item);
                                    // }
                                },
                            ],
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'hovered-underline',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search terminals',
                            width: 280,
                            listeners: {
                                change: function (me, newValue, oldValue, eOpts) {
                                    let store = me.upVM().get('terminals');
                                    store.removeFilter(1000);
                                    if (newValue) {
                                        store.addFilter({
                                            id: 1000,
                                            property: 'name',
                                            operator: 'like',
                                            value: newValue,
                                        });
                                    } else {
                                        store.clearFilter();
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
                    xtype: 'common.port.terminalsgrid',
                },
            ],
        },
        {
            // TERMINAL DETAILS
            xtype: 'container',
            padding: '24 0 0 0',
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
                                            '#portTerminalssMainContainerItemId'
                                        )[0];
                                        mainContainer.setActiveItem(0);
                                        mainContainer.getViewModel().set('selectedTerminal', null);
                                    },
                                },
                                {
                                    xtype: 'div',
                                    bind: {
                                        html: '<h2>{selectedTerminal.name}</h2>',
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
                                    handler: function (me) {
                                        let vm = this.upVM(),
                                            portRecord = vm.get('port'),
                                            record = vm.get('selectedTerminal'),
                                            terminal = null,
                                            portId = portRecord.get('id'),
                                            terminals = vm.get('terminals');
                                        portName = portRecord.get('name');
                                        if (record.get('company_id') == 0) {
                                            terminal = Ext.create('Abraxa.model.common.Terminal', {
                                                port_id: portId,
                                                name: record.get('name'),
                                                parent_id: record.get('id'),
                                                id: record.get('id'),
                                                ...record.getData(),
                                            });
                                        } else {
                                            terminal = record;
                                        }

                                        Ext.create('Abraxa.view.settings.library.ports.AddTerminal', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    editMode: true,
                                                    store: terminals,
                                                    terminal: terminal,
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
                                        hidden: '{selectedTerminal.company_id ? false:true}',
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
                                    handler: function (button, el, data) {
                                        let me = this,
                                            record = me.upVM().get('selectedTerminal'),
                                            mainContainer = Ext.ComponentQuery.query(
                                                '#portTerminalssMainContainerItemId'
                                            )[0];
                                        store = me.upVM().get('terminals');

                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you want to delete this record?',
                                            function (btn) {
                                                if (btn === 'yes') {
                                                    store.remove(record);
                                                    store.sync({
                                                        success: function (batch) {
                                                            mainContainer.setActiveItem(0);
                                                            mainContainer.getViewModel().set('selectedTerminal', null);
                                                            Ext.toast('Record deleted', 1000);
                                                        },
                                                        failure: function (batch) {
                                                            Ext.Msg.alert(
                                                                'Something went wrong',
                                                                'Unable to delete this record!'
                                                            );
                                                        },
                                                    });
                                                }
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
                                                    enableToggle: true,
                                                    ui: 'decline alt loading',
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
                                            label: 'Location',
                                            bind: {
                                                value: '{selectedTerminal.location ? selectedTerminal.location :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Type',
                                            bind: {
                                                value: '{parsedTypeName}',
                                            },
                                        },
                                        {
                                            label: 'Storage capacity',
                                            bind: {
                                                value: '{selectedTerminal.storage_capacity ? selectedTerminal.storage_capacity :"---"}',
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
                                            label: 'ISPS code',
                                            bind: {
                                                value: '{selectedTerminal.isps_code ? selectedTerminal.isps_code :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Services',
                                            bind: {
                                                value: '{selectedTerminal.services ? selectedTerminal.services :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Equipment',
                                            bind: {
                                                value: '{selectedTerminal.equipment ? selectedTerminal.equipment :"---"}',
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
                                html: '<div class="hbox"><i class="material-icons mr-16">short_text</i><span class="c-grey">{(selectedTerminal.description ? selectedTerminal.description : "---")}</span></div>',
                            },
                        },
                    ],
                },
                // FOOTER
                {
                    xtype: 'container',
                    padding: '16 32',
                    cls: 'a-bt-100 fs-13',
                    docked: 'bottom',
                    bind: {
                        html: '<span class="c-grey-500">Last updated:</span> <span class="a-date">{selectedTerminal.updated_at:date("d M y - H:i")}</span>',
                    },
                },
            ],
        },
    ],
});
