import '../portcall/Attachment';
import '../portcall/Service';
import '../comments/Comment';

Ext.define('Abraxa.model.husbandry.Crewing', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'portcall_id',
            type: 'integer',
        },
        {
            name: 'checked',
            type: 'auto',
            persist: false,
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'email',
            type: 'auto',
        },
        {
            name: 'type',
            type: 'auto',
        },
        {
            name: 'type_name',
            type: 'auto',
        },
        {
            name: 'actions',
            type: 'auto',
        },
        {
            name: 'action_name',
            type: 'auto',
        },
        {
            name: 'id_number',
            type: 'auto',
        },
        {
            name: 'flight_details',
            type: 'auto',
        },
        {
            name: 'isps',
            type: 'integer',
        },
        {
            name: 'id_type',
            type: 'auto',
        },
        {
            name: 'phone',
            type: 'auto',
        },
        {
            name: 'company',
            type: 'auto',
        },
        {
            name: 'vehicle_type',
            type: 'auto',
        },
        {
            name: 'registration_plate',
            type: 'auto',
        },
        {
            name: 'covid19',
            type: 'auto',
            defaultValue: 'no',
        },
        {
            name: 'is_checked',
            type: 'auto',
            persist: false,
        },
        {
            name: 'date_of_birth',
            type: 'date',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
        {
            name: 'services',
            model: 'Abraxa.model.portcall.Service',
            associatedKey: 'services',
        },
        {
            name: 'public_comments',
            model: 'Abraxa.model.comments.Comment',
            associatedKey: 'public_comments',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/crewing',
        batchActions: true,
        writer: {
            type: 'json',
            allowSingle: false,
            rootProperty: 'crewings',
            clientIdProperty: 'crewingId',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: true,
            },
        },
    },
});
