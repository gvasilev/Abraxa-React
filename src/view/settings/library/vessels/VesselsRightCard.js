Ext.define('Abraxa.view.settings.library.vessels.CargoesRightCard', {
    extend: 'Ext.Container',
    xtype: 'vessels.right.card',
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'tool',
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            margin: '0 16 0 0',
                            ui: 'tool-md',
                            handler: function () {
                                let grid = Ext.ComponentQuery.query('settings\\.library\\.vessels\\.grid')[0];
                                if (grid) {
                                    grid.setSelection(null);
                                    grid.deselectAll();
                                }
                                let tabbar = Ext.ComponentQuery.query('vessels\\.right\\.card')[0].down('tabbar');
                                if (tabbar) {
                                    tabbar.setActiveTab(0);
                                }
                            },
                        },
                        {
                            xtype: 'title',
                            bind: {
                                title: '{vesselsGrid.selection.name}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            padding: '0 32',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'tabbar',
                    height: 64,
                    animateIndicator: false,
                    activeTab: 0,
                    defaults: {
                        ui: 'tab-lg',
                        ripple: false,
                    },
                    items: [
                        {
                            text: 'Main details',
                            testId: 'vesselMainDetailsTabTestId',
                        },
                        {
                            text: 'Technical',
                            testId: 'vesselTechnicalTabTestId',
                        },
                        {
                            text: 'Management',
                            testId: 'vesselManagementTabTestId',
                        },
                        {
                            text: 'Certificates',
                            testId: 'vesselCertificatesTabTestId',
                        },
                    ],
                    listeners: {
                        activeTabchange: function (me, value) {
                            let activeTab = me.getActiveTab(),
                                profileCardContainer = Ext.ComponentQuery.query('#vesselCardContainer')[0];
                            if (profileCardContainer.down('grid')) {
                                profileCardContainer.down('grid').deselectAll();
                            }
                            profileCardContainer.setActiveItem(this.items.indexOf(activeTab));
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            itemId: 'vesselCardContainer',
            layout: {
                type: 'card',
            },
            items: [
                {
                    xtype: 'settings.library.vessels.main.details',
                },
                {
                    xtype: 'settings.library.vessels.technicals',
                },
                {
                    xtype: 'settings.library.vessels.managment',
                },
                {
                    xtype: 'settings.library.vessels.certificates',
                },
            ],
        },
    ],
});
