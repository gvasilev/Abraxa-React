import '../../model/common/User';

Ext.define('Abraxa.store.common.Users', {
    extend: 'Ext.data.Store',
    alias: 'store.users',
    model: 'Abraxa.model.common.User',
    storeId: 'userStore',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'companies/users',
        reader: {
            type: 'json',
        },
    },
    autoLoad: false,
    remoteSort: true,
});
