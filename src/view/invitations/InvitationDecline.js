Ext.define('Abraxa.view.invitations.InvitationDecline', {
    xtype: 'invitation.decline',
    extend: 'Ext.MessageBox',
    modal: true,
    title: 'Decline',
    width: 540,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    closable: true,
    draggable: false,
    defaults: {
        labelWidth: 100,
        labelSeparator: '',
    },
    padding: '16 24',
    items: [
        {
            xtype: 'div',
            cls: 'fw-b fs-16 mb-16',
            html: 'Do you want to decline this invitation?',
        },
        {
            xtype: 'div',
            bind: {
                html: '<div class="hbox"><div class="a-obj-logo a-logo a-logo-appointment mr-12"><i class="md-icon-business-center md-icon-outlined md-18"></i></div><div style="line-height: 1.2;"><div class="fw-b">{invitationRecord.voyage.vessel_name}</div><div class="fs-12">INV - {invitationRecord.id}</div></div></div>',
            },
        },
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            itemId: 'invitation-decline-form',
            xtype: 'formpanel',
            padding: '16 0',
            items: [
                {
                    xtype: 'fieldcontainer',
                    padding: '16 0',
                    defaults: {
                        layout: 'hbox',
                        ui: 'classic',
                        labelAlign: 'top',
                    },
                    items: [
                        {
                            xtype: 'textareafield',
                            ui: 'no-border classic',
                            cls: 'a-field-icon icon-short',
                            placeholder: 'Enter comment',
                            label: 'Comment',
                            maxRows: 8,
                            bind: {
                                value: '{invitationRecord.declined_reason}',
                            },
                            required: true,
                            width: '100%',
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('invitationRecord');
                                    record.set('declined_reason', this.getValue());
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function (me) {
                let dialog = me.up('dialog'),
                    record = dialog.upVM().get('invitationRecord');
                record.reject();
                dialog.destroy();
            },
            margin: '0 12',
            ui: 'default',
        },
        {
            text: 'Decline',
            ui: 'decline alt',
            handler: function (me) {
                let dialog = me.up('dialog'),
                    invitation = dialog.upVM().get('invitationRecord'),
                    invitations = dialog.upVM().get('invitations'),
                    form = dialog.queryById('invitation-decline-form');
                if (form.validate()) {
                    dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                    invitation.getProxy().setExtraParams({
                        object_id: invitation.get('object_id'),
                        object_meta_id: invitation.get('object_meta_id'),
                    });
                    invitation.set('status', 'Declined');
                    invitation.save({
                        success: function (batch) {
                            invitations.remove(invitation);
                            if (Ext.ComponentQuery.query('[itemId=invitationRightContainer]')[0]) {
                                Ext.ComponentQuery.query('[itemId=invitationRightContainer]')[0].hide();
                            }
                            if (Ext.ComponentQuery.query('[xtype=invitaion\\.main\\.dialog]')[0]) {
                                Ext.ComponentQuery.query('[xtype=invitaion\\.main\\.dialog]')[0].destroy();
                            }
                            invitations.commitChanges();
                            Ext.toast('Record updated', 1000);
                            dialog.destroy();
                        },
                        failure: function (batch) {
                            // Ext.Msg.alert('Something went wrong', 'Could not appoint this Inquiry!');
                        },
                    });
                } else {
                    dialog.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                }
            },
        },
    ],
});
