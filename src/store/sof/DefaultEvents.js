Ext.define('Abraxa.store.sof.DefaultEvents', {
    extend: 'Ext.data.Store',
    alias: 'store.sof-general-events',
    autoLoad: false,
    model: 'Abraxa.model.sof.DefaultEvents',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof/default_events',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
