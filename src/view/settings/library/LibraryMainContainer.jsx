import './SharedCostCentersButton.jsx';
import './ports/PortsMainContainer.jsx';
import './sof/SofMainContainer.jsx';
import './expenses/ExpensesMainContainer.jsx';
import './costcenter/CostCenterMainContainer.jsx';
import './cargoes/CargoesMainContainer.jsx';
import './vessels/VesselsMainContainer.jsx';
import './taxes/TaxesMainContainer.jsx';
import './ports/PortsRightCard.jsx';
import './cargoes/CargoesRightCard.jsx';
import './vessels/VesselsRightCard.jsx';
import './ports/FilesInfo.jsx';
import './ports/TerminalsRightCard.jsx';
import './ports/BerthsRightCard.jsx';
import './ports/HolidaysRightCard.jsx';
import './taxes/TaxesRightCard.jsx';
import './expenses/ServiceRightPanel.jsx';
import './costcenter/CostCenterDetails.jsx';
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
Ext.define('Abraxa.view.settings.lirbrary.LibraryMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.main',
    layout: 'vbox',
    flex: 1,
    itemId: 'libraryMainContainer',
    viewModel: {
        data: {
            dialogHasBeenShown: false,
            agentsCounts: 0,
            LibraryServicesGrid: null,
            legacyPort: null,
            //hardcoded email for use Dimo Dimitrov to send submissions to nomenclature module
            //must be remove in feature!!
            userSubmissions: [
                'dimitrov@abraxa.com',
                'zapryanov@abraxa.com',
                'marin.zapryanov@gmail.com',
                'test503@abv.bg',
                'boyan.stoyanov@abraxa.com',
            ],
        },
        stores: {
            portServedBerths: {
                source: '{portsServerGrid.selection.berths}',
            },
            portServedTerminals: {
                source: '{portsServerGrid.selection.terminals}',
            },
        },
        formulas: {
            portImg: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (port) {
                        if (port.code) {
                            return 'https://static.abraxa.com/ports/' + port.code + '.jpg';
                        } else {
                            return 'https: //static.abraxa.com/images/no-image-port.svg';
                        }
                    }
                },
            },
            portFlag: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (port && port.flag_abv_2_letters) {
                        return 'https://static.abraxa.com/flags/1x1/' + port.flag_abv_2_letters.toLowerCase() + '.svg';
                    }
                },
            },

            point: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port.point}',
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
            portserveRecord: {
                bind: {
                    bindTo: '{portsServerGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    }
                },
            },
            portServedHolidays: {
                bind: {
                    bindTo: '{portsServerGrid.selection.holidays}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        store.sort('date', 'ASC');
                        return store;
                    }
                },
            },
            terminalCollection: {
                bind: {
                    bindTo: '{legacyPort}',
                    deep: true,
                },
                get: function (legacyPort) {
                    if (legacyPort) {
                        return legacyPort.terminals;
                    }
                    return null;
                },
            },

            //Uncoment when BE is ready
            // selectedAgents: function (get) {
            //     const vm = this;
            //     Ext.Ajax.request({
            //         url: Env.ApiEndpoint + 'cost-structure-shares/',
            //         method: 'GET',
            //         headers: {
            //             Authorization: 'Bearer ' + localStorage.getItem('id_token'),
            //             'Content-Type': 'application/json',
            //         },
            //         jsonData: {},
            //         success: function (response) {
            //             const data = JSON.parse(response.responseText).data;
            //             vm.set('agentsCounts', data.length);
            //         },
            //         failure: function (response) {},
            //     });
            // },
        },
    },
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            hidden: false,
            itemId: 'main-right-container',
            bind: {
                hidden: '{portsServerGrid.selection || cargoesGrid.selection || vesselsGrid.selection ? true : false}',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-bb-100',
                    weight: 1,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            docked: 'top',
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'tabbar',
                                    height: 64,
                                    padding: '0 8',
                                    bind: {
                                        activeTab: '{currentUserType == "principal" ? 2 : 0}',
                                    },
                                    reference: 'library_tabbar',
                                    publishes: {
                                        activeTab: true,
                                        activeTabIndex: true,
                                    },
                                    defaults: {
                                        ui: 'tab-lg',
                                        ripple: false,
                                    },
                                    items: [
                                        {
                                            text: 'Ports served',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'SOF',
                                            testId: 'librarySofTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'Services',
                                            testId: 'libraryServicesTabTestId',
                                        },
                                        {
                                            text: 'Cost center',
                                            testId: 'libraryServicesTabTestId',
                                        },
                                        {
                                            text: 'Cargoes',
                                            testId: 'libraryCargoesTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'Vessels',
                                            testId: 'libraryVesselsTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'Taxes',
                                            testId: 'libraryTaxesTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                    ],
                                    listeners: {
                                        activeTabchange: function (me, value) {
                                            //DEV-2926
                                            if (value && value.getText() == 'Services') {
                                                Ext.ComponentQuery.query('#LibraryServicesGrid')[0].getStore().load();
                                            }

                                            Ext.ComponentQuery.query('#taxGrid')[0].deselectAll();
                                            Ext.ComponentQuery.query('#LibraryServicesGrid')[0].deselectAll();
                                        },
                                    },
                                },
                                {
                                    xtype: 'SharedCostCentersButton',
                                    bind: {
                                        hidden: '{currentUserType !== "principal"}',
                                        text: 'Share with agents <em style="background-color: white; color: #0078D7">{agentsCounts}</em>',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'settings.library.ports.main',
                },
                {
                    xtype: 'settings.library.sof.main',
                },
                {
                    xtype: 'settings.library.expenses.main',
                },
                {
                    xtype: 'CostCenterMainContainer',
                },
                {
                    xtype: 'settings.library.cargoes.main',
                },
                {
                    xtype: 'settings.library.vessels.main',
                },
                {
                    xtype: 'settings.library.taxes.taxes.main',
                },
            ],
        },
        {
            xtype: 'ports.right.card',
            hidden: true,
            showAnimation: 'slide',
            bind: {
                hidden: '{portsServerGrid.selection ? false : true}',
            },
        },
        {
            xtype: 'cargoes.right.card',
            hidden: true,
            showAnimation: 'slide',
            bind: {
                hidden: '{cargoesGrid.selection ? false : true}',
            },
        },
        {
            xtype: 'vessels.right.card',
            hidden: true,
            showAnimation: 'slide',
            bind: {
                hidden: '{vesselsGrid.selection ? false : true}',
            },
        },
        {
            xtype: 'settings.library.port.files.info',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            zIndex: 998,
            weight: 0,
            docked: 'right',
        },
        {
            xtype: 'settings.library.terminals.right.card',
        },
        {
            xtype: 'settings.library.berths.right.card',
        },
        {
            xtype: 'settings.library.holidays.right.card',
        },
        {
            xtype: 'taxes.right.card',
        },
        {
            xtype: 'ServiceRightPanel',
        },
        {
            xtype: 'CostCenterDetails',
            width: '100%',
            docked: 'right',
            hidden: true,
            bind: {
                hidden: '{costCenterGrid.selection ? false : true}',
            },
        },
    ],
});
