import Env from '../../env.jsx'; // Import Env from env.jsx

Ext.define('Abraxa.store.disbursements.DefaultDisbursementTags', {
    extend: 'Ext.data.Store',
    alias: 'store.default.disbursement.tags',
    autoLoad: false,
    autoSync: false,
    proxy: {
        appendId: false,
        type: 'rest',
        url: Env.ApiEndpoint + 'default_disbursement_tags',
        withCredentials: true,
    },
});
