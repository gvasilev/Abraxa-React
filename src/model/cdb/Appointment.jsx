Ext.define('Abraxa.model.cdb.Appointment', {
    extend: 'Ext.data.Model',
    name: 'contact',
    alias: 'model.CdbAppointmentModel',

    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'vessel_name',
            type: 'string',
        },
        {
            name: 'vessel_id',
            type: 'string',
        },
        {
            name: 'status',
            type: 'auto',
        },
        {
            name: 'nomination_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/appointments/{org_id}',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
