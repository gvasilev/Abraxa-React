Ext.define('Abraxa.view.main.UserMenu', {
    extend: 'Ext.Container',
    xtype: 'user.header.menu',
    testId: 'userHeaderMenuContainer',
    cls: 'a-main-profile',
    layout: {
        type: 'hbox',
        pack: 'space-between',
    },
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'center',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '0 8 0 0',
                    ui: 'normal-light round',
                    iconCls: 'md-icon-add',
                    arrow: false,
                    hidden: true,
                    slug: 'portcall',
                    testId: 'userHeaderMenuNewTaskNoteBtn',
                    skipEditPermission: true,
                    tooltip: {
                        html: 'New',
                        anchor: true,
                        showDelay: 0,
                        hideDelay: 0,
                        align: 't50-b50',
                    },
                    bind: {
                        hidden: '{(routeHash == "#portcall" && currentUserType == "agent") ? false : true}',
                        disabled: '{object_record.is_archived ? true : false}',
                        permission: '{userPermissions}',
                    },
                    menu: {
                        cls: 'a-menu-badges',
                        items: [
                            {
                                text: 'Task',
                                cls: 'a-menu-task',
                                slug: 'taskCreate',
                                bind: {
                                    permission: '{userPermissions}',
                                },
                                iconCls: 'md-icon-outlined md-icon-task-alt',
                                handler: function () {
                                    let button = this;

                                    // Check if a note is already opened
                                    if (button.taskOpened) {
                                        return;
                                    }

                                    button.taskOpened = true;

                                    let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                        viewModel: {
                                            parent: this.upVM(),
                                            data: {
                                                object_record: this.upVM().get('object_record'),
                                                subObjects: this.upVM().get('subObjects'),
                                                users: this.upVM().get('users'),
                                                sortedFilesNoLimit: this.upVM().get('sortedFilesNoLimit'),
                                                currentUser: this.upVM().get('currentUser'),
                                                editMode: false,
                                                taskEdit: false,
                                                record: Ext.create('Abraxa.model.task.Task', {
                                                    status: 'to-do',
                                                    object_id: 3,
                                                    object_meta_id: this.upVM().get('object_record').get('id'),
                                                }),
                                            },
                                        },
                                        // Add listeners to reset the flag when the task is closed
                                        listeners: {
                                            destroy: () => {
                                                button.taskOpened = false; // Reset the flag
                                            },
                                        },
                                    });

                                    // Show the task
                                    task.show();
                                },
                            },
                            {
                                text: 'Document',
                                cls: 'a-menu-docs',
                                iconCls: 'md-icon-description md-icon-outlined',
                                slug: 'portcall',
                                bind: {
                                    hidden: '{nonEditable}',
                                    permission: '{userPermissions}',
                                },
                                handler: function () {
                                    let portCallVM = Ext.ComponentQuery.query(
                                        Env.currentUser.get('company').type + 'portcall\\.main'
                                    )[0].upVM();

                                    Ext.create('Abraxa.view.adocs.CreateDocumentPopup', {
                                        viewModel: {
                                            parent: portCallVM,
                                            data: {
                                                object_record: this.upVM().get('object_record'),
                                                currentUser: this.upVM().get('currentUser'),
                                                organizations: this.upVM().get('organizations'),
                                                userPermissions: this.upVM().get('userPermissions'),
                                            },
                                        },
                                    }).show();
                                },
                            },
                            {
                                text: 'Note',
                                cls: 'a-menu-note',
                                slug: 'portcall',
                                bind: {
                                    permission: '{userPermissions}',
                                },
                                iconCls: 'md-icon-mode-comment md-icon-outlined',
                                handler: function () {
                                    let button = this;

                                    // Check if a note is already opened
                                    if (button.noteOpened) {
                                        return;
                                    }

                                    button.noteOpened = true;

                                    let note = Ext.create('Abraxa.view.notes.AddNotePopup', {
                                        viewModel: {
                                            data: {
                                                subObjects: this.upVM().get('subObjects'),
                                                object_record: this.upVM().get('object_record'),
                                                users: this.upVM().get('users'),
                                                sortedFilesNoLimit: this.upVM().get('sortedFilesNoLimit'),
                                                currentUser: this.upVM().get('currentUser'),
                                                editMode: true,
                                                record: this.upVM().get('object_record').notes().add({})[0],
                                            },
                                        },
                                        // Add listeners to reset the flag when the note is closed
                                        listeners: {
                                            destroy: () => {
                                                button.noteOpened = false; // Reset the flag
                                            },
                                        },
                                    });

                                    // Show the note
                                    note.show();
                                },
                            },
                            // {
                            //     hidden: true,
                            //     text: 'Mail',
                            //     cls: 'a-menu-ctm',
                            //     iconCls: "md-icon-mail md-icon-outlined",
                            //     handler: function () {
                            //         var mailPopup = Ext.create(
                            //             "Abraxa.view.mail.Sendmail", {
                            //                 viewModel: {
                            //                     data: {
                            //                         object_record: this.upVM().get('object_record'),
                            //                         object_id: 3,
                            //                         object_meta_id: this.upVM().get('object_record').get('id'),
                            //                         currentUser: this.upVM().get('currentUser'),
                            //                         members: this.upVM().get('object_record.members')
                            //                     },
                            //                     stores: {
                            //                         attachments: {
                            //                             type: 'mail.attachments'
                            //                         }
                            //                     },
                            //                 }
                            //             }
                            //         ).show();
                            //     }
                            // }
                        ],
                    },
                },
                {
                    xtype: 'button',
                    width: 36,
                    height: 36,
                    iconCls: 'md-icon-search md-icon-outlined',
                    cls: 'chameleon_general_search_icon',
                    ui: 'tool toggle round',
                    testId: 'userHeaderMenuSearchBtn',
                    tooltip: {
                        html: 'Search',
                        anchor: true,
                        showDelay: 0,
                        hideDelay: 0,
                        align: 't50-b50',
                    },
                    handler: function () {
                        mixpanel.track('Search icon – main header');
                        if (Ext.getCmp('searchPanel')) {
                            Ext.getCmp('searchPanel').show();
                        } else {
                            Ext.create('Abraxa.view.search.SearchPanel').show();
                        }
                    },
                },
                // {
                //     xtype: "button",
                //     width: 36,
                //     height: 36,
                //     iconCls: "md-icon-invert-colors md-icon-outlined",
                //     ui: 'tool toggle round',
                //     enableToggle: true,
                //     handler: function () {
                //         Ext.select('#ext-viewport').toggleCls('is-boxed');
                //     }
                // },
                {
                    xtype: 'button',
                    width: 36,
                    height: 36,
                    iconCls: 'md-icon-notifications md-icon-outlined',
                    cls: 'chameleon_notifications_icon',
                    ui: 'tool round',
                    testId: 'userHeaderMenuNotificationsBtn',
                    bind: {
                        badgeText: '{unreadNotifications > 0 ? unreadNotifications : ""}',
                    },
                    tooltip: {
                        html: 'Notifications',
                        anchor: true,
                        showDelay: 0,
                        hideDelay: 0,
                        align: 't50-b50',
                    },
                    handler: function handler() {
                        mixpanel.track('Notification bell – main header');
                        Ext.ComponentQuery.query('main\\.notificationmenu')[0].toggle();
                    },
                },
            ],
        },
        {
            xtype: 'container',
            margin: '0 0 0 8',
            padding: 4,
            cls: 'user_menu_container',
            testId: 'userHeaderMenuUserMenuContainer',
            listeners: {
                click: {
                    element: 'element',
                    //bind to the underlying el property on the panel
                    fn: function fn() {
                        Ext.getCmp('userMenu').showBy(this);
                    },
                },
            },
            items: [
                {
                    xtype: 'image',
                    cls: 'a-profile-image chameleon_user_menu_image',
                    bind: {
                        src: '{userProfileImage}',
                    },
                    mode: 'image',
                    height: 28,
                    width: 28,
                    align: 'center',
                    tooltip: {
                        html: 'Account',
                        anchor: true,
                        showDelay: 0,
                        hideDelay: 0,
                        align: 't50-b50',
                    },
                },
                {
                    xtype: 'menu',
                    hideAnimation: null,
                    id: 'userMenu',
                    ui: 'dropdown has-icons',
                    testId: 'userHeaderMenuUserActualMenu',
                    width: 220,
                    hidden: true,
                    cls: 'a-user-menu',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    // bind: {
                    //     cls: "{(!!currentUser.current_office_id) ? 'a-user-menu is-animated  a-menu-large' : 'a-user-menu is-animated'}",
                    // },
                    // listeners: {
                    //     tofront: function expand() {
                    //         const currentUser = this.upVM().get('currentUser');
                    //         const offices = currentUser.get('offices');
                    //         const isPrincipal = currentUser.get('company').type == 'principal';
                    //         if (isPrincipal && offices.length < 2) {
                    //             this.setCls('a-user-menu is-animated');
                    //         }
                    //     },
                    // },
                    items: [
                        {
                            xtype: 'container',
                            testId: 'userHeaderMenuUserActualMenuSettingsContainer',
                            bind: {
                                html:
                                    '<div class="user-info">' +
                                    '<span class="a-profile-image"><img src="{userProfileImage}" alt="" /></span>' +
                                    '<div class="user-company">{currentUser.company.name}</div>' +
                                    '<div class="user-name">{currentUser.first_name} {currentUser.last_name}</div>' +
                                    '<div class="user-type"><span class="a-status-badge rounded a-status-{currentUser.company.type} a-status-sm no-border">{currentUser.company.type:capitalize}</span></div>' +
                                    '</div>',
                            },
                            flex: 1,
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'div.user-info',
                                    fn: function (el) {
                                        this.component.up('menu').hide();
                                        Ext.getCmp('main-menu').deselectAll();
                                        window.location.hash = '#settings/profile';
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-menu-switch',
                            testId: 'userHeaderMenuUserActualMenuSwitchOfficeContainer',
                            flex: 1,
                            bind: {
                                // store: '{currentUser.tenants}',
                                hidden: '{(currentUser.current_office_id && currentUser.office) ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'h5',
                                    testId: 'userHeaderMenuUserActualMenuSwitchOfficeDiv',
                                    html: 'Switch office',
                                },
                                {
                                    xtype: 'selectfield',
                                    ui: 'classic',
                                    margin: '6 0 0 0',
                                    cls: 'non-editable',
                                    label: false,
                                    labelAlign: 'top',
                                    valueField: 'office_id',
                                    displayTpl: '{office.office_name}',
                                    itemTpl: '{office.office_name}',
                                    testId: 'userHeaderMenuSwitchOfficeSelectField',
                                    bind: {
                                        store: '{currentUser.offices}',
                                        hidden: '{currentUser.current_office_id ? false : true}',
                                    },
                                    listeners: {
                                        painted: function () {
                                            let user = this.upVM().get('currentUser');
                                            this.setValue(user.get('current_office_id'));
                                        },
                                    },
                                    floatedPicker: {
                                        listeners: {
                                            select: function (me, selection) {
                                                let vm = this.upVM(),
                                                    user = vm.get('currentUser');
                                                if (user.get('current_office_id') != selection.get('office_id')) {
                                                    Ext.Msg.confirm(
                                                        'Switch office',
                                                        'Are you sure you would like to switch to <strong>' +
                                                            selection.get('office').office_name +
                                                            '</strong> ?',
                                                        function (answer) {
                                                            if (answer != 'yes') return;
                                                            user.set('current_office_id', selection.get('office_id'));
                                                            user.save({
                                                                success: function () {
                                                                    window.location.hash = '#dashboard';
                                                                    window.location.reload();
                                                                },
                                                            });
                                                        },
                                                        this,
                                                        [
                                                            {
                                                                xtype: 'button',
                                                                itemId: 'no',
                                                                margin: '0 8 0 0',
                                                                text: 'Cancel',
                                                            },
                                                            {
                                                                xtype: 'button',
                                                                itemId: 'yes',
                                                                ui: 'action',
                                                                text: 'Switch',
                                                            },
                                                        ]
                                                    );
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            text: 'My profile',
                            flex: 1,
                            testId: 'userHeaderMenuMyProfileBtn',
                            iconCls: 'md-icon-person md-icon-outlined',
                            cls: 'chameleon_user_menu_my_profile',
                            handler: function handler() {
                                Ext.getCmp('main-menu').deselectAll();
                                window.location.hash = 'profile';
                            },
                        },
                        {
                            text: 'Settings',
                            flex: 1,
                            testId: 'userHeaderMenuSettingsBtn',
                            iconCls: 'md-icon-settings md-icon-outlined',
                            cls: 'chameleon_user_menu_settings',
                            slug: 'settings',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function handler() {
                                Ext.getCmp('main-menu').deselectAll();
                                window.location.hash = '#settings/company';
                            },
                        },
                        {
                            text: 'Account & Billing',
                            flex: 1,
                            testId: 'userHeaderMenuAccountBillingBtn',
                            iconCls: 'md-icon-payment md-icon-outlined',
                            handler: function handler() {
                                Ext.getCmp('main-menu').deselectAll();
                                window.location.hash = '#billing';
                            },
                        },
                        {
                            text: 'Help center',
                            flex: 1,
                            testId: 'userHeaderMenuHelpCenterBtn',
                            iconCls: 'md-icon-help-outline md-icon-outlined',
                            handler: function handler() {
                                Ext.getCmp('main-menu').deselectAll();
                                window.open('https://support.abraxa.com');
                            },
                        },
                        // {
                        //     text: "Quick start",
                        //     iconCls: "abraxa-icon-bulb",
                        //     handler: function handler() {
                        //         //window.open('https://support.abraxa.com', '_blank');
                        //     }
                        // },
                        // {
                        //     text: "Help center",
                        //     iconCls: "md-icon-help-outline",
                        //     cls: 'chameleon_user_menu_help',
                        //     handler: function handler() {
                        //         // window.open('https://support.abraxa.com', '_blank');
                        //     }
                        // },
                        {
                            text: 'Logout',
                            flex: 1,
                            testId: 'userHeaderMenuLogoutBtn',
                            separator: true,
                            cls: 'a-menu-logout',
                            iconCls: 'md-icon-exit-to-app',
                            handler: function handler() {
                                Ext.getApplication().logout();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
