Ext.define('Abraxa.store.task.TaskTemplates', {
    extend: 'Ext.data.Store',
    alias: 'store.task.templates',
    model: 'Abraxa.model.task.TaskTemplate',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'task_template',
    },
});
