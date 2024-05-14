import './File.jsx';
Ext.define('Abraxa.model.amail.Amail', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
    ],
    hasMany: [
        {
            name: 'files',
            model: 'Abraxa.model.amail.File',
            associationKey: 'files',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'portcall/${object_meta_id}/amails',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
