Ext.define('Abraxa.Live.view.registration.RegistrationContainer', {
    extend: 'Ext.Container',
    xtype: 'registration.container',
    controller: 'registration-controller',
    cls: 'a-signup-wrap a-registration',
    showAnimation: 'fade',
    layout: {
        type: 'vbox',
        pack: 'middle',
    },
    items: [
        {
            xtype: 'abraxa.container',
            cls: 'a-signup-card',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    // minHeight: '440',
                    padding: 0,
                    reference: 'regpanel',
                    layout: {
                        type: 'card',
                        indicator: {
                            reference: 'indicator',
                            tapMode: 'item',
                            publishes: ['activeIndex', 'count'],
                            listeners: {
                                indicatortap: function () {
                                    let panel = this.up('panel');
                                    if (!panel.getActiveItem().validate()) {
                                        return false;
                                    }
                                },
                                previous: function () {
                                    let panel = this.up('panel');
                                    if (!panel.getActiveItem().validate()) {
                                        return false;
                                    }
                                },
                                next: function () {
                                    let panel = this.up('panel');
                                    if (!panel.getActiveItem().validate()) {
                                        return false;
                                    }
                                },
                            },
                        },
                        animation: 'slide',
                    },
                    bbar: {
                        reference: 'regbbar',
                        padding: '0 12 24 12',
                        items: [
                            {
                                text: 'Back',
                                ui: 'default large outlined',
                                handler: 'onPrevious',
                                bind: {
                                    disabled: '{indicator.activeIndex == 0}',
                                },
                            },
                            {
                                text: 'Next',
                                handler: 'onNext',
                                ui: 'accent large',
                                bind: {
                                    hidden: '{indicator.activeIndex == indicator.count - 1}',
                                },
                            },
                            {
                                text: 'Sign up',
                                handler: 'onSubmit',
                                ui: 'accent loading large',
                                cls: 'signup_button',
                                // enableToggle: true,
                                bind: {
                                    hidden: '{(indicator.activeIndex == indicator.count - 1) ? false : true}',
                                },
                            },
                        ],
                    },
                    items: [
                        {
                            xtype: 'registration.personal',
                        },
                        {
                            xtype: 'registration.company',
                        },
                        {
                            xtype: 'registration.initial.setup',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'text-center',
            margin: '32 0 0 0',
            html: "<div class='sign_up_text'>Already have an account? <a class='log_in' href='javascript:void(0)'>Login</a></div>",
        },
    ],
    listeners: {
        click: {
            element: 'element',
            delegate: 'a.log_in',
            fn: function () {
                auth0Login();
            },
        },
    },
});
