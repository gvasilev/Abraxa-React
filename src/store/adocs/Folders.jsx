Ext.define('Abraxa.store.adocs.Folders', {
    extend: 'Ext.data.Store',
    alias: 'store.folders',
    autoLoad: false,
    model: 'Abraxa.model.adocs.DocumentFolder',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'adocs_folders',
    },
    sorters: [
        {
            property: 'id',
            direction: 'ASC',
        },
    ],
});
