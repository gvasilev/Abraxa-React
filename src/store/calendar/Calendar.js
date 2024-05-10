Ext.define('Abraxa.store.calendar.Calendar', {
    storeId: 'store-calendar',
    extend: 'Ext.calendar.store.Calendars',
    alias: 'store.calendar',
    model: 'Abraxa.model.calendar.Calendar',
    autoLoad: true,
    autoSync: true,
    proxy: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        type: 'ajax',
        method: 'POST',
        api: {
            read: Env.ApiEndpoint + 'calendars/read',
            update: Env.ApiEndpoint + 'calendars/update',
            create: Env.ApiEndpoint + 'calendars/create',
            destroy: Env.ApiEndpoint + 'calendars/destroy',
        },
    },
});
