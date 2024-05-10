Ext.define('Abraxa.view.profile.Security', {
    extend: 'Ext.Container',
    xtype: 'profile.security',
    testId: 'profileSecurityContainer',
    cls: 'a-settings-main a-settings-profile',
    scrollable: true,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">Security settings</h1>',
                    testId: 'profileSecurityTitle',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">These preferences will be applied to your account only.<br>Change your password details on regular basis for maximum security.</p>',
                    testId: 'profileSecurityDescription',
                },
                {
                    xtype: 'div',
                    margin: '16 0',
                    html: '<hr>',
                },
                {
                    xtype: 'div',
                    html: '<h3>Reset password</h3><div class="text-info">Change the password for your account</div>',
                    testId: 'profileSecurityChangePasswordTitle',
                },
                {
                    xtype: 'abraxa.panel',
                    shadow: false,
                    padding: 0,
                    margin: '24 0',
                    bodyPadding: 0,
                    layout: {
                        type: 'vbox',
                    },
                    header: false,
                    innerCls: 'chameleon_settings_personal_sign_in_security',
                    testId: 'profileSecurityChangePasswordPanel',
                    bbar: {
                        ui: 'toolbar-panel-bottom',
                        padding: '8 0 0 0',
                        docked: 'bottom',
                        items: [
                            '->',
                            {
                                text: 'Cancel',
                                margin: '0 8 0 0',
                                testId: 'profileSecurityChangePasswordCancel',
                                handler: function (me) {
                                    let form = me.find('formChangePassword');
                                    form.reset();
                                    form.clearErrors();
                                    me.find('formError').setHtml('').hide().removeCls('error');
                                },
                            },
                            {
                                text: 'Save',
                                testId: 'profileSecurityChangePasswordSave',
                                enableToggle: true,
                                ui: 'action loading',
                                handler: 'changePassword',
                            },
                        ],
                    },
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            itemId: 'formError',
                            testId: 'profileSecurityChangePasswordError',
                            margin: 0,
                            padding: 8,
                        },
                        {
                            xtype: 'formpanel',
                            padding: 0,
                            itemId: 'formChangePassword',
                            testId: 'profileSecurityChangePasswordForm',
                            defaults: {
                                ui: 'hovered-border classic',
                                labelAlign: 'left',
                                clearable: false,
                            },
                            items: [
                                {
                                    xtype: 'passwordfield',
                                    placeholder: 'Current password',
                                    testId: 'profileSecurityChangePasswordCurrentPasswordField',
                                    name: 'currentPassword',
                                    required: true,
                                    label: 'Current password',
                                    flex: 1,
                                    cls: 'a-field-icon icon-rounded icon-lock_open',
                                },
                                {
                                    xtype: 'passwordfield',
                                    placeholder: 'New password',
                                    testId: 'profileSecurityChangePasswordNewPasswordField',
                                    name: 'newPassword',
                                    required: true,
                                    label: 'New password',
                                    validators: {
                                        type: 'length',
                                        min: 6,
                                    },
                                    flex: 1,
                                    cls: 'a-field-icon icon-rounded icon-lock_open',
                                },
                                {
                                    xtype: 'passwordfield',
                                    placeholder: 'Repeat password',
                                    testId: 'profileSecurityChangePasswordRepeatPasswordField',
                                    required: true,
                                    labelWidth: '120px',
                                    label: 'Repeat password',
                                    validators: {
                                        type: 'length',
                                        min: 6,
                                    },
                                    name: 'repeatPassword',
                                    flex: 1,
                                    cls: 'a-field-icon icon-rounded icon-lock_open',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
