import '../../model/template/TemplateItem.jsx';
Ext.define('Abraxa.store.templates.TemplateItems', {
    extend: 'Ext.data.Store',
    alias: 'store.template.items',
    model: 'Abraxa.model.template.TemplateItem',
    autoLoad: false,
    // sorters: [
    //     {
    //         property: 'order_id',
    //         direction: 'ASC',
    //     },
    // ],
    // autoSort: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'template_items/${type}/${template_id}/items',
        batchActions: true,
        pageParam: false,
        startParam: false,
        limitParam: false,
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
