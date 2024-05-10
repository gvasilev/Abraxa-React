Ext.define('Abraxa.model.approval.Approval', {
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
            name: 'approvable_type',
            type: 'string',
        },
        {
            name: 'approvable_id',
            type: 'integer',
        },
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'current_approval_data',
            persist: false,
        },
        {
            name: 'status_reason',
            depends: 'status',
            persist: false,
            convert: function (val, record) {
                return record.get(record.get('status') + '_reason');
            },
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        appendId: false,
        url: Env.ApiEndpoint + 'approval-workflows/approval-requests/${disbursement_id}',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'eligible_members',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
