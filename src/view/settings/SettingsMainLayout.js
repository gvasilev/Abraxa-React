Ext.define('Abraxa.view.settings.SettingsMainLayout', {
    extend: 'Ext.Container',
    xtype: 'settings.main',
    testId: 'settingsMain',
    viewModel: 'settings-main-viewmodel',
    cls: 'a-settings',
    bodyCls: 'a-layout-card-wrap',
    layout: 'fit',
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    testId: 'settingsMainLeftMenu',
                    cls: 'a-left-menu settings_left_menu',
                    stateful: ['width', 'userCls'],
                    stateId: 'settingsLeftMenu',
                    reference: 'settingsLeftMenu',
                    publishes: ['userCls'],
                    userCls: 'is-expanded',
                    docked: 'left',
                    weight: 0,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Global settings</h5>',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'round',
                                    testId: 'settingsMainExpandCollapseBtn',
                                    iconCls: 'md-icon-outlined md-icon-first-page',
                                    focusable: false,
                                    bind: {
                                        tooltip: {
                                            html: '<span class="tooltip_expand">{settingsLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                            anchor: true,
                                            align: 'bc-tc?',
                                        },
                                    },
                                    handler: function () {
                                        let panel = Ext.ComponentQuery.query('[cls~=settings_left_menu]')[0],
                                            cls = panel.getUserCls() == 'is-expanded';

                                        if (cls != '') {
                                            panel.setUserCls('');
                                        } else {
                                            panel.setUserCls('is-expanded');
                                        }
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'settings.menu',
                        },
                    ],
                    slug: 'settings',
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'settings.main.container',
                    slug: 'settings',
                    showNoPermissions: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
    ],
});
