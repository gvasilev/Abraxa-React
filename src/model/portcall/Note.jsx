import '../likes/Like.jsx';
Ext.define('Abraxa.model.portcall.Note', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'note',
            type: 'auto',
        },
        {
            name: 'updated_at',
            type: 'date',
        },
        {
            name: 'created_at',
            type: 'date',
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'likes',
            model: 'Abraxa.model.likes.Like',
            associationKey: 'likes',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${object_meta_id}/note',
    },
});
