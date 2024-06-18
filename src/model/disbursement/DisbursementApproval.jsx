Ext.define('Abraxa.model.disbursement.DisbursementApproval', {
    extend: 'Abraxa.model.approval.Approval',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'disbursement/${disbursement_id}/approvals',
    },
});
