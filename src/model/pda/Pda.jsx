import '../common/Vessel';
import '../inquiry/Inquiry';
import '../inquiry/InquiryOfferService';
import '../portcall/Attachment';
import '../portcall/Note';
import '../task/Task';
import '../portcall/Instruction';

Ext.define('Abraxa.model.pda.Pda', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'status',
            type: 'auto',
            convert: function (val, record) {
                let statuses = ['draft', 'submitted', 'approved', 'rejected'];
                return statuses[val];
            },
        },
        {
            name: 'vessel_data',
            type: 'auto',
            // critical: true
        },
    ],
    hasOne: [
        {
            name: 'vessel',
            model: 'Abraxa.model.common.Vessel',
        },
        {
            name: 'inquiry',
            model: 'Abraxa.model.inquiry.Inquiry',
        },
    ],
    hasMany: [
        {
            name: 'services',
            model: 'Abraxa.model.inquiry.InquiryOfferService',
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
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry/${inquiry_id}/pda',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
