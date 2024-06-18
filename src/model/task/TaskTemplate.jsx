Ext.define('Abraxa.model.task.TaskTemplate', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
    ],
    hasMany: [
        {
            name: 'items',
            model: 'Abraxa.model.task.TaskTemplateItem',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'task_template',
    },
});
