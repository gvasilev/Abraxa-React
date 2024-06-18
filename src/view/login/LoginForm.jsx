Ext.define('Abraxa.Live.view.login.LoginForm', {
    extend: 'Ext.form.Panel',
    xtype: 'login.form',
    flex: 1,
    items: [
        {
            xtype: 'form.error',
            docked: 'top',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'emailfield',
            ui: 'outlined field-lg',
            clearable: false,
            labelAlign: 'top',
            label: 'Email',
            placeholder: 'Email address',
            required: true,
            name: 'email',
            reference: 'user_email',
            validators: 'email',
            bind: {
                value: '{linkData ? linkData.invitation_email : null}',
            },
            listeners: {
                change: function () {
                    if (!this.getValue()) this.setError(false);
                },
            },
        },
        {
            xtype: 'passwordfield',
            ui: 'outlined field-lg',
            clearable: false,
            labelAlign: 'top',
            label: 'Password',
            testId: 'loginPasswordField',
            placeholder: 'Password',
            required: true,
            name: 'password',
        },
    ],
    bbar: {
        padding: '24 16',
        layout: {
            type: 'hbox',
            pack: 'space-between',
        },
        items: [
            {
                xtype: 'div',
                cls: 'text-right',
                html: "<a class='forgot_pass' href='javascript:void(0)'>Forgot password?</a>",
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.forgot_pass',
                        fn: function () {
                            Ext.ComponentQuery.query('login\\.form')[0].hide();
                            Ext.ComponentQuery.query('forgot\\.password\\.form')[0].show();
                            Ext.ComponentQuery.query('[cls="hide_password"]')[0].show();
                            Ext.ComponentQuery.query('[cls~="login_subtitle"]')[0].setHtml('<h1>Reset password</h1>');
                        },
                    },
                },
            },
            {
                xtype: 'button',
                cls: 'login_button',
                text: 'Log in',
                ui: 'accent loading large',
                // enableToggle: true,
                testId: 'loginFormLoginButton',
                handler: 'login',
            },
        ],
    },
    listeners: {
        keypress: {
            element: 'element',
            fn: function (browserEvent) {
                if (browserEvent.event.key == 'Enter') this.component.up('login\\.dialog').getController().login();
            },
        },
    },
});
