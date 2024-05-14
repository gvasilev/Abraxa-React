import './DocumentData.js';
import './DocumentPage.jsx';
Ext.define('Abraxa.model.adocs.Document', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'object_id',
            type: 'integer',
        },
        {
            name: 'object_meta_id',
            type: 'integer',
        },
        {
            name: 'original_name',
            type: 'string',
        },
        {
            name: 's3_name',
            type: 'string',
        },
        {
            name: 'extension',
            type: 'string',
        },
        {
            type: 'auto',
            name: 'created_at',
        },
        {
            type: 'auto',
            name: 'updated_at',
        },
        {
            type: 'auto',
            name: 'created_by',
        },
        {
            type: 'auto',
            name: 'updated_by',
        },
        {
            name: 'size',
            convert: function (size) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (size == 0) return '0 Byte';
                var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
            },
        },
    ],
    hasOne: [
        {
            name: 'data',
            model: 'Abraxa.model.adocs.DocumentData',
            associationKey: 'data',
            getterName: 'getDocumentData',
            setterName: 'setDocumentData',
        },
    ],
    hasMany: [
        {
            name: 'pages',
            model: 'Abraxa.model.adocs.DocumentPage',
            associationKey: 'pages',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'document',
    },
});
