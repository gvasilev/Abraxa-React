import Env from '../../env.jsx'; // Import Env from env.jsx

Ext.define('Abraxa.store.common.DefaultDisbursementItems', {
    extend: 'Ext.data.Store',
    alias: 'store.default-disbursements-items',
    autoLoad: true,
    model: 'Abraxa.model.disbursement.DefaultDisbursementItem',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_disbursement_items',
    },
});
