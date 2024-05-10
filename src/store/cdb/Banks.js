Ext.define('Abraxa.store.cdb.Banks', {
    extend: 'Ext.data.Store',
    alias: 'store.cdbbanks',
    model: 'Abraxa.model.cdb.Bank',
    autoLoad: true,
    proxy: {
        type: 'rest',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        url: Env.ApiEndpoint + 'organizations/${org_id}/banks',
        writer: {
            allowSingle: false,
        },
    },
});
