Ext.define('Abraxa.view.settings.automation.templates.sof.AddEditSofItem', {
    xtype: 'templates.add.edit.sof.item',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-person my-8 a_grid_action"><i class="md-icon-outlined">description</i><div class="ml-4 text-truncate fw-b">{title}</div></div>',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    viewModel: true,
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
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
                    xtype: 'sof.general.events',
                    ui: 'classic hovered-border',
                    placeholder: 'Event name',
                    label: 'Event',
                    bind: {
                        store: '{sofEvents}',
                        value: '{record.default_sof_item_id}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                        select: function () {
                            let selection = this.getSelection();
                            if (selection) {
                                this.upVM().get('record').set('event_name', selection.get('name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'combobox',
                    ui: 'classic hovered-border',
                    placeholder: 'Status',
                    label: 'Portcall status',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    bind: {
                        store: '{portcallAgentStatus}',
                        value: '{record.portcall_status_id_trigger}',
                    },
                },
                {
                    xtype: 'selectfield',
                    ui: 'classic hovered-border',
                    placeholder: 'Prospect',
                    label: 'Prospects trigger',
                    valueField: 'value',
                    displayField: 'text',
                    queryMode: 'local',
                    bind: {
                        value: '{record.portcall_status_id_trigger}',
                    },
                    options: [
                        {
                            text: 'ATA',
                            value: 'ata',
                        },
                        {
                            text: 'ATD',
                            value: 'atd',
                        },
                        {
                            text: 'Berthed',
                            value: 'berthed',
                        },
                        {
                            text: 'Completed',
                            value: 'completed',
                        },
                        {
                            text: 'Departed',
                            value: 'departed',
                        },
                    ],
                },
                {
                    ui: 'classic',
                    placeholder: AbraxaConstants.placeholders.emptyValue,
                    xtype: 'textfield',
                    label: 'Comment',
                    bind: {
                        value: '{record.event_comment}',
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
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('templateItems');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            if (store.neesSync) {
                                store.sync({
                                    success: function (batch, opt) {
                                        Ext.toast('Record updated', 1000);
                                        dialog.destroy();
                                    },
                                    failure: function (batch, operations) {
                                        Ext.Msg.alert('Something went wrong', 'Cannot update template item!');
                                    },
                                });
                            } else {
                                dialog.destroy();
                            }
                        } else {
                            store.add(record);

                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record created', 1000);
                                    dialog.destroy();
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot create template item!');
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
