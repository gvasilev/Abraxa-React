Ext.define('Abraxa.store.common.user.Invitations', {
    extend: 'Ext.data.Store',
    alias: 'store.user.invitations',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'user/invitations',
        reader: {
            type: 'json',
        },
    },
});
