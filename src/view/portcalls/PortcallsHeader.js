Ext.define('Abraxa.view.portcalls.PortcallsHeader', {
    extend: 'Ext.Container',
    xtype: 'portcalls.header',
    layout: 'vbox',
    flex: 1,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-main-titlebar',
                    items: [
                        {
                            xtype: 'div',
                            itemId: 'mainTitle',
                            cls: 'a-main-title has-dropdown',
                            bind: {
                                html: '<h1>{viewTitle}</h1>',
                                hidden: '{hasPortcallRights ? false : true}',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let menu = Ext.create('Abraxa.view.main.RecentlyOpenedMenu', {
                                            viewModel: {
                                                parent: Ext.getCmp('main-viewport').getViewModel(),
                                            },
                                        });
                                        menu.showBy(this);
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'tabbar',
                    cls: 'a-main-tabs',
                    controller: 'portcalls-agent-controller',
                    activeTab: 0,
                    reference: 'portcallsMainTabbar',
                    publishes: {
                        activeTab: true,
                        activeTabIndex: true,
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                    },
                    defaults: {
                        ui: 'tab-main',
                        ripple: false,
                    },
                    items: [
                        {
                            id: 'operations',
                            title: 'Operations',
                        },
                        {
                            id: 'accounts',
                            title: 'Financials',
                        },
                        {
                            id: 'disbursements',
                            title: 'Disbursements',
                        },
                        {
                            id: 'transactions',
                            title: 'Transactions',
                            hidden: true,
                            bind: {
                                hidden: '{currentUserType != "principal" ? false : true}',
                            },
                        },
                    ],
                },
                // {
                // 	xtype: 'tabbar',
                // 	cls: 'a-main-tabs',
                // 	slug: 'portcall',
                // 	bind: {
                // 		permission: '{userPermissions}',
                // 	},
                // 	activeTab: 0,
                // 	layout: {
                // 		type: 'hbox',
                // 		pack: 'start',
                // 	},
                // 	defaults: {
                // 		ui: 'tab-main',
                // 		ripple: false,
                // 	},
                // 	reference: 'portcallsAgentTabbar',
                // 	publishes: ['activeTabIndex'],
                // 	activeTabIndex: 0,
                // 	items: [
                // 		{
                // 			text: 'Active',
                // 		},
                // 		{
                // 			text: 'Closed',
                // 		},
                // 		{
                // 			text: 'Invitations',
                // 			slug: 'portcallInvitations',
                // 			bind: {
                // 				badgeText: '{invitaionsPendingCount}',
                // 				permission: '{userPermissions}',
                // 			},
                // 		},
                // 	],
                // 	listeners: {
                // 		activeTabchange: function (me, value) {
                // 			let currentUser = me.upVM().get('currentUser'),
                // 				activeGrid = Ext.ComponentQuery.query('[xtype=portcalls\\.grid\\.active]')[0],
                // 				archiveGrid = Ext.ComponentQuery.query('[xtype=portcalls\\.grid\\.closed]')[0];
                // 			activeGrid.deselectAll();
                // 			archiveGrid.deselectAll();
                // 			if (currentUser.getCompany().get('type') === 'principal') {
                // 				let portcallsPrincipalArchived = Ext.ComponentQuery.query(
                // 					'portcalls\\.principal\\.main'
                // 				)[0]
                // 					.lookupViewModel()
                // 					.get('portcallsArchived');
                // 				if (value.getText() == 'Closed') {
                // 					if (!portcallsPrincipalArchived.isLoaded()) {
                // 						portcallsPrincipalArchived.load();
                // 					}
                // 				}
                // 			} else {
                // 				let portcallsAgentArchived = Ext.ComponentQuery.query('portcalls\\.agent\\.main')[0]
                // 					.lookupViewModel()
                // 					.get('portcallsArchived');
                // 				if (value.getText() == 'Closed') {
                // 					if (!portcallsAgentArchived.isLoaded()) {
                // 						portcallsAgentArchived.load();
                // 					}
                // 				}
                // 			}
                // 		},
                // 	},
                // },
                {
                    xtype: 'container',
                    cls: 'a-main-right',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'verified.div',
                        },
                    ],
                },
            ],
        },
    },
});
