Ext.define('Abraxa.store.Channel', {
    extend: 'Ext.data.Store',
    alias: 'store.portal.channel',
    autoload: false,
    proxy: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        type: 'rest',
        url: Env.ApiEndpoint + 'portal/channel/${object_id}/${object_meta_id}/${company_id}',
    },
});
