Ext.define('Abraxa.model.settings.pda.PDATemplateItem', {
    extend: 'Ext.data.Model',
    // idProperty: 'id',
    fields: [
        {
            name: 'name',
            type: 'string',
        },
        {
            type: 'number',
            name: 'default_pda_item_id',
        },
        {
            type: 'number',
            name: 'pda_template_id',
        },
        {
            type: 'string',
            name: 'category',
        },
    ],
});
