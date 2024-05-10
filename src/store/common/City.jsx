import Env from '../../env.jsx';
import '../../model/common/City.js';
Ext.define('Abraxa.store.common.City', {
    extend: 'Ext.data.Store',
    alias: 'store.cityStore',
    model: 'Abraxa.model.common.City',
    storeId: 'cityStore',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'countries/${country_id}/cities',
        reader: {
            type: 'json',
        },
    },
    sorters: {
        property: 'city_name',
    },
    autoLoad: false,
});
