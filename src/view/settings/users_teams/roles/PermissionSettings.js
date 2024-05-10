Ext.define('Abraxa.view.settings.users_teams.roles.PermissionSettings', {
    extend: 'Ext.Container',
    xtype: 'usersettings.permission.settings',
    cls: 'a-settings-main permission_settings needs_hide',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    showAnimation: {
        type: 'slide',
        direction: 'left',
    },
    items: [
        {
            xtype: 'abraxa.titlebar',
            padding: 0,
            margin: '0 -12',
            bind: {
                title: '<div class="hbox"><span class="mr-4">Role</span><span class="text-info">({rolesGrid.selection.name})</span></div>',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '0 16 0 0',
                    align: 'left',
                    iconCls: 'md-icon-keyboard-backspace',
                    ui: 'round default',
                    handler: function () {
                        Ext.ComponentQuery.query('[cls~=permission_settings]')[0].setHidden(true);
                        Ext.ComponentQuery.query('[cls~=role_settings]')[0]
                            .setShowAnimation({
                                type: 'slide',
                                direction: 'right',
                            })
                            .setHidden(false);
                    },
                },
            ],
        },
        {
            xtype: 'div',
            padding: '16 32',
            cls: 'hbox',
            bind: {
                html: '<div class="a-obj-logo a-logo-lg {objectTabs.activeTab.object_record.object.cls} a-shadow mr-24"><i class="{objectTabs.activeTab.object_record.object.icon}"></i></div><div class="a-info"><div class="h3 m-0">{objectTabs.activeTab.object_record.object.name} advanced settings</div><div class="text-info">Powerful reporting & collaboration tools made for port agents.</div></div>',
            },
        },
        {
            xtype: 'settings.permisiongrid',
        },
    ],
});
