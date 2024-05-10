Ext.define('Abraxa.store.common.port.Terminals', {
    extend: 'Ext.data.Store',
    alias: 'store.port.terminals',
    proxy: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        type: 'rest',
        url: Env.ApiEndpoint + 'ports/${port_id}/terminals',
    },
});
