Ext.define('Abraxa.view.common.port.AddEditBerth', {
    xtype: 'common.addEditBerthToPortForm',
    itemId: 'addEditBerthToPortFormItemId',
    extend: 'Ext.Dialog',

    manageBorders: false,
    ui: 'type3 dialog-md',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',

    title: 'Berth',
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
                            placeholder: 'Berth name',
                            listeners: {
                                painted: function (me) {
                                    me.focus();
                                },
                            },
                            bind: {
                                value: '{selectedBerth.name}',
                            },
                            required: true,
                        },
                        {
                            // Port
                            xtype: 'port.combo',
                            cls: 'col-6 pr-12 a-field-icon icon-port',
                            valueField: 'port_id',
                            displayField: 'port_name',
                            label: 'Port ',
                            name: 'port_id',
                            reference: 'berthPortCombo',
                            required: true,
                            clearable: true,
                            bind: {
                                value: '{selectedBerth.port_id}',
                            },
                            listeners: {
                                painted: function (combo, el, eOpts) {
                                    var cmp = el.component;
                                    var vm = cmp.upVM();
                                    var portId = parseInt(vm.getData().portId);
                                    var portName = vm.getData().portName;
                                    if (portId) {
                                        this.setInputValue(portName);
                                        this.setDisabled(true);
                                    }
                                },
                                select: function (me, selection) {
                                    if (selection) {
                                        Ext.ComponentQuery.query('#terminalCombo')[0].clearValue();
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'port.terminals',
                            cls: 'col-6 pl-12 a-field-icon icon-short non-editable',
                            label: 'Terminal',
                            itemId: 'terminalCombo',
                            name: 'terminal',
                            bind: {
                                value: '{selectedBerth.terminal_id}',
                                store: '{terminals}',
                            },
                            listeners: {
                                beforequery: function (me) {
                                    let combo = me.combo,
                                        store = combo.getStore(),
                                        portSelection = this.upVM().get('berthPortCombo.selection');

                                    if (!store.autoLoad && portSelection) {
                                        if (!store.getProxy().extraParams.port_id) {
                                            store.getProxy().setExtraParams({
                                                port_id: portSelection.get('id'),
                                            });
                                            store.load();
                                        } else {
                                            if (store.getProxy().extraParams.port_id != portSelection.get('id')) {
                                                store.getProxy().setExtraParams({
                                                    port_id: portSelection.get('id'),
                                                });
                                                store.load();
                                            }
                                        }
                                    } else if (store.autoLoad && portSelection) {
                                        if (!store.getProxy().extraParams.port_id) {
                                            store.getProxy().setExtraParams({
                                                port_id: portSelection.get('id'),
                                            });
                                            store.load();
                                        } else {
                                            if (store.getProxy().extraParams.port_id != portSelection.get('id')) {
                                                store.getProxy().setExtraParams({
                                                    port_id: portSelection.get('id'),
                                                });
                                                store.load();
                                            }
                                        }
                                    }
                                    store.clearFilter();
                                },
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'col-6 pr-12 a-field-icon icon-short',
                            label: 'IMO',
                            name: 'imo',
                            placeholder: 'IMO number',
                            bind: {
                                value: '{selectedBerth.imo}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'col-6 pl-12 a-field-icon icon-short',
                            label: 'UN Locator code',
                            name: 'un_locator_code',
                            placeholder: AbraxaConstants.placeholders.emptyValue,
                            bind: {
                                value: '{selectedBerth.un_locator_code}',
                            },
                        },
                        {
                            xtype: 'selectfield',
                            cls: 'col-6 pr-12 a-field-icon icon-short non-editable',
                            label: 'Type',
                            name: 'type',
                            displayField: 'text',
                            valueField: 'value',
                            bind: {
                                value: '{selectedBerth.type}',
                            },
                            options: [
                                {
                                    text: 'Berth',
                                    value: 'berth',
                                },
                                {
                                    text: 'Buoy',
                                    value: 'buoy',
                                },
                                {
                                    text: 'Anchorage',
                                    value: 'anchorage',
                                },
                                {
                                    text: 'Jetty',
                                    value: 'jetty',
                                },
                            ],
                        },
                        {
                            xtype: 'selectfield',
                            label: 'Function',
                            name: 'function',
                            placeholder: 'Function',
                            valueField: 'id',
                            displayField: 'name',
                            cls: 'col-6 pl-12 a-field-icon icon-short non-editable',
                            store: {
                                type: 'berth.function',
                            },
                            bind: {
                                value: '{selectedBerth.function}',
                            },
                        },
                    ],
                },

                // ----------------------

                // RESTRICTIONS
                {
                    xtype: 'div',
                    html: '<div class="h3">Restrictions</div>',
                },

                {
                    xtype: 'container',
                    cls: 'a-form flex-wrap',
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        margin: '12 0',
                        pack: 'space-between',
                    },

                    items: [
                        {
                            xtype: 'container',
                            cls: 'col-6 pr-12',
                            layout: 'hbox',
                            defaults: {
                                ui: '',
                            },

                            items: [
                                {
                                    xtype: 'numberfield',
                                    maxLength: 15,
                                    cls: 'a-prepend a-field-icon icon-short',
                                    label: 'Draft',
                                    name: 'draft',
                                    placeholder: '00.00',
                                    labelAlign: 'top',
                                    clearable: false,
                                    bind: {
                                        value: '{selectedBerth.draft}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'no-border',
                                    cls: 'a-append',
                                    label: '',
                                    padding: '16 0 0 0',
                                    placeholder: 'm',
                                    labelAlign: 'top',
                                    disabled: true,
                                    clearable: false,
                                    value: 'm',
                                    flex: 1,
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'col-6 pl-12',
                            layout: 'hbox',
                            defaults: {
                                ui: '',
                            },

                            items: [
                                {
                                    xtype: 'numberfield',
                                    cls: 'a-prepend a-field-icon icon-short',
                                    maxLength: 15,
                                    label: 'Air Draft',
                                    name: 'air_draft',
                                    labelAlign: 'top',
                                    placeholder: '00.00',
                                    clearable: false,
                                    bind: {
                                        value: '{selectedBerth.air_draft}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'no-border',
                                    cls: 'a-append',
                                    label: '',
                                    padding: '16 0 0 0',
                                    placeholder: 'm',
                                    labelAlign: 'top',
                                    disabled: true,
                                    clearable: false,
                                    value: 'm',
                                    flex: 1,
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'col-6 pr-12',
                            layout: 'hbox',
                            defaults: {
                                ui: '',
                            },

                            items: [
                                {
                                    xtype: 'numberfield',
                                    maxLength: 15,
                                    cls: 'a-prepend a-field-icon icon-short',
                                    label: 'Beam',
                                    name: 'beam',
                                    labelAlign: 'top',
                                    placeholder: '00.00',
                                    clearable: false,
                                    bind: {
                                        value: '{selectedBerth.beam}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'no-border',
                                    cls: 'a-append a-disabled',
                                    label: '',
                                    padding: '16 0 0 0',
                                    placeholder: 'm',
                                    labelAlign: 'top',
                                    disabled: true,
                                    clearable: false,
                                    value: 'm',
                                    flex: 1,
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'col-6 pl-12',
                            layout: 'hbox',
                            defaults: {
                                ui: '',
                            },

                            items: [
                                {
                                    xtype: 'numberfield',
                                    maxLength: 15,
                                    cls: 'a-prepend a-field-icon icon-short',
                                    label: 'LOA',
                                    name: 'loa',
                                    labelAlign: 'top',
                                    placeholder: '00.00',
                                    clearable: false,
                                    bind: {
                                        value: '{selectedBerth.loa}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'no-border',
                                    cls: 'a-append a-disabled',
                                    label: '',
                                    padding: '16 0 0 0',
                                    placeholder: 'm',
                                    labelAlign: 'top',
                                    disabled: true,
                                    clearable: false,
                                    value: 'm',
                                    flex: 1,
                                },
                            ],
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
                        value: '{selectedBerth.description}',
                    },
                },
            ],
        },
    ],

    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },

    buttons: [
        {
            text: 'Save',
            weight: 2,
            ui: 'action',
            handler: function () {
                var dialog = this.up('dialog'),
                    vm = dialog.upVM(),
                    form = dialog.down('formpanel'),
                    berth = vm.get('selectedBerth'),
                    mainContainer = Ext.ComponentQuery.query('#portBerthsMainContainerItemId')[0],
                    berts = vm.get('berths'),
                    createfromEdit = false,
                    action = vm.getData().action;
                if (!Ext.isNumber(berth.get('id'))) {
                    createfromEdit = true;
                }
                if (form.validate()) {
                    if (Ext.Object.isEmpty(berth.getProxy().extraParams) && berth.get('port_id')) {
                        berth.getProxy().setExtraParams({
                            port_id: berth.get('port_id'),
                        });
                    }
                    berth.save({
                        success: function (record) {
                            if (action == 'create') {
                                berts.add(record);
                                Ext.toast('Record created', 1000);
                            } else {
                                if (createfromEdit) {
                                    berts.add(record);
                                    mainContainer.getViewModel().set('selectedBerth', record);
                                }
                                berts.load();
                                Ext.toast('Record updated', 1000);
                            }
                            let portcallView = Ext.ComponentQuery.query('[xtype=portcall]')[0];
                            if (portcallView) {
                                let vm = portcallView.getVM(),
                                    berths = vm.get('berths');
                                berthsStore = vm.get('berthsStore');
                                // if (berths) {
                                //     berths.reload();
                                // }
                                if (berthsStore) {
                                    berthsStore.reload();
                                }
                            }
                            dialog.destroy();
                        },
                        failure: function (batch) {
                            // Ext.Msg.alert('Something went wrong', 'Could not appoint this Inquiry!');
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
                this.upVM().get('selectedBerth').reject();
                this.up('dialog').destroy();
            },
        },
    ],
});
