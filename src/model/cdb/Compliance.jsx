import Env from '../../env.jsx'; // Import Env from env.jsx

Ext.define('Abraxa.model.cdb.Compliance', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'organization_id',
            type: 'integer',
            critical: true,
        },
        {
            name: 'status',
            type: 'auto',
            critical: true,
        },
        {
            name: 'expiration_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'team_registering',
            type: 'auto',
        },
        {
            name: 'verified_by',
            type: 'auto',
        },
        {
            name: 'created_by',
            type: 'auto',
        },
        {
            name: 'updated_by',
            type: 'auto',
        },
        {
            name: 'created_at',
            type: 'auto',
        },
        {
            name: 'updated_at',
            type: 'auto',
        },
        {
            name: 'verified_at',
            type: 'auto',
        },
        {
            name: 'updated_by_user',
            persist: false,
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cdb/compliance',
    },
});
