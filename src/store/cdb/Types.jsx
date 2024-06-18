import '../../model/cdb/Type';

Ext.define('Abraxa.store.cdb.Types', {
    extend: 'Ext.data.Store',
    alias: 'store.company-organization-types',
    model: 'Abraxa.model.cdb.Type',
    autoLoad: false,
    pageParam: false,
    startParam: false,
    limitParam: false,
    proxy: {
        type: 'rest',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        url: Env.ApiEndpoint + 'organizations/types',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
