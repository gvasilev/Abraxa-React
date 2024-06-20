import '../comments/Comment';
import '../portcall/Attachment';
import '../likes/Like';

Ext.define('Abraxa.model.task.Task', {
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
        {
            name: 'taskable_type',
            type: 'string',
        },
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'updated_at',
            type: 'date',
        },
        {
            name: 'likes',
            type: 'auto',
        },
        {
            name: 'overdue',
            persist: false,
            calculate: function (data) {
                if (data.status == 'completed') {
                    return moment(data.due_date).isBefore(data.updated_at);
                }
                return moment(data.due_date).isBefore(new Date());
            },
        },
        {
            name: 'search_index',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data) {
                    return this.buildSearchIndex(data);
                }
            },
        },
        {
            name: 'current_office_id',
            type: 'auto',
            mapping: function (data) {
                return data && data.assigned_user && data.assigned_user.current_office_id
                    ? data.assigned_user.current_office_id
                    : 0;
            },
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'comments',
            model: 'Abraxa.model.comments.Comment',
        },
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
        {
            name: 'likes',
            model: 'Abraxa.model.likes.Like',
            associationKey: 'likes',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'task',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
