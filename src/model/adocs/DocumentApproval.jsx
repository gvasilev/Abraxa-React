Ext.define('Abraxa.model.adocs.DocumentApproval', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'auto',
            name: 'id',
        },
        {
            type: 'auto',
            name: 'document_folder_file_id',
        },
        {
            type: 'auto',
            name: 'document_folder_id',
        },
        {
            type: 'auto',
            name: 'status',
        },
        {
            type: 'auto',
            name: 'comment',
        },
        {
            type: 'date',
            name: 'updated_at',
        },
        {
            name: 'status_order',
            persist: false,
            convert: function (v, record) {
                let order_id = 0;
                switch (record.get('status')) {
                    case 'pending':
                        order_id = 3;
                        break;
                    case 'approved':
                        order_id = 1;
                        break;
                    case 'rejected':
                        order_id = 2;
                        break;
                }
                return order_id;
            },
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'folder_files/approvals/${object_id}/${object_meta_id}',
        batchActions: true,
        appendId: false,
        writer: {
            allowSingle: false,
        },
    },
});
