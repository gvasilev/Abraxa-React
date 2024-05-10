Ext.define('Abraxa.model.voyage.Voyage', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            name: 'port_id',
            type: 'auto',
        },
        {
            name: 'vessel_imo',
            type: 'auto',
        },
        {
            name: 'vessel_name',
            type: 'auto',
        },
        {
            name: 'function',
            type: 'auto',
        },
        {
            name: 'vessel_is_bowthruster_fitted',
            type: 'auto',
        },
        {
            name: 'is_dry',
            type: 'auto',
        },
        {
            name: 'voyage_number',
            type: 'auto',
        },
        {
            name: 'reference_number',
            type: 'auto',
        },
        {
            name: 'file_id',
            type: 'auto',
        },
        {
            name: 'cp_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'vessel_data',
            type: 'auto',
            critical: true,
        },
    ],
    hasOne: [
        {
            name: 'inquiry',
            model: 'Abraxa.model.inquiry.Inquiry',
            associatedKey: 'inquiry',
        },
        {
            name: 'portcall',
            model: 'Abraxa.model.portcall.Portcall',
        },
    ],
    hasMany: [
        {
            name: 'inquiries',
            model: 'Abraxa.model.inquiry.Inquiry',
            associatedKey: 'inquiries',
        },
        {
            name: 'portcalls',
            model: 'Abraxa.model.portcall.Portcall',
        },
        {
            name: 'invitations',
            model: 'Abraxa.model.invitation.Invitation',
            associatedKey: 'invitations',
        },
        {
            name: 'tasks',
            model: 'Abraxa.model.task.Task',
        },
    ],
    proxy: {
        type: 'rest',
        api: {
            read: Env.ApiEndpoint + 'voyages',
            update: Env.ApiEndpoint + 'voyages',
            create: Env.ApiEndpoint + 'voyages',
            destroy: Env.ApiEndpoint + 'voyages',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
