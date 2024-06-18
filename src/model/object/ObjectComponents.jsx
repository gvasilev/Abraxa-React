Ext.define('Abraxa.model.object.ObjectComponents', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'section',
            type: 'auto',
        },
        {
            name: 'slug',
            type: 'auto',
        },
    ],
});
