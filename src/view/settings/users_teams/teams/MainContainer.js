Ext.define('Abraxa.view.settings.users_teams.teams.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.users_teams.teams.main.container',
    layout: 'vbox',
    testId: 'settingsTeamsMain',
    flex: 1,
    scrollable: true,
    hidden: true,
    bind: {
        hidden: '{user_tabbar.activeTabIndex == 2 ? false: true}',
    },
    items: [
        {
            cls: 'a-container-premium errorHandler',
            maxWidth: 540,
            bind: {
                hidden: '{currentUserPlan == "starter" ? false:true}',
            },
            items: [
                {
                    xtype: 'div',
                    padding: '16 48',
                    cls: 'text-center',
                    html: '<div class="h1">Premium feature</div><p class="a-txt">The ultimate all-in-one package for companies that need to handle port calls with confidence.</p>',
                },
                {
                    xtype: 'div',
                    margin: '16 0 24 -12',
                    cls: 'text-center',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="416" height="248" viewBox="0 0 416 248"><g transform="translate(-533 -328)"><rect width="242" height="158" rx="8" transform="translate(533 328)" fill="#fbe3c9" opacity="0.4"/><rect width="400" height="232" rx="8" transform="translate(549 344)" fill="#fff"/><rect width="64" height="8" rx="4" transform="translate(741 384)" fill="#f3c46b"/><rect width="64" height="8" rx="4" transform="translate(741 528)" fill="#ecf0f1"/><rect width="64" height="8" rx="4" transform="translate(637 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(637 528)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 432)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 480)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 528)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 432)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 480)" fill="#b0bec5" opacity="0.24"/><g transform="translate(333 85)"><rect width="40" height="40" rx="8" transform="translate(240 283)" fill="#ffb74d"/><g transform="translate(248 291)"><path d="M0,0H24V24H0Z" fill="none"/><path d="M20,6H17.82A2.993,2.993,0,0,0,12.5,3.35l-.5.67-.5-.68A2.994,2.994,0,0,0,6.18,6H4A1.985,1.985,0,0,0,2.01,8L2,19a1.993,1.993,0,0,0,2,2H20a1.993,1.993,0,0,0,2-2V8A1.993,1.993,0,0,0,20,6ZM15,4a1,1,0,1,1-1,1A1,1,0,0,1,15,4ZM9,4A1,1,0,1,1,8,5,1,1,0,0,1,9,4ZM20,19H4V17H20Zm0-5H4V8H9.08L7,10.83,8.62,12,11,8.76,12,7.4l1,1.36L15.38,12,17,10.83,14.92,8H20Z" fill="#fff"/></g></g></g></svg>',
                },
                {
                    xtype: 'button',
                    margin: '16 0',
                    ui: 'premium large',
                    text: 'Upgrade to Premium',
                    testId: 'settingsTeamsMainUpgradePremiumBtn',
                    handler: function () {
                        window.open('https://www.abraxa.com/pricing/');
                    },
                },
            ],
        },
        {
            xtype: 'container',
            layout: 'vbox',
            hidden: true,
            bind: {
                hidden: '{currentUserPlan == "starter" ? true:false}',
            },
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
                                    html: '<h1 class="fw-n">Teams settings</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Create team structures under your organization.<br>Easily manage rules for each individual team, to control who can access particular type of port calls.</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'button',
                                    text: 'Team',
                                    testId: 'settingsTeamsMainAddTeamSmallBtn',
                                    ui: 'action small',
                                    iconCls: 'md-icon-add',
                                    slug: 'settingsUserTeamCreate',
                                    bind: {
                                        permission: '{userPermissions}',
                                        hidden: '{teams.count ? false : true}',
                                    },
                                    handler: function (btn, e) {
                                        Ext.create('Abraxa.view.settings.users_teams.teams.CreateTeam', {
                                            viewModel: {
                                                parent: btn.upVM(),
                                                data: {
                                                    editMode: false,
                                                    team: Ext.create('Abraxa.model.team.Team', {
                                                        company_id: btn.upVM().get('currentCompany').get('id'),
                                                    }),
                                                },
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'settings.teams.grid',
                            testId: 'settingsTeamsMainTeamsGrid',
                            flex: 1,
                            showNoPermissions: true,
                            slug: 'settingsUserTeam',
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
