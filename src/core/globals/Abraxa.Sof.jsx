/**
 * Global class for currency
 */
Ext.define('Abraxa.sof', {
    singleton: true,

    checkForTriggersAndUpdate: function (cmp, store) {
        let me = cmp,
            sof_events = store;

        sof_events.each(function (record) {
            let triggers = record.get('triggers');
            if (triggers) {
                if (triggers.port_itinerary_trigger) {
                    let portcall = me.upVM().get('object_record'),
                        event_date = record.get('event_date'),
                        event_from = record.get('event_from');

                    if (event_date && event_from) {
                        let date = moment(event_date).format('YYYY-MM-DD'),
                            time = moment(event_from).format('HH:mm'),
                            formatted = moment(date + ' ' + time).toDate();

                        portcall.set(triggers.port_itinerary_trigger, formatted);
                    }
                }
                if (triggers.berth_itinerary_trigger) {
                    let berths = me.upVM().get('berths'),
                        berth_id = record.get('da_berth_id');

                    if (berth_id) {
                        let berth = berths.getById(berth_id),
                            event_date = record.get('event_date'),
                            event_from = record.get('event_from');

                        if (event_date && event_from) {
                            let date = moment(event_date).format('YYYY-MM-DD'),
                                time = moment(event_from).format('HH:mm'),
                                formatted = moment(date + ' ' + time).toDate();

                            berth.set(triggers.berth_itinerary_trigger, formatted);
                        }
                    }
                }
                if (triggers.portcall_status_trigger) {
                    let portcall = me.upVM().get('object_record'),
                        event_date = record.get('event_date'),
                        event_from = record.get('event_from'),
                        status_name,
                        satus_string;
                    if (event_date && event_from) {
                        switch (triggers.portcall_status_trigger) {
                            case 1:
                                status_name = 'En route';
                                status_string = 'enroute';
                                break;
                            case 2:
                                status_name = 'Anchored';
                                status_string = 'anchored';
                                break;
                            case 3:
                                status_name = 'Berthed';
                                status_string = 'berthed';
                                break;
                            case 4:
                                status_name = 'Cargo operations';
                                status_string = 'cargo';
                                break;
                            case 5:
                                status_name = 'Shifting';
                                status_string = 'shifting';
                                break;
                            case 6:
                                status_name = 'Awaiting documents';
                                status_string = 'documents';
                                break;
                            case 7:
                                status_name = 'Bunkering';
                                status_string = 'bunkering';
                                break;
                            case 8:
                                status_name = 'Pilot ordered';
                                status_string = 'pilot';
                                break;
                            case 9:
                                status_name = 'Sailed';
                                status_string = 'sailed';
                                break;
                            case 10:
                                status_name = 'FDA settlement';
                                status_string = 'fda';
                                break;
                            case 11:
                                status_name = 'Completed';
                                status_string = 'completed';
                                break;
                        }
                        portcall.set('status_data', {
                            string: status_string,
                            name: status_name,
                        });
                    }
                }
            }
        });
    },
});
