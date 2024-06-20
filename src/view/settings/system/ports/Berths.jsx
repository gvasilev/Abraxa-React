Ext.define('Abraxa.view.settings.system.ports.Berths', {
    extend: 'Ext.Container',
    xtype: 'settings.system.ports.berths',
    layout: 'hbox',
    items: [
        {
            xtype: 'abraxa.container',
            flex: 3,
            height: 'calc(100vh - 124px)',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'abraxa.titlebar',
                    bind: {
                        title: 'Berths for {settingsPortsGrid.selection.port_name}',
                    },
                    items: [
                        {
                            xtype: 'button',
                            align: 'left',
                            margin: '0 16 0 0',
                            iconCls: 'md-icon-keyboard-backspace',
                            ui: 'round default',
                            handler: function () {
                                Ext.ComponentQuery.query('settings\\.system\\.ports\\.berths')[0].setHidden(true);
                                Ext.ComponentQuery.query('#portServedList')[0].setHidden(false);
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'confirm raised round btn-normal',
                            //flex: 1,
                            align: 'right',
                            iconCls: 'md-icon-add',
                            text: 'Add Berth',
                            handler: function (item, el, eOpts) {
                                // Ext.ComponentQuery.query('#mainleftmenuSlidepanelSearchId')[0].getViewModel().set('storeLoaded', false);
                                let me = this,
                                    vm = this.lookupViewModel();
                                portRecord = vm.get('settingsPortsGrid.selection');

                                let portId = portRecord.get('port_id'),
                                    portName = portRecord.get('port_name');
                                var berthsStore = this.upVM().get('portBerthsStore');

                                Ext.create('Abraxa.view.common.port.AddEditBerth', {
                                    title: 'Add Berth',
                                    viewModel: {
                                        data: {
                                            selectedBerth: null,
                                            portId: portId,
                                            portName: portName,
                                            store: berthsStore,
                                            action: 'create',
                                        },
                                        portId: portId,
                                    },
                                }).show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'grid',
                    cls: 'abraxa-grid',
                    flex: 1,
                    // minHeight: 255,
                    emptyText: 'No records yet',
                    emptyTextDefaults: {
                        xtype: 'emptytext',
                        cls: 'a-empty-text',
                    },
                    viewModel: {
                        selectedBerth: null,
                    },

                    bind: {
                        store: {
                            bindTo: '{portBerthsStore}',
                            deep: true,
                        },
                    },
                    columns: [
                        {
                            text: 'Name',
                            dataIndex: 'name',
                            flex: 5,
                            cell: {
                                encodeHtml: false,
                            },
                            renderer: function (val, record) {
                                if (val) {
                                    return (
                                        '<div class="vbox c-blue fw-b"><i class="material-icons mr-8 fs-16">location_on</i>' +
                                        val +
                                        '</div>'
                                    );
                                }
                            },
                        },
                        {
                            text: 'UN Locator',
                            dataIndex: 'un_locator_code',
                            flex: 2,
                            cell: {
                                encodeHtml: false,
                            },
                            renderer: function (val, record) {
                                if (val) {
                                    return val;
                                }
                            },
                        },
                        {
                            text: 'Type',
                            dataIndex: 'type',
                            flex: 2,
                            cell: {
                                encodeHtml: false,
                            },
                            renderer: function (val, record) {
                                if (val) {
                                    return val;
                                }
                            },
                        },
                        {
                            text: 'Fuction',
                            dataIndex: 'function',
                            flex: 2,
                            cell: {
                                encodeHtml: false,
                            },
                            renderer: function (val, record) {
                                if (val) {
                                    return val;
                                }
                            },
                        },
                        {
                            text: 'Terminal/Region',
                            dataIndex: 'terminal_name',
                            flex: 2,
                            cell: {
                                encodeHtml: false,
                            },
                            renderer: function (val, record) {
                                if (val) {
                                    return val;
                                }
                            },
                        },
                        {
                            menuDisabled: true,
                            sortable: false,
                            hideable: false,
                            cell: {
                                cls: 'a-cell-actions a-actions-hover',
                                align: 'right',
                                encodeHtml: false,
                                tools: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-edit',
                                        ui: 'round tool-round-md',
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
                                            var me = this,
                                                vm = this.upVM(),
                                                port = vm.get('port'),
                                                record = vm.get('selectedBerth'),
                                                portId = port.get('id'),
                                                portName = port.get('name');
                                            if (record.get('company_id') == 0) {
                                                let recordClone = record.clone(null),
                                                    recordData = recordClone.getData();
                                                delete recordData['id'];
                                                berth = new Abraxa.model.common.Berth(Object.assign({}, recordData));
                                                berth.set('parent_id', record.get('id'));
                                            } else {
                                                berth = record;
                                            }

                                            Ext.create('Abraxa.view.common.port.AddEditBerth', {
                                                title: 'Edit Berth',
                                                viewModel: {
                                                    parent: vm,
                                                    data: {
                                                        selectedBerth: record,
                                                        portId: portId,
                                                        portName: portName,
                                                        action: 'edit',
                                                    },
                                                },
                                            }).show();
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-delete',
                                        ui: 'round tool-round-md',
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
                                            var me = this,
                                                vm = this.upVM(),
                                                selectedRow = vm.get('selectedBerth'),
                                                store = mv.get('berths');

                                            Ext.Msg.confirm(
                                                'Delete',
                                                'Do you want to delete this record?',
                                                function (btn) {
                                                    if (btn === 'yes') {
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
                                                    }
                                                }
                                            );
                                        },
                                    },
                                ],
                            },
                        },
                    ],

                    listeners: {
                        itemtap: function (grid, index, target, record, event) {
                            var me = this;
                            var record = me.getSelection();
                            this.getViewModel().set('selectedBerth', record);
                        },
                    },
                },
            ],
        },
    ],
});
