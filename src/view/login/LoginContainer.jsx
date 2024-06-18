Ext.define('Abraxa.view.login.LoginContainer', {
    extend: 'Ext.Container',
    xtype: 'login',
    cls: 'a-signup-container',
    layout: 'hbox',
    // docked: 'top',
    height: '100%',
    items: [
        {
            xtype: 'container',
            cls: 'a-signup-art',
            layout: {
                type: 'vbox',
                align: 'middle',
                pack: 'middle',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-art-logo',
                    html: '<img src="https://static.abraxa.com/images/logo-white.svg" height="20" alt="Abraxa" />',
                },
                {
                    xtype: 'div',
                    cls: 'a-art-slogan',
                    html: '<h1>We help port agencies <strong>grow</strong> their business and provide <strong>outstanding</strong> customer service.</h1>',
                },
            ],
        },
        {
            xtype: 'container',
            flex: 2,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'middle',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-signup-forms',
                    layout: {
                        type: 'vbox',
                        // pack: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-signup-steps',
                            hidden: true,
                            bind: {
                                hidden: '{registration_mode && !registration_success ? false : true}',
                                html: 'Step {indicator.activeIndex + 1} of 3',
                            },
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                            },
                            flex: 1,
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-signup-logo',
                                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g transform="translate(-680 -142)"><rect width="48" height="48" rx="8" transform="translate(680 142)" fill="#00b6c8"/><g transform="translate(688 150)"><rect width="32" height="32" fill="none"/><path d="M149.477,143.333l-7.3-4.073L133.9,125.871l-7.02,11.357,10.5-2.04L123.1,143.333h-4.787l12.279-19.863A3.1,3.1,0,0,1,133.231,122h1.328a3.1,3.1,0,0,1,2.639,1.471Z" transform="translate(-117.916 -116.667)" fill="#fff"/></g></g></svg>',
                                    bind: {
                                        hidden: '{registration_success ? true : false}',
                                    },
                                },
                                {
                                    xtype: 'login.dialog',
                                    hidden: true,
                                    bind: {
                                        hidden: '{registration_mode ? true : false}',
                                    },
                                },
                                {
                                    xtype: 'registration.container',
                                    hidden: true,
                                    bind: {
                                        hidden: '{registration_mode && !registration_success ? false : true}',
                                    },
                                },
                                {
                                    hidden: true,
                                    bind: {
                                        hidden: '{registration_mode && registration_success ? false : true}',
                                    },
                                    layout: {
                                        type: 'vbox',
                                        pack: 'middle',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'text-center',
                                            style: 'margin: 0 auto',
                                            html: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="none"/><path d="M50.24,28.8A21.457,21.457,0,1,1,34.7,8.191L38.9,3.983A26.323,26.323,0,0,0,28.8,2,26.8,26.8,0,1,0,55.6,28.8M17.839,23.655,14.06,27.46,26.12,39.52l26.8-26.8L49.141,8.914,26.12,31.936Z" transform="translate(3.36 3.36)" fill="#009688"/></svg>',
                                            width: 180,
                                        },
                                        {
                                            xtype: 'div',
                                            margin: '16 0 0 0',
                                            cls: 'text-center',
                                            html: '<h1 class="m-0">Email verified</h1>',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'text-center',
                                            margin: '8 0',
                                            html: '<p style="font-size: 16px; color: #6B7C93; line-height: 1.8;">Thank you!<br> You can now login and start using Abraxa.</p>',
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Login',
                                            width: 112,
                                            ui: 'large action',
                                            margin: '8 0',
                                            handler: function () {
                                                // window.history.replaceState({}, document.title, "/#login");
                                                Ext.Viewport.getController().redirectTo('login', {
                                                    replace: true,
                                                });
                                                window.location.hash = '#login';
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'main.new.user.password.dialog',
                                    hidden: true,
                                },
                                {
                                    xtype: 'container',
                                    hidden: true,
                                    cls: 'registration_complete',
                                    flex: 1,
                                    showAnimation: 'pop',
                                    layout: {
                                        type: 'vbox',
                                        pack: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'text-center',
                                            style: 'margin: 0 auto',
                                            html: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="none"/><path d="M50.24,28.8A21.457,21.457,0,1,1,34.7,8.191L38.9,3.983A26.323,26.323,0,0,0,28.8,2,26.8,26.8,0,1,0,55.6,28.8M17.839,23.655,14.06,27.46,26.12,39.52l26.8-26.8L49.141,8.914,26.12,31.936Z" transform="translate(3.36 3.36)" fill="#009688"/></svg>',
                                            width: 180,
                                        },
                                        {
                                            xtype: 'div',
                                            margin: '16 0 0 0',
                                            cls: 'text-center',
                                            html: '<h1 class="m-0">Registration complete!</h1>',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'text-center',
                                            margin: '8 0',
                                            html: '<p style="font-size: 16px; color: #6B7C93; line-height: 1.8;">Thank you for registering!<br>Please confirm the verification email sent to your mailbox.</p>',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    listeners: {
        click: {
            element: 'element',
            delegate: 'a.resend_verification',
            fn: function () {
                let cmp = this.component,
                    email = Ext.ComponentQuery.query('[name=email]')[0].getValue();

                if (email) Ext.ComponentQuery.query('login\\.dialog')[0].getController().resendVerification(email);
            },
        },
    },
});
