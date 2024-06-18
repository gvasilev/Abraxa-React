import '../../../model/directory/ports/Ports';

Ext.define('Abraxa.store.directory.Ports', {
    extend: 'Ext.data.Store',
    alias: 'store.DirectoryPortsStore',
    model: 'Abraxa.model.directory.Ports',
    pageSize: 50,
    statefulFilters: true,
    remoteFilter: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'port-info',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'meta.total',
        },
    },
});
