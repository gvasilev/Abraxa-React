Ext.define('Abraxa.store.calendar.Events', {
    storeId: 'store-events',
    extend: 'Ext.calendar.store.Events',
    alias: 'store.events',
    model: 'Abraxa.model.calendar.Event',
    autoLoad: true,
    autoSync: true,
    proxy: {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        type: 'ajax',
        method: 'POST',
        api: {
            read: Env.ApiEndpoint + 'events/read',
            update: Env.ApiEndpoint + 'events/update',
            create: Env.ApiEndpoint + 'events/create',
            destroy: Env.ApiEndpoint + 'events/destroy',
        },
    },
});
