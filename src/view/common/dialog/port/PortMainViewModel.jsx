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
        alternativeNames: {
            bind: {
                bindTo: '{port.meta_name_alternatives}',
            },
            get: AbraxaFunctions.getAlternativeNames,
        },
        armedGuards: {
            bind: {
                bindTo: '{port.restriction_armed_guards}',
            },
            get: AbraxaFunctions.getYesNoWithIcon,
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
        calculateLatCoordinates: {
            bind: {
                bindTo: '{port.center}',
                deep: true,
            },
            get: (coordinates) => AbraxaFunctions.getPortLatitude(coordinates),
        },
        calculateLonCoordinates: {
            bind: {
                bindTo: '{port.center}',
                deep: true,
            },
            get: (coordinates) => AbraxaFunctions.getPortLongitude(coordinates),
        },
        firstPortOfEntry: {
            bind: {
                bindTo: '{port.restriction_first_port_of_entry}',
            },
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        fromToLoadLines: {
            bind: {
                bindTo: '{port.restriction_load_lines_summer}',
                deep: true,
            },
            get: function (loadLinesObject) {
                return AbraxaFunctions.getFromToStringValue(loadLinesObject, 'from', 'to', '');
            },
        },
        fromToPilotageAvailability: {
            bind: {
                bindTo: '{port.pilotage_availability}',
                deep: true,
            },
            get: function (data) {
                return AbraxaFunctions.getFromToStringValue(data, 'start', 'end', '');
            },
        },
        fromToTowageAvailability: {
            bind: {
                bindTo: '{port.towage_availability}',
                deep: true,
            },
            get: function (data) {
                return AbraxaFunctions.getFromToStringValue(data, 'start', 'end', '');
            },
        },
        minMaxAnchorageDraft: {
            bind: {
                min: '{port.restriction_min_anchorage_draft}',
                max: '{port.restriction_max_anchorage_draft}',
            },
            get: function (data) {
                return AbraxaFunctions.getMinMaxValue(data, 'min', 'max', 1, 'm');
            },
        },
        minMaxChannelDraft: {
            bind: {
                min: '{port.restriction_min_channel_draft}',
                max: '{port.restriction_max_channel_draft}',
            },
            get: function (data) {
                return AbraxaFunctions.getMinMaxValue(data, 'min', 'max', 1, 'm');
            },
        },
        minMaxWaterDensity: {
            bind: {
                min: '{port.info_water_density_min}',
                max: '{port.info_water_density_max}',
            },
            get: function (data) {
                return AbraxaFunctions.getMinMaxValue(data, 'min', 'max', 3, '');
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
        usRepresentative: {
            bind: {
                bindTo: '{port.info_us_representative}',
            },
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        waterSalinity: {
            bind: {
                bindTo: '{port.water}',
                deep: true,
            },
            get: function (waterArray) {
                return waterArray && waterArray[0] ? waterArray[0] : AbraxaConstants.placeholders.emptySpan;
            },
        },
    },
});
