Ext.define('Abraxa.store.voyage.Voyages', {
    extend: 'Ext.data.Store',
    alias: 'store.voyages',
    model: 'Abraxa.model.voyage.Voyage',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'voyage',
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: false,
            },
        },
    },
});
