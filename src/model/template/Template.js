Ext.define('Abraxa.model.template.Template', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
    ],
    hasOne: [
        {
            name: 'office',
            model: 'Abraxa.model.office.Office',
            associatedKey: 'office',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'templates',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
