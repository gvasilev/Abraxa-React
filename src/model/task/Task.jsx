import Env from '../../env.jsx';
import moment from 'moment';

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
        // {
        //     name: 'search_index',
        //     depends: 'updated_at',
        //     persist: false,
        //     mapping: function (data) {
        //         if (data) {
        //             return this.buildSearchIndex(data);
        //         }
        //     },
        // },
        {
            name: 'current_office_id',
            type: 'auto',
            mapping: function (data) {
                if (data && data.assignee && data.assignee.current_office_id) {
                    return data.assignee.current_office_id;
                }
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
