

Ext.define('Abraxa.store.common.system.RecentlyOpened', {
    extend: 'Ext.data.Store',
    alias: 'store.recently-opened',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'system/recently_opened',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
    sorters: [
        {
            property: 'updated_at',
            direction: 'DESC',
        },
    ],
});
