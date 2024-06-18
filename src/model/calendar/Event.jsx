Ext.define('Abraxa.model.calendar.Event', {
    extend: 'Ext.calendar.model.Event',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'title',
            type: 'string',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'calendarId',
            type: 'auto',
        },
        {
            name: 'startDate',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'endDate',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'startTime',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'endTime',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'allDay',
            type: 'boolean',
        },
        {
            name: 'duration',
            type: 'number',
        },
    ],
});
