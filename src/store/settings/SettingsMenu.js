Ext.define('Abraxa.store.settings.SettingsMenu', {
    extend: 'Ext.data.Store',
    alias: 'store.settings.menu',
    autoLoad: false,
    autoSync: false,
    proxy: {
        appendId: false,
        type: 'rest',
        url: Env.ApiEndpoint + 'settings/menu',
    },
    // grouper: {
    //     groupFn: function (record) {
    //         return record.get('group');
    //     },
    //     sortProperty: 'id'
    // },
    sorters: 'id',
});
