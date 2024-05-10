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

Ext.define('Abraxa.view.common.dialog.PortMain', {
    extend: 'Ext.Dialog',
    xtype: 'port.main',
    ui: 'dialog-md type3',
    minWidth: '1180',
    cls: 'a-dialog-color a-dialog-port',
    margin: 0,
    padding: 0,
    maxHeight: '90%',
    height: 768,
    viewModel: {
        type: 'port-main-viewmodel',
    },
    hideAnimation: null,
    layout: 'vbox',
    tbar: {
        ui: 'toolbar-panel-top',
        layout: {
            type: 'hbox',
            align: 'middle',
        },
        items: [
            {
                xtype: 'container',
                minWidth: 360,
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                },
                flex: 1,
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'tool',
                        ui: 'tool-md',
                        iconCls: 'md-icon-close',
                        tooltip: {
                            anchorToTarget: true,
                            html: 'Close',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            this.up('dialog').destroy();
                        },
                    },
                ],
            },
        ],
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-dialog-bgr',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-img-wrap',
                            items: [
                                {
                                    xtype: 'image',
                                    align: 'stretch',
                                    itemId: 'portImageItemId',
                                    layout: 'fit',
                                    minHeight: 196,
                                    flex: 1,
                                    bind: {
                                        src: '{port.code ? "https://static.abraxa.com/ports/"+port.code+".jpg": "https://static.abraxa.com/images/no-image-port.svg"}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: 'vbox',
                            scrollable: true,
                            defaults: {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '12 0',
                                defaults: {
                                    xtype: 'displayfield',
                                    ui: 'default',
                                    encodeHtml: false,
                                    cls: 'col-6',
                                    renderer: function (value) {
                                        if (value) {
                                            return value;
                                        } else {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    items: [
                                        {
                                            labelAlign: 'top',
                                            ui: 'field-xl',
                                            cls: 'col-12',
                                            margin: '0 0 12 0',
                                            bind: {
                                                label: '{port.type}',
                                                value: '<div class="hbox"><img data-qtip="{port.country}" data-qalign="bc-tc" height="24" class="a-img-round mr-16" src="https://static.abraxa.com/flags/1x1/{port.flag_abv_2_letters:lowercase}.svg" alt="" />{port.name} <span class="text-uppercase ml-2">({port.flag_abv_2_letters})</span></div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Locode',
                                            bind: {
                                                value: '{port.locode}',
                                            },
                                        },
                                        {
                                            label: 'Timezone',
                                            bind: {
                                                value: '{port.time_zone}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Coordinates',
                                            bind: {
                                                value: '{calculateLatCoordinates}',
                                            },
                                        },
                                        {
                                            label: '&nbsp;',
                                            bind: {
                                                value: '{calculateLonCoordinates}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Season',
                                            cls: 'col-6 a-val-capitalize',
                                            bind: {
                                                value: '{port.season}',
                                            },
                                        },
                                        {
                                            label: 'Water Salinity',
                                            cls: 'col-6 a-val-capitalize',
                                            bind: {
                                                value: '{port.water}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: '(S)ECA',
                                            bind: {
                                                value: '{port.is_seca}',
                                            },
                                        },
                                        {
                                            label: 'Shelter Afforded',
                                            bind: {
                                                value: '{port.shelter_afforded_code}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Harbor Size',
                                            bind: {
                                                value: '{port.harbor_size_code}',
                                            },
                                        },
                                        {
                                            label: 'Harbor Type',
                                            bind: {
                                                value: '{port.harbor_type_code}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'port.dialog.info',
                    flex: 8,
                },
            ],
        },
    ],
    listeners: {
        destroy: function (me) {
            let portServed = Ext.getCmp('main-viewport').getVM().get('portsServed'),
                port = me.upVM().get('port');
            portRecord = portServed.findRecord('port_id', port.get('id'), 0, false, false, true);
            if (portRecord) {
                portRecord.load();
            }
        },
    },
});
