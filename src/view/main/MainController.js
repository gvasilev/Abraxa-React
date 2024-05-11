import './ViewportMask';
Ext.define('Abraxa.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-controller',

    listen: {
        controller: {
            '*': {
                // unmatchedroute: 'handleUnmatchedRoute',
            },
        },

        global: {
            updateNewPortNewsCount: function () {
                const vm = this.getViewModel();
                Ext.create('Abraxa.store.portnews.PortNewsCountNew').load({
                    callback: function (records, operation, success) {
                        if (success) {
                            vm.set('newsFeedCount', records[0].get('count'));
                        } else {
                            vm.set('newsFeedCount', 0);
                        }
                    },
                });
            },
        },
    },
    routes: {
        ':type(/:args)?': {
            action: 'handleNavigationRoute',
            conditions: {
                // NOTE(SB): how to build this list automatically from the Menu store?
                ':type':
                    '(dashboard|portcalls|inquiries|companydatabase|taskmanager|settings|billing|404|design|profile|wpsboard|inbox|calculator|portnews|operations|comingsoon)',
                ':args': '(.*)',
            },
        },
        ':type/:id(/:args)?': {
            action: 'handleDataRoute',
            conditions: {
                ':type': '(company)',
                ':id': '([a-f0-9-]{36}|create|edit|[0-9]+)',
                ':args': '(.*)',
            },
        },
        'portcall/:id(/:args)?': {
            action: 'handlePortcallRoute',
            conditions: {
                ':id': '([a-f0-9-]{36}|create|edit|[0-9]+)',
                ':args': '(.*)',
            },
            lazy: true,
        },
        'inquiry/:id': {
            action: 'handleInquiryRoute',
            conditions: {
                ':id': '([a-f0-9-]{36}|create|edit|[0-9]+)',
                ':args': '(.*)',
            },
            handlers: [
                {
                    before: 'onBefore',
                    scope: {
                        onBefore: function (id, action) {
                            if (Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') != 'agent') {
                                // other roles can't access this module
                                Ext.getCmp('main-viewport').getController().redirectTo('404');
                                return;
                            }
                            action.resume();
                        },
                    },
                },
            ],
        },
        'invitations/:id': {
            action: 'handleInvitationRoute',
        },
        'inquiry/:id/:type(/:args)?': {
            action: 'handleInquiryRoute',
            conditions: {
                ':type': '(pda)',
                ':id': '([a-f0-9-]{36}|create|edit|[0-9]+)',
                ':args': '(.*)',
            },
            handlers: [
                {
                    before: 'onBefore',
                    scope: {
                        onBefore: function (id, type, args, action) {
                            if (Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') != 'agent') {
                                // other roles can't access this module
                                Ext.getCmp('main-viewport').getController().redirectTo('404');
                                return;
                            }
                            if (action) {
                                action.resume();
                            }
                        },
                    },
                },
            ],
        },

        'profiles(/:id)': {
            action: 'handleProfileInfoRoute',
        },

        // 'port-info/:id': {
        //     action: 'handlePortInfoRoute',
        //     conditions: {
        //         ':id': '([a-f0-9-]{36}|[0-9]+)',
        //     },
        // },
        // 'port-info/:id/:tab': {
        //     action: 'handlePortInfoRoute',
        //     conditions: {
        //         ':id': '([a-f0-9-]{36}|[0-9]+)',
        //     },
        // },
        // 'port-info/:id/:tab(/:args)?': {
        //     action: 'handlePortInfoRoute',
        // },
        'port-info(/:id)(/:tab)(/:tabId)': {
            action: 'handlePortInfoRoute',
        },
        directory: {
            handlers: [
                {
                    before: 'onBefore',
                    scope: {
                        onBefore: function (action) {
                            if (
                                Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') != 'principal'
                            ) {
                                // other roles can't access this module
                                Ext.getCmp('main-viewport').getController().redirectTo('404');
                                return;
                            }
                            Ext.getCmp('main-viewport').getController().redirectTo('directory/agents');
                            action.resume();
                        },
                    },
                },
            ],
        },
        'directory/:tab': {
            action: 'handleDirectoryRoute',
            conditions: {
                ':tab': '(agents|ports)',
            },
            handlers: [
                {
                    before: 'onBefore',
                    scope: {
                        onBefore: function (tab, action) {
                            if (
                                Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') != 'principal'
                            ) {
                                // other roles can't access this module
                                Ext.getCmp('main-viewport').getController().redirectTo('404');
                                return;
                            }
                            if (tab === 'agents' || tab === 'ports') {
                                action.resume();
                            } else {
                                Ext.getCmp('main-viewport').getController().redirectTo('directory/agents');
                                return;
                            }
                        },
                    },
                },
            ],
        },
        'voyage/create': {
            action: 'handleCreateVoyageRoute',
        },
        'voyage/:id/:action(/:appointmentId)': {
            action: 'handleCreateVoyageRoute',
            conditions: {
                ':action': '(update|appoint)',
            },
        },
        'voyage/:id/:action(/:appointmentId)': {
            action: 'handleCreateVoyageRoute',
            conditions: {
                ':action': '(update|appoint)',
            },
        },
        'appointment/create': {
            action: 'handleCreateAppointmentRoute',
        },
    },

    // registerStateProvider: function () {
    //     Ext.state.Provider.register(new Abraxa.core.components.StateProvider({
    //         url: Env.ApiEndpoint + 'app_state',
    //         stateRestoredCallback: function () {
    //             console.log('RESTORE')
    //         }
    //     }));
    // },

    init: function () {
        this.getView().setMasked({
            xtype: 'viewport.mask',
        });
        this.redirectTo(window.location.hash.substring(1), {
            force: true,
        });

        var map = new Ext.util.KeyMap({
            target: window,
            key: 'f',
            shift: true,
            ctrl: true,
            handler: function () {
                Ext.create('Abraxa.ElasticSearch').show();
            },
        });
    },

    /**
     * @param {String} ref Component reference, MUST be valid.
     * @protected
     */
    activate: function (ref) {
        var view = ref.isComponent ? ref : this.lookup(ref),
            child = view,
            parent;
        while ((parent = child.getParent())) {
            parent.setActiveItem(child);
            child = parent;
        }
        return view;
    },

    ensureView: function (id, config, route) {
        var container = this.getContainerForViewId(id);

        var item = container.child('component[viewId=' + id + ']'),
            reset = !!item;
        if (!item) {
            container.removeAll(true, false);
            Ext.getCmp('main-viewport').setMasked({
                xtype: 'viewport.mask',
            });
            item = container.add(
                Ext.apply(
                    {
                        viewId: id,
                        hidden: true,
                        hideMode: 'clip',
                        bind: {
                            hidden: '{routeHash != "#' + id + '" ? true : false}',
                        },
                    },
                    config
                )
            );
        }

        if (Ext.isDefined(item.config.route)) {
            item.setRoute(route);
        }

        // Reset the component (form?) only if previously instantiated (i.e. with outdated data).
        if (reset && Ext.isFunction(item.reset)) {
            item.reset();
        }
        return item;
    },

    getContainerForViewId: function () {
        return this.getView();
    },

    handleNavigationRoute: function (type, args) {
        var me = this,
            store = Ext.getStore('View'),
            entry = store.getById(type);
        // Ext.getCmp('main-viewport').removeAll(true, false);

        if (type === 'directory') {
            if (Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') !== 'principal') {
                // other roles can't access this module
                this.redirectTo('404', {
                    replace: true,
                });
                return;
            }
            if (!args) {
                me.redirectTo('directory/agents');
                return;
            }
        }
        if (type === 'operations') {
            if (Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') !== 'principal') {
                // other roles can't access this module
                this.redirectTo('404', {
                    replace: true,
                });
                return;
            }
            if (!args) {
                me.redirectTo('port-calls');
                return;
            }
        }
        if (type === 'portcalls') {
            if (Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') !== 'agent') {
                // other roles can't access this module
                this.redirectTo('404', {
                    replace: true,
                });
                return;
            }
        }

        Ext.Viewport.getViewModel().set('routeHash', '#' + entry.get('id'));
        Ext.Viewport.getViewModel().set('routeParams', args);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('object_record', null);
        me.getViewModel().set('objectPermissions', null);
        me.getViewModel().set('object_type', null);
        // this.lookup('mainmenu').setSelection(entry);
        if (!type) {
            return;
        }

        this.activate(
            this.ensureView(
                type,
                {
                    xtype: entry.get('xtype'),
                },
                args
            )
        );
        Ext.getCmp('main-viewport').setMasked(false);
    },

    handlePortcallRoute: function (id, args) {
        Ext.getCmp('main-viewport').setMasked({
            xtype: 'viewport.mask',
        });
        var me = this,
            args = Ext.Array.clean((args || '').split('/')),
            type = 'portcall',
            xtype,
            view;

        xtype = Env.currentUser.get('company').type + 'portcall.main';

        // leave a developer message in case of new types addition
        if (!Ext.ClassManager.getNameByAlias('widget.' + xtype)) {
            Ext.log.error('Invalid route: no view for xtype: ' + xtype);
        }

        Ext.Viewport.getViewModel().set('routeHash', '#' + type);
        Ext.Viewport.getViewModel().set('routeParams', id);
        Ext.Viewport.getViewModel().set('routeExtraParams', args[0] ? args[0] : null);

        //this is need when switch between object records
        //for example from inquiry to portcall
        //and this clear fix lot of errors
        me.getViewModel().set('object_record', null);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        // me.getViewModel().set('objectPermissions', null);
        // me.getViewModel().set('object_type', type);

        view = this.activate(
            this.ensureView(
                type,
                {
                    xtype: xtype,
                },
                args
            )
        );

        if (view.getRecord() && view.getRecord().get('id') == id) {
            Ext.getCmp('main-viewport').setMasked(false);
            //This must be here to load payments every time
            if (args[0] === 'payments') {
                const vm = Ext.ComponentQuery.query('portcall\\.main')[0].getViewModel();
                const paymentsGrid = view.down('payments\\.grid');
                paymentsGrid.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading...',
                });
                paymentsGrid.getStore().load({
                    callback: function () {
                        paymentsGrid.setMasked(false);
                    },
                });
            }
        }
        view.loadRecord(id, args);
    },

    handleDataRoute: function (type, id, args) {
        // Ext.getCmp('main-viewport').removeAll(true, false);
        Ext.getCmp('main-viewport').setMasked({
            xtype: 'viewport.mask',
        });
        var me = this,
            args = Ext.Array.clean((args || '').split('/')),
            Model = Abraxa.model[type][Ext.String.capitalize(type)],
            action,
            xtype,
            view;
        xtype = type;
        // leave a developer message in case of new types addition
        if (!Ext.ClassManager.getNameByAlias('widget.' + xtype)) {
            Ext.log.error('Invalid route: no view for xtype: ' + xtype);
        }
        // if (id == null) {
        //     view.setRecord(new Model());
        //     me.activate(view);
        //     return;
        // }

        Ext.Viewport.getViewModel().set('routeHash', '#' + type);
        Ext.Viewport.getViewModel().set('routeParams', id);
        Ext.Viewport.getViewModel().set('routeExtraParams', args[0] ? args[0] : null);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('object_record', null);
        me.getViewModel().set('objectPermissions', null);
        me.getViewModel().set('object_type', type);
        view = this.ensureView(
            type,
            {
                xtype: xtype,
            },
            args
        );
        Model.load(id, {
            callback: function (record, operation, success) {
                if (operation.error && operation.error.status == 404) {
                    me.redirectTo('404', {
                        replace: true,
                    });
                    return;
                }
                if (operation.error && operation.error.status == 403) {
                    let els = document.getElementsByClassName('x-mask'),
                        history = me.getViewModel().get('history');
                    Ext.create('Ext.MessageBox', {
                        ui: 'warning',
                        title: 'Permissions',
                        innerCls: 'a-bgr-white',
                        message:
                            '<div class="text-center mt-8"><i class="md-icon-outlined fs-64">lock</i><p class="mb-0">You don\'t have permissions to view the selected port call.</p></div>',
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
                                    iconCls: 'md-icon-refresh',
                                    ui: 'action',
                                    text: 'Dashboard',
                                    hidden: history > 1 ? true : false,
                                    handler: function () {
                                        me.redirectTo('dashboard', {
                                            replace: true,
                                        });
                                        Ext.Array.each(els, function (el) {
                                            el.classList.remove('a-blurred');
                                        });
                                        this.up('dialog').destroy();
                                        return;
                                    },
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-arrow-back',
                                    ui: 'action',
                                    text: 'Back',
                                    hidden: history > 1 ? false : true,
                                    handler: function () {
                                        window.history.back();
                                        Ext.Array.each(els, function (el) {
                                            el.classList.remove('a-blurred');
                                        });
                                        this.up('dialog').destroy();
                                        return;
                                    },
                                },
                            ],
                        },
                    }).show();
                    Ext.Array.each(els, function (el) {
                        el.classList.add('a-blurred');
                    });
                    return;
                }

                if (!operation.error) {
                    if (type === 'portcall') {
                        var vm = me.getViewModel(),
                            store = Ext.getStore('portcalls');
                        if (store) {
                            store.add(record);
                            store.commitChanges();
                        }
                        vm.set('object_id', 3);
                    }

                    if (type === 'company') {
                        var vm = me.getViewModel(),
                            store = Ext.getStore('cdb');

                        if (store) {
                            store.add(record);
                            store.commitChanges();
                        }
                        vm.set('object_id', 2);
                    }
                    vm.set('object_record', record);
                    me.activate(view);
                }
            },
        });
    },

    handleInquiryRoute: function (id, type, args) {
        Ext.getCmp('main-viewport').setMasked({
            xtype: 'viewport.mask',
        });
        var me = this,
            args = Ext.Array.clean((args || '').split('/')),
            action,
            xtype,
            Model,
            view;
        if (!type) {
            type = 'inquiry';
            Model = Abraxa.model[type][Ext.String.capitalize(type)];
        } else {
            let hash = Ext.Array.clean((type || '').split('/'));
            type = hash[0];
        }

        xtype = type;
        // leave a developer message in case of new types addition
        if (!Ext.ClassManager.getNameByAlias('widget.' + xtype)) {
            Ext.log.error('Invalid route: no view for xtype: ' + xtype);
        }
        Ext.Viewport.getViewModel().set('routeHash', '#' + type);
        Ext.Viewport.getViewModel().set('routeParams', id);
        Ext.Viewport.getViewModel().set('routeExtraParams', args[0] ? args[0] : null);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('object_record', null);
        me.getViewModel().set('objectPermissions', null);
        me.getViewModel().set('object_type', type);
        view = this.ensureView(
            type,
            {
                xtype: xtype,
            },
            args
        );
        if (type == 'inquiry') {
            Model.load(id, {
                callback: function (record, operation, success) {
                    if (operation.error && operation.error.status == 404) {
                        me.redirectTo('404', {
                            replace: true,
                        });
                        return;
                    }
                    if (operation.error && operation.error.status == 401) {
                        me.redirectTo('404', {
                            replace: true,
                        });
                        return;
                    }
                    if (operation.error && operation.error.status == 403) {
                        let els = document.getElementsByClassName('x-mask'),
                            history = me.getViewModel().get('history');
                        Ext.create('Ext.MessageBox', {
                            ui: 'warning',
                            title: 'Permissions',
                            innerCls: 'a-bgr-white',
                            message:
                                '<div class="text-center mt-8"><i class="md-icon-outlined fs-64">lock</i><p class="mb-0">You don\'t have permissions to view the selected port call.</p></div>',
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
                                        iconCls: 'md-icon-refresh',
                                        ui: 'action',
                                        text: 'Dashboard',
                                        hidden: history > 1 ? true : false,
                                        handler: function () {
                                            me.redirectTo('dashboard', {
                                                replace: true,
                                            });
                                            Ext.Array.each(els, function (el) {
                                                el.classList.remove('a-blurred');
                                            });
                                            this.up('dialog').destroy();
                                            return;
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-arrow-back',
                                        ui: 'action',
                                        text: 'Back',
                                        hidden: history > 1 ? false : true,
                                        handler: function () {
                                            window.history.back();
                                            Ext.Array.each(els, function (el) {
                                                el.classList.remove('a-blurred');
                                            });
                                            this.up('dialog').destroy();
                                            return;
                                        },
                                    },
                                ],
                            },
                        }).show();
                        Ext.Array.each(els, function (el) {
                            el.classList.add('a-blurred');
                        });

                        return;
                    }

                    var vm = me.getViewModel(),
                        store = Ext.getStore('inquiries');
                    if (store) {
                        store.add(record);
                        store.commitChanges();
                    }
                    vm.set('object_record', record);
                    vm.set('object_id', 6);
                    vm.set('execInquiryDefaults', new Date());
                },
            });
        } else {
            view.getVM().set('inquiry_id', id);
            view.getVM().set('pda_id', args[0]);
            view.getVM().set('execPdaDefaults', new Date());
        }
        me.activate(view);
    },
    handleInvitationRoute: function (id, type, args) {
        let me = this;
        this.parseInvitation(id).then(function (response) {
            if (response.success) {
                // This was originally allways redirecting to #portcalls, but for Principal users
                // there is no #portcalls route and a 404 page was being shown.
                // This case happened only when a Principal user clicks on an invitation link and is logged in.
                const currentUserCompany = Env.currentUser.getCompany();
                let redirectHash = 'portcalls';

                if (currentUserCompany.get('type') === 'principal') {
                    redirectHash = 'operations/port-calls';
                }

                me.redirectTo(redirectHash, {
                    replace: true,
                });
                if (response.data.tenant_id === currentUserCompany.get('id')) {
                    me.getViewModel().set('invitation_id', response.data.id);
                }
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
                                text: 'Ok',
                                handler: function () {
                                    me.redirectTo('dashboard', {
                                        replace: true,
                                    });
                                    me.loadMainView();
                                },
                            },
                        ],
                    },
                }).show();
            }
        });
        // me.getViewModel().set('invitation_id', id);
    },
    parseInvitation: function (hash) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'parse_invitation/' + hash,
                method: 'GET',
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    resolve(res);
                },
            });
        });
    },
    handleUnmatchedRoute: function (route) {
        this.redirectTo('404');
    },

    handleProfileInfoRoute: function (profileId) {
        let me = this,
            tab = 'profiles',
            xtype = 'DirectoryAgentsContainer',
            Model = Abraxa.model.directory.Agents,
            view;
        if (Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') != 'principal') {
            // other roles can't access this module
            me.redirectTo('404');
            return;
        }
        Ext.Viewport.getViewModel().set('routeParams', profileId);

        Ext.Viewport.getViewModel().set('routeParams', profileId);
        Ext.Viewport.getViewModel().set('routeHash', '#' + tab);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('objectPermissions', null);

        if (!me.getViewModel().get('object_record')) {
            //clear all before render this is need when hit directly new port in url
            //for example when you are in port with id 5128 and hit 325
            Ext.getCmp('main-viewport').removeAll(true, false);
            Ext.getCmp('main-viewport').setMasked({
                xtype: 'viewport.mask',
            });
        } else {
            if (
                me.getViewModel().get('object_record') &&
                me.getViewModel().get('object_record').get('id') != profileId
            ) {
                //clear all before render this is need when hit directly new port in url
                //for example when you are in port with id 5128 and hit 325
                Ext.getCmp('main-viewport').removeAll(true, false);
                Ext.getCmp('main-viewport').setMasked({
                    xtype: 'viewport.mask',
                });
            }
        }

        view = this.ensureView(tab, {
            xtype: xtype,
        });

        let extistingModel = me.getViewModel().get('object_record');
        if (!extistingModel || extistingModel.get('id') != profileId) {
            Model.load(profileId, {
                callback: function (record, operation, success) {
                    if (operation.error && operation.error.status == 404) {
                        me.redirectTo('404', {
                            replace: true,
                        });
                        return;
                    }
                    if (operation.error && operation.error.status == 401) {
                        me.redirectTo('404', {
                            replace: true,
                        });
                        return;
                    }
                    if (operation.error && operation.error.status == 403) {
                        let els = document.getElementsByClassName('x-mask'),
                            history = me.getViewModel().get('history');
                        Ext.create('Ext.MessageBox', {
                            ui: 'warning',
                            title: 'Permissions',
                            innerCls: 'a-bgr-white',
                            message:
                                '<div class="text-center mt-8"><i class="md-icon-outlined fs-64">lock</i><p class="mb-0">You don\'t have permissions to view the selected port call.</p></div>',
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
                                        iconCls: 'md-icon-refresh',
                                        ui: 'action',
                                        text: 'Dashboard',
                                        hidden: history > 1 ? true : false,
                                        handler: function () {
                                            me.redirectTo('dashboard', {
                                                replace: true,
                                            });
                                            Ext.Array.each(els, function (el) {
                                                el.classList.remove('a-blurred');
                                            });
                                            this.up('dialog').destroy();
                                            return;
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-arrow-back',
                                        ui: 'action',
                                        text: 'Back',
                                        hidden: history > 1 ? false : true,
                                        handler: function () {
                                            window.history.back();
                                            Ext.Array.each(els, function (el) {
                                                el.classList.remove('a-blurred');
                                            });
                                            this.up('dialog').destroy();
                                            return;
                                        },
                                    },
                                ],
                            },
                        }).show();
                        Ext.Array.each(els, function (el) {
                            el.classList.add('a-blurred');
                        });

                        return;
                    }
                    me.getViewModel().set('object_record', record);
                    view.getVM().set('execPortDefaults', new Date());
                },
            });
        }

        me.activate(view);
    },

    //handle #port-info/{id}/{tab?}/{tabRecordId?}
    //id must be valid port id
    //tabs are terminal/berths/holidays/agents
    //tabRecordId or subTabId is selection of current tab (subTab) for example #port-info/323/terminal/893
    handlePortInfoRoute: function (portId, subTab, subTabId) {
        let me = this,
            tab = 'port-info',
            xtype = 'PortDetailsMainView',
            Model = Abraxa.model.directory.Ports,
            view;
        if (Ext.Viewport.getViewModel().get('currentUser').getCompany().get('type') != 'principal') {
            // other roles can't access this module
            me.redirectTo('404');
            return;
        }
        Ext.Viewport.getViewModel().set('routeParams', portId);
        Ext.Viewport.getViewModel().set('routeHash', '#' + tab);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('objectPermissions', null);
        if (!me.getViewModel().get('object_record')) {
            //clear all before render this is need when hit directly new port in url
            //for example when you are in port with id 5128 and hit 325
            Ext.getCmp('main-viewport').removeAll(true, false);
            Ext.getCmp('main-viewport').setMasked({
                xtype: 'viewport.mask',
            });
        } else {
            if (me.getViewModel().get('object_record') && me.getViewModel().get('object_record').get('id') != portId) {
                //clear all before render this is need when hit directly new port in url
                //for example when you are in port with id 5128 and hit 325
                Ext.getCmp('main-viewport').removeAll(true, false);
                Ext.getCmp('main-viewport').setMasked({
                    xtype: 'viewport.mask',
                });
            }
        }
        view = this.ensureView(tab, {
            xtype: xtype,
        });
        //clears subtab and subtab id when route is change from one port to another
        view.getVM().set('subTab', null);
        view.getVM().set('subTabId', null);
        let extistingModel = me.getViewModel().get('object_record');
        if (!extistingModel || extistingModel.get('id') != portId) {
            Model.load(portId, {
                callback: function (record, operation, success) {
                    if (operation.error && operation.error.status == 404) {
                        me.redirectTo('404', {
                            replace: true,
                        });
                        return;
                    }
                    if (operation.error && operation.error.status == 401) {
                        me.redirectTo('404', {
                            replace: true,
                        });
                        return;
                    }
                    if (operation.error && operation.error.status == 403) {
                        let els = document.getElementsByClassName('x-mask'),
                            history = me.getViewModel().get('history');
                        Ext.create('Ext.MessageBox', {
                            ui: 'warning',
                            title: 'Permissions',
                            innerCls: 'a-bgr-white',
                            message:
                                '<div class="text-center mt-8"><i class="md-icon-outlined fs-64">lock</i><p class="mb-0">You don\'t have permissions to view the selected port call.</p></div>',
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
                                        iconCls: 'md-icon-refresh',
                                        ui: 'action',
                                        text: 'Dashboard',
                                        hidden: history > 1 ? true : false,
                                        handler: function () {
                                            me.redirectTo('dashboard', {
                                                replace: true,
                                            });
                                            Ext.Array.each(els, function (el) {
                                                el.classList.remove('a-blurred');
                                            });
                                            this.up('dialog').destroy();
                                            return;
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-arrow-back',
                                        ui: 'action',
                                        text: 'Back',
                                        hidden: history > 1 ? false : true,
                                        handler: function () {
                                            window.history.back();
                                            Ext.Array.each(els, function (el) {
                                                el.classList.remove('a-blurred');
                                            });
                                            this.up('dialog').destroy();
                                            return;
                                        },
                                    },
                                ],
                            },
                        }).show();
                        Ext.Array.each(els, function (el) {
                            el.classList.add('a-blurred');
                        });

                        return;
                    }
                    me.getViewModel().set('object_record', record);
                    view.getVM().set('execPortDefaults', new Date());
                    //set tab and tab id during load port model

                    if (subTab) {
                        view.getVM().set('subTab', subTab);
                    }
                    if (subTabId) {
                        view.getVM().set('subTabId', subTabId);
                    }
                },
            });
        } else {
            //already loaded port-info view only change tabs
            if (subTab) {
                view.getVM().set('subTab', subTab);
            }
            if (subTabId) {
                view.getVM().set('subTabId', subTabId);
            }
        }
        me.activate(view);
    },

    handleDirectoryRoute: function (tab) {
        var me = this,
            type = 'directory',
            store = Ext.getStore('View'),
            entry = store.getById(type);
        Ext.Viewport.getViewModel().set('routeHash', '#' + entry.get('id'));
        Ext.Viewport.getViewModel().set('routeParams', tab);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('object_record', null);
        me.getViewModel().set('objectPermissions', null);
        me.getViewModel().set('object_type', null);

        if (!type) {
            return;
        }

        this.activate(
            this.ensureView(type, {
                xtype: entry.get('xtype'),
            })
        );
        Ext.getCmp('main-viewport').setMasked(false);
    },

    handleCreateVoyageRoute: function (id, action, appointmentId) {
        var me = this,
            type = 'voyage/create',
            xtype,
            view;

        if (Env.currentUser.get('company').type !== 'principal') {
            this.redirectTo('404', {
                replace: true,
            });
            return;
        }

        xtype = 'CreateVoyage';
        if (action && action === 'appoint') {
            type = 'voyage';
            xtype = 'VoyageMainView';
        }
        // leave a developer message in case of new types addition
        if (!Ext.ClassManager.getNameByAlias('widget.' + xtype)) {
            Ext.log.error('Invalid route: no view for xtype: ' + xtype);
        }
        Ext.Viewport.getViewModel().set('routeHash', '#voyage');
        Ext.Viewport.getViewModel().set('routeParams', id);
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('objectPermissions', null);
        view = this.activate(
            this.ensureView(type, {
                xtype: xtype,
            })
        );
        if (action && action === 'appoint') {
            view.loadRecord(id, appointmentId);
        } else {
            view.setBind({
                hidden: null,
            });
            view.setHidden(false);
            view.initializeRecord(id);
        }
    },

    handleCreateAppointmentRoute: function () {
        var me = this,
            type = 'appointment/create',
            xtype,
            view;

        if (Env.currentUser.get('company').type !== 'principal') {
            this.redirectTo('404', {
                replace: true,
            });
            return;
        }

        xtype = 'CreateAppointment';
        // leave a developer message in case of new types addition
        if (!Ext.ClassManager.getNameByAlias('widget.' + xtype)) {
            Ext.log.error('Invalid route: no view for xtype: ' + xtype);
        }
        Ext.Viewport.getViewModel().set('routeHash', '#operations/port-calls');
        me.getViewModel().set('portcall_record', null);
        me.getViewModel().set('company', null);
        me.getViewModel().set('objectPermissions', null);
        view = this.activate(
            this.ensureView(type, {
                xtype: xtype,
            })
        );

        view.setBind({
            hidden: null,
        });
        view.setHidden(false);
        view.initializeRecord();
    },
});
