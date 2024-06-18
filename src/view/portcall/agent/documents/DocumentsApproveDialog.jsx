Ext.define('Abraxa.view.portcall.documents.DocumentsApproveDialog', {
    extend: 'Ext.Dialog',
    xtype: 'documents.approve.dialog',
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
            html: 'Do you want to approve the selected document?',
        },
        {
            xtype: 'textareafield',
            margin: '24 0 0 40',
            ui: 'classic no-border',
            cls: 'a-field-icon icon-short',
            label: false,
            labelAlign: 'top',
            placeholder: 'Add a message (optional)',
            name: 'status_reason',
            bind: {
                value: '{recordForApproval.approved_reason}',
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
                xtype: 'button',
                ui: 'confirm alt',
                text: 'Approve',
                handler: function (me) {
                    let record = this.upVM().get('recordForApproval'),
                        store = this.upVM().get('approvals');
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'approval-workflows/request/' + record.get('id') + '/approve',
                        method: 'POST',
                        success: function (response) {
                            store.reload();
                            Ext.toast('Record updated');
                            me.up('dialog').close();
                        },
                    });
                },
            },
        ],
    },
});
