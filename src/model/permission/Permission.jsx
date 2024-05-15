Ext.define('Abraxa.model.permission.Permission', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'create',
            type: 'boolean',
        },
        {
            name: 'edit',
            type: 'boolean',
        },
        {
            name: 'delete',
            type: 'boolean',
        },
        {
            name: 'view',
            type: 'boolean',
        },
        {
            name: 'updated',
            type: 'auto',
            persist: false,
        },
        {
            name: 'manual',
            type: 'boolean',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'permission/${role_id}',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
