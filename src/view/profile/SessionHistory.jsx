Ext.define('Abraxa.view.profile.SessionHistory', {
    extend: 'Ext.Container',
    xtype: 'profile.session.history',
    cls: 'a-settings-main a-settings-profile',
    scrollable: true,
    plugins: {
        lazyitems: {
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
                                html: '<i class="material-icons-outlined c-teal mr-12">login</i><span class="fw-b">{currentUser.previous_login.time:date("d M y - H:i")}</span>',
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'decline alt',
                            text: 'Log out',
                            handler: function handler() {
                                Ext.getApplication().logout();
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-grid-list',
                    margin: '0 -12',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-grid-titles',
                            //html: '<div class="flex-1">Device</div><div class="flex-1">Location</div><div class="flex-1">Last usage</div><div class="flex-1"></div>'
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaults: {
                                padding: '0 12',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'flex-1',
                                    //html: '<i class="md-icon-outlined md-20 mr-16">desktop_windows</i><span>Mac OS<span class="sm-title d-block">Google Chrome</span></span>'
                                },
                                {
                                    xtype: 'div',
                                    cls: 'flex-1',
                                    //html: '<i class="md-icon-outlined md-20 mr-16">place</i><span>Sofia, BG<span class="sm-title d-block">46.238.4.245</span></span>'
                                },
                                {
                                    xtype: 'div',
                                    cls: 'flex-1',
                                    // html: '<i class="md-icon-outlined md-20 mr-16">calendar_today</i><span class="fs-13">26 Apr 22 - 02:12</span>'
                                },
                                {
                                    xtype: 'container',
                                    margin: '0 12',
                                    cls: 'flex-1',
                                    items: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
