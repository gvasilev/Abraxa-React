Ext.define('Abraxa.model.nomination.Nomination', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'portcall_id',
            type: 'integer',
        },
        {
            name: 'appointing_party_id',
            type: 'auto',
        },
        {
            name: 'appointing_party_name',
            type: 'auto',
        },
        {
            name: 'appointing_party_email',
            type: 'auto',
        },
        {
            name: 'voyage_number',
            type: 'auto',
        },
        {
            name: 'nominating_party_id',
            type: 'auto',
        },
        {
            name: 'nominating_party_name',
            type: 'auto',
        },
        {
            name: 'nominating_party_email',
            type: 'auto',
        },
        {
            name: 'nomination_reference',
            type: 'auto',
        },
        {
            name: 'port_function',
            type: 'auto',
        },
        {
            name: 'lead_agent_id',
            type: 'auto',
        },
        {
            name: 'lead_agent_name',
            type: 'auto',
        },
        {
            name: 'lead_agent_email',
            type: 'auto',
        },
        {
            name: 'sub_agent_id',
            type: 'auto',
        },
        {
            name: 'sub_agent_name',
            type: 'auto',
        },
        {
            name: 'sub_agent_email',
            type: 'auto',
        },
        {
            name: 'hub_reference',
            type: 'auto',
        },
        {
            name: 'agency_type_id',
            type: 'auto',
        },
        {
            name: 'agency_type_name',
            type: 'auto',
        },
        {
            name: 'date_received',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'created_by',
            type: 'auto',
        },
        {
            name: 'created_at',
            type: 'auto',
        },
        {
            name: 'updated_by',
            type: 'auto',
        },
        {
            name: 'updated_at',
            type: 'auto',
        },
    ],
    hasMany: [
        {
            name: 'cargoes',
            model: 'Abraxa.model.cargo.Cargo',
            associatedKey: 'id',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/nomination',
        writer: {
            // rootProperty: 'data',
        },
    },
});
