Ext.define('Abraxa.model.portcall.Master', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'master_name',
            type: 'auto',
        },
        {
            name: 'master_phone',
        },
        {
            name: 'master_phone_alt',
            type: 'auto',
        },
        {
            name: 'master_email',
            type: 'auto',
        },
        {
            name: 'master_email_alt',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'voyage/${voyage_id}/master',
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'masters',
            clientIdProperty: 'masterId',
        },
    },
});
