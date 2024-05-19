import '../../../model/directory/agents/Agents.jsx';
Ext.define('Abraxa.store.directory.Agents', {
    extend: 'Ext.data.Store',
    alias: 'store.AgentsStore',
    model: 'Abraxa.model.directory.Agents',
    autoLoad: true,
    pageSize: 50,
    storeId: 'agentsStore',
    statefulFilters: true,
    remoteFilter: true,
    reader: {
        type: 'json',
        rootProperty: 'data',
    },
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'profiles',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
