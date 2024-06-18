import './users/MainContainer';
import './roles/MainContainer';
import './teams/MainContainer';

Ext.define('Abraxa.view.settings.users_teams.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.users_teams.main.container',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    hidden: true,
    itemId: 'usersMainContainer',
    testId: 'usersTeamsMainCntr',
    showAnimation: {
        type: 'slide',
        direction: 'right',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            weight: 1,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    docked: 'top',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'tabbar',
                            height: 64,
                            padding: '0 8',
                            activeTab: 0,
                            reference: 'user_tabbar',
                            publishes: {
                                activeTab: true,
                                activeTabIndex: true,
                            },
                            defaults: {
                                ui: 'tab-lg',
                                ripple: false,
                            },
                            items: [
                                {
                                    text: 'Users',
                                    testId: 'usersTeamsMainUsersTab',
                                },
                                {
                                    text: 'Roles',
                                    testId: 'usersTeamsMainRolesTab',
                                },
                                {
                                    text: 'Teams',
                                    testId: 'usersTeamsMainTeamsTab',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'settings.users_teams.users.main.container',
        },
        {
            xtype: 'settings.users_teams.roles.main.container',
        },
        {
            xtype: 'settings.users_teams.teams.main.container',
        },
    ],
});
