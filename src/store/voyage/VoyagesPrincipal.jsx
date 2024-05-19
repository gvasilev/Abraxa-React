import '../../model/voyage/VoyagePrincipal.jsx';
Ext.define('Abraxa.store.voyage.VoyagesPrincipal', {
    extend: 'Ext.data.Store',
    alias: 'store.voyagesPrincipal',
    storeId: 'voyagesPrincipal',
    model: 'Abraxa.model.voyage.VoyagePrincipal',
    pageSize: 20,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'voyages',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'meta.total',
        },
    },
    statefulFilters: true,
    remoteFilter: true,
});
