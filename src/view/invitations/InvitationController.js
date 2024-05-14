Ext.define('Abraxa.view.invitations.InvitationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.invitation-controller',
    init: function () {},

    acceptInvite: function (cmp) {
        let record = cmp.getParent().ownerCmp.getRecord();

        if (record.get('object_name') == 'appointment') {
            let portcall = record.get('voyage').portcall;

            portcall['parent_id'] = record.get('object_meta_id');
        }
    },

    showFileIdPrompt: function (invitationMainVM, parentDialog) {
        const invitation = invitationMainVM.get('invitation');
        const invitations = Ext.getCmp('main-viewport').getViewModel().get('invitations');

        if (Ext.getCmp('invitationMainVMFileIdPrompt')) {
            Ext.getCmp('invitationMainVMFileIdPrompt').destroy();
        }

        const fileIdPrompt = Ext.create('Ext.MessageBox', {
            title: 'Please choose a File ID',
            id: 'invitationMainVMFileIdPrompt',
            testId: 'invitationMainVMFileIdPrompt',
            closeAction: 'destroy',
            viewModel: {
                parent: invitationMainVM,
            },
            prompt: {
                xtype: 'textfield',
                label: 'File ID',
                name: 'file_id',
                labelAlign: 'top',
                bind: {
                    value: '{invitation.file_id}',
                },
                required: true,
                listeners: {
                    painted: function (me) {
                        me.focus();
                    },
                },
            },
            bbar: {
                items: [
                    '->',
                    {
                        xtype: 'button',
                        text: 'Cancel',
                        testId: 'invitationMainVMFileIdPromptCancelButton',
                        margin: '0 8',
                        handler: function (me) {
                            me.up('dialog').destroy();
                        },
                    },
                    {
                        xtype: 'button',
                        text: 'Save and accept',
                        testId: 'invitationMainVMFileIdPromptSaveAndAcceptButton',
                        enableToggle: true,
                        ui: 'action loading',
                        bind: {
                            disabled: '{!invitation.file_id}',
                        },
                        handler: function (me) {
                            invitation.set('status', 'Accepted');
                            invitation.save({
                                success: function (record) {
                                    if (parentDialog) {
                                        parentDialog.destroy();
                                    }
                                    me.up('dialog').destroy();
                                    Ext.toast('Invitation accepted');
                                    Ext.getCmp('main-viewport')
                                        .getController()
                                        .redirectTo('#portcall/' + record.get('invitable_id'));

                                    invitations.reload();
                                },
                                failure: function (record, response) {
                                    var result = response.error.response.responseJson;
                                    Ext.Msg.alert('Oops', result.message);
                                },
                            });
                        },
                    },
                ],
            },
        });

        fileIdPrompt.show();
    },
    shareWithParticipant: function () {
        let me = this,
            view = me.getView(),
            form = view.down('#shareForm'),
            sharings = view.getVM().get('sharings'),
            disbursement = view.getVM().get('disbursement'),
            values = form.getValues();
        if (form.validate()) {
            sharings.add({
                tenant_id: values.tenant_field,
                disbursement_id: disbursement.get('id'),
            });
            sharings.sync({
                success: function (batch) {
                    Ext.toast('Record created', 1000);
                },
                failure: function (batch) {
                    var msg = batch.operations[0].error.response.responseJson.message[0];
                    Ext.Msg.alert('Something went wrong', msg);
                },
            });
        }
    },
});
