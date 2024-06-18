import './DashboardViewModel';
import './DashboardLeftContainer';
import './DashboardRightContainer';
import './DashboardMiddleContainer';
import './DashboardBottomLeftContainer';
import './DashboardBottomRightContainer';

Ext.define('Abraxa.view.dashboard.DashboardMainContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboard.main',
    id: 'dashboardMainContainer',
    viewModel: 'dashboard-viewmodel',
    bodyCls: 'a-container-full a-dashboard a-layout-wrap-transparent',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'container',
            flex: 1,
            scrollable: true,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        // align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-dashboard-heading',
                            bind: {
                                html: '<h2>Ahoy, {currentUser.first_name}</h2><div class="a-subheading">Welcome to Abraxa</div>',
                            },
                        },
                        {
                            xtype: 'container',
                            id: 'newsFeedRedirectBtn',
                            cls: 'a-button-dashboard-newsfeed-container',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'default outlined',
                                    cls: 'a-has-counter',
                                    iconCls: 'md-icon-outlined md-icon-file-copy',
                                    html: 'News feed <em class="bg-blue-grey-100">&nbsp;</em>',
                                    bind: {
                                        html: 'News feed <em class="bg-pink-500">{newsFeedCount}</em>',
                                    },
                                    listeners: {
                                        painted: function() {
                                            Ext.fireEvent('updateNewPortNewsCount');
                                        },
                                    },
                                    handler: function() {
                                        Ext.getCmp('main-viewport').getController().redirectTo('portnews');
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    height: 420,
                    layout: 'hbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'dashboard.left.container',
                        },
                        {
                            xtype: 'container',
                            flex: 3.2,
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                            },
                            items: [
                                {
                                    xtype: 'dashboard.right.container',
                                    flex: 1,
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-card-container bordered',
                                    hideMode: 'opacity',
                                    minHeight: 140,
                                    items: [
                                        {
                                            xtype: 'container',
                                            cls: 'a-titlebar',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'center',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'title',
                                                            title: 'Total open balance',
                                                        },
                                                        {
                                                            xtype: 'infoicon',
                                                            infoText:
                                                                'Sum of all client balances converted into your selected base currency',
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            padding: '0 16 16 16',
                                            showNoPermissions: true,
                                            slug: 'dashboardBalanceExposure',
                                            bind: {
                                                permission: '{userPermissions}',
                                                cls: 'a-dashboard-balance {disbursementsTotalCls}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    cls: 'a-balance',
                                                    bind: {
                                                        html: '<strong><small>{disbursementsCurrency}</small> {disbursementsTotal}</strong>',
                                                    },
                                                },
                                                {
                                                    xtype: 'container',
                                                    margin: '16 0 0 0',
                                                    bind: {
                                                        html: '<div class="sm-title"><strong>Total:</strong> {disbursementsCount} appointments</div>',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'dashboard.middle.container',
                    height: 420,
                    flex: 1,
                },
                {
                    xtype: 'container',
                    height: 420,
                    flex: 1,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'dashboard.bottom.left.container',
                        },
                        {
                            xtype: 'dashboard.bottom.right.container',
                        },
                    ],
                },
            ],
        },
    ],
});
