import '../likes/Like';

Ext.define('Abraxa.model.cdb.Note', {
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
        url: Env.ApiEndpoint + 'cdb/${object_meta_id}/note',
    },
});
