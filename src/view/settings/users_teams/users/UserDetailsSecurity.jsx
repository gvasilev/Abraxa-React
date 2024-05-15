Ext.define('Abraxa.view.settings.users_teams.users.UserDetailsSecurity', {
    extend: 'Ext.Container',
    xtype: 'user.details.security',
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
                            html: '<h1 class="fw-n">Security settings</h1>',
                        },
                        {
                            xtype: 'div',
                            html: '<p class="text-info">These preferences will be applied to your account only.<br>Change your password details on regular basis for maximum security.</p>',
                        },
                        {
                            xtype: 'div',
                            margin: '16 0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'div',
                            html: '<h3>Request password change</h3><div class="text-info">Change the password for this account</div>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'end',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Change password',
                                    ui: 'normal small',
                                    margin: '8 0 0 0',
                                    height: 28,
                                    slug: 'settingsUser',
                                    bind: {
                                        permission: '{userPermissions}',
                                        disabled: '{userGrid.selection.id == currentUser.id ? true:false}',
                                    },
                                    handler: 'changePassword',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
