Ext.define('Abraxa.view.settings.library.ports.AddBerth', {
    xtype: 'settings.library.ports.add.berth',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">place</i></div>Add berth',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 280,
    maxHeight: '90%',
    padding: '0 24 0 72',
    scrollable: true,
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            // showAnimation: 'fadeIn',
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    label: false,
                    clearable: false,
                    placeholder: 'Berth name',
                    bind: {
                        value: '{berth.name}',
                    },
                    required: true,
                },
                {
                    xtype: 'port.terminals',
                    testId: 'berthPortComboTestIdAddBerthDialog',
                    label: 'Terminal',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{berth.terminal_id}',
                        store: '{terminalsPerPort}',
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
                    label: 'IMO',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'IMO number',
                    bind: {
                        value: '{berth.imo}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'UN Locator code',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter UN code',
                    bind: {
                        value: '{berth.un_locator_code}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'berthTypeTestIdAddBerthDialog',
                    label: 'Type',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Choose type',
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
                    bind: {
                        value: '{berth.type}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'berthFunctionTestIdAddBerthDialog',
                    label: 'Function',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    forceSelection: true,
                    placeholder: 'Function',
                    queryMode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    bind: {
                        value: '{berth.function}',
                    },
                    store: {
                        type: 'berth.function',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'my-16',
                    html: '<hr>',
                },
                // Restrictions
                {
                    xtype: 'container',
                    html: '<div class="h3 mt-0">Restrictions</div>',
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'Draft',
                            testId: 'berthDraftTestIdAddBerthDialog',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berth.draft}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            testId: 'berthAirDraftTestIdAddBerthDialog',
                            label: 'Air draft',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berth.air_draft}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            testId: 'berthMaxDwtTestIdAddBerthDialog',
                            label: 'Beam',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berth.beam}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            testId: 'berthMaxLoaTestIdAddBerthDialog',
                            label: 'Loa',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berth.loa}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'my-16',
                    html: '<hr>',
                },
                // DESCRIPTION
                {
                    xtype: 'container',
                    html: '<div class="h3 my-0">Description</div>',
                },
                {
                    xtype: 'textareafield',
                    testId: 'berthDescriptionTestIdAddBerthDialog',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    bind: {
                        value: '{berth.description}',
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function () {
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                testId: 'saveBerthButtonTestIdAddBerthDialog',
                bind: {
                    text: 'Save',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        portserveRecord = vm.get('portserveRecord'),
                        currentUser = vm.get('currentUser'),
                        store = vm.get('store');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('berth'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                    portserveRecord.set('updated_at', new Date());
                                    portserveRecord.save();
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot update office!');
                                },
                            });
                            dialog.destroy();
                        } else {
                            store.add(record);
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record created', 1000);
                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                    portserveRecord.set('updated_at', new Date());
                                    portserveRecord.save();
                                    dialog.destroy();
                                    store.getProxy().setExtraParams({
                                        port_id: portserveRecord.get('port_id'),
                                    });
                                    store.reload();
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot create office!');
                                },
                            });
                        }
                    } else {
                        dialog
                            .down('form\\.error')
                            .setHtml('Please fill in all required fields')
                            .show()
                            .addCls('error');
                        me.toggle();
                    }
                },
            },
        ],
    },
});
