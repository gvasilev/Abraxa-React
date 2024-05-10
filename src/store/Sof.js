Ext.define('Abraxa.store.Sof', {
    extend: 'Ext.data.Store',
    alias: 'store.sof-events',
    model: 'Abraxa.model.SofEvent',
    autoLoad: true,
    autoSort: false,
    proxy: {
        type: 'rest',
        batchActions: true,
        appendId: false,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        url: Env.ApiEndpoint + 'sof/${sof_id}/events/${company_id}',
    },
    // sorters: [{
    //     property: 'event_full_date',
    //     direction: 'DESC'
    // }],
    sorters: [
        {
            sorterFn: function (record1, record2) {
                var firstDate = record1.get('event_date'),
                    firstTime = record1.get('event_from'),
                    secondDate = record2.get('event_date'),
                    secondTime = record2.get('event_from');

                if (firstDate && !firstTime) {
                    firstTime = moment('00:00', 'HH:mm')._d;
                }

                if (secondDate && !secondTime) {
                    secondTime = moment('00:00', 'HH:mm')._d;
                }

                if (moment(firstDate).isValid() || moment(firstTime).isValid()) {
                    var date1 = moment(
                        moment(firstDate).format('YYYY-MM-DD') + ' ' + moment(firstTime).format('HH:mm')
                    )._d;
                } else {
                    var date1 = new Date('2050-11-11 00:00');
                }

                if (moment(secondDate).isValid() || moment(secondTime).isValid()) {
                    var date2 = moment(
                        moment(secondDate).format('YYYY-MM-DD') + ' ' + moment(secondTime).format('HH:mm')
                    )._d;
                } else {
                    var date2 = new Date('2050-11-11 00:00');
                }
                return new Date(date1) - new Date(date2);
            },
            direction: 'ASC',
        },
        {
            property: 'id',
            direction: 'ASC',
        },
    ],

    // sorters: [{
    //     property: 'id',
    //     direction: 'ASC'
    // }, {
    //     property: 'event_date',
    //     direction: 'ASC'
    // }, {
    //     property: 'event_from',
    //     direction: 'ASC'
    // }],
    listeners: {
        load: function () {
            this.sort();
        },
    },
});
