import '../likes/Like.jsx';
Ext.define('Abraxa.model.chatter.Message', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'sender',
            type: 'string',
        },
        {
            name: 'timestamp',
            type: 'date',
        },
        {
            name: 'message',
            type: 'string',
        },
        {
            name: 'own',
            calculate: function (data) {
                let user_id = Ext.Viewport.getViewModel().get('currentUser').id;
                return data.sender === user_id;
            },
            persist: false,
        },
        {
            name: 'editMode',
            persist: false,
        },
        {
            name: 'user',
            persist: false,
        },
        {
            name: 'consecutive',
            persist: false,
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
        type: 'direct',
        api: {
            read: 'Socket.Chatter.read',
            create: 'Socket.Chatter.add',
            update: 'Socket.Chatter.edit',
            destroy: 'Socket.Chatter.delete',
        },
    },
});
