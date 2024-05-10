Ext.define('Abraxa.store.settings.CustomFileNumber', {
    extend: 'Ext.data.Store',
    alias: 'store.settings.custom.file.number',
    autoLoad: false,
    autoSync: false,
    proxy: {
        // appendId: false,
        type: 'rest',
        url: Env.ApiEndpoint + 'companies/custom_file_number',
    },
});
