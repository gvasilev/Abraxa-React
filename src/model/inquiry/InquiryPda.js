Ext.define('Abraxa.model.inquiry.InquiryPda', {
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
                return statuses[val];
            },
        },
    ],
    hasOne: [
        {
            name: 'inquiry',
            model: 'Abraxa.model.inquiry.Inquiry',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry/pdas',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
