Ext.define('Abraxa.Live.view.login.ForgotPasswordForm', {
    extend: 'Ext.form.Panel',
    xtype: 'forgot.password.form',
    flex: 1,
    items: [
        {
            xtype: 'form.error',
            docked: 'top',
            hidden: true,
            margin: 0,
            padding: '8 0',
        },
        {
            xtype: 'div',
            cls: 'text-center c-blue-grey',
            html: 'Please enter your email address.<br>We will send you an email to reset your password.',
        },
        {
            xtype: 'emailfield',
            ui: 'outlined field-lg',
            clearable: false,
            labelAlign: 'top',
            label: 'Email',
            placeholder: 'Email address',
            required: true,
            cls: 'forgot_password_mail',
            name: 'email',
            validators: 'email',
            bind: {
                value: '{user_email.value}',
            },
            listeners: {
                change: function () {
                    if (!this.getValue()) this.setError(false);
                },
            },
        },
    ],
    bbar: {
        padding: '24 16',
        layout: {
            type: 'hbox',
            pack: 'end',
        },
        items: [
            {
                xtype: 'button',
                text: 'Reset',
                ui: 'accent loading large',
                cls: 'reset_password_button',
                handler: 'forgotPassword',
            },
        ],
    },
});
