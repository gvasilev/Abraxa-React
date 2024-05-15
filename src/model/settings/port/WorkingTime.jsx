Ext.define('Abraxa.model.settings.port.WorkingTime', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            type: 'number',
            name: 'company_id',
        },
        {
            type: 'number',
            name: 'user_id',
        },
        {
            type: 'string',
            name: 'start_day',
        },
        {
            type: 'string',
            name: 'end_day',
        },
        {
            name: 'start_time',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'end_time',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            type: 'date',
            name: 'created_at',
        },
        {
            type: 'number',
            name: 'created_by',
        },
        {
            type: 'date',
            name: 'updated_at',
        },
        {
            type: 'number',
            name: 'updated_by',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'working_times',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'workingTimes',
        },
    },
});
