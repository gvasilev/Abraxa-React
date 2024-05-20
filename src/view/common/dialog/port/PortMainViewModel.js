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
    var lngResult;

    // Make sure that you are working with numbers.
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    lngResult = '';

    // Check the correspondence of the coordinates for longitude: East or West.
    var lngLetter = lng >= 0 ? 'E' : 'W';

    // Call getDms(lng) function for the coordinates of Longitude in DMS.
    lngResult += getDms(lng) + ' ' + lngLetter;

    return lngResult;
};

var convertLatDDtoDMS = function ddToDms(lng, lat) {
    var lat = lat;
    var lng = lng;
    var latResult;

    // Make sure that you are working with numbers.
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    latResult = '';

    // Check the correspondence of the coordinates for latitude: North or South.
    var latLetter = lat >= 0 ? 'N' : 'S';

    latResult += getDms(lat) + ' ' + latLetter;

    return latResult;
};

Ext.define('Abraxa.view.common.port.PortMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.port-main-viewmodel',
    data: {
        getIsPortServed: false,
    },
    stores: {
        terminals: {
            source: '{port.terminals}',
        },
    },
    formulas: {
        calculateLatCoordinates: {
            bind: '{port.point}',
            get: function (data) {
                if (data) {
                    let info = JSON.parse(data);
                    let lat = info.coordinates[1];

                    return convertLatDDtoDMS(null, lat);
                }
            },
        },
        calculateLonCoordinates: {
            bind: '{port.point}',
            get: function (data) {
                if (data) {
                    let info = JSON.parse(data);
                    let lon = info.coordinates[0];
                    return convertLonDDtoDMS(lon, null);
                }
            },
        },
        berths: {
            bind: {
                bindTo: '{port}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = record.berths();
                    store.getProxy().setExtraParams({
                        port_id: record.get('id'),
                    });
                    return store;
                }
            },
        },
        updateTerminals: {
            bind: {
                bindTo: '{port}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = this.get('terminals');
                    store.getProxy().setExtraParams({
                        port_id: record.get('id'),
                    });
                }
            },
        },

        portServedHolidays: {
            bind: {
                bindTo: '{port.holidays}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    store.setSorters([
                        {
                            sorterFn: function (record1, record2) {
                                var firstDate = record1.get('date'),
                                    secondDate = record2.get('date');

                                if (moment(firstDate).isValid()) {
                                    var date1 = moment(moment(firstDate).format('MM-DD'));
                                }

                                if (moment(secondDate).isValid()) {
                                    var date2 = moment(moment(secondDate).format('MM-DD'));
                                }

                                return date1 - date2;
                            },
                            direction: 'ASC',
                        },
                    ]);
                    return store;
                }
            },
        },
    },
});
