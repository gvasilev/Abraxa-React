Ext.define('Abraxa.view.mail.AddEditDistributionGroup', {
    xtype: 'mail.add.edit.distribution.group',
    cls: 'a-dialog-create a-dialog-has-icon',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    // floated: true,
    alwaysOnTop: 2,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-distribution"><i class="md-icon-outlined md-icon-group"></i></div>{title}',
    },
    manageBorders: false,
    closable: true,
    // centered: true,
    minWidth: 640,
    maxWidth: 640,
    minHeight: 540,
    maxHeight: 860,
    padding: 0,
    viewModel: {
        stores: {
            organizationsMulti: {
                source: '{organizations}',
            },
        },
    },
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
            scrollable: false,
            items: [
                {
                    xtype: 'container',
                    margin: '0 24 0 72',
                    layout: 'hbox',
                    defaults: {
                        labelAlign: 'left',
                        clearable: false,
                        ui: 'classic hovered-border',
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            ui: 'field-xl no-border classic',
                            label: false,
                            flex: 1,
                            placeholder: 'Enter distribution group name',
                            bind: {
                                value: '{record.name}',
                            },
                            listeners: {
                                painted: function (me) {
                                    me.focus();
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-general-form',
                    margin: '0 0 0 64',
                    defaults: {
                        labelAlign: 'left',
                        clearable: false,
                        ui: 'classic hovered-border',
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            // label: 'Email subject',
                            placeholder: 'Enter email subject',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: {
                                value: '{record.email_subject}',
                            },
                        },
                        // {
                        //     xtype: 'textfield',
                        //     label: 'Default template',
                        //     placeholder: "Enter template",
                        //     disabled: true,
                        //     cls: 'a-field-icon icon-short icon-rounded',
                        //     bind: {
                        //         value: '{record.template_id}',
                        //     }
                        // },
                        // {
                        //     xtype: 'textfield',
                        //     label: 'Cargo',
                        //     placeholder: "Enter cargo",
                        //     disabled: true,
                        //     cls: 'a-field-icon icon-short icon-rounded',
                        //     bind: {
                        //         value: '{record.cargo_id}',
                        //     }
                        // },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '',
                },
                {
                    xtype: 'container',
                    cls: 'a-recipient-form',
                    defaults: {
                        labelAlign: 'left',
                        clearable: false,
                        ui: 'no-border',
                    },
                    flex: 1,
                    items: [
                        {
                            xtype: 'common-distribution-email-combo',
                            required: true,
                            bind: {
                                value: '{record.dist_emails}',
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
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function (me) {
                    let record = me.upVM().get('record');
                    if (record) {
                        record.reject();
                    }
                    me.up('dialog').destroy();
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
                        store = vm.get('distribution_groups');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            fromPortcall = vm.get('fromPortcall'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            if (!fromPortcall) {
                                store.sync({
                                    success: function (batch, opt) {
                                        Ext.toast('Record updated', 1000);
                                        dialog.destroy();
                                    },
                                });
                            } else {
                                Ext.toast('Record updated', 1000);
                                dialog.destroy();
                            }
                        } else {
                            store.add(record);
                            if (!fromPortcall) {
                                store.sync({
                                    success: function (batch, opt) {
                                        Ext.toast('Record created', 1000);
                                        dialog.destroy();
                                    },
                                });
                            } else {
                                Ext.toast('Record created', 1000);
                                dialog.destroy();
                            }
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
