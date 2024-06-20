Ext.define('Abraxa.view.common.port.AddEditTerminal', {
    xtype: 'common.addEditTerminalToPortForm',
    extend: 'Ext.Dialog',
    manageBorders: false,
    ui: 'type3 dialog-md',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',

    title: 'Terminal',
    closable: true,
    centered: true,
    width: 640,
    minHeight: 640,
    layout: {
        type: 'vbox',
        // align: 'stretch'
    },
    action: 'create', // create, edit

    scrollable: true,

    defaults: {
        labelWidth: 60,
        labelSeparator: '',
    },
    items: [
        {
            xtype: 'formpanel',
            flex: 1,
            margin: 0,
            padding: 0,
            items: [
                // GENERAL DATA
                {
                    xtype: 'container',
                    cls: 'a-form flex-wrap',
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        labelAlign: 'top',
                        margin: '12 0',
                        ui: '',
                        pack: 'space-between',
                    },

                    items: [
                        {
                            // Name
                            xtype: 'textfield',
                            cls: 'col-12',
                            margin: '0',
                            clearable: false,
                            ui: 'field-xl no-border classic',
                            name: 'name',
                            placeholder: 'Terminal name',
                            listeners: {
                                painted: function (me) {
                                    me.focus();
                                },
                            },
                            bind: {
                                value: '{terminal.name}',
                            },
                            required: true,
                        },
                        // Port
                        // {
                        //     xtype: "port.combo",
                        //     cls: "col-6 pr-12 a-field-icon icon-port",
                        //     valueField: "port_id",
                        //     displayField: "port_name",
                        //     label: "Port ",
                        //     name: 'port_id',
                        //     required: true,
                        //     listeners: {
                        //         painted: function (combo, el, eOpts) {
                        //             var cmp = el.component;
                        //             var vm = cmp.upVM();
                        //             var portId = parseInt(vm.getData().portId);
                        //             var portName = vm.getData().portName;
                        //             if (portId) {
                        //                 var store = combo.getStore();
                        //                 store.proxy.extraParams = {
                        //                     query: portName
                        //                 };
                        //                 store.load();
                        //                 this.setValue(portId);
                        //                 this.setDisabled(true);
                        //             }
                        //         },
                        //     }
                        // },
                        {
                            xtype: 'textfield',
                            cls: 'col-6 pr-12 a-field-icon icon-short',
                            placeholder: 'Enter coordinates',
                            label: 'Location',
                            bind: {
                                value: '{terminal.location}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'col-6 pl-12 a-field-icon icon-short',
                            placeholder: 'Enter ISPS code',
                            label: 'ISPS code',
                            bind: {
                                value: '{terminal.isps_code}',
                            },
                        },
                        {
                            xtype: 'selectfield',
                            cls: 'col-6 pr-12 a-field-icon icon-short',
                            placeholder: 'Choose type',
                            label: 'Type',
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
                                value: '{terminal.type}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'col-6 pl-12 a-field-icon icon-short',
                            placeholder: 'Enter services',
                            label: 'Services',
                            bind: {
                                value: '{terminal.services}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'col-6 pr-12 a-field-icon icon-short',
                            placeholder: 'Enter storage capacity',
                            label: 'Storage capacity',
                            bind: {
                                value: '{terminal.storage_capacity}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'col-6 pl-12 a-field-icon icon-short',
                            placeholder: 'Enter equipment',
                            label: 'Equipment',
                            bind: {
                                value: '{terminal.equipment}',
                            },
                        },
                    ],
                },
                // DESCRIPTION
                {
                    xtype: 'div',
                    html: '<div class="h3">Description</div>',
                },
                {
                    xtype: 'textareafield',
                    ui: 'no-border classic',
                    cls: 'a-field-icon icon-short',
                    maxRows: 5,
                    name: 'description',
                    placeholder: 'Enter description',
                    bind: {
                        value: '{terminal.description}',
                    },
                },
            ],
        },
    ],

    buttons: [
        {
            text: 'Save',
            weight: 2,
            ui: 'action',
            handler: function () {
                let dialog = this.up('dialog'),
                    vm = dialog.upVM(),
                    form = dialog.down('formpanel'),
                    terminalStore = vm.get('terminals'),
                    createfromEdit = false,
                    mainContainer = Ext.ComponentQuery.query('#portTerminalssMainContainerItemId')[0],
                    terminal = vm.get('terminal'),
                    action = vm.getData().action;
                if (!Ext.isNumber(terminal.get('id'))) {
                    createfromEdit = true;
                }
                if (form.validate()) {
                    terminal.save({
                        success: function (record) {
                            if (action == 'create') {
                                terminalStore.add(record);
                                Ext.toast('Record created', 1000);
                            } else {
                                if (createfromEdit) {
                                    terminalStore.add(record);
                                    mainContainer.getViewModel().set('selectedTerminal', record);
                                }
                                terminalStore.load();
                                Ext.toast('Record updated', 1000);
                            }
                            let portcallView = Ext.ComponentQuery.query('[xtype=portcall]')[0];
                            if (portcallView) {
                                let vm2 = portcallView.getVM(),
                                    terminalsPortcall = vm2.get('terminals');
                                if (terminalsPortcall) {
                                    terminalsPortcall.reload();
                                }
                            }
                            dialog.destroy();
                        },
                    });
                }
            },
        },
        {
            text: 'Cancel',
            weight: 1,
            margin: '0 8 0 0',
            ui: 'default',
            handler: function () {
                var dialog = this.up('dialog');
                var vm = dialog.upVM();
                var store = vm.getData().store;
                store.rejectChanges();
                this.up('dialog').destroy();
            },
        },
    ],
});
