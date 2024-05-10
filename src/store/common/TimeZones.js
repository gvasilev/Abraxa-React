Ext.define('Abraxa.store.common.TimeZones', {
    extend: 'Ext.data.Store',
    alias: 'store.common.timezones',
    model: 'Abraxa.model.common.TimeZone',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'time_zones',
    },
    sorters: [
        {
            property: 'timezone',
            direction: 'ASC',
        },
    ],
});
