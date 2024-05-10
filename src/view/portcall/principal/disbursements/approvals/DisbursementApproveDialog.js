Ext.define('Abraxa.view.portcall.principal.disbursements.approvals.DisbursementApproveDialog', {
    extend: 'Ext.Dialog',
    xtype: 'DisbursementApproveDialog',
    // height: 400,
    width: 480,
    closable: true,
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-request-approval"><i class="material-icons-outlined">check_circle</i></div>Approval request',
    items: [
        {
            xtype: 'div',
            cls: 'fw-b c-text',
            padding: '0 0 0 48',
            html: 'Do you want to approve the selected disbursement?',
        },
        {
            xtype: 'textareafield',
            margin: '24 0 0 40',
            ui: 'classic no-border',
            cls: 'a-field-icon icon-short',
            label: false,
            labelAlign: 'top',
            placeholder: 'Add a message (optional)',
            name: 'disbursement_approve_notes',
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                margin: '0 8 0 0',
                text: 'Cancel',
                handler: function () {
                    this.up('dialog').close();
                },
            },
            {
                xtype: 'button',
                xtype: 'button',
                ui: 'completed loading',
                enableToggle: true,
                text: 'Approve',
                reference: 'approveDisbursementButton',
                publishes: 'pressed',
                bind: {
                    disabled: '{approveDisbursementButton.pressed}',
                },
                handler: function (me) {
                    let approvalRecord = me.upVM().get('approvalRecord'),
                        disbursmentRecord = me.upVM().get('disbursementRecord');
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'approval-workflows/request/' + approvalRecord.get('id') + '/approve',
                        method: 'POST',
                        jsonData: {
                            notes: me.up('dialog').down('textareafield').getValue(),
                        },
                        success: function (response) {
                            disbursmentRecord.load();
                            Ext.toast('Record updated');
                            me.up('dialog').close();
                        },
                    });
                },
            },
        ],
    },
});
