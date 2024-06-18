import './UserController';
import './UserDetailsMain';
import './UserDetailsSecurity';
import './UserDetailsSessionHistory';

Ext.define('Abraxa.view.settings.users_teams.users.UserDetails', {
    extend: 'Ext.Container',
    xtype: 'usersettings.userdetails',
    hidden: true,
    scrollable: true,
    cls: 'a-main-container a-profile a-profile-full-width needs_hide',
    margin: 0,
    flex: 1,
    layout: 'vbox',
    itemId: 'userDetalsContainer',
    controller: 'settings.users.controller',
    style: 'box-shadow: none;',
    showAnimation: {
        type: 'slide',
        direction: 'left',
    },
    viewModel: {
        formulas: {
            userStatus: {
                bind: {
                    bindTo: '{userGrid.selection}',
                    deep: true,
                },
                get: function (user) {
                    let status = 'pending';
                    if (user && user.get('auth0id')) {
                        let company_user = user.get('company_user'),
                            company_user_record = null;
                        Ext.Array.each(company_user, function (value) {
                            if (value.company_id == user.get('current_company_id')) {
                                company_user_record = value;
                            }
                        });
                        if (company_user_record && company_user_record.is_active) {
                            status = 'active';
                        } else {
                            status = 'suspended';
                        }
                    }
                    return status;
                },
            },
            userStatusIcon: {
                bind: {
                    bindTo: '{userStatus}',
                    deep: true,
                },
                get: function (status) {
                    let icon = 'done';
                    switch (status) {
                        case 'pending':
                            icon = 'schedule';
                            break;
                        case 'suspended':
                            icon = 'block';
                            break;
                        default:
                            icon = 'done';
                            break;
                    }
                    return icon;
                },
            },
            isActiveUser: {
                bind: {
                    bindTo: '{userGrid.selection}',
                    deep: true,
                },
                get: function (user) {
                    if (user) {
                        let company_user = user.get('company_user'),
                            company_user_record = null;
                        Ext.Array.each(company_user, function (value) {
                            if (value.company_id == user.get('current_company_id')) {
                                company_user_record = value;
                            }
                        });
                        if (company_user_record) {
                            return company_user_record.is_active;
                        }
                    }
                },
            },
            userRole: {
                bind: {
                    bindTo: '{userGrid.selection}',
                    deep: true,
                },
                get: function (user) {
                    let role = '';
                    if (user) {
                        let currentUser = Ext.Viewport.getViewModel().get('currentUser');
                        if (user.get('role')) {
                            let editAction =
                                '<span style="cursor: pointer;" class="ml-4"><i class="edit_role md-icon-outlined md-18" data-qtip="Change role" data-qalign="bc-tc" data-qanchor="true">edit</i></span>';
                            // Ext.Array.each(user.get('role').user_roles, function (value, index) {

                            // });
                            let roles = this.get('roles');
                            let record = roles.getById(user.get('role_id'));
                            if (record) {
                                let access_string = 'Limited access';
                                if (record.get('name') == 'Admin') {
                                    access_string = 'Unlimited access';
                                }
                                if (user.get('id') == currentUser.get('id')) {
                                    editAction = '';
                                }
                                role =
                                    '<h5>Role</h5><div class="hbox"><div class="a-badge a-badge-person"><i class="md-icon-outlined">manage_accounts</i></div><div class="ml-12"><div class="text-truncate fw-b c-blue hbox">' +
                                    record.get('name') +
                                    editAction +
                                    '</div><div class="sm-title">' +
                                    access_string +
                                    '</div></div></div>';
                            }
                        }
                    }
                    return role;
                },
            },
            userTeam: {
                bind: {
                    bindTo: '{userGrid.selection.team}',
                    deep: true,
                },
                get: function (team) {
                    let teamString;
                    if (team) {
                        teamString =
                            '<h5>Team</h5><div class="hbox"><div class="a-badge a-badge-teams"><i class="md-icon-outlined">groups</i></div><div class="ml-12"><div class="text-truncate fw-b c-blue">' +
                            team.name +
                            '</div><div class="sm-title">' +
                            team.description +
                            '</div></div></div>';
                    }
                    return teamString;
                },
            },
            userOffice: {
                bind: {
                    bindTo: '{userGrid.selection.office}',
                    deep: true,
                },
                get: function (office) {
                    let userOfiice;
                    if (office) {
                        let description = '';
                        if (office.description) {
                            description = office.description;
                        }
                        userOfiice =
                            '<h5>Offices</h5><div class="hbox"><div class="a-badge a-badge-office"><i class="md-icon-outlined">maps_home_work</i></div><div class="ml-12"><div class="text-truncate fw-b c-blue">' +
                            office.get('office_name') +
                            '</div><div class="sm-title">' +
                            description +
                            '</div></div></div>';
                    }
                    return userOfiice;
                },
            },
            selectedUserImage: {
                bind: {
                    bindTo: '{userGrid.selection}',
                    deep: true,
                },
                get: function (user) {
                    if (user) {
                        if (user.get('profile_image') == '') {
                            return AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image.svg';
                        } else {
                            return user.get('profile_image');
                        }
                    }
                },
            },
        },
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'abraxa.titlebar',
                    height: 64,
                    bind: {
                        title: '<div class="hbox"><span class="a-panel-title">{userGrid.selection.full_name}</span></div>',
                    },
                    items: [
                        {
                            xtype: 'button',
                            margin: '0 16 0 0',
                            align: 'left',
                            iconCls: 'md-icon-keyboard-backspace',
                            ui: 'round default',
                            handler: function () {
                                let upContainer = Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0],
                                    downContainer = Ext.ComponentQuery.query('[itemId=userDetalsContainer]')[0];
                                downContainer.setHidden(true);
                                upContainer.setHidden(false);
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '-24 0 0 0',
                    flex: 1,
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-user-heading',
                            margin: 0,
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-user-image',
                                    items: [
                                        {
                                            xtype: 'image',
                                            itemId: 'imageHead',
                                            bind: {
                                                src: '{selectedUserImage}',
                                            },
                                            mode: 'image',
                                            align: 'center',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        pack: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            margin: '0 4 0 0',
                                            ui: 'field-xl no-border classic',
                                            textAlign: 'right',
                                            label: false,
                                            clearable: false,
                                            disabled: true,
                                            placeholder: 'First name',
                                            bind: {
                                                value: '{userGrid.selection.first_name}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            margin: '0 0 0 4',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            clearable: false,
                                            disabled: true,
                                            placeholder: 'Last name',
                                            bind: {
                                                value: '{userGrid.selection.last_name}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                                pack: 'center',
                                            },
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    bind: {
                                                        cls: 'a-status-badge a-has-icon status-{userStatus} rounded',
                                                        html: '<i class="material-icons-outlined">{userStatusIcon}</i><span>{userStatus:capitalize}</span>',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'tabbar',
                                            border: true,
                                            manageBorders: false,
                                            height: 64,
                                            padding: '0 8',
                                            animateIndicator: false,
                                            activeTab: 0,
                                            style: 'border-bottom-width: 1px; border-bottom-style: solid;',
                                            defaults: {
                                                ui: 'tab-lg',
                                                ripple: false,
                                            },
                                            items: [
                                                {
                                                    text: 'Personal profile',
                                                    testId: 'personalProfileTabUserDetailsSystemTestId',
                                                    type: 'personal.main',
                                                },
                                                {
                                                    text: 'Security',
                                                    testId: 'securityTabUserDetailsSystemTestId',
                                                    type: 'security',
                                                },
                                                {
                                                    text: 'Session history',
                                                    testId: 'sessionHistoryTabUserDetailsSystemTestId',
                                                    type: 'signature',
                                                },
                                            ],
                                            listeners: {
                                                activeTabchange: function (me, value) {
                                                    let activeTab = me.getActiveTab(),
                                                        profileCardContainer =
                                                            Ext.ComponentQuery.query('#profileUserCardContainer')[0];
                                                    profileCardContainer.setActiveItem(this.items.indexOf(activeTab));
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            scrollable: true,
                            itemId: 'profileUserCardContainer',
                            layout: {
                                type: 'card',
                                // animation: 'slide'
                            },
                            items: [
                                {
                                    xtype: 'user.details.main',
                                },
                                {
                                    xtype: 'user.details.security',
                                },
                                {
                                    xtype: 'user.details.session.history',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
