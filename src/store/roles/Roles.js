Ext.define('Abraxa.store.roles.Roles', {
    extend: 'Ext.data.Store',
    alias: 'store.roles',
    model: 'Abraxa.model.role.Role',
    autoLoad: false,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'companies/roles',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
