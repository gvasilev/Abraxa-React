Ext.define('Abraxa.view.main.NewUserPasswordDialog', {
    extend: 'Ext.Container',
    xtype: 'main.new.user.password.dialog',
    title: 'Create password',
    testId: 'mainNewUserPasswordDialog',
    cls: 'a-signup-wrap a-login',
    items: [
        {
            xtype: 'toolbar',
            docked: 'bottom',
            testId: 'mainNewUserPasswordDialogToolbar',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                '->',
                {
                    xtype: 'button',
                    ui: 'accent loading large',
                    text: 'Continue',
                    testId: 'mainNewUserPasswordDialogContinueButton',
                    handler: 'createPassword',
                },
            ],
        },
        {
            xtype: 'formpanel',
            reference: 'formChangePassword',
            testId: 'mainNewUserPasswordDialogForm',
            items: [
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
                    testId: 'mainNewUserPasswordDialogError',
                    docked: 'top',
                },
                {
                    xtype: 'container',
                    flex: 1,
                    testId: 'mainNewUserPasswordDialogContainer',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'text-center login_subtitle',
                            html: '<h1>Almost there! Choose a password to start working faster, smarter and better.</h1>',
                            testId: 'mainNewUserPasswordDialogSubtitle',
                        },
                        {
                            xtype: 'container',
                            defaults: {
                                ui: 'outlined field-lg',
                                clearable: false,
                                labelAlign: 'top',
                                required: true,
                            },
                            testId: 'mainNewUserPasswordDialogFieldsContainer',
                            items: [
                                {
                                    xtype: 'passwordfield',
                                    placeholder: 'Password',
                                    label: 'Password',
                                    testId: 'mainNewUserPasswordDialogPasswordField',
                                    clearable: false,
                                    name: 'newPassword',
                                    required: true,
                                    flex: 1,
                                    cls: 'a-field-icon icon-lock_open',
                                    minLength: 8, // Minimum length validator
                                    autoComplete: false,
                                    validators: [
                                        function (value) {
                                            let errMsg = null;

                                            if (value.length < 8) {
                                                errMsg = 'Password must be at least 8 characters long.';
                                            } else if (!/\d/.test(value)) {
                                                errMsg = 'Password must contain at least one number.';
                                            } else if (!/[a-z]/.test(value)) {
                                                errMsg = 'Password must contain at least one lowercase letter.';
                                            } else if (!/[A-Z]/.test(value)) {
                                                errMsg = 'Password must contain at least one uppercase letter.';
                                            } else if (!/[@#$%^&+=]/.test(value)) {
                                                errMsg =
                                                    'Password must contain at least one special character (@#$%^&+=).';
                                            }

                                            if (!errMsg) return true;

                                            let form = Ext.ComponentQuery.query(
                                                '[xtype=main\\.new\\.user\\.password\\.dialog]'
                                            )[0].down('formpanel');
                                            let formError = form.down('form\\.error');
                                            formError.customErrorMsg = errMsg;
                                            return errMsg;
                                        },
                                    ],
                                    errorTip: {
                                        maxWidth: '420',
                                        showDelay: 0,
                                        hideDelay: 0,
                                    },
                                },
                                {
                                    xtype: 'passwordfield',
                                    placeholder: 'Repeat password',
                                    label: 'Repeat password',
                                    testId: 'mainNewUserPasswordDialogRepeatPasswordField',
                                    clearable: false,
                                    required: true,
                                    name: 'repeatPassword',
                                    flex: 1,
                                    cls: 'a-field-icon icon-lock_open',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    listeners: {
        keypress: {
            element: 'element',
            fn: function (e, target, eOpt) {
                if (e.browserEvent.key === 'Enter') {
                    this.component.up('viewport').getController().createPassword();
                }
            },
        },
    },
});
