Ext.define('Abraxa.model.task.TaskTemplateItem', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'order_id',
            type: 'integer',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'task/template/${template_id}/items',
    },
});
