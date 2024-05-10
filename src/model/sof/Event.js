Ext.define('Abraxa.model.sof.Event', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'event_id',
            type: 'auto',
        },
        {
            name: 'event_date',
            type: 'date',
            dateWriteFormat: 'Y-m-d',
            dateFormat: 'Y-m-d',
        },
        {
            name: 'event_from',
            type: 'date',
            dateFormat: 'H:i:s',
            dateWriteFormat: 'H:i:s',
        },
        {
            name: 'event_to',
            type: 'date',
            dateFormat: 'H:i:s',
            dateWriteFormat: 'H:i:s',
        },
        {
            name: 'event_comment',
            type: 'auto',
        },
        {
            name: 'event_is_split',
            type: 'auto',
        },
        {
            name: 'default_sof_event_category_id',
            type: 'auto',
        },
        {
            name: 'event_name',
            type: 'auto',
        },
        {
            name: 'split_sof',
            type: 'auto',
        },
        {
            name: 'checked',
            type: 'auto',
            persist: false,
        },
        {
            name: 'showDate',
            type: 'auto',
            persist: false,
        },
        {
            name: 'event_class',
            type: 'auto',
            persist: false,
            convert: function (value, record) {
                let event_type = record.get('default_sof_event_category_id'),
                    event_class = '';

                switch (event_type) {
                    case 4:
                        event_class = 'a-worked';
                        break;
                    case 5:
                        event_class = 'a-stopped';
                        break;
                    case 3:
                        event_class = 'a-shifting';
                        break;
                    case 2:
                        event_class = 'a-waiting';
                        break;
                    default:
                        event_class = 'a-miscellaneous';
                        break;
                }
                return event_class;
            },
        },
        {
            name: 'event_category_name',
            type: 'auto',
            persist: false,
            convert: function (value, record) {
                let event_type = record.get('default_sof_event_category_id'),
                    event_class = 'event';

                switch (event_type) {
                    case 4:
                        event_class = 'working';
                        break;
                    case 5:
                        event_class = 'stoppage';
                        break;
                    case 3:
                        event_class = 'shifting';
                        break;
                    case 2:
                        event_class = 'waiting';
                        break;
                    case 6:
                        event_class = 'miscellaneous';
                        break;
                }
                return event_class;
            },
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'new_sof/${sof_id}/events',
    },
});
