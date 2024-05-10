Ext.define('Abraxa.model.cdb.OrganizationPhone', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'org_id',
            type: 'integer',
            critical: true,
        },
        {
            name: 'phone',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cdb/${org_id}/phones',
    },
});
