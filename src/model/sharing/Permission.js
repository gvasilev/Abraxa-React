Ext.define('Abraxa.model.sharing.Permission', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'member/${member_id}/permissions',
        writer: {
            allowSingle: false,
        },
    },
});
