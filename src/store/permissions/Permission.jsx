import '../../model/permission/Permission';

Ext.define('Abraxa.store.permissions.Permissions', {
    extend: 'Ext.data.Store',
    alias: 'store.permissions',
    model: 'Abraxa.model.permission.Permission',
    autoLoad: false,
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
