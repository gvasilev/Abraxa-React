Ext.define('Abraxa.model.disbursement.DisbursementMember', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'disbursement_id',
            type: 'integer',
        },
        {
            name: 'member_id',
            type: 'integer',
        },
        {
            type: 'auto',
            name: 'created_at',
        },
        {
            type: 'auto',
            name: 'updated_at',
        },
        {
            type: 'auto',
            name: 'created_by',
        },
        {
            type: 'auto',
            name: 'updated_by',
        },
    ],
    // proxy: {
    //     type: 'rest',
    //     url: Env.ApiEndpoint + 'disbursement/${disbursement_id}/members',
    //     batchActions: true,
    //     appendId: false,
    //     writer: {
    //         allowSingle: false
    //     }
    // }
});
