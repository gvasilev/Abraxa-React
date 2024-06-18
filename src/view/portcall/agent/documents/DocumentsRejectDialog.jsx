Ext.define('Abraxa.view.portcall.documents.DocumentsRejectDialog', {
    extend: 'Ext.Dialog',
    xtype: 'documents.reject.dialog',
    width: '480',
    closable: true,
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-reject-approval"><i class="material-icons-outlined">highlight_off</i></div>Reject approval',
    // padding: '16 24 0 24',
    items: [
        {
            xtype: 'div',
            cls: 'fw-b c-text',
            padding: '0 0 0 48',
            html: 'Do you want to reject the selected document?',
        },
        {
            xtype: 'textareafield',
            margin: '24 0 0 40',
            ui: 'classic no-border',
            cls: 'a-field-icon icon-short',
            // label: 'Rejection reason',
            label: false,
            labelAlign: 'top',
            required: true,
            placeholder: 'Add a message (required)',
            name: 'rejected_reason',
            bind: {
                value: '{recordForApproval.rejected_reason}',
            },
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
                ui: 'decline alt',
                text: 'Reject',
                handler: function (me) {
                    let record = this.upVM().get('recordForApproval'),
                        store = this.upVM().get('approvals'),
                        rejectionReason = Ext.ComponentQuery.query('[name=rejected_reason]')[0];
                    store.getProxy().setExtraParams({
                        disbursement_id: record.get('approvable_id'),
                    });
                    if (rejectionReason.validate()) {
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'approval-workflows/request/' + record.get('id') + '/reject',
                            method: 'PUT',
                            success: function (response) {
                                store.reload();
                                Ext.toast('Record updated');
                                me.up('dialog').close();
                            },
                        });
                    }
                },
            },
        ],
    },
});
