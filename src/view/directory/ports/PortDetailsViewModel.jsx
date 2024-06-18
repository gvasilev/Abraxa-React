import './PortInfoTab/PortInfoMain';
import './TerminalsTab/TerminalsTab';
import './BerthsTab/BerthsTabMain';
import './HolidaysTab/HolidaysMain';
import './AgentsTab/AgentsMain';

Ext.define('Abraxa.view.directory.ports.PortDetailsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.PortDetailsViewModel',
    data: {
        subTab: null,
        subTabId: null,
    },
    stores: {
        tabXtypes: {
            data: [
                {
                    id: 0,
                    tabXtype: 'PortInfoMain',
                },
                {
                    id: 1,
                    tabXtype: 'TerminalsMain',
                },
                {
                    id: 2,
                    tabXtype: 'BerthsTabMain',
                },
                {
                    id: 3,
                    tabXtype: 'HolidaysMain',
                },
                {
                    id: 4,
                    tabXtype: 'AgentsMain',
                },
            ],
        },
        terminals: {
            source: '{object_record.terminals}',
        },
        berths: {
            source: '{object_record.berths}',
        },
        holidays: {
            source: '{object_record.holidays}',
        },
        agents: {
            source: '{object_record.agents}',
        },
        berthsPerTerminal: {
            source: '{berths}',
            filters: '{berthPerTerminalFilter}',
        },
    },
    formulas: {
        doDefaults: {
            bind: {
                bindTo: '{execPortDefaults}',
                deep: true,
            },
            get: function(rec) {
                if (rec) {
                    Ext.getCmp('main-viewport').setMasked(false);
                    return rec;
                }
            },
        },
        activeItemPerSubTab: {
            bind: {
                bindTo: '{subTab}',
                deep: true,
            },
            get: function(subTab) {
                let tabbar = Ext.ComponentQuery.query('[xtype=PortDetailsMainView]')[0].down('tabbar');
                let tabIndex = 0;
                if (tabbar.getItems().items && tabbar.getItems().items.length) {
                    Ext.Array.each(tabbar.getItems().items, function(item, index) {
                        if (item.hash === subTab) {
                            tabIndex = index;
                        }
                    });
                }
                if (!this.get('subTabId')) {
                    tabbar.setActiveTab(tabIndex);
                }
            },
        },
        activeItemPerTab: {
            bind: {
                bindTo: '{portInfoTabbar.activeTabIndex}',
                deep: true,
            },
            get: function(activeTab) {
                let xtype = null;
                let tabXtypes = this.get('tabXtypes');
                let tabXtypeRecord = tabXtypes.getById(activeTab);
                if (tabXtypeRecord) {
                    xtype = tabXtypeRecord.get('tabXtype');
                }

                if (xtype) {
                    return {
                        xtype: xtype,
                    };
                }
            },
        },
        portImg: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function(port) {
                if (port) {
                    if (port.get('code')) {
                        return 'https://static.abraxa.com/ports/' + port.get('code') + '.jpg';
                    } else {
                        return 'https://static.abraxa.com/images/no-image-port.svg';
                    }
                }
            },
        },
        portCoordinates: {
            bind: {
                bindTo: '{object_record.center}',
                deep: true,
            },
            get: function(portCoordinates) {
                if (portCoordinates) {
                    return portCoordinates;
                }
                return null;
            },
        },
        lat: {
            bind: {
                bindTo: '{portCoordinates}',
                deep: true,
            },
            get: (coordinates) => AbraxaFunctions.getPortLatitude(coordinates),
        },
        lon: {
            bind: {
                bindTo: '{portCoordinates}',
                deep: true,
            },
            get: (coordinates) => AbraxaFunctions.getPortLongitude(coordinates),
        },
        showRightCard: {
            bind: {
                bindTo: '{subTabId}',
                deep: true,
            },
            get: function(subTabId) {
                if (subTabId) {
                    Ext.ComponentQuery.query('[xtype=PortInfoRightCard]')[0].setHidden(false);
                } else {
                    Ext.ComponentQuery.query('[xtype=PortInfoRightCard]')[0].setHidden(true);
                }
            },
        },
        badgeString: {
            bind: {
                bindTo: '{subTab}',
                deep: true,
            },
            get: function(tab) {
                if (tab) {
                    if (tab == 'terminals') return 'terminal';
                    if (tab == 'berths') return 'berth';
                }
            },
        },
        selectedRecord: {
            bind: {
                subTabId: '{subTabId}',
                terminalsCount: '{terminals.count}',
                berthsCount: '{berths.count}',
            },
            get: function(data) {
                if (data.subTabId) {
                    let store = this.get('terminals');
                    if (this.get('subTab') == 'berths') {
                        store = this.get('berths');
                    }
                    if (store) {
                        return store.getById(parseInt(data.subTabId));
                    }
                }
            },
        },
        berthPerTerminalFilter: {
            bind: {
                badgeString: '{badgeString}',
                terminalId: '{subTabId}',
            },
            get: function(data) {
                if (data && data.badgeString && data.terminalId) {
                    let store = this.get('berthsPerTerminal');
                    if (store) store.clearFilter();
                    return function(rec) {
                        if (data.badgeString === 'terminal') {
                            if (rec.get('terminal_id') && rec.get('terminal_id') === data.terminalId) {
                                return true;
                            }
                        }
                    };
                } else {
                    return function() {
                        return false;
                    };
                }
            },
        },
        selectionContent: {
            bind: {
                bindTo: '{subTab}',
                deep: true,
            },
            get: function(section) {
                if (section) {
                    Ext.ComponentQuery.query('[cls~=right_card_content]')[0].removeAll(true, false);
                    if (section === 'terminals') {
                        //return terminal right content
                        return {
                            xtype: 'TerminalsRightContent',
                        };
                    }
                    if (section === 'berths') {
                        //return berth right content
                        return {
                            xtype: 'BerthsRightContent',
                        };
                    }
                }
            },
        },
        portInfoUpdated: {
            bind: {
                bindTo: '{object_record.updated_at}',
            },
            get: function(date) {
                if (date) {
                    return date;
                }
            },
        },
    },
});
