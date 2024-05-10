Ext.define('Abraxa.store.common.Rules', {
    extend: 'Ext.data.Store',
    alias: 'store.rules',
    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'name',
            type: 'string',
        },
    ],
    data: [
        {
            id: 'port_id',
            name: 'Port',
            type: 'all',
        },
        {
            id: 'port_function',
            name: 'Port function',
            type: 'all',
        },
        {
            id: 'principal_org_id',
            name: 'Appointing party',
            type: 'agent',
        },
        {
            id: 'agency_type',
            name: 'Agency type',
            type: 'all',
        },
        {
            id: 'appointing_party_email',
            name: 'Appointing party',
            type: 'principal',
        },
    ],
    autoLoad: true,
    proxy: {
        type: 'memory',
    },
});
