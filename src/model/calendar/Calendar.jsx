Ext.define('Abraxa.model.calendar.Calendar', {
    extend: 'Ext.calendar.model.Calendar',
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
            name: 'color',
            type: 'string',
        },
        {
            name: 'hidden',
            type: 'boolean',
        },
        {
            name: 'editable',
            type: 'boolean',
        },
        {
            name: 'eventStore',
            type: 'auto',
        },
    ],
});
