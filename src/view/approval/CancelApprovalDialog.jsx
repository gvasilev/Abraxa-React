Ext.define('Abraxa.view.approval.CancelApprovalDialog', {
    extend: 'Ext.Dialog',
    xtype: 'cancel.approval.dialog',
    width: '480',
    closable: true,
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="hbox"><div class="a-badge a-badge-cancel-approval my-8 mr-16"><i class="material-icons-outlined">block</i></div>Cancel request</div>',
    // padding: '16 24 0 24',
    items: [
        {
            xtype: 'div',
            cls: 'fw-b c-text',
            padding: '0 0 0 48',
            html: 'Do you want to cancel the approval request?',
        },
        {
            xtype: 'textareafield',
            margin: '24 0 0 40',
            ui: 'classic no-border',
            cls: 'a-field-icon icon-short',
            // label: 'Rejection reason',
            label: false,
            labelAlign: 'top',
            placeholder: 'Add a message',
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
                text: 'Cancel request',
                handler: function (me) {
                    let approbavle = this.upVM().get('approvable'),
                        record = this.upVM().get('recordForApproval'),
                        store = this.upVM().get('approvals');
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'approval-workflows/request/' + record.get('id') + '/cancel',
                        method: 'PUT',
                        jsonData: {
                            notes: me.up('dialog').down('textareafield').getValue(),
                        },
                        success: function (response) {
                            Ext.toast('Record updated');
                            approbavle.load();
                            me.up('dialog').close();
                        },
                    });
                },
            },
        ],
    },
});
