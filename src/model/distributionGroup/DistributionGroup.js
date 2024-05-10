Ext.define('Abraxa.model.distributionGroup.DistributionGroup', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'dist_emails',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/distribution-groups',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'distribution_groups',
            clientIdProperty: 'dGroupId',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
