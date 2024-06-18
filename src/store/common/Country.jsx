import '../../model/common/Country';

Ext.define('Abraxa.store.common.Country', {
    extend: 'Ext.data.Store',
    alias: 'store.countryStore',
    model: 'Abraxa.model.common.Country',
    storeId: 'countryStore',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'countries',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        reader: {
            type: 'json',
        },
    },
    sorters: {
        property: 'country_name',
    },
    autoLoad: true,
});
