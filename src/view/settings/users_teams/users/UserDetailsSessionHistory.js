Ext.define('Abraxa.view.settings.users_teams.users.UserDetailsSessionHistory', {
    extend: 'Ext.Container',
    xtype: 'user.details.session.history',
    cls: 'a-settings-main a-settings-profile',
    scrollable: true,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    style: 'max-width: 800px; margin: auto;',
                    items: [
                        {
                            xtype: 'div',
                            html: '<h1 class="fw-n">Activity</h1>',
                        },
                        {
                            xtype: 'div',
                            html: '<p class="text-info">Last login activity for your account</p>',
                        },
                        {
                            xtype: 'div',
                            margin: '16 0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'div',
                            html: '<h3>Last login</h3><div class="text-info">Last account activity</div>',
                        },
                        {
                            xtype: 'container',
                            padding: '24 0',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<i class="material-icons-outlined c-teal mr-12">login</i><span class="fw-b">{userGrid.selection.previous_login.time:date("d M y - H:i")}</span>',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
