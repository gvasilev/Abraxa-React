Ext.define('Abraxa.view.settings.library.ports.CreateEditPortServices', {
    extend: 'Ext.Dialog',
    xtype: 'settings.library.ports.create.port.services',
    testId: 'setLibCreateEditPortSrvs',
    cls: 'a-dialog-create a-dialog-has-icon',
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-services"><i class="md-icon-outlined md-icon-layers"></i></div>{editMode ? "Edit service":"Add service"}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 320,
    padding: '16 24 16 72',
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
            flex: 1,
            layout: 'vbox',
            margin: 0,
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'default.expense.items.combo',
                            label: 'Service',
                            labelAlign: 'left',
                            placeholder: 'Choose service',
                            cls: 'a-field-icon icon-short icon-rounded',
                            itemCls: 'a-disb-costs-combo',
                            ui: 'classic hovered-border',
                            required: true,
                            bind: {
                                store: '{expenseItems}',
                                value: '{portService.service_id}',
                            },
                            listeners: {
                                beforequery: function () {
                                    let store = this.getStore();
                                    if (store) {
                                        store.removeFilter(8787);
                                        store.addFilter({
                                            id: 8787,
                                            filterFn: function (record) {
                                                if (
                                                    record &&
                                                    record.get('category') &&
                                                    record.get('category').name == 'port'
                                                )
                                                    return true;
                                            },
                                        });
                                    }
                                },
                                select: function (me, selection) {
                                    if (selection) {
                                        let record = me.upVM().get('portService');
                                        record.set('service_name', selection.get('name'));
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                margin: '0 8 0 0',
                text: 'Cancel',
                testId: 'setLibCreateEditPortSrvsCancelBtn',
                handler: function () {
                    this.up('dialog').upVM().get('portService').reject();
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                enableToggle: true,
                ui: 'action loading',
                testId: 'setLibCreateEditPortSrvsSaveBtn',
                bind: {
                    text: '{editMode ? "Save":"Add"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('store');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('portService'),
                            portServedRecord = vm.get('portServedRecord'),
                            currentUser = vm.get('currentUser'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    portServedRecord.set('updated_by_user', currentUser.getData());
                                    portServedRecord.set('updated_at', new Date());
                                    portServedRecord.save();
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    me.toggle();
                                },
                            });
                            dialog.destroy();
                        } else {
                            store.add(record);
                            store.sync({
                                success: function (batch, opt) {
                                    portServedRecord.set('updated_by_user', currentUser.getData());
                                    portServedRecord.set('updated_at', new Date());
                                    portServedRecord.save();
                                    Ext.toast('Record created', 1000);
                                    dialog.destroy();
                                },
                                failure: function (batch, operations) {
                                    me.toggle();
                                },
                            });
                        }
                    } else {
                        me.toggle();
                        dialog
                            .down('form\\.error')
                            .setHtml('Please fill in all required fields')
                            .show()
                            .addCls('error');
                    }
                },
            },
        ],
    },
});
