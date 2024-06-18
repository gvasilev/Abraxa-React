Ext.define('Abraxa.store.settings.voyage.VoyageTemplate', {
    extend: 'Ext.data.Store',
    alias: 'store.settings.voyage.template',
    autoLoad: false,
    autoSync: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'voyage_template/',
    },
});
