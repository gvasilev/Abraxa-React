Ext.define('Abraxa.store.settings.workflows.Workflows', {
    extend: 'Ext.data.Store',
    alias: 'store.workflows',
    model: 'Abraxa.model.settings.workflows.Workflow',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'approval-workflows',
        pageParam: false,
        startParam: false,
        limitParam: false,
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
