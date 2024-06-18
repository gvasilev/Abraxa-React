Ext.define('Abraxa.view.portcall.principal.disbursements.approvals.DisbursementRejectDialog', {
    extend: 'Ext.Dialog',
    xtype: 'DisbursementRejectDialog',
    width: '480',
    closable: true,
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-warning"><i class="material-icons-outlined">published_with_changes</i></div>Request changes',
    // padding: '16 24 0 24',
    items: [
        {
            xtype: 'div',
            cls: 'fw-b c-text',
            padding: '0 0 0 48',
            html: 'Do you want to request changes?',
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
            name: 'disbursement_reject_notes',
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
                ui: 'premium loading',
                enableToggle: true,
                text: 'Request changes',
                reference: 'rejectDisbursementButton',
                publishes: 'pressed',
                bind: {
                    disabled: '{rejectDisbursementButton.pressed}',
                },
                handler: function (me) {
                    let approvalRecord = me.upVM().get('approvalRecord'),
                        disbursmentRecord = me.upVM().get('disbursementRecord');

                    if (me.up('dialog').down('textareafield').validate()) {
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'approval-workflows/request/' + approvalRecord.get('id') + '/reject',
                            method: 'PUT',
                            jsonData: {
                                notes: me.up('dialog').down('textareafield').getValue(),
                            },
                            success: function (response) {
                                disbursmentRecord.load();
                                Ext.toast('Record updated');
                                me.up('dialog').close();
                            },
                        });
                    } else {
                        this.setPressed(false);
                        Ext.toast('Please add a message');
                    }
                },
            },
        ],
    },
});
