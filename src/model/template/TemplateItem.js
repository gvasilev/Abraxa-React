Ext.define('Abraxa.model.template.TemplateItem', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'template_items/${type}/${template_id}/items',
        writer: {
            allowSingle: false,
            rootProperty: 'task_template_items',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
