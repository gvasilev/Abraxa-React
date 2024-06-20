Ext.define('Abraxa.view.settings.library.ports.AddTerminal', {
    xtype: 'settings.library.ports.add.terminal',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: '',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 280,
    padding: '0 24 0 72',
    bind: {
        title: `{editMode ? '<div class="a-badge a-badge-default"><i class="md-icon-outlined">warehouse</i></div>Edit terminal' : '<div class="a-badge a-badge-default"><i class="md-icon-outlined">warehouse</i></div>Add terminal'}`,
    },
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
                    testId: 'terminalNameCreateDialogTestId',
                    ui: 'field-xl no-border classic',
                    label: false,
                    placeholder: 'Terminal name',
                    bind: {
                        value: '{terminal.name}',
                    },
                    required: true,
                },
                {
                    xtype: 'textfield',
                    label: 'Location',
                    testId: 'terminalLocationCreateDialogTestId',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter location',
                    bind: {
                        value: '{terminal.location}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalIspsCodeCreateDialogTestId',
                    label: 'ISPS code',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter ISPS code',
                    bind: {
                        value: '{terminal.isps_code}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'terminalTypeComboCreateDialogTestId',
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
                        value: '{terminal.type}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalServicesCreateDialogTestId',
                    label: 'Services',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter services',
                    bind: {
                        value: '{terminal.services}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalStorageCapacityCreateDialogTestId',
                    label: 'Storage capacity',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter storage capacity',
                    bind: {
                        value: '{terminal.storage_capacity}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'terminalEquipmentCreateDialogTestId',
                    label: 'Equipment',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter equipment',
                    bind: {
                        value: '{terminal.equipment}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'my-16',
                    html: '<hr>',
                },
                {
                    xtype: 'div',
                    cls: 'h3 my-0',
                    html: 'Description',
                },
                {
                    xtype: 'textareafield',
                    testId: 'terminalDescriptionCreateDialogTestId',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    scrollable: false,
                    bind: {
                        value: '{terminal.description}',
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
                    // this.upVM().get('currencies').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                testId: 'saveTerminalCreateDialogTestId',
                ui: 'action loading',
                bind: {
                    text: 'Save',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        portServedRecord = vm.get('portServedRecord'),
                        currentUser = vm.get('currentUser'),
                        store = vm.get('store');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('terminal'),
                            editMode = vm.get('editMode');
                        const index = store.find('id', record.get('id'));
                        const recordInStore = store.getAt(index);
                        if (recordInStore) {
                            recordInStore.set(record.getData());
                        }
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    if (portServedRecord) {
                                        portServedRecord.set('updated_by_user', currentUser.getData());
                                        portServedRecord.set('updated_at', new Date());
                                        portServedRecord.save();
                                    }
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                            dialog.destroy();
                        } else {
                            store.add(record);
                            store.sync({
                                success: function (batch, opt) {
                                    if (portServedRecord) {
                                        portServedRecord.set('updated_by_user', currentUser.getData());
                                        portServedRecord.set('updated_at', new Date());
                                        portServedRecord.save();
                                    }
                                    Ext.toast('Record created', 1000);
                                    let portcallView = Ext.ComponentQuery.query('[xtype=portcall]')[0];
                                    if (portcallView) {
                                        let vm2 = portcallView.getVM(),
                                            terminalsPortcall = vm2.get('terminals');
                                        if (terminalsPortcall) {
                                            terminalsPortcall.reload();
                                        }
                                    }

                                    // NOTE: portServedRecord is null (couldn't find an isntance when it isn't);
                                    // port_id is in record = vm.get('terminal');
                                    // Also, it is in the store.getProxy().getExtraParams() already.
                                    // To avoid bugs, I am leaving the old code with a check for portServedRecord.
                                    // Needs to be removed/refactored?
                                    if (portServedRecord && portServedRecord.get('port_id')) {
                                        store.getProxy().setExtraParams({
                                            port_id: portServedRecord.get('port_id'),
                                        });
                                    }

                                    store.reload();
                                    dialog.destroy();
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
