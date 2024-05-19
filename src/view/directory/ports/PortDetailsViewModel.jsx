import './PortInfoTab/PortInfoMain.jsx';
import './TerminalsTab/TerminalsTab.jsx';
import './BerthsTab/BerthsTabMain.jsx';
import './HolidaysTab/HolidaysMain.jsx';
import './AgentsTab/AgentsMain.jsx';
var getDms = function getDms(val) {
    // Required variables
    var valDeg, valMin, valSec, result;

    // Here you'll convert the value received in the parameter to an absolute value.
    // Conversion of negative to positive.
    // In this step does not matter if it's North, South, East or West,
    // such verification was performed earlier.
    val = Math.abs(val); // -40.601203 = 40.601203

    // ---- Degrees ----
    // Stores the integer of DD for the Degrees value in DMS
    valDeg = Math.floor(val); // 40.601203 = 40

    // Add the degrees value to the result by adding the degrees symbol.
    result = valDeg + '\u00B0 ';

    // ---- Minutes ----
    // Removing the integer of the inicial value you get the decimal portion.
    // Multiply the decimal portion by 60.
    // Math.floor returns an integer discarding the decimal portion.
    // ((40.601203 - 40 = 0.601203) * 60 = 36.07218) = 36
    valMin = Math.floor((val - valDeg) * 60); // 36.07218 = 36

    // Add minutes to the result, adding the symbol minutes "'".
    result += valMin + "' ";

    // ---- Seconds ----
    // To get the value in seconds is required:
    // 1Âº - removing the degree value to the initial value: 40 - 40.601203 = 0.601203;
    // 2Âº - convert the value minutes (36') in decimal ( valMin/60 = 0.6) so
    // you can subtract the previous value: 0.601203 - 0.6 = 0.001203;
    // 3Âº - now that you have the seconds value in decimal,
    // you need to convert it into seconds of degree.
    // To do so multiply this value (0.001203) by 3600, which is
    // the number of seconds in a degree.
    // You get 0.001203 * 3600 = 4.3308
    // As you are using the function Math.round(),
    // which rounds a value to the next unit,
    // you can control the number of decimal places
    // by multiplying by 1000 before Math.round
    // and subsequent division by 1000 after Math.round function.
    // You get 4.3308 * 1000 = 4330.8 -> Math.round = 4331 -> 4331 / 1000 = 4.331
    // In this case the final value will have three decimal places.
    // If you only want two decimal places
    // just replace the value 1000 by 100.
    valSec = parseFloat(Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000).toFixed(2); // 40.601203 = 4.331

    // Add the seconds value to the result,
    // adding the seconds symbol " " ".
    result += valSec + '" '; // 40Âº36'4.331"

    // Returns the resulting string.
    return result;
};

// Convert coordinates: DD to DMS
var convertDddToDms = function ddToDms(lng, lat) {
    var lat = lat;
    var lng = lng;
    var latResult, lngResult, dmsResult;

    // Make sure that you are working with numbers.
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    latResult = '';
    lngResult = '';

    // Check the correspondence of the coordinates for latitude: North or South.
    var latLetter = lat >= 0 ? 'N' : 'S';

    latResult += getDms(lat) + ' ' + latLetter;

    // Check the correspondence of the coordinates for longitude: East or West.
    var lngLetter = lng >= 0 ? 'E' : 'W';

    // Call getDms(lng) function for the coordinates of Longitude in DMS.
    lngResult += getDms(lng) + ' ' + lngLetter;

    dmsResult = latResult + '  &nbsp;&nbsp;' + lngResult;

    return dmsResult;
};

var convertLonDDtoDMS = function ddToDms(lng, lat) {
    var lat = lat;
    var lng = lng;
    var latResult, lngResult, dmsResult;

    // Make sure that you are working with numbers.
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    latResult = '';
    lngResult = '';

    // Check the correspondence of the coordinates for latitude: North or South.
    var latLetter = lat >= 0 ? 'N' : 'S';

    latResult += getDms(lat) + ' ' + latLetter;

    // Check the correspondence of the coordinates for longitude: East or West.
    var lngLetter = lng >= 0 ? 'E' : 'W';

    // Call getDms(lng) function for the coordinates of Longitude in DMS.
    lngResult += getDms(lng) + ' ' + lngLetter;

    dmsResult = latResult + '  &nbsp;&nbsp;' + lngResult;

    return lngResult;
};

var convertLatDDtoDMS = function ddToDms(lng, lat) {
    var lat = lat;
    var lng = lng;
    var latResult, lngResult, dmsResult;

    // Make sure that you are working with numbers.
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    latResult = '';
    lngResult = '';

    // Check the correspondence of the coordinates for latitude: North or South.
    var latLetter = lat >= 0 ? 'N' : 'S';

    latResult += getDms(lat) + ' ' + latLetter;

    // Check the correspondence of the coordinates for longitude: East or West.
    var lngLetter = lng >= 0 ? 'E' : 'W';

    // Call getDms(lng) function for the coordinates of Longitude in DMS.
    lngResult += getDms(lng) + ' ' + lngLetter;

    dmsResult = latResult + '  &nbsp;&nbsp;' + lngResult;

    return latResult;
};
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
            get: function (rec) {
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
            get: function (subTab) {
                let tabbar = Ext.ComponentQuery.query('[xtype=PortDetailsMainView]')[0].down('tabbar');
                let tabIndex = 0;
                if (tabbar.getItems().items && tabbar.getItems().items.length) {
                    Ext.Array.each(tabbar.getItems().items, function (item, index) {
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
            get: function (activeTab) {
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
            get: function (port) {
                if (port) {
                    if (port.get('code')) {
                        return 'https://static.abraxa.com/ports/' + port.get('code') + '.jpg';
                    } else {
                        return 'https://static.abraxa.com/images/no-image-port.svg';
                    }
                }
            },
        },
        point: {
            bind: {
                bindTo: '{object_record.point}',
                deep: true,
            },
            get: function (point) {
                if (point) {
                    return JSON.parse(point);
                }
            },
        },
        lat: {
            bind: {
                bindTo: '{point}',
                deep: true,
            },
            get: function (point) {
                if (point) return convertLatDDtoDMS(null, point.coordinates[1]);
            },
        },
        lon: {
            bind: {
                bindTo: '{point}',
                deep: true,
            },
            get: function (point) {
                if (point) return convertLatDDtoDMS(null, point.coordinates[0]);
            },
        },
        showRightCard: {
            bind: {
                bindTo: '{subTabId}',
                deep: true,
            },
            get: function (subTabId) {
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
            get: function (tab) {
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
            get: function (data) {
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
            get: function (data) {
                if (data && data.badgeString && data.terminalId) {
                    let store = this.get('berthsPerTerminal');
                    if (store) store.clearFilter();
                    return function (rec) {
                        if (data.badgeString === 'terminal') {
                            if (rec.get('terminal_id') && rec.get('terminal_id') === data.terminalId) {
                                return true;
                            }
                        }
                    };
                } else {
                    return function () {
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
            get: function (section) {
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
            get: function (date) {
                if (date) {
                    return date;
                }
            },
        },
    },
});
