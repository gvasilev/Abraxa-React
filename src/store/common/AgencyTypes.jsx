
Ext.define('Abraxa.store.common.AgencyTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.agency.types',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'agency_types',
    },
});
