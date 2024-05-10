Ext.define('Abraxa.view.settings.library.ports.TerminalsRightCard', {
    extend: 'Ext.Container',
    xtype: 'settings.library.terminals.right.card',
    cls: 'a-right-container',
    hidden: true,
    itemId: 'terminalRightCard',
    // bind: {
    //     hidden: '{terminalsGrid.selection ? false : true}',
    // },
    // viewModel: {
    //     stores: {
    //         terminalWorkingTimes: {
    //             source: '{terminalsGrid.selection.working_times}',
    //         },
    //         terminalPortServices: {
    //             source: '{terminalsGrid.selection.port_services}',
    //         }
    //     },
    // },
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">warehouse</i></div>{terminalsGrid.selection.name}',
                    },
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
                            iconCls: 'md-icon-outlined md-icon-edit',
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
                            slug: 'settingsLibraryTerminal',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{terminalsGrid.selection.company_id ? true : false}',
                            },
                            handler: function (btn, e) {
                                let me = this,
                                    record = me.upVM().get('terminalsGrid.selection'),
                                    currentUser = Ext.Viewport.getViewModel().get('currentUser'),
                                    port = me.upVM().get('portsServerGrid.selection');
                                let recordData = record.getData();
                                delete recordData['id'];
                                let newRecord = new Abraxa.model.common.Terminal(Object.assign({}, recordData));
                                newRecord.set('port_id', port.get('port_id'));
                                newRecord.set('duplicates', record.get('id'));
                                newRecord.set('company_id', currentUser.get('current_company_id'));
                                Ext.create('Abraxa.view.settings.library.ports.AddTerminal', {
                                    viewModel: {
                                        parent: btn.upVM(),
                                        data: {
                                            editMode: false,
                                            store: btn.upVM().get('portsServerGrid.selection').terminals(),
                                            terminal: newRecord,
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'button',
                            testId: 'deleteTerminalBtntestIdRigthCard',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'settingsLibraryTerminalDelete',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{terminalsGrid.selection.company_id ? false:true}',
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
                                let vm = this.upVM(),
                                    store = vm.get('portsServerGrid.selection').terminals(),
                                    container = this.find('terminalRightCard'),
                                    portserveRecord = vm.get('portserveRecord'),
                                    currentUser = vm.get('currentUser'),
                                    record = vm.get('terminalsGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer === 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                                    portserveRecord.set('updated_at', new Date());
                                                    portserveRecord.save();
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function (batch) {
                                                    Ext.Msg.alert('Something went wrong', 'Could not delete record!');
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
                                            testId: 'deleteTerminalBtntestIdRigthCardConfirm',
                                            itemId: 'yes',
                                            ui: 'decline alt',
                                            text: 'Delete',
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                let record = this.upVM().get('terminalsGrid.selection'),
                                    grid = Ext.ComponentQuery.query('settings\\.library\\.terminals\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=settings\\.library\\.terminals\\.right\\.card]').hide();
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
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 24',
            layout: 'vbox',
            scrollable: 'y',
            flex: 1,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
                listeners: {
                    blur: function (me) {
                        let record = me.upVM().get('terminalsGrid.selection'),
                            portserveRecord = me.upVM().get('portserveRecord'),
                            currentUser = me.upVM().get('currentUser');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                    portserveRecord.set('updated_at', new Date());
                                    portserveRecord.save();
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
                slug: 'settingsLibraryTerminal',
                bind: {
                    permission: '{userPermissions}',
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    testId: 'terminalRightCardNameTestId',
                    label: false,
                    clearable: false,
                    bind: {
                        value: '{terminalsGrid.selection.name}',
                        ui: '{terminalsGrid.selection.company_id ? "field-xl no-border classic":"viewonly field-xl no-border classic"}',
                        readOnly: '{terminalsGrid.selection.company_id ? false : true}',
                    },
                    required: true,
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('terminalsGrid.selection'),
                                portserveRecord = me.upVM().get('portserveRecord'),
                                currentUser = me.upVM().get('currentUser');
                            if (record.dirty) {
                                record.save({
                                    success: function () {
                                        portserveRecord.set('updated_by_user', currentUser.getData());
                                        portserveRecord.set('updated_at', new Date());
                                        portserveRecord.save();
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalRightCardLocationTestId',
                    label: 'Location',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter location',
                    bind: {
                        value: '{terminalsGrid.selection.location}',
                        ui: '{terminalsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{terminalsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalRightCardIspsCodeTestId',
                    label: 'ISPS code',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter ISPS code',
                    bind: {
                        value: '{terminalsGrid.selection.isps_code}',
                        ui: '{terminalsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{terminalsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'terminalRightCardTypeComboTestId',
                    label: 'Type',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Choose type',
                    valueField: 'type',
                    displayField: 'text',
                    options: [
                        {
                            type: 'container',
                            text: 'Container',
                        },
                        {
                            type: 'liquid',
                            text: 'Liquid',
                        },
                        {
                            type: 'bulk',
                            text: 'Bulk',
                        },
                        {
                            type: 'ro-ro',
                            text: 'Ro-Ro',
                        },
                        {
                            type: 'multiple',
                            text: 'Multiple',
                        },
                    ],
                    bind: {
                        value: '{terminalsGrid.selection.type}',
                        ui: '{terminalsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{terminalsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalRightCardServicesTestId',
                    label: 'Services',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter services',
                    bind: {
                        value: '{terminalsGrid.selection.services}',
                        ui: '{terminalsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{terminalsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalRightCardStorageCapacityTestId',
                    label: 'Storage capacity',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter storage capacity',
                    bind: {
                        value: '{terminalsGrid.selection.storage_capacity}',
                        ui: '{terminalsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{terminalsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalRightCardEquipmentTestId',
                    label: 'Equipment',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter equipment',
                    bind: {
                        value: '{terminalsGrid.selection.equipment}',
                        ui: '{terminalsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{terminalsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24 mb-0',
                    html: '<hr>',
                },
                // DESCRIPTION
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    padding: 0,
                    items: [
                        {
                            xtype: 'title',
                            title: 'Description',
                        },
                    ],
                },
                {
                    xtype: 'textareafield',
                    testId: 'terminalRightCardDescriptionTestId',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    bind: {
                        value: '{terminalsGrid.selection.description}',
                    },
                },
                // {
                //     xtype: 'div',
                //     cls: 'divider divider-offset offset-x24 my-0',
                //     html: '<hr>'
                // },
                // // Working time
                // {
                //     xtype: 'container',
                //     items: [{
                //             xtype: 'container',
                //             cls: 'a-titlebar',
                //             padding: 0,
                //             items: [{
                //                 xtype: 'title',
                //                 title: 'Working time'
                //             }]
                //         },
                //         {
                //             xtype: 'div',
                //             hidden: true,
                //             bind: {
                //                 hidden: '{terminalWorkingTimes.count ? false:true}'
                //             },
                //             cls: 'a-list-titles',
                //         },
                //         {
                //             xtype: 'abraxa.formlist',
                //             bind: {
                //                 store: '{terminalWorkingTimes}'
                //             },
                //             itemConfig: {
                //                 viewModel: true,
                //                 xtype: 'container',
                //                 flex: 1,
                //                 layout: {
                //                     type: 'hbox',
                //                     align: 'middle'
                //                 },
                //                 items: [{
                //                         xtype: 'div',
                //                         cls: 'hbox',
                //                         flex: 1,
                //                         bind: {
                //                             html: '<div style="width:164px;"><span class="fs-13 c-blue-grey">{record.start_day:capitalize} - {record.end_day:capitalize}</span></div><div class="hbox"><i class="md-icon-outlined fs-18 c-light-grey mr-8">schedule</i><span class="">{record.start_time:date("H:i")} <span class="text-center c-blue-grey px-16">to</span> {record.end_time:date("H:i")}</span></div>',
                //                         }
                //                     },
                //                     {
                //                         xtype: 'button',
                //                         iconCls: 'md-icon-outlined md-icon-delete',
                //                         ui: 'round tool-round-md',
                //                         tooltip: {
                //                             anchorToTarget: true,
                //                             html: "Delete",
                //                             align: "bc-tc?",
                //                             showDelay: 0,
                //                             hideDelay: 0,
                //                             dismissDelay: 0,
                //                             allowOver: false,
                //                             closeAction: 'destroy'
                //                         },
                //                         handler: function (me) {
                //                             let record = me.upVM().get('record'),
                //                                 portserveRecord = me.upVM().get('portserveRecord'),
                //                                 currentUser = me.upVM().get('currentUser'),
                //                                 store = me.upVM().get('terminalWorkingTimes');
                //                             Ext.Msg.confirm(
                //                                 'Delete',
                //                                 'Are you sure you would like to delete this row?',
                //                                 function (answer) {
                //                                     if (answer != 'yes') return;
                //                                     store.remove(record);
                //                                     store.sync({
                //                                         success: function (err, msg) {
                //                                             portserveRecord.set('updated_by', currentUser.getData());
                //                                             portserveRecord.set('updated_at', new Date());
                //                                             portserveRecord.save();
                //                                             Ext.toast('Record updated', 1000);
                //                                         },
                //                                         failure: function (batch) {
                //                                             var response = batch.operations[0].error.response.responseJson;
                //                                             Ext.Msg.alert('Something went wrong', response.message);
                //                                         }
                //                                     });
                //                                 }, this, [{
                //                                     xtype: 'button',
                //                                     itemId: 'no',
                //                                     margin: '0 8 0 0',
                //                                     text: 'Cancel'
                //                                 }, {
                //                                     xtype: 'button',
                //                                     itemId: 'yes',
                //                                     ui: 'decline alt',
                //                                     text: 'Delete'
                //                                 }]
                //                             );
                //                         }
                //                     }
                //                 ]
                //             }
                //         },
                //         {
                //             xtype: 'button',
                //             text: 'Add working time',
                //             ui: 'normal small',
                //             margin: '8 0',
                //             height: 28,
                //             bind: {
                //                 hidden: '{terminalsGrid.selection.company_id ? false:true}'
                //             },
                //             iconCls: 'md-icon-add',
                //             handler: function (btn, e) {
                //                 Ext.create('Abraxa.view.settings.library.ports.CreateEditWorkingTime', {
                //                     viewModel: {
                //                         parent: btn.upVM(),
                //                         data: {
                //                             editMode: false,
                //                             store: btn.upVM().get('terminalWorkingTimes'),
                //                             workingTime: Ext.create('Abraxa.model.settings.port.WorkingTime', {
                //                                 start_day: 'monday',
                //                                 end_day: 'monday',
                //                                 port_id: btn.upVM().get('portsServerGrid.selection').get('port_id'),
                //                                 workable_id: btn.upVM().get('terminalsGrid.selection').get('id'),
                //                                 workable_type: 'App\\Models\\Port\\Terminal'
                //                             })
                //                         },
                //                     }
                //                 }).show();
                //             }
                //         }
                //     ]
                // },
                // {
                //     xtype: 'div',
                //     cls: 'divider divider-offset offset-x24 mb-0',
                //     html: '<hr>'
                // },
                // // Services
                // {
                //     xtype: 'container',
                //     items: [{
                //             xtype: 'container',
                //             cls: 'a-titlebar',
                //             padding: 0,
                //             items: [{
                //                 xtype: 'title',
                //                 title: 'Services'
                //             }]
                //         },
                //         {
                //             xtype: 'div',
                //             hidden: true,
                //             bind: {
                //                 hidden: '{terminalPortServices.count ? false:true}'
                //             }
                //         },
                //         {
                //             xtype: 'abraxa.formlist',
                //             bind: {
                //                 store: '{terminalPortServices}'
                //             },
                //             itemConfig: {
                //                 viewModel: true,
                //                 xtype: 'container',
                //                 flex: 1,
                //                 layout: {
                //                     type: 'hbox',
                //                     align: 'middle'
                //                 },
                //                 items: [{
                //                         xtype: 'div',
                //                         flex: 1,
                //                         cls: 'hbox',
                //                         bind: {
                //                             html: '<i class="md-icon md-18 c-green">check</i><span class="ml-12">{record.service_name}</span>',
                //                         }
                //                     },
                //                     {
                //                         xtype: 'button',
                //                         iconCls: 'md-icon-outlined md-icon-delete',
                //                         ui: 'round tool-round-md',
                //                         tooltip: {
                //                             anchorToTarget: true,
                //                             html: "Delete",
                //                             align: "bc-tc?",
                //                             showDelay: 0,
                //                             hideDelay: 0,
                //                             dismissDelay: 0,
                //                             allowOver: false,
                //                             closeAction: 'destroy'
                //                         },
                //                         handler: function (me) {
                //                             let record = me.upVM().get('record'),
                //                                 portserveRecord = me.upVM().get('portserveRecord'),
                //                                 currentUser = me.upVM().get('currentUser'),
                //                                 store = me.upVM().get('terminalPortServices');
                //                             Ext.Msg.confirm(
                //                                 'Delete',
                //                                 'Are you sure you would like to delete this row?',
                //                                 function (answer) {
                //                                     if (answer != 'yes') return;
                //                                     store.remove(record);
                //                                     store.sync({
                //                                         success: function (err, msg) {
                //                                             portserveRecord.set('updated_by', currentUser.getData());
                //                                             portserveRecord.set('updated_at', new Date());
                //                                             portserveRecord.save();
                //                                             Ext.toast('Record updated', 1000);
                //                                         },
                //                                         failure: function (batch) {
                //                                             var response = batch.operations[0].error.response.responseJson;
                //                                             Ext.Msg.alert('Something went wrong', response.message);
                //                                         }
                //                                     });
                //                                 }, this, [{
                //                                     xtype: 'button',
                //                                     itemId: 'no',
                //                                     margin: '0 8 0 0',
                //                                     text: 'Cancel'
                //                                 }, {
                //                                     xtype: 'button',
                //                                     itemId: 'yes',
                //                                     ui: 'decline alt',
                //                                     text: 'Delete'
                //                                 }]
                //                             );
                //                         }
                //                     }
                //                 ]
                //             },
                //         },
                //         {
                //             xtype: 'button',
                //             text: 'Add services',
                //             ui: 'normal small',
                //             margin: '8 0 16 0',
                //             bind: {
                //                 hidden: '{terminalsGrid.selection.company_id ? false:true}'
                //             },
                //             height: 28,
                //             iconCls: 'md-icon-add',
                //             handler: function (btn, e) {
                //                 Ext.create('Abraxa.view.settings.library.ports.CreateEditPortServices', {
                //                     viewModel: {
                //                         parent: btn.upVM(),
                //                         data: {
                //                             editMode: false,
                //                             store: btn.upVM().get('terminalPortServices'),
                //                             portService: Ext.create('Abraxa.model.settings.port.PortService', {
                //                                 port_id: btn.upVM().get('portsServerGrid.selection').get('port_id'),
                //                                 serviceable_id: btn.upVM().get('terminalsGrid.selection').get('id'),
                //                                 serviceable_type: 'App\\Models\\Port\\Terminal'
                //                             })
                //                         },
                //                     }
                //                 }).show();
                //             }
                //         }
                //     ]
                // }
            ],
        },
    ],
});
