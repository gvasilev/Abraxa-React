Ext.define('Abraxa.view.invitations.PublishDialog', {
    extend: 'Ext.Dialog',
    xtype: 'publish.dialog',
    controller: 'invitation-controller',
    width: 420,
    title: 'Publish',
    closable: true,
    draggable: false,
    defaults: {
        ui: 'classic',
    },
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'formpanel',
                    padding: 0,
                    itemId: 'shareForm',
                    items: [
                        {
                            xtype: 'form.error',
                            docked: 'top',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            showAnimation: 'fadeIn',
                        },
                        {
                            xtype: 'member.combo',
                            label: 'Publish to',
                            labelAlign: 'top',
                            cls: 'non-editable a-field-icon icon-business',
                            editable: false,
                            placeholder: 'Please select',
                            required: true,
                            name: 'member_id',
                            listeners: {
                                painted: function (me) {
                                    me.focus();
                                },
                                select: function (me, selection) {
                                    if (selection) {
                                        let publishedMemberIds = me.upVM().get('publishedMemberIds'),
                                            selectedMemberId = selection.get('id'),
                                            dialog = me.up('dialog'),
                                            errorContainer = dialog.down('form\\.error');
                                        if (publishedMemberIds.length > 0) {
                                            //check for published disbursements with this member
                                            if (Ext.Array.contains(publishedMemberIds, selectedMemberId)) {
                                                errorContainer
                                                    .setHtml(
                                                        'You have already published another disbursement to this member.'
                                                    )
                                                    .show()
                                                    .addCls('error');
                                                me.upVM().set('disablePublish', true);
                                            } else {
                                                errorContainer.setHtml('').hide().removeCls('error');
                                                me.upVM().set('disablePublish', false);
                                            }
                                        } else {
                                            errorContainer.setHtml('').hide().removeCls('error');
                                            me.upVM().set('disablePublish', false);
                                        }
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttons: {
        ok: {
            weight: 2,
            text: 'Publish',
            enableToggle: true,
            ui: 'action',
            bind: {
                disabled: '{disablePublish}',
            },
            handler: function (me) {
                me.setDisabled(true);
                let disbursement = me.upVM().get('disbursement'),
                    disbursements = me.upVM().get('disbursements'),
                    disablePublish = me.upVM().get('disablePublish'),
                    members = me.upVM().get('members');
                form = me.up('dialog').down('formpanel');
                if (!disablePublish) {
                    if (form.validate()) {
                        let member = members.getById(form.getValues().member_id),
                            memberEmail = '';
                        me.setUi('action loading');
                        form.down('form\\.error').setHtml('').hide().removeCls('error');
                        let submitData = {};
                        submitData = {
                            disbursement_id: disbursement.get('id'),
                            member_id: member.get('id'),
                            portcall_id: disbursement.get('portcall_id'),
                        };
                        Abraxa.getApplication()
                            .getController('AbraxaController')
                            .publishDisbursement(submitData)
                            .then(function (result) {
                                if (result) {
                                    disbursement.getProxy().setExtraParams({
                                        portcall_id: disbursement.get('portcall_id'),
                                    });
                                    disbursements.load({
                                        callback: function (records, operation, success) {
                                            if (success == true) {
                                                let newRecord = null;
                                                Ext.Array.each(records, function (value) {
                                                    if (value.get('id') === result.id) {
                                                        newRecord = value;
                                                    }
                                                });
                                                me.setDisabled(false);
                                                me.toggle();
                                                if (newRecord) {
                                                    me.upVM().getParent().set('selectedRecord', newRecord);
                                                    Ext.toast('Record published', 1000);
                                                    let title = 'Disbursement published successfully',
                                                        content = '';
                                                    Abraxa.popup.showSuccessDialog(title, content);
                                                    me.up('dialog').destroy();
                                                }
                                            }
                                        },
                                    });
                                } else {
                                    me.setDisabled(false);
                                    me.toggle();
                                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                                }
                            });
                        // if (member.get("org_email")) {
                        //     memberEmail = member.get("org_email");
                        // }
                        // Ext.Msg.confirm(
                        //     'Confirmation',
                        //     '<div class="mb-16">Would you like to publish this document to</div><div class="party-item"><div class="sm-function function-A"><i class="md-icon md-18">business</i></div><a href="javascript:void(0);" class="sm-company fw-b">' + member.get("org_name") + '</a><div class="sm-type">' + memberEmail + '</div></div>',
                        //     function (answer) {
                        //         if (answer == 'yes') {

                        //         }
                        //     },
                        //     this, [{
                        //         xtype: 'button',
                        //         itemId: 'no',
                        //         text: 'No'
                        //     }, {
                        //         xtype: 'button',
                        //         itemId: 'yes',
                        //         ui: 'action',
                        //         text: 'Yes'
                        //     }]
                        // );
                    } else {
                        form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                    }
                }
            },
        },
        cancel: {
            weight: 1,
            text: 'Cancel',
            margin: '0 8 0 0',
            ui: 'default',
            handler: function () {
                // standard button (see below)
                this.up('dialog').hide();
                var me = this;
                setTimeout(function () {
                    if (me.up('dialog')) me.up('dialog').destroy();
                }, 300);
            },
        },
    },
});
