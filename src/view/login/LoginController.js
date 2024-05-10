Ext.define('Abraxa.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login-controller',

    login: function (me) {
        let view = this.getView(),
            btn = Ext.ComponentQuery.query('[cls="login_button"]')[0],
            form = view.down('login\\.form');

        if (form.validate()) {
            let values = form.getValues(),
                me = this;
            btn.setDisabled(true);
            btn.toggle();

            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'login',
                method: 'POST',
                jsonData: values,
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    if (!res.data) {
                        btn.setDisabled(false);
                        btn.toggle();
                        view.down('login\\.form').down('form\\.error').setHtml(res.message).show().addCls('error');
                    } else {
                        if (res.data.user.company_user && !res.data.user.company_user[0].is_active) {
                            btn.setDisabled(false);
                            btn.toggle();
                            Ext.Viewport.removeAll(true, true);
                            me.suspendMsg();
                        } else if (res.data.user.needs_password_change) {
                            Ext.getApplication().logout();
                            window.location = res.data.user.needs_password_url;
                        } else {
                            view.down('login\\.form').down('form\\.error').setHtml(res.error_description).hide();
                            btn.setDisabled(false);
                            let mainVM = Ext.Viewport.getViewModel(),
                                user = new Abraxa.model.common.User(),
                                routeHash = mainVM.get('routeHash'),
                                appHasUpdate = mainVM.get('appHasUpdate');
                            // if (!routeHash || routeHash == '#')
                            //     window.location.hash = '#dashboard';

                            Ext.state.Provider.get().restoreState();
                            let company = Abraxa.getApplication()
                                .getController('AbraxaController')
                                .createCompanyModel(res.data.user.company);
                            company.custom_components().setData(res.data.user.company.custom_components);
                            user.mergeData(res.data.user);
                            user.setCompany(company);
                            if (res.data.user.signatures) {
                                user.signatures().setData(res.data.user.signatures);
                            }
                            if (res.data.user.offices) {
                                user.offices().setData(res.data.user.offices);
                            }
                            if (res.data.user.office) {
                                user.setOffice(new Abraxa.model.office.Office(Object.assign({}, res.data.user.office)));
                                if (res.data.user.office.emails) {
                                    user.getOffice().emails().setData(res.data.user.office.emails);
                                }
                            }
                            mainVM.set('is_logged', true);
                            mainVM.set('currentUser', user);
                            chmln.identify(user.get('id'), {
                                // Unique ID of each user in your database (e.g. 23443 or "590b80e5f433ea81b96c9bf6")
                                email: user.get('email'), // Put quotes around text strings (e.g. "jim@example.com")
                                created: user.get('created_at'), // Send dates in ISO or unix timestamp format (e.g. "2017-07-01T03:21:10Z" or 1431432000)
                                name: user.get('first_name'),
                                company: {
                                    // For B2B products, send company / account information here
                                    uid: user.get('current_company_id'), // Unique ID of the company / account in your database (e.g. 9832 or "590b80e5f433ea81b96c9bf7")
                                    name: user.get('company').name, // Send any data that appears within URLs, such as subdomains (e.g. "airbnb")
                                    spend: user.get('company').type, // Send any data that appears within URLs, such as subdomains (e.g. "airbnb")
                                },
                            });
                            // me.registerStateProvider(user.get('id'));
                            // Ext.ComponentQuery.query('login\\.container')[0].destroy();
                            Ext.Viewport.getController().loadMainView();

                            if (routeHash === '#invitations') {
                                window.location.hash = 'portcalls';
                                if (mainVM.get('linkData').tenant_id == user.get('company').id) {
                                    Ext.getCmp('main-viewport')
                                        .getController()
                                        .showInvitation(mainVM.get('linkData').id);
                                }
                            }

                            if (appHasUpdate) {
                                Ext.Msg.show({
                                    width: 440,
                                    closable: false,
                                    title: false,
                                    cls: 'text-center',
                                    buttonToolbar: {
                                        hidden: true,
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            html:
                                                "<div class='my-16'><img src='https://static.abraxa.com/images/logo.svg' alt='Abraxa' height='16' /></div>" +
                                                "<div class='display-1 my-24'>Updates available</div>" +
                                                "<div class='my-24'><img src='https://static.abraxa.com/images/img-hooray.png' alt='Abraxa' /></div>" +
                                                "<div class='display-3 mt-24 text-left'><div class='pl-24'><span class='mb-16'>In a constant effort to improve your experience we have made a <b>new update</b> available.</span></div></div>",
                                        },
                                        {
                                            xtype: 'container',
                                            margin: '16 0 0 0',
                                            layout: {
                                                type: 'hbox',
                                                pack: 'center',
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: 'Update',
                                                    cls: 'a-no-content-btn',
                                                    iconCls: 'md-icon-refresh',
                                                    ui: 'action round',
                                                    handler: function (button) {
                                                        Ext.getCmp('main-viewport').getVM().set('appHasUpdate', false);
                                                        window.location.reload();
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                });
                            }
                        }
                        // window.location.hash = '#dashboard';
                    }
                },
                failure: function (batch) {
                    var res = Ext.decode(batch.responseText);
                    btn.setDisabled(false);
                    btn.toggle();
                    view.down('login\\.form').down('form\\.error').setHtml(res.message).show().addCls('error');
                },
            });
        } else {
            btn.setDisabled(false);
            view.down('login\\.form')
                .down('form\\.error')
                .setHtml('Please fill all required fields')
                .show()
                .addCls('error');
        }
    },

    resendVerification: function (email) {
        let view = this.getView(),
            form = view.down('login\\.form');

        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'resend_verification',
            method: 'POST',
            jsonData: {
                email: email,
            },
            success: function (response, opts) {
                var res = Ext.decode(response.responseText);
                if (res.success) {
                    view.down('login\\.form').down('form\\.error').setHtml(res.message).show().addCls('success');
                } else {
                }
            },
        });
    },

    forgotPassword: function () {
        let email = Ext.ComponentQuery.query('[cls=forgot_password_mail]')[0].getValue(),
            view = this.getView(),
            form = view.down('forgot\\.password\\.form'),
            reset_password_button = form.down('[cls~=reset_password_button]');

        if (form.validate()) {
            reset_password_button.toggle();
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'reset_password',
                method: 'POST',
                jsonData: {
                    email: email,
                },
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    if (res.success) {
                        view.down('forgot\\.password\\.form')
                            .down('form\\.error')
                            .setHtml(res.message)
                            .show()
                            .addCls('success');
                        reset_password_button.toggle();
                    }
                },
                failure: function (response) {
                    var res = Ext.decode(response.responseText);
                    view.down('forgot\\.password\\.form')
                        .down('form\\.error')
                        .setHtml(res.message)
                        .show()
                        .addCls('erroe');
                    reset_password_button.toggle();
                },
            });
        } else {
            form.down('form\\.error').setHtml('Please enter your email address.').show().addCls('error');
        }
    },

    // registerStateProvider: function (user_id) {
    //     Ext.state.Provider.register(new Abraxa.core.components.StateProvider({
    //         url: Env.ApiEndpoint + 'app_state',
    //         stateRestoredCallback: function () {
    //             // if (!v) {
    //             //     v = Ext.create('App.view.Viewport');
    //             // }
    //         }
    //     }));
    // },

    suspendMsg: function () {
        Ext.create('Ext.MessageBox', {
            ui: 'warning',
            title: 'Account suspended',
            innerCls: 'a-bgr-white',
            message:
                'Your account is <b>suspended</b>.<br><br><small>For more details, please contact your organization administrator.</small>',
            width: 300,
            dataTitle: 'Warning',
            modal: true,
            draggable: false,
            bbar: {
                manageBorders: false,
                items: [
                    '->',
                    {
                        xtype: 'button',
                        ui: 'action',
                        text: 'Ok',
                        handler: function () {
                            this.up('dialog').destroy();
                            Ext.getApplication().logout();
                        },
                    },
                ],
            },
        }).show();
    },
});
