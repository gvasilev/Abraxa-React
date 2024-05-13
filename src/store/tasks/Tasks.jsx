
import '../../model/task/Task.jsx';

Ext.define('Abraxa.store.task.Tasks', {
    extend: 'Ext.data.Store',
    alias: 'store.tasks',
    storeId: 'tasks',
    model: 'Abraxa.model.task.Task',
    autoLoad: false,
    pageSize: 50,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'task',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
