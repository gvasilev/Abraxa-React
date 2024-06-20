Ext.define('Abraxa.view.settings.automation.templates.task.AddEditTaskItem', {
    xtype: 'settings.automation.templates.add.edit.task.item',
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
                    xtype: 'textfield',
                    label: false,
                    placeholder: 'Enter item name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{record.name}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Priority',
                    placeholder: 'Choose priority',
                    cls: 'a-field-icon icon-flag icon-rounded non-editable',
                    displayField: 'name',
                    valueField: 'value',
                    options: [
                        {
                            name: 'Normal',
                            value: 'normal',
                        },
                        {
                            name: 'High',
                            value: 'high',
                        },
                    ],
                    bind: {
                        value: '{record.priority}',
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
