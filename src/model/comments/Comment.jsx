import '../likes/Like';

Ext.define('Abraxa.model.comments.Comment', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
        },
        {
            name: 'comment',
            type: 'string',
        },
        {
            name: 'created_at',
            type: 'date',
        },
        {
            name: 'updated_at',
            type: 'date',
        },
    ],
    hasMany: [
        {
            name: 'likes',
            model: 'Abraxa.model.likes.Like',
            associationKey: 'likes',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + '${object_type}/${object_meta_id}/comments',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
