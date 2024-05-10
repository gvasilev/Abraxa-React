Ext.define('Abraxa.store.sof.DefaultEventCategories', {
    extend: 'Ext.data.Store',
    alias: 'store.sof-default-event-categories',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof/default_categories',
    },
});
