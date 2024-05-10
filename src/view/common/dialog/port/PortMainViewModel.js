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
