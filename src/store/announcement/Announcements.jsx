import Env from '../../env.jsx'; // Import Env from env.jsx
import '../../model/announcement/Announcement.jsx';
Ext.define('Abraxa.store.announcement.Announcements', {
    extend: 'Ext.data.Store',
    alias: 'store.announcements',
    model: 'Abraxa.model.announcement.Announcement',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'announcements',
        writer: {
            rootProperty: 'announcement',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
