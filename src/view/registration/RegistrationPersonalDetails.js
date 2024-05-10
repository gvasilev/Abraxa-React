Ext.define('Abraxa.view.registration.RegistrationPersonalDetails', {
    extend: 'Ext.form.Panel',
    xtype: 'registration.personal',
    flex: 1,
    padding: 0,
    items: [
        {
            xtype: 'div',
            cls: 'text-center login_subtitle',
            html: '<h1>Create your free account</h1>',
        },
        {
            xtype: 'form.error',
            hidden: true,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'container',
            cls: 'mb-8',
            layout: 'hbox',
            defaults: {
                ui: 'outlined field-lg',
                clearable: false,
                margin: '0 12',
                labelAlign: 'top',
                required: true,
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'First name',
                    flex: 1,
                    placeholder: 'First name',
                    name: 'first_name',
                },
                {
                    xtype: 'textfield',
                    label: 'Last name',
                    placeholder: 'Last name',
                    flex: 1,
                    name: 'last_name',
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'mb-8',
            layout: 'hbox',
            defaults: {
                ui: 'outlined field-lg',
                clearable: false,
                margin: '0 12',
                labelAlign: 'top',
                required: true,
            },
            items: [
                {
                    xtype: 'emailfield',
                    label: 'Email',
                    placeholder: 'Email address',
                    validators: 'email',
                    flex: 1,
                    name: 'email',
                    reference: 'personalEmail',
                    bind: {
                        value: '{linkData ? linkData.invitation_email : null}',
                        disabled: '{linkData ? true : false}',
                    },
                },
                {
                    xtype: 'abraxa.phonefield',
                    label: 'Phone',
                    placeholder: '+000 000-000',
                    flex: 1,
                    name: 'phone',
                },
            ],
        },
        {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                ui: 'outlined field-lg',
                clearable: false,
                margin: '0 12',
                labelAlign: 'top',
                required: true,
            },
            items: [
                {
                    xtype: 'passwordfield',
                    itemId: 'registrationPasswordField',
                    label: 'Password',
                    placeholder: 'Password',
                    flex: 1,
                    name: 'password',
                    minLength: 8, // Minimum length validator
                    autoComplete: false,
                    validators: [
                        function (value) {
                            if (!/\d/.test(value)) {
                                return 'Password must contain at least one number.';
                            }
                            return true;
                        },
                        function (value) {
                            if (!/[a-z]/.test(value)) {
                                return 'Password must contain at least one lowercase letter.';
                            }
                            return true;
                        },
                        function (value) {
                            if (!/[A-Z]/.test(value)) {
                                return 'Password must contain at least one uppercase letter.';
                            }
                            return true;
                        },
                        function (value) {
                            if (!/[@#$%^&+=]/.test(value)) {
                                return 'Password must contain at least one special character (@#$%^&+=).';
                            }
                            return true;
                        },
                        function (value) {
                            if (value.length < 8) {
                                return 'Password must be at least 8 characters long.';
                            }
                            return true;
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
                    label: 'Repeat Password',
                    placeholder: 'Password again',
                    flex: 1,
                    name: 'password_confirmation',
                },
            ],
        },
    ],
});
