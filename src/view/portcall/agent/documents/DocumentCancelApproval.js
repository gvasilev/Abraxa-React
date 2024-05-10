Ext.define('Abraxa.view.portcall.documents.DocumentCancelApproval', {
    extend: 'Ext.Dialog',
    xtype: 'documents.cancel.dialog',
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
            name: 'canceled_reason',
            bind: {
                value: '{recordForApproval.canceled_reason}',
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
                text: 'Cancel request',
                handler: function (me) {
                    let record = this.upVM().get('recordForApproval'),
                        store = this.upVM().get('approvals');

                    record.set('status', 'canceled');

                    store.sync({
                        success: function () {
                            Ext.toast('Record updated');
                            me.up('dialog').close();
                        },
                    });
                },
            },
        ],
    },
});
