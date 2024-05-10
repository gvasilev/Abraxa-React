Ext.define('Abraxa.view.settings.library.ports.CreateEditWorkingTime', {
    extend: 'Ext.Dialog',
    xtype: 'settings.library.ports.create.working.time',
    cls: 'a-dialog-create a-dialog-has-icon',
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">schedule</i></div>{editMode ? "Edit working time":"Add working time"}',
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
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'selectfield',
                            width: 115,
                            label: null,
                            placeholder: 'Choose',
                            required: true,
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-date icon-rounded',
                            options: [
                                {
                                    value: 'monday',
                                    text: 'Mon',
                                },
                                {
                                    value: 'tuesday',
                                    text: 'Tue',
                                },
                                {
                                    value: 'wednesday',
                                    text: 'Wed',
                                },
                                {
                                    value: 'thursday',
                                    text: 'Thu',
                                },
                                {
                                    value: 'friday',
                                    text: 'Fri',
                                },
                                {
                                    value: 'saturday',
                                    text: 'Sat',
                                },
                                {
                                    value: 'sunday',
                                    text: 'Sun',
                                },
                            ],
                            bind: {
                                value: '{workingTime.start_day}',
                            },
                        },
                        {
                            xtype: 'div',
                            padding: '0 8',
                            html: '-',
                        },
                        {
                            xtype: 'selectfield',
                            width: 80,
                            label: null,
                            placeholder: 'Choose',
                            required: true,
                            ui: 'classic hovered-border',
                            // cls: 'a-field-icon icon-date icon-rounded',
                            options: [
                                {
                                    value: 'monday',
                                    text: 'Mon',
                                },
                                {
                                    value: 'tuesday',
                                    text: 'Tue',
                                },
                                {
                                    value: 'wednesday',
                                    text: 'Wed',
                                },
                                {
                                    value: 'thursday',
                                    text: 'Thu',
                                },
                                {
                                    value: 'friday',
                                    text: 'Fri',
                                },
                                {
                                    value: 'saturday',
                                    text: 'Sat',
                                },
                                {
                                    value: 'sunday',
                                    text: 'Sun',
                                },
                            ],
                            bind: {
                                value: '{workingTime.end_day}',
                            },
                        },
                        {
                            xtype: 'abraxa.timefield',
                            padding: '0 4',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-time icon-rounded',
                            width: 105,
                            placeholder: '00:00',
                            bind: {
                                value: '{workingTime.start_time}',
                            },
                        },
                        {
                            xtype: 'div',
                            padding: '0 4',
                            html: 'to',
                        },
                        {
                            xtype: 'abraxa.timefield',
                            ui: 'classic hovered-border',
                            width: 100,
                            placeholder: '00:00',
                            bind: {
                                value: '{workingTime.end_time}',
                            },
                            padding: '0 4',
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
                    this.up('dialog').upVM().get('workingTime').reject();
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                enableToggle: true,
                ui: 'action loading',
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
                        let record = vm.get('workingTime'),
                            portserveRecord = vm.get('portserveRecord'),
                            currentUser = vm.get('currentUser'),
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
                                    Ext.Msg.alert('Something went wrong', 'Cannot update working time!');
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
                                    Ext.Msg.alert('Something went wrong', 'Cannot add working time!');
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
