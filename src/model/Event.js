Ext.define('Abraxa.model.SofEvent', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'event_id',
            type: 'auto',
        },
        {
            name: 'event_date',
            type: 'date',
            dateWriteFormat: 'Y-m-d H:i:s',
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
            name: 'comment',
            type: 'auto',
        },
        {
            name: 'event_is_split',
            type: 'auto',
        },
        {
            name: 'event_category_id',
            type: 'auto',
        },
        {
            name: 'event_name',
            type: 'auto',
            persist: false,
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
    ],
});
