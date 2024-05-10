Ext.define('Abraxa.Live.view.login.LoginDialog', {
    extend: 'Ext.Container',
    xtype: 'login.dialog',
    controller: 'login-controller',
    cls: 'a-signup-wrap a-login',
    showAnimation: 'fadeIn',
    layout: {
        type: 'vbox',
        pack: 'middle',
    },
    items: [
        {
            xtype: 'abraxa.container',
            cls: 'a-signup-card',
            items: [
                {
                    xtype: 'tool',
                    iconCls: 'md-icon-keyboard-backspace',
                    left: 16,
                    top: 12,
                    hidden: true,
                    cls: 'hide_password',
                    handler: function () {
                        Ext.ComponentQuery.query('forgot\\.password\\.form')[0].hide();
                        Ext.ComponentQuery.query('login\\.form')[0].show();
                        Ext.ComponentQuery.query('[cls~="login_subtitle"]')[0].setHtml(
                            '<h1>Work faster, smarter and service your clients better.</h1>'
                        );
                        this.hide();
                    },
                },
                {
                    xtype: 'div',
                    cls: 'text-center login_subtitle',
                    html: '<h1>Work faster, smarter and service your clients better.</h1>',
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'login.form',
                            showAnimation: {
                                type: 'slideIn',
                                direction: 'right',
                            },
                        },
                        {
                            xtype: 'forgot.password.form',
                            hidden: true,
                            showAnimation: {
                                type: 'slideIn',
                                direction: 'left',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'text-center',
            margin: '32 0 0 0',
            hidden: true,
            html: "<div class='sign_up_text'>Don't have an account? <a class='sign_up' href='javascript:void(0)'>Sign up for free</a></div>",
        },
    ],
    listeners: {
        click: {
            element: 'element',
            delegate: 'a.sign_up',
            fn: function () {
                Ext.Viewport.getViewModel().set('registration_mode', true);
                Ext.ComponentQuery.query('login\\.dialog')[0].hide(false);
                Ext.ComponentQuery.query('registration\\.container')[0].show();
            },
        },
    },
});
