Ext.define('Abraxa.store.portcalls.CrewingActions', {
    extend: 'Ext.data.Store',
    alias: 'store.portcall.crewingactions',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'crewing_actions',
    },
    autoLoad: true,
});
