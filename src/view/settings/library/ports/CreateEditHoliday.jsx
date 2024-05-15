Ext.define('Abraxa.view.settings.library.ports.CreateEditHoliday', {
    extend: 'Ext.Dialog',
    xtype: 'settings.library.ports.create.holiday',
    cls: 'a-dialog-create a-dialog-has-icon',
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-default a-badge-rounded"><i class="md-icon-outlined md-16">calendar_today</i></div>{editMode ? "Edit holiday":"Add holiday"}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 320,
    padding: '0 24 0 72',
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
                    xtype: 'div',
                    html: '<div class="text-info">Manage your local or national holidays</div>',
                },
                {
                    xtype: 'div',
                    cls: 'my-16',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                    },
                    items: [
                        {
                            xtype: 'abraxa.datefield',
                            testId: 'holidayDateCreateDialogTestId',
                            label: 'Date',
                            placeholder: 'dd/mm',
                            dateFormat: 'd/m',
                            cls: 'a-field-icon icon-time icon-rounded',
                            bind: {
                                value: '{holiday.date}',
                            },
                            required: true,
                        },
                        {
                            xtype: 'selectfield',
                            testId: 'holidayTypeCreateDialogTestId',
                            label: 'Type',
                            placeholder: 'Choose',
                            required: true,
                            cls: 'a-field-icon icon-date icon-rounded',
                            options: [
                                {
                                    value: 'normal',
                                    text: 'National',
                                },
                                {
                                    value: 'local',
                                    text: 'Local',
                                },
                            ],
                            bind: {
                                value: '{holiday.type}',
                            },
                        },
                        {
                            xtype: 'textareafield',
                            testId: 'holidayDescriptionCreateDialogTestId',
                            maxWidth: '50%',
                            ui: 'no-border no-underline',
                            cls: 'a-field-icon icon-short',
                            placeholder: 'Enter description',
                            required: true,
                            bind: {
                                value: '{holiday.description}',
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
                handler: function () {
                    this.up('dialog').upVM().get('holiday').reject();
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                testId: 'holidayCreateDialogTestIdSaveButton',
                enableToggle: true,
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save":"Add"}',
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
                        let record = vm.get('holiday'),
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
                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                    portserveRecord.set('updated_at', new Date());
                                    portserveRecord.save();
                                    Ext.toast('Record created', 1000);
                                    dialog.destroy();
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
