import './CompanyController.jsx';
Ext.define('Abraxa.view.settings.company.AddEmail', {
    xtype: 'settings.company.add.email',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-email"><i class="md-icon-outlined">alternate_email</i></div>{editMode ? "Edit email account":"Add email account"}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 580,
    padding: '8 24 24 72',
    controller: 'company.controller',
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
                    xtype: 'abraxa.emailfield',
                    testId: 'AddEmailSettingstestId',
                    clearable: false,
                    label: 'Email address',
                    placeholder: 'Email address',
                    name: 'smtp_email',
                    required: true,
                    cls: 'a-field-icon icon-rounded icon-email',
                    bind: {
                        value: '{record.email}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'AddUsernameSettingstestId',
                    placeholder: 'Username',
                    label: 'Username',
                    name: 'smtp_username',
                    required: true,
                    cls: 'a-field-icon icon-rounded icon-person',
                    bind: {
                        value: '{record.smtp_username}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'AddPasswordSettingstestId',
                    label: 'Password',
                    placeholder: 'Password',
                    inputType: 'password',
                    name: 'smtp_password',
                    required: true,
                    cls: 'a-field-icon icon-rounded icon-lock',
                    bind: {
                        value: '{record.smtp_password}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'AddSmtpServerSettingstestId',
                    label: 'SMTP server',
                    placeholder: 'Enter SMTP server name',
                    name: 'smtp_server',
                    required: true,
                    cls: 'a-field-icon icon-rounded icon-lock',
                    bind: {
                        value: '{record.smtp_server}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'AddSmtpServerSettingsPortCombotestId',
                    label: 'SMTP port',
                    placeholder: 'Choose port',
                    name: 'smtp_port',
                    required: true,
                    cls: 'a-field-icon icon-rounded icon-public non-editable',
                    options: [
                        {
                            value: 25,
                            text: 25,
                        },
                        {
                            value: 465,
                            text: 465,
                        },
                        {
                            value: 587,
                            text: 587,
                        },
                    ],
                    bind: {
                        value: '{record.smtp_port}',
                    },
                },
                {
                    xtype: 'container',
                    margin: '8 0 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-label',
                            width: 165,
                            html: 'Secure connection',
                        },
                        {
                            xtype: 'radiogroup',
                            itemId: 'sslTls',
                            bind: {
                                value: '{record.secure_connection}',
                            },
                            listeners: {
                                change: function (t, newValue) {
                                    let record = this.upVM().get('record');
                                    if (record) {
                                        record.set('secure_connection', newValue);
                                    }
                                },
                            },
                            items: [
                                {
                                    ui: 'large',
                                    label: 'SSL',
                                    labelAlign: 'right',
                                    labelWidth: 80,
                                    value: 'ssl',
                                    bind: {
                                        checked: '{record.secure_connection === "ssl" ? "true":"false"}',
                                    },
                                },
                                {
                                    ui: 'large',
                                    label: 'TLS',
                                    labelAlign: 'right',
                                    labelWidth: 80,
                                    value: 'tls',
                                    bind: {
                                        checked: '{record.secure_connection === "tls" ? "true":"false"}',
                                    },
                                },
                                {
                                    ui: 'large',
                                    label: 'None',
                                    labelAlign: 'right',
                                    labelWidth: 80,
                                    value: null,
                                    checked: true,
                                    bind: {
                                        checked: '{record.secure_connection === null ? "true":"false"}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    margin: '24 0 0 0',
                    padding: 0,
                    required: false,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Set as default',
                            // ui: 'large',
                            bind: {
                                disabled: '{disableDefault}',
                                checked: '{record.is_default}',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'hbox smtp_test_failed',
                            hidden: true,
                            html: '<i class="material-icons c-red mr-8">close</i><span class="c-black">Connection failed</span>',
                        },
                        {
                            xtype: 'div',
                            cls: 'hbox smtp_test_success',
                            hidden: true,
                            html: '<i class="material-icons-outlined c-green mr-8">check_circle_outline</i><span class="c-black">Connection successful</span>',
                        },
                        {
                            xtype: 'button',
                            text: 'Test connection',
                            ui: 'normal loading',
                            enableToggle: true,
                            cls: 'smtp_test_button',
                            handler: 'onEmailTest',
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
                handler: function () {
                    this.upVM().get('emailSettings').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                testId: 'AddEmailSaveButtonTestId',
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('emailSettings');

                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            if (record.get('is_default')) {
                                store.each(function (rec) {
                                    if (rec.get('is_default') && rec.get('id') != record.get('id')) {
                                        rec.set('is_default', false);
                                    }
                                });
                            }
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot update email!');
                                },
                            });
                            dialog.destroy();
                        } else {
                            record.save({
                                success: function (rec) {
                                    Ext.toast('Record created', 1000);
                                    if (rec.get('is_default')) {
                                        let defaultRecord = store.findRecord('is_default', true, 0, false, false, true);
                                        if (defaultRecord) {
                                            defaultRecord.set('is_default', false);
                                        }
                                    }
                                    store.add(rec);
                                    store.sync();
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
