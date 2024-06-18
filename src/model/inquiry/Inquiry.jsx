import '../voyage/Voyage';
import '../portcall/Instruction';
import './InquiryOffer';
import '../amail/Amail';
import '../cargo/Cargo';
import '../pda/Pda';
import '../invitation/Invitation';
import '../common/Port';
import '../portcall/Attachment';
import '../portcall/Note';
import '../task/Task';

Ext.define('Abraxa.model.inquiry.Inquiry', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'voyage_id',
        },
        {
            name: 'status',
            type: 'auto',
            mapping: function (data) {
                if (data) {
                    let statuses = [
                        'new',
                        'draft',
                        'in progress',
                        'submitted',
                        'appointed',
                        'canceled',
                        'lost',
                        'other',
                    ];
                    return statuses[data.status];
                }
            },
        },
        {
            name: 'alternative_ports',
            persist: false,
            mapping: function (data) {
                if (data && data.ports) {
                    let alternative_ports = data.ports;
                    return alternative_ports.slice(1);
                }
            },
        },
        {
            name: 'status_string',
            type: 'auto',
            persist: false,
            depends: 'status',
            convert: function (value, record) {
                if (Ext.isNumber(record.get('status'))) {
                    let statuses = [
                        'new',
                        'draft',
                        'in progress',
                        'submitted',
                        'appointed',
                        'canceled',
                        'lost',
                        'other',
                    ];
                    return statuses[record.get('status')];
                } else {
                    return record.get('status');
                }
            },
        },
        {
            name: 'port_eta',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'port_itinerary_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'assigned_to',
            type: 'auto',
        },
        {
            name: 'created_at',
            type: 'auto',
        },
        {
            name: 'updated_at',
            type: 'auto',
        },
        {
            name: 'search_index',
            type: 'auto',
        },
        {
            name: 'port_id',
            type: 'auto',
        },
        {
            name: 'voyage',
            type: 'auto',
        },
        {
            name: 'vessel',
            type: 'auto',
        },
        {
            name: 'is_archived',
            type: 'number',
        },
        {
            name: 'vessel_name',
            depends: 'voyage',
            persist: false,
            mapping: function (data) {
                if (data && data.voyage) return data.voyage.vessel_name;
            },
        },
        {
            name: 'abraxa_id',
            persist: false,
            mapping: function (data) {
                if (data.parent_id) return 'INQ-' + data.parent_id;

                return 'INQ-' + data.id;
            },
        },
        {
            name: 'is_watching',
            //            mapping: function(data) {
            //                return data.watching.find((e) => e.user_id === Ext.getCmp('main-viewport').upVM().get('currentUser').get('id'));
            //            },
        },
    ],
    idProperty: 'id',
    hasOne: [
        {
            name: 'voyage',
            model: 'Abraxa.model.voyage.Voyage',
            associatedName: 'voyage',
        },
        {
            name: 'instruction',
            model: 'Abraxa.model.portcall.Instruction',
        },
    ],
    hasMany: [
        {
            name: 'amails',
            model: 'Abraxa.model.amail.Amail',
            associationKey: 'amails',
        },
        {
            name: 'cargoes',
            model: 'Abraxa.model.cargo.Cargo',
            associatedKey: 'id',
        },
        {
            name: 'pdas',
            model: 'Abraxa.model.pda.PDA',
            associatedKey: 'id',
        },
        {
            name: 'invitations',
            model: 'Abraxa.model.invitation.Invitation',
            associatedKey: 'id',
        },
        {
            name: 'ports',
            model: 'Abraxa.model.common.Port',
        },
        {
            name: 'offers',
            model: 'Abraxa.model.inquiry.InquiryOffer',
        },
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
        },
        {
            name: 'notes',
            model: 'Abraxa.model.portcall.Note',
        },
        {
            name: 'tasks',
            model: 'Abraxa.model.task.Task',
        },
        {
            name: 'instructions',
            model: 'Abraxa.model.portcall.Instruction',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: false,
            },
        },
    },
});
