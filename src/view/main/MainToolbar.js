Ext.define('Abraxa.view.main.MainToolbar', {
    extend: 'Ext.Container',
    xtype: 'main.toolbar',
    weight: 1,
    cls: 'a-main-sidebar',
    stateId: 'mainSidebar',
    stateful: ['userCls'],
    zIndex: 100,
    userCls: 'not-expanded',
    reference: 'main_sidebar',
    publishes: 'userCls',
    shadow: true,
    docked: 'left',
    items: [
        {
            xtype: 'button',
            cls: 'a-inline-svg a-main-toggle chameleon_main_menu_toggle',
            ui: 'tool round alt',
            text: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><path d="M0,0h24v24H0V0z" fill="none"/><path d="M3,18h13v-2H3V18z M3,13h10v-2H3V13z M3,6v2h13V6H3z M21,15.59L17.42,12L21,8.41L19.59,7l-5,5l5,5L21,15.59z"/></svg>',
            stateId: 'mainSidebarButton',
            stateful: ['ui'],
            bind: {
                tooltip: {
                    html: '{main_sidebar.userCls == "not-expanded" ? "Expand sidebar": "Hide sidebar"}',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    allowOver: false,
                    closeAction: 'destroy',
                    anchorToTarget: false,
                    align: 'l50-r50',
                    anchor: true,
                },
            },
            handler: function () {
                this.up('container').toggleCls('is-expanded');
                if (this.up('container').getUserCls() == 'not-expanded') {
                    this.up('container').setUserCls('is-expanded');
                } else {
                    this.up('container').setUserCls('not-expanded');
                }
            },
        },
        {
            xtype: 'div',
            cls: 'a-main-logo',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            html: '<svg xmlns="http://www.w3.org/2000/svg" width="121.187" height="16" viewBox="0 0 121.187 16"><path d="M189.253,27.658v1.23h-.245v-1.23h-.442v-.225h1.128v.225Zm.953,1.23h-.245V27.433h.382l.44.914.439-.914h.38v1.455h-.245V27.751l-.508,1.01h-.137l-.506-1.01Zm.605,11.491,5.478,3.054-9.21-14.9a2.328,2.328,0,0,0-1.978-1.1h-.995a2.334,2.334,0,0,0-1.981,1.1l-7.052,11.406,2.743,2.743,9.4-5.361-7.875,1.53,5.265-8.518Zm-14.3-12.946h-4.32l-5.838,5.842-5.842-5.842h-4.32l8,8-8,8h4.32l5.842-5.838,5.838,5.838h4.32l-8-8ZM155.4,42.162l2.219-2.22L150.57,28.536a2.337,2.337,0,0,0-1.981-1.1h-1a2.334,2.334,0,0,0-1.981,1.1l-9.208,14.9h3.59L150.7,37.324l-7.875,1.53,5.265-8.518ZM133.351,37.9a5.527,5.527,0,0,0-2.473-10.47h-12.8v16h3.055V38.488h6.007l4.945,4.945h4.32l-4.974-4.974A5.43,5.43,0,0,0,133.351,37.9Zm-12.218-2.47V30.488h9.745a2.472,2.472,0,1,1,0,4.945Zm-5.778,0a4.739,4.739,0,0,0,.951-1.527,4.751,4.751,0,0,0,0-3.418,4.767,4.767,0,0,0-2.737-2.738,4.712,4.712,0,0,0-1.711-.317H98.3V40.379l1.888,3.054h11.674a4.691,4.691,0,0,0,1.711-.317,4.768,4.768,0,0,0,2.737-2.737,4.764,4.764,0,0,0-.951-4.946Zm-3.5,4.946H101.351V36.96h10.507a1.71,1.71,0,1,1,0,3.419Zm0-6.473H101.351V30.488h10.507a1.709,1.709,0,1,1,0,3.418ZM89.266,28.537a2.328,2.328,0,0,0-1.98-1.1h-1a2.327,2.327,0,0,0-1.979,1.1L75.1,43.433h3.59L89.4,37.324l-7.875,1.53,5.266-8.518L93,40.379l5.478,3.054Z" transform="translate(-75.103 -27.433)" fill="#fff"/></svg>',
        },
        {
            xtype: 'list',
            cls: 'a-main-menu',
            id: 'main-menu',
            itemId: 'sidebarItemsContainerItemId',
            testId: 'sidebarItemsContainer',
            layout: 'vbox',
            deselectable: false,
            reference: 'mainMenuList',
            publishes: ['selection', 'self'],
            // bind: {
            //     store: '{mainMenu}'
            // },
            store: {
                data: [
                    {
                        iconCls: 'md-icon-dashboard md-icon-outlined',
                        icon: 'dashboard',
                        name: 'Dashboard',
                        mixPanelSlug: 'dashboard',
                        hash: '#dashboard',
                        cls: 'chameleon_main_menu_dashboard',
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-inbox md-icon-outlined',
                        icon: 'inbox',
                        mixPanelSlug: 'inbox',
                        name: 'Inbox',
                        hash: '#inbox',
                        bind: {
                            text: '100',
                            pressed: '{(routeHash == "#inbox") ? true : false}',
                        },
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-business-center md-icon-outlined',
                        icon: 'business_center',
                        cls: 'chameleon_main_menu_portcalls',
                        name: 'Operations',
                        hash: '#operations/port-calls',
                        role: 'principal', //set this if menu is specific for role
                        bind: {
                            pressed: '{(routeHash == "#operations") ? true : false}',
                        },
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-business-center md-icon-outlined',
                        icon: 'business_center',
                        cls: 'chameleon_main_menu_portcalls',
                        name: 'Port calls',
                        slug: 'portcall',
                        mixPanelSlug: 'portCalls',
                        skipEditPermission: true,
                        role: 'agent', //set this if menu is specific for role
                        hash: '#portcalls',
                        bind: {
                            pressed:
                                '{(routeHash == "#portcalls" || routeHash == "#portcall" || routeHash == "#invitations") ? true : false}',
                            permission: '{userPermissions}',
                        },
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-live-help md-icon-outlined',
                        icon: 'live_help',
                        hidden: false,
                        skipEditPermission: true,
                        name: 'Enquiries',
                        role: 'agent', //set this if menu is specific for role
                        mixPanelSlug: 'enquiries',
                        hash: '#inquiries',
                        bind: {
                            pressed:
                                '{(routeHash == "#inquiries" || routeHash == "#inquiry" || routeHash == "#pda" ) ? true : false}',
                        },
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-contacts md-icon-outlined',
                        icon: 'contacts',
                        hidden: false,
                        skipEditPermission: true,
                        name: 'Directory',
                        mixPanelSlug: 'directory',
                        hash: '#directory/agents',
                        testId: 'directoryIcon',
                        role: 'principal', //set this if menu is specific for role
                        bind: {
                            pressed: '{(routeHash == "#directory" ) ? true : false}',
                            permission: '{userPermissions}',
                        },
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-contacts md-icon-outlined',
                        name: 'Company database',
                        icon: 'contacts',
                        cls: 'chameleon_main_menu_cdb',
                        hash: '#companydatabase',
                        slug: 'cdb',
                        role: 'agent', //set this if menu is specific for role
                        mixPanelSlug: 'companyDatabase',
                        skipEditPermission: true,
                        bind: {
                            pressed: '{routeHash == "#companydatabase" ? true : false}',
                            permission: '{userPermissions}',
                        },
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-outlined md-icon-task-alt',
                        icon: '',
                        customIcon: 'md-icon-outlined md-icon-task-alt',
                        hidden: false,
                        name: 'Task manager',
                        hash: '#taskmanager',
                        slug: 'taskManager',
                        role: 'agent', //set this if menu is specific for role
                        mixPanelSlug: 'taskManager',
                        skipEditPermission: true,
                        bind: {
                            pressed: '{(routeHash == "#taskmanager") ? true : false}',
                            permission: '{userPermissions}',
                        },
                        company_id: 0,
                    },
                    {
                        iconCls: 'md-icon-calculate md-icon-outlined',
                        icon: 'calculate',
                        // customIcon: 'abraxa-icon-money',
                        hidden: false,
                        name: 'Port cost engine',
                        hash: '#calculator',
                        slug: 'portCostEngine',
                        role: 'agent', //set this if menu is specific for role
                        company_id: 0,
                        bind: {
                            pressed: '{(routeHash == "#calculator") ? true : false}',
                        },
                    },
                    {
                        iconCls: 'md-icon-attach-modeny md-icon-outlined',
                        icon: 'attach_money',
                        name: 'Financial',
                        slug: 'financial',
                        role: 'principal', //set this if menu is specific for role
                        hash: '#comingsoon',
                        bind: {
                            pressed: '{(routeHash == "#financial") ? true : false}',
                        },
                        company_id: 0,
                    },
                ],
                // filters: [
                //     {
                //         filterFn: function (record) {
                //             let current_company_id = Ext.Viewport.getViewModel()
                //                 .get('currentUser')
                //                 .get('current_company_id');
                //             return record.get('company_id') == current_company_id || record.get('company_id') == 0;
                //         },
                //     },
                //     {
                //         //filter for role this is needed when module is for specific role agent,principal,shipowner etc.
                //         filterFn: function (record) {
                //             let currentUserType = Ext.Viewport.getViewModel()
                //                 .get('currentUser')
                //                 .getCompany()
                //                 .get('type');
                //             if (record.get('role')) {
                //                 // check if menu has role attribute
                //                 return record.get('role') && record.get('role') == currentUserType;
                //             } else {
                //                 return true;
                //             }
                //         },
                //     },
                // ],
            },
            ripple: false,
            itemRipple: {
                color: 'rgba(255, 255, 255, 0.4)',
            },
            itemConfig: {
                viewModel: {
                    formulas: {
                        selectedRecord: {
                            bind: {
                                bindTo: '{routeHash}',
                                deep: true,
                            },
                            get: function (hash) {
                                let section = hash ? hash : '#dashboard',
                                    list = this.getView().up('list'),
                                    store = list.getStore();
                                if (section == '#portcalls') section = '#portcall';
                                if (store) {
                                    let record = store.findRecord('hash', section);
                                    if (record) {
                                        list.select(record);
                                    }
                                }
                            },
                        },
                    },
                },
                xtype: 'container',
                bind: {
                    cls: 'a-main-menu-item {record.cls}',
                },
                bodyCls: 'overflow-visible',
                layout: {
                    type: 'hbox',
                    align: 'center',
                },
                items: [
                    {
                        xtype: 'container',
                        cls: 'hbox overflow-visible',
                        bodyCls: 'overflow-visible',
                        bind: {
                            html: '<div class="main-menu-icon hbox"><i class="{record.customIcon ? record.customIcon : "md-icon md-icon-outlined"}">{record.icon}</i></div>',
                            tooltip: {
                                html: '{record.name}',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                                anchorToTarget: false,
                                align: 'l50-r50',
                                anchor: true,
                            },
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-main-menu-item-badge',
                                hidden: true,
                                bind: {
                                    hidden: '{record.name == "Inbox" && invitaionsPendingCount > 0 ? false : true}',
                                    html: '{invitaionsPendingCount}',
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'div',
                        cls: 'a-main-menu-item-name',
                        bind: {
                            html: '{record.name}',
                        },
                    },
                ],
            },
            listeners: {
                childtap: function (list, item) {
                    mixpanel.track('List item clicked', {
                        Type: 'List',
                        Target: 'Main menu list',
                        Tag: 'Secondary event',
                    });

                    let hash = item.record.get('hash');
                    let mixPanelSlug = item.record.get('mixPanelSlug');
                    window.location.hash = hash;

                    if (mixPanelSlug === 'taskManager') {
                        mixpanel.track('Page changed', {
                            Type: 'Main menu',
                            Target: 'Task manager - Active tasks',
                            Tag: 'Primary event',
                        });

                        // Change the location after page change event
                        mixpanel.register({
                            Origin: 'Task manager / Active tasks',
                        });
                    }
                },
            },
        },
        {
            cls: 'a-list-recent-wrap',
            hidden: false,
            slug: 'portcall',
            bind: {
                hidden: '{main_sidebar.userCls == "not-expanded" ? true : false}',
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'div',
                    margin: '0 16',
                    cls: 'h5',
                    html: 'Recently viewed',
                },
                {
                    xtype: 'list',
                    minHeight: 100,
                    scrollable: false,
                    selectable: false,
                    emptyText: true,
                    flex: 1,
                    slug: 'portcall',
                    cls: 'a-list-recent',
                    bind: {
                        store: '{recentlyOpened}',
                        permission: '{userPermissions}',
                    },
                    itemConfig: {
                        viewModel: {},
                        xtype: 'container',
                        padding: '8 16',
                        cls: 'cursor-pointer',
                        items: [
                            {
                                xtype: 'div',
                                bind: {
                                    html: '<div class="row align-items-center"><div class="col-auto"><i class="{record.object.watching.length ? "is-active" : ""}"></i></div><div class="col text-truncate"><div class="a-vessel" style="color: #fff;">{record.object.voyage.vessel_name}</div><div class="a-id">{record.object.file_id}</div></div><div class="col col-status text-right"><div class="a-status-badge status-{record.object.status_data.string}"><div class="text-truncate">{record.object.status_data.name}</div></div></div></div>',
                                },
                            },
                        ],
                    },
                    listeners: {
                        childtap: function (item, location) {
                            window.location.hash = '#portcall/' + location.record.get('object_meta_id');
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-main-subscription',
            bind: {
                hidden: '{currentUserPlan == "starter" && currentUserType !="principal" ? false:true}',
            },
            items: [
                {
                    xtype: 'div',
                    margin: '12 0',
                    html: '<div class="h3">Premium</div><small>The ultimate all-in-one package for companies that need to handle port calls with confidence.</small>',
                },
                {
                    xtype: 'button',
                    margin: '8 0 0 0',
                    ui: 'warning outlined',
                    text: 'Upgrade to Premium',
                    handler: function () {
                        window.open('https://www.abraxa.com/pricing/');
                    },
                },
            ],
        },
        {
            xtype: 'button',
            ui: 'tool warning',
            iconCls: 'md-icon-help-outline md-icon-outlined',
            text: 'Help center',
            cls: 'a-button-help-center chameleon_toolbar_help_center',
            // handler: function handler() {
            //     window.open('https://support.abraxa.com');
            // },
        },
    ],
});
