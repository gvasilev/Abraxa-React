Ext.define('Abraxa.store.PartyTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.party-types',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'counterparty_types',
    },
    autoLoad: true,
});
