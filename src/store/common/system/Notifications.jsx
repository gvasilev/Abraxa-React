import '../../../model/notification/Notification';

Ext.define('Abraxa.store.common.system.Notifications', {
    extend: 'Ext.data.Store',
    alias: 'store.notifications',
    model: 'Abraxa.model.notification.Notification',
    grouper: {
        groupFn: function (record) {
            return record.get('grouper');
        },
        sorterFn: function (a, b) {
            return a.get('id') < b.get('id') ? 1 : -1;
        },
    },
    pageSize: 50,
    sorters: [
        {
            property: 'created_at',
            direction: 'DESC',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        appendId: false,
        url: Env.ApiEndpoint + 'notifications',
        writer: {
            allowSingle: false,
            rootProperty: 'notifications',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
