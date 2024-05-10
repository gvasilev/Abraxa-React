Ext.define('Abraxa.store.sof.DefaultEventTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.sof-default-event-types',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof/default_types',
    },
});
