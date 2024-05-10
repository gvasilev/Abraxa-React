Ext.define('Abraxa.model.inquiry.InquiryOffer', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'status',
            type: 'auto',
            mapping: function (data, record) {
                let statuses = [
                    'draft',
                    'under review',
                    'submitted',
                    'pending approval',
                    'changes requested',
                    'approved',
                    'completed',
                    'canceled',
                ];
                return statuses[data.status];
            },
            serialize: function (val, record) {
                let statuses = [
                    'draft',
                    'under review',
                    'submitted',
                    'pending approval',
                    'changes requested',
                    'approved',
                    'completed',
                    'canceled',
                ];
                return statuses.indexOf(val);
            },
        },
        // {
        //     name: 'status_string',
        //     type: 'auto',
        //     persist: false,
        //     depends: 'status',
        //     convert: function (value, record) {
        //         if (Ext.isNumber(record.get('status'))) {
        //             let statuses = ['draft', 'submitted', 'approved', 'rejected'];
        //             return statuses[record.get('status')];
        //         } else {
        //             return record.get('status');
        //         }
        //     },
        // },
        {
            name: 'vessel_data',
            type: 'auto',
            critical: true,
        },
        {
            name: 'exchange_rate',
            type: 'float',
            defaultValue: 1,
        },
        {
            name: 'proforma_date',
            type: 'date',
            dateWriteFormat: 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'due_date',
            type: 'date',
            dateWriteFormat: 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d H:i:s',
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
        {
            name: 'pc_calculation',
            model: 'Abraxa.model.calculation.Calculation',
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
