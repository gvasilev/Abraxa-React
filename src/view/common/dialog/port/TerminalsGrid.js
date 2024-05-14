Ext.define('Abraxa.view.common.port.Terminals', {
    extend: 'Ext.grid.Grid',
    xtype: 'common.port.terminalsgrid',
    itemId: 'terminalsGridItemId',
    ui: 'transparent bordered grid-lg',
    cls: 'abraxa-grid a-terminals-grid',
    flex: 1,
    scrollable: 'y',
    emptyText: {
        xtype: 'container',
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-38 -31)"><g transform="translate(-796 -314)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(60 53)"><path d="M30.667,35.333a6.667,6.667,0,1,1,6.667-6.667A6.686,6.686,0,0,1,30.667,35.333Zm20-6c0-12.1-8.833-20.667-20-20.667s-20,8.567-20,20.667c0,7.8,6.5,18.133,20,30.467C44.167,47.467,50.667,37.133,50.667,29.333ZM30.667,2c14,0,26.667,10.733,26.667,27.333q0,16.6-26.667,39.333Q4.017,45.917,4,29.333C4,12.733,16.667,2,30.667,2Z" transform="translate(9.333 4.667)" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No terminals available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Terminal',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: function (item, el, eOpts) {
                    let dialog = this.up('dialog'),
                        vm = dialog.getViewModel(),
                        portRecord = vm.get('port'),
                        terminals = vm.get('terminals'),
                        portId = portRecord.get('id');
                    Ext.create('Abraxa.view.settings.library.ports.AddTerminal', {
                        viewModel: {
                            parent: dialog.upVM(),
                            data: {
                                editMode: false,
                                store: terminals,
                                terminal: Ext.create('Abraxa.model.common.Terminal', {
                                    port_id: portId,
                                }),
                            },
                        },
                    }).show();
                    // Ext.create("Abraxa.view.common.port.AddEditTerminal", {
                    //     title: 'Add Terminal',
                    //     viewModel: {
                    //         parent: vm,
                    //         data: {
                    //             action: 'create',
                    //             portName: portName,
                    //             portId: portId,
                    //             port: portRecord,
                    //             terminal: Ext.create('Abraxa.model.common.Terminal', {
                    //                 port_id: portId
                    //             })
                    //         }
                    //     }
                    // }).showBy(item);
                },
            },
        ],
    },
    // infinite: true,
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    bind: {
        store: '{terminals}',
    },
    itemConfig: {
        viewModel: true,
    },
    columns: [
        {
            text: 'Terminal',
            dataIndex: 'name',
            flex: 2,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val, record) {
                if (val) {
                    return (
                        '<div class="vbox"><i class="md-icon-outlined mr-12 fs-24">place</i><span class="fw-b c-blue">' +
                        val +
                        '</span></div>'
                    );
                }
            },
        },
        {
            text: 'Type',
            flex: 1,
            dataIndex: 'type',
            renderer: function (val) {
                if (val) {
                    if (val) {
                        if (val == 'ro-ro') {
                            return 'Ro-Ro';
                        } else {
                            return Ext.String.capitalize(val);
                        }
                    }
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'ISPS code',
            dataIndex: 'isps_code',
            flex: 1,
            renderer: function (val) {
                if (val) {
                    return val;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            minWidth: 110,
            maxWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        arrow: false,
                        // bind: {
                        //     hidden: '{nonEditable}'
                        // },
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        menu: {
                            cls: 'a-main-edit-menu',
                            width: 160,
                            ui: 'has-icons medium',
                            items: [
                                {
                                    text: 'Edit',
                                    iconCls: 'md-icon-outlined md-icon-edit',
                                    handler: function (button, el, data) {
                                        let me = this,
                                            vm = this.upVM(),
                                            portRecord = vm.get('port'),
                                            record = me.up('grid').getSelection(),
                                            terminal = null,
                                            portId = portRecord.get('id'),
                                            terminals = vm.get('terminals');
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
                                {
                                    text: 'Delete',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    ui: 'decline',
                                    separator: true,
                                    bind: {
                                        hidden: '{record.company_id ? false:true}',
                                    },
                                    handler: function (button, el, data) {
                                        let me = this,
                                            record = me.up('grid').getSelection(),
                                            store = me.upVM().get('terminals');
                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you would like to delete this record?',
                                            function (answer) {
                                                if (answer != 'yes') return;
                                                store.remove(record);
                                                store.sync({
                                                    success: function (batch) {
                                                        Ext.toast('Record deleted', 1000);
                                                    },
                                                    failure: function (batch) {
                                                        Ext.Msg.alert(
                                                            'Something went wrong',
                                                            'Unable to delete this record!'
                                                        );
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
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            let me = this,
                                record = me.up('grid').getSelection(),
                                mainContainer = Ext.ComponentQuery.query('#portTerminalssMainContainerItemId')[0];
                            mainContainer.setActiveItem(1);
                            mainContainer.getViewModel().set('selectedTerminal', record);
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        itemtap: function (grid, index, row, record, item, eOpts) {
            if (item.target.tagName != 'BUTTON') {
                var mainContainer = Ext.ComponentQuery.query('#portTerminalssMainContainerItemId')[0];
                mainContainer.setActiveItem(1);
                mainContainer.getViewModel().set('selectedTerminal', record);
            }
        },
    },
});