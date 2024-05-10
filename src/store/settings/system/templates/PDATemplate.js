Ext.define('Abraxa.store.settings.system.templates.PDATemplate', {
    extend: 'Ext.data.Store',
    alias: 'store.settings.templates.pda',
    autoLoad: false,
    autoSync: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pda_template/',
    },
});
