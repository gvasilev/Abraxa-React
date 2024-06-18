import '../../model/template/Template';

Ext.define('Abraxa.store.templates.Templates', {
    extend: 'Ext.data.Store',
    alias: 'store.templates',
    model: 'Abraxa.model.template.Template',
    autoLoad: false,
    sorters: [
        {
            property: 'id',
            direction: 'DESC',
        },
    ],
    grouper: {
        property: 'office_name',
    },
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'templates',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
