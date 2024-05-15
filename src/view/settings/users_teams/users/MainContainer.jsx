import './UsersGrid.jsx';
Ext.define('Abraxa.view.settings.users_teams.users.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.users_teams.users.main.container',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    hidden: true,
    bind: {
        hidden: '{user_tabbar.activeTabIndex == 0 ? false: true}',
    },
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main',
                    layout: 'vbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h1 class="fw-n">Users settings</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Create, manage and remove users from your organization.</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'button',
                                    text: 'User',
                                    testId: 'usersTeamsMainUsersTabAddTestId',
                                    ui: 'action small',
                                    cls: 'chameleon_settings_invite_user',
                                    iconCls: 'md-icon-add',
                                    slug: 'settingsUserCreate',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (btn, e) {
                                        mixpanel.track('User - button');
                                        Ext.create('Abraxa.view.settings.users.UserInvite', {
                                            viewModel: {
                                                parent: btn.upVM(),
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'settings.users.grid',
                            flex: 1,
                            showNoPermissions: true,
                            slug: 'settingsUser',
                            skipEditPermission: true,
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
