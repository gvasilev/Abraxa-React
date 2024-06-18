Ext.define('Abraxa.model.portcall.Task', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'due_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'comments',
            model: 'Abraxa.model.comments.Comment',
            associatedKey: 'comments',
        },
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.TaskAttachment',
            associatedKey: 'attachments',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${object_meta_id}/task',
    },
});
