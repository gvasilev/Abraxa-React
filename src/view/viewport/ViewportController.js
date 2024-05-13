Ext.define('Abraxa.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.viewport',

    listen: {
        global: {
            beforeroutes: 'onBeforeRoutes',
        },
        // controller: {
        //     '*': {
        //         login: 'onLogin',
        //         logout: 'onLogout',
        //         unmatchedroute: 'handleUnmatchedRoute'
        //     }
        // }
    },

    routes: {
        login: 'handleLoginRoute',
        signup: 'handleSignup',
        registration_success: 'handleRegistrationSuccess',
        'userinvite/:args': {
            action: 'handleUserInvite',
            conditions: {
                ':args': '(.*)',
            },
        },
        'remoteToken/:token': {
            action: 'handleRemoteLogin',
            conditions: {
                ':token': '(.*)',
            },
        },
        // '*': {
        //     action: 'checkForSso',
        // },
    },

    // init: function () {
    //     if (window.location.href.indexOf('email=') > -1) {
    //         window.history.replaceState({}, document.title, "/#dashboard");
    //         this.redirectTo('dashboard', {
    //             replace: true
    //         });
    //     }
    // },

    onLaunch: function () {
        let me = this,
            tokens = window.location.hash.split('/');
        this.originalRoute = Abraxa.getApplication().getDefaultToken();
        if (tokens.includes('#userinvite')) return;

        if (tokens.includes('#signup')) {
            me.showAuth();
            return;
        }

        this.buildAuth0().then(function (promise) {
            me.checkLogin().then(function (content) {
                if (content.cache_cleared) {
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
                                            Ext.Viewport.getViewModel().set('appHasUpdate', false);
                                            window.location.reload();
                                        },
                                    },
                                ],
                            },
                        ],
                    });
                    return;
                }
                if (content.success == false && content.message == 'User not found') {
                    Ext.create('Ext.MessageBox', {
                        ui: 'warning',
                        title: 'Warning',
                        // testId: 'permissionsUpdateTeamsRulesMsgbox',
                        innerCls: 'a-bgr-white',
                        message: 'User not found <br> Please check your credentials',
                        // width: 300,
                        dataTitle: 'Warning',
                        modal: true,
                        draggable: false,
                        closable: false,
                        bbar: {
                            manageBorders: false,
                            items: [
                                '->',
                                {
                                    xtype: 'button',
                                    // iconCls: 'md-icon-exit-to-app',
                                    ui: 'action',
                                    text: 'Login',
                                    handler: function () {
                                        auth0Logout();
                                    },
                                },
                            ],
                        },
                    }).show();
                    return;
                }
                if (content.data) {
                    let user = Ext.Viewport.getViewModel().get('currentUser');
                    let company = Abraxa.getApplication()
                        .getController('AbraxaController')
                        .createCompanyModel(content.data.user.company);
                    company.custom_components().setData(content.data.user.company.custom_components);
                    user.setCompany(company);
                    user.mergeData(content.data.user);
                    if (content.data.user.signatures) {
                        user.signatures().setData(content.data.user.signatures);
                    }
                    if (content.data.user.offices) {
                        user.offices().setData(content.data.user.offices);
                    }
                    if (content.data.user.office) {
                        user.setOffice(new Abraxa.model.office.Office(Object.assign({}, content.data.user.office)));
                        if (content.data.user.office.emails) {
                            user.getOffice().emails().setData(content.data.user.office.emails);
                        }
                    }
                    Ext.Viewport.getViewModel().set('is_logged', true);
                    // Ext.state.Provider.get().restoreState();
                    me.identifyChameleon(user);
                    if (content.data.user.company_user && !content.data.user.company_user[0].is_active) {
                        me.suspendMsg();
                    } else if (content.data.user.needs_password_change) {
                        Ext.getApplication().logout();
                        window.location = content.data.user.needs_password_url;
                    } else {
                        me.parseHash(tokens);
                    }
                } else {
                    let currentURL = window.location.href;
                    if (currentURL.includes('#userinvite')) return;

                    if (window.location.hash === '#signup') {
                        me.showAuth();
                    } else {
                        // auth0Logout();
                    }
                }
            });
        });
        return;
        // this.initDirect();
        // this.restoreSession();
    },

    buildAuth0: function () {
        return new Ext.Promise(async function (resolve, reject) {
            const fetchAuthConfig = () => fetch('/auth_config.json');
            const response = await fetchAuthConfig();
            const config = await response.json();

            auth0Client = await auth0.createAuth0Client({
                domain: config.domain,
                clientId: config.clientId,
                organization: config.organization,
                // useRefreshTokens: true,
                // cacheLocation: 'localstorage',
            });

            let isAuthenticated = await auth0Client.isAuthenticated();
            const query = window.location.search;

            if (query.includes('code=') && query.includes('state=')) {
                // Process the login state
                await auth0Client.handleRedirectCallback().then(async () => {
                    await getIdToken();
                    isAuthenticated = await auth0Client.isAuthenticated();
                });
                // Use replaceState to redirect the user away and remove the querystring parameters
                window.history.replaceState({}, document.title, '/#dashboard');
            }

            if (isAuthenticated) {
                getIdToken();
                resolve();
            } else {
                await auth0Login();
                reject();
            }
        });
    },

    checkSSO: async function (code, state) {
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'sso',
            method: 'POST',
            jsonData: {
                code: code,
                state: state,
            },
            success: function (response, opts) {
                let res = Ext.decode(response.responseText);
                if (res.success) window.location.reload();
            },
        });
    },

    onBeforeRoutes: function (obj, route) {
        let containers = Ext.ComponentQuery.query('[cls~=a-right-container]'),
            grids = Ext.ComponentQuery.query('grid'),
            containersToHide = Ext.ComponentQuery.query('[cls~=needs_hide]'),
            containersToShow = Ext.ComponentQuery.query('[cls~=needs_show]'),
            lists = Ext.ComponentQuery.query('list');

        if (containers.length) {
            Ext.each(containers, function (container) {
                container.hide();
            });
        }

        if (grids.length) {
            Ext.each(grids, function (grid) {
                grid.deselectAll();
            });
        }

        // if (lists.length) {
        //     Ext.each(lists, function (list) {
        //         list.deselectAll();
        //     });
        // }
        if (containersToHide.length) {
            Ext.Array.each(containersToHide, function (value) {
                if (!value.isHidden()) {
                    value.setHidden(true);
                }
            });
        }
        if (containersToShow.length) {
            Ext.Array.each(containersToShow, function (value) {
                if (value.isHidden()) {
                    value.setHidden(false);
                }
            });
        }
        let appointmentMain = Ext.ComponentQuery.query('appointment\\.main')[0];
        if (appointmentMain) {
            appointmentMain.getVM().set('selectedInstruction', null);
        }

        if (Ext.ComponentQuery.query('dialog[xtype=invite\\.dialog]').length)
            Ext.ComponentQuery.query('dialog[xtype=invite\\.dialog]')[0].destroy();
        if (Ext.ComponentQuery.query('sheet[xtype=tasks\\.right\\.container]').length)
            Ext.ComponentQuery.query('sheet[xtype=tasks\\.right\\.container]')[0].destroy();
    },

    identifyChameleon(user) {
        chmln.identify(user.get('id'), {
            // Unique ID of each user in your database (e.g. 23443 or "590b80e5f433ea81b96c9bf6")
            email: user.get('email'), // Put quotes around text strings (e.g. "jim@example.com")
            created: user.get('created_at'), // Send dates in ISO or unix timestamp format (e.g. "2017-07-01T03:21:10Z" or 1431432000)
            name: user.get('first_name'),
            company: {
                // For B2B products, send company / account information here
                uid: user.get('current_company_id'), // Unique ID of the company / account in your database (e.g. 9832 or "590b80e5f433ea81b96c9bf7")
                name: user.get('company').name, // Send any data that appears within URLs, such as subdomains (e.g. "airbnb")
                spend: user.get('company').type,
            },
        });
    },

    showView: function (xtype) {
        var view = this.lookup(xtype),
            viewport = this.getView();
        if (!view) {
            viewport.removeAll(true);
            view = viewport.add({
                xtype: xtype,
                reference: xtype,
            });
        }

        viewport.setActiveItem(view);
    },

    showAuth: function () {
        this.showView('login');
    },

    loadMainView: function () {
        this.showView('main');
    },

    // ROUTING

    handleRemoteLogin: function (token) {
        if (token) {
            let me = this;
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'logout',
                method: 'POST',
                success: function (response, opts) {
                    Ext.Viewport.removeAll(true, true);
                    var date = new Date();
                    date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);
                    expires = '; expires=' + date.toUTCString();
                    document.cookie = 'token' + '=' + (token || '') + expires + '; path=/';
                    if (me.redirectTo('dashboard')) window.location.reload();
                },
            });

            // Ext.getApplication().logout();
        }
    },
    handleUserInvite: function (token) {
        let me = this;
        if (token) {
            this.parseUserInvite(token).then(function (response) {
                if (response.success) {
                    Ext.Viewport.removeAll(true, true);
                    me.getView().add(Ext.create('Abraxa.view.login.LoginContainer'));
                    Ext.ComponentQuery.query('login\\.dialog')[0].destroy();
                    Ext.ComponentQuery.query('main\\.new\\.user\\.password\\.dialog')[0].show(true);
                    me.getView().upVM().set('linkData', response.data);
                } else {
                    Ext.create('Ext.MessageBox', {
                        ui: 'warning',
                        title: 'Warning',
                        innerCls: 'a-bgr-white text-center',
                        message: response.message,
                        width: 300,
                        dataTitle: 'Warning',
                        modal: false,
                        bbar: {
                            manageBorders: false,
                            items: [
                                '->',
                                {
                                    xtype: 'button',
                                    text: 'Login',
                                    ui: 'action',
                                    handler: function () {
                                        Ext.getApplication().logout();
                                        this.up('dialog').destroy();
                                        // me.loadMainView();
                                    },
                                },
                            ],
                        },
                    }).show();
                }
            });
        }
    },
    handleLoginRoute: function () {
        let is_logged = Ext.Viewport.getViewModel().get('is_logged');

        if (is_logged) {
            var target = Abraxa.getApplication().getDefaultToken();
            this.redirectTo(target, {
                replace: true,
            });
        } else {
            Ext.Viewport.getViewModel().set('registration_mode', false);
            if (Ext.ComponentQuery.query('[cls=registration_complete]')[0]) {
                Ext.ComponentQuery.query('[cls=registration_complete]')[0].hide();
            }
            this.showAuth();
        }
    },

    handleSignup: function () {
        Ext.Viewport.getViewModel().set('registration_mode', true);
        Ext.Viewport.getViewModel().set('registration_success', false);
    },

    handleRegistrationSuccess: function () {
        Ext.Viewport.getViewModel().set('registration_mode', true);
        Ext.Viewport.getViewModel().set('registration_success', true);
    },

    handleUnmatchedRoute: function (route) {
        var me = this;

        // if (!me.session || !me.session.isValid()) {
        //     // There is no authenticated user, let's redirect to the login page but keep track
        //     // of the original route to restore the requested route after user authentication.
        //     me.originalRoute = route;
        //     me.redirectTo('login', {
        //         replace: true
        //     });
        //     return;
        // }

        // There is an authenticated user, so let's simply redirect to the default token.
        // var target = Abraxa.getApplication().getDefaultToken();
        // Ext.log.warn('Route unknown: ', route);

        // if (route !== target) {

        //     me.redirectTo(target, {
        //         replace: true
        //     });
        // }
    },

    // MAIN SHIT, BE CAREFUL
    parseHash: function (tokens) {
        if (tokens) {
            let mainVM = this.getView().getViewModel(),
                route = tokens[0].substr(1),
                me = this,
                invitationHash;
            switch (tokens[0].substr(1)) {
                case 'userinvite':
                    return false;
                    break;
                case 'signup':
                    me.showAuth();
                    break;
                default:
                    me.loadMainView();
            }
        }
    },

    checkLogin: function (login) {
        return new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'validate_token',
                method: 'POST',
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    resolve(res);
                },
                failure: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    resolve(res);
                },
            });
        });
    },
    parseUserInvite: function (hash) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'parse_user_invite/' + hash,
                method: 'GET',
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    resolve(res);
                },
            });
        });
    },
    //create password method for new invited users
    createPassword() {
        let me = this,
            view = this.getView(),
            vm = view.upVM(),
            form = view.lookup('formChangePassword'),
            values = form.getValues(),
            data = vm.get('linkData');
        if (form.validate()) {
            let password = values.newPassword;
            let rePassword = values.repeatPassword;
            if (password !== rePassword) {
                form.down('form\\.error').setHtml('Passwords do not match!').show().addCls('error');
                return false;
            }
            form.down('form\\.error').setHtml('').hide().removeCls('error');
            data.password = password;
            let setPassword = new Ext.Promise(function (resolve, reject) {
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'new_user_invite',
                    method: 'POST',
                    jsonData: data,
                    success: function (response, opts) {
                        var res = Ext.decode(response.responseText);
                        resolve(res);
                    },
                });
            });
            setPassword.then(function (data) {
                if (data.success) {
                    window.location.hash = '#dashboard';
                    window.location.reload();
                    // Ext.ComponentQuery.query('main\\.new\\.user\\.password\\.dialog')[0].hide(true);
                    // let user = vm.get('currentUser');
                    // let company = Abraxa.getApplication()
                    //     .getController('AbraxaController')
                    //     .createCompanyModel(data.user.company);
                    // company.custom_components().setData(data.user.company.custom_components);
                    // user.setCompany(company);
                    // user.mergeData(data.user);
                    // if (data.user.signatures) {
                    //     user.signatures().setData(data.user.signatures);
                    // }
                    // if (data.user.offices) {
                    //     user.offices().setData(data.user.offices);
                    // }
                    // if (data.user.office) {
                    //     user.setOffice(new Abraxa.model.office.Office(Object.assign({}, data.user.office)));
                    //     if (data.user.office.emails) {
                    //         user.getOffice().emails().setData(data.user.office.emails);
                    //     }
                    // }
                    // user.set('is_logged', true);
                    // vm.set('is_logged', true);
                    // me.identifyChameleon(user);
                    // me.redirectTo('dashboard', {
                    //     replce: true,
                    // });
                    // me.loadMainView();
                } else {
                    Ext.Msg.alert('Error', data.message);
                }
            });
        } else {
            let formErrorCmp = form.down('form\\.error');
            formErrorCmp
                .setHtml(formErrorCmp.customErrorMsg || 'Please fill all required fields')
                .show()
                .addCls('error');
            return false;
        }
    },

    showInvitation(id) {
        let mainVM = Ext.getCmp('main-viewport').getViewModel();
        mainVM.set('invitation_id', id);
    },
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

    // SESSION MANAGEMENT

    restoreSession: function () {
        var data = App.util.State.get('session'),
            session = data ? App.model.Session.loadData(data) : null;

        if (session && session.isValid()) {
            this.initiateSession(session);
        } else {
            this.terminateSession();
        }

        return session;
    },

    initiateSession: function (session) {
        this.setDirectToken(session.get('token'));
        this.saveSession(session);
        this.showMain();
    },

    terminateSession: function () {
        this.setDirectToken(null);
        this.saveSession(null);
        this.showAuth();
    },

    saveSession: function (session) {
        App.util.State.set('session', session && session.getData(true));
        this.getViewModel().set('user', session && session.getUser());
        this.session = session;
    },

    // AUTHENTICATION

    onLogin: function (session) {
        if (!session || !session.isValid()) {
            return false;
        }

        this.initiateSession(session);
        this.redirectTo(this.originalRoute, {
            replace: true,
        });
    },

    onLogout: function () {
        var me = this,
            view = me.getView(),
            session = me.session;

        if (!session || !session.isValid()) {
            return false;
        }

        view.setMasked({
            xtype: 'loadmask',
        });
        session
            .logout()
            .catch(function () {
                // TODO handle errors
            })
            .then(function () {
                me.originalRoute = Ext.History.getToken();
                me.terminateSession();
                view.setMasked(false);
                me.redirectTo('login', {
                    replace: true,
                });
            });
    },

    loginUser: function () {
        const me = this;
        me.checkLogin().then(function (content) {
            if (content.success == false && content.message == 'User not found') {
                Ext.create('Ext.MessageBox', {
                    ui: 'warning',
                    title: 'Warning',
                    // testId: 'permissionsUpdateTeamsRulesMsgbox',
                    innerCls: 'a-bgr-white',
                    message: 'User not found <br> Please check your credentials',
                    // width: 300,
                    dataTitle: 'Warning',
                    modal: true,
                    draggable: false,
                    closable: false,
                    bbar: {
                        manageBorders: false,
                        items: [
                            '->',
                            {
                                xtype: 'button',
                                // iconCls: 'md-icon-exit-to-app',
                                ui: 'action',
                                text: 'Login',
                                handler: function () {
                                    auth0Logout();
                                },
                            },
                        ],
                    },
                }).show();
                return;
            }
            if (content.data) {
                let user = Ext.Viewport.getViewModel().get('currentUser');
                let company = Abraxa.getApplication()
                    .getController('AbraxaController')
                    .createCompanyModel(content.data.user.company);
                company.custom_components().setData(content.data.user.company.custom_components);
                user.setCompany(company);
                user.mergeData(content.data.user);
                if (content.data.user.signatures) {
                    user.signatures().setData(content.data.user.signatures);
                }
                if (content.data.user.offices) {
                    user.offices().setData(content.data.user.offices);
                }
                if (content.data.user.office) {
                    user.setOffice(new Abraxa.model.office.Office(Object.assign({}, content.data.user.office)));
                    if (content.data.user.office.emails) {
                        user.getOffice().emails().setData(content.data.user.office.emails);
                    }
                }
                Ext.Viewport.getViewModel().set('is_logged', true);
                // Ext.state.Provider.get().restoreState();
                // me.identifyChameleon(user);
                if (content.data.user.company_user && !content.data.user.company_user[0].is_active) {
                    me.suspendMsg();
                } else if (content.data.user.needs_password_change) {
                    Ext.getApplication().logout();
                    window.location = content.data.user.needs_password_url;
                }
            } else {
                let currentURL = window.location.href;
                if (currentURL.includes('#userinvite')) return;

                if (window.location.hash === '#signup') {
                    me.showAuth();
                } else {
                    // auth0Logout();
                }
            }
        });
    }
});
