import './RolesGrid';
import './AddEditRole';

Ext.define('Abraxa.view.settings.users_teams.roles.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.users_teams.roles.main.container',
    testId: 'settingsUserRolesMain',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    hidden: true,
    bind: {
        hidden: '{user_tabbar.activeTabIndex == 1 ? false: true}',
    },
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
                            html: '<h1 class="fw-n">Roles settings</h1>',
                        },
                        {
                            xtype: 'div',
                            cls: 'w-50',
                            html: '<p class="text-info">Customize user permissions and make sure your team sees what they are supposed to.</p>',
                        },
                        {
                            xtype: 'div',
                            margin: '16 0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'button',
                            text: 'Role',
                            testId: 'settingsUserRolesMainAddSmallBtn',
                            ui: 'action small',
                            cls: 'chameleon_settings_invite_user',
                            iconCls: 'md-icon-add',
                            slug: 'settingsUserRoleCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let currentUserPlan = me.upVM().get('currentUserPlan');
                                if (currentUserPlan == 'starter') {
                                    Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                } else {
                                    Ext.create('Abraxa.view.settings.company.AddEditRole', {
                                        viewModel: {
                                            parent: me.upVM(),
                                            data: {
                                                title: 'Create role',
                                                editMode: false,
                                                record: Ext.create('Abraxa.model.role.Role', {
                                                    company_id: me.upVM().get('currentUser').current_company_id,
                                                }),
                                            },
                                        },
                                    }).show();
                                }
                            },
                        },
                    ],
                },
                {
                    xtype: 'settings.roles.grid',
                    flex: 1,
                    showNoPermissions: true,
                    slug: 'settingsUserRole',
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
    ],
});
