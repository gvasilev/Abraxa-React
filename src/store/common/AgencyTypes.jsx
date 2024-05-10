import Env from '../../env.jsx'; // Import Env from env.jsx
Ext.define('Abraxa.store.common.AgencyTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.agency.types',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'agency_types',
    },
});
