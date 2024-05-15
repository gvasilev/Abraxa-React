import './PortInfo.jsx';
import './TerminalsMainCointaner.jsx';
import './BerthsMainCointaner.jsx';
import './HolidaysMainCointaner.jsx';
import './AdditionalMainContainer.jsx';
import './FilesMainContainer.jsx';
Ext.define('Abraxa.view.settings.library.ports.PortsRightCard', {
    extend: 'Ext.Container',
    xtype: 'ports.right.card',
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
                                let grid = Ext.ComponentQuery.query('settings\\.library\\.portsserved\\.grid')[0];
                                if (grid) {
                                    grid.deselectAll();
                                }
                                let tabbar = Ext.ComponentQuery.query('ports\\.right\\.card')[0].down('tabbar');
                                if (tabbar) {
                                    tabbar.setActiveTab(0);
                                }
                            },
                        },
                        {
                            xtype: 'title',
                            bind: {
                                title: '{portsServerGrid.selection.port_name} ({portsServerGrid.selection.port.flag_abv_2_letters})',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    padding: '0 16 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                            text: 'Export port info',
                            hidden: true,
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
                            text: 'Port info',
                            testId: 'libraryPortInfoTabTestId',
                        },
                        {
                            text: 'Terminals',
                            testId: 'libraryTerminalsTabTestId',
                        },
                        {
                            text: 'Berths',
                            testId: 'libraryBerthsTabTestId',
                        },
                        {
                            text: 'Holidays',
                            testId: 'libraryHolidaysTabTestId',
                        },
                        {
                            text: 'Additional info',
                            testId: 'libraryAdditionalInfoTabTestId',
                        },
                        {
                            text: 'Files',
                            testId: 'libraryFilesTabTestId',
                        },
                    ],
                    listeners: {
                        activeTabchange: function (me, value) {
                            let activeTab = me.getActiveTab(),
                                profileCardContainer = Ext.ComponentQuery.query('#portsCardContainer')[0];
                            if (profileCardContainer.getActiveItem().down('grid')) {
                                profileCardContainer.getActiveItem().down('grid').deselectAll();
                            }
                            if (profileCardContainer.getActiveItem().down('list')) {
                                profileCardContainer.getActiveItem().down('list').deselectAll();
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
            itemId: 'portsCardContainer',
            layout: {
                type: 'card',
                // animation: 'slide'
            },
            items: [
                {
                    xtype: 'settings.library.port.info',
                },
                {
                    xtype: 'settings.library.terminals.main',
                },
                {
                    xtype: 'settings.library.berths.main',
                },
                {
                    xtype: 'settings.library.holidays.main',
                },
                {
                    xtype: 'settings.library.additional.main',
                },
                {
                    xtype: 'settings.library.port.files.main',
                },
            ],
        },
    ],
});
