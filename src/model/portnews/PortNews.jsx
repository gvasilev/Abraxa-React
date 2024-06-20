import '../portcall/Attachment';
import '../likes/Like';

Ext.define('Abraxa.model.portnews.PortNews', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'body',
            type: 'string',
            critical: true,
        },
        {
            name: 'port_ids',
            type: 'auto',
            critical: true,
        },
        {
            name: 'commodities',
            type: 'auto',
            critical: true,
        },
        {
            name: 'company',
            type: 'auto',
        },
        {
            name: 'created_at',
            type: 'date',
        },
        {
            name: 'created_by',
            type: 'auto',
        },
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'is_new',
            type: 'number',
        },
        {
            name: 'ports',
            type: 'auto',
            critical: true,
        },
        {
            name: 'port_ids',
            type: 'auto',
            critical: true,
            mapping: function (data) {
                return data.ports.map((port) => port.id);
            },
        },
        {
            name: 'title',
            type: 'string',
            critical: true,
        },
        {
            name: 'type_id',
            type: 'number',
            critical: true,
        },
        {
            name: 'updated_at',
            type: 'date',
        },
        {
            name: 'updated_by',
            type: 'auto',
        },
        {
            name: 'validity_from',
            type: 'date',
        },
        {
            name: 'validity_to',
            type: 'date',
        },
        {
            name: 'likes',
            type: 'auto',
            defaultValue: [],
        },
    ],
    hasMany: [
        {
            name: 'likes',
            model: 'Abraxa.model.likes.Like',
            associationKey: 'likes',
        },
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
    ],

    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'port-news',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
