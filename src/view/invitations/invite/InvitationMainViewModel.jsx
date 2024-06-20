Ext.define('Abraxa.view.invitations.invite.InvitationMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.invitation-main-viewmodel',
    data: {
        invitation: null,
        dialog: false,
    },

    formulas: {
        portcall: {
            bind: {
                bindTo: '{invitation.voyage}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record.getPortcall();
                }
            },
        },
        voyage: {
            bind: {
                bindTo: '{invitation}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record.getVoyage();
                }
            },
        },
        vessel: {
            bind: {
                bindTo: '{voyage}',
                deep: true,
            },
            get: function (voyage) {
                if (voyage) {
                    if (voyage.get('custom_vessel')) {
                        return voyage.get('custom_vessel');
                    } else {
                        return voyage.get('vessel');
                    }
                }
            },
        },
        vesselImage: {
            bind: {
                bindTo: '{vessel}',
                deep: true,
            },
            get: function (vessel) {
                if (vessel) {
                    if (vessel.company_id && vessel.vessel_img) {
                        return vessel.vessel_img;
                    } else {
                        return AbraxaConstants.urls.staticAbraxa + 'ships/' + vessel.imo + '.jpg';
                    }
                }
            },
        },
        vesselType: {
            bind: {
                bindTo: '{vessel}',
                deep: true,
            },
            get: function (vessel) {
                if (vessel && vessel.types) {
                    return vessel.types.name;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        status: {
            bind: {
                bindTo: '{portcall}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record.get('status_data');
                }
            },
        },
        instructions: {
            bind: {
                bindTo: '{portcall}',
                deep: true,
            },
            get: function (portcall) {
                if (portcall) {
                    if (portcall.instructions()) {
                        return portcall.instructions();
                    }
                }
            },
        },
        attachmentInstructionsVisible: {
            bind: {
                bindTo: '{instructionsVisible}',
                deep: true,
            },

            get: function (visible) {
                if (visible) {
                    return true;
                }
                return false;
            },
        },
        instructionsVisible: {
            bind: {
                bindTo: '{instructions.count}',
                deep: true,
            },
            get: function (count) {
                if (count) {
                    return false;
                }
                return true;
            },
        },
        attachmentsVisible: {
            bind: {
                bindTo: '{files}',
                deep: true,
            },
            get: function (files) {
                if (files && files.length > 0) {
                    return false;
                }
                return true;
            },
        },
        files: {
            bind: {
                bindTo: '{portcall}',
                deep: true,
            },
            get: function (portcall) {
                if (portcall) {
                    return portcall.get('created_files');
                }
            },
        },
        setParentDataForDialog: {
            bind: {
                bindTo: '{invitation}',
                deep: true,
            },
            get: function (invitation) {
                if (invitation) {
                    if (
                        this.getParent().hasOwnProperty('name') &&
                        this.getParent().name == 'invitationDialogViewModel'
                    ) {
                        this.getParent().set('invitationData', invitation);
                    }
                }
            },
        },
        toolbarItems: {
            bind: {
                bindTo: '{invitation}',
                deep: true,
            },
            get: function (record) {
                let items = ['->'];

                if (!record) return items;

                if (['Accepted', 'Declined', 'Withdrawn'].includes(record.get('status'))) {
                    return items;
                }

                let currentUser = Ext.getCmp('main-viewport').getViewModel().get('currentUser'),
                    currentUserType = Ext.getCmp('main-viewport').getViewModel().get('currentUserType');

                if (record.get('company_id') !== currentUser.get('current_company_id')) {
                    let declined = {
                        xtype: 'button',
                        testId: 'invitationMainVMDeclineButton',
                        ui: 'danger outlined',
                        text: 'Decline',
                        slug: 'portcallInvitations',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        handler: function (me) {
                            let invitationMainVM = me.upVM(),
                                invitation = invitationMainVM.get('invitation');

                            Ext.create('Abraxa.view.invitations.InvitationDecline', {
                                viewModel: {
                                    parent: invitationMainVM,
                                    data: {
                                        invitationRecord: invitation,
                                    },
                                },
                            }).show();
                        },
                    };

                    let accepted = {
                        xtype: 'button',
                        margin: '0 0 0 8',
                        ui: 'confirm alt',
                        text: 'Accept',
                        testId: 'invitationMainVMAcceptButton',
                        slug: 'portcallInvitations',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        handler: function (acceptButton) {
                            let invitationMainVM = acceptButton.upVM(),
                                invitationController = acceptButton.lookupController(),
                                invitation = invitationMainVM.get('invitation'),
                                currentUserType = Ext.getCmp('main-viewport').getViewModel().get('currentUserType'),
                                invitations = Ext.getCmp('main-viewport').getViewModel().get('invitations'),
                                dialog = acceptButton.up('dialog');

                            if (currentUserType && currentUserType === 'agent') {
                                let portId = invitation.getVoyage().getPortcall().get('port_id'),
                                    portName = invitation.getVoyage().getPortcall().get('port_name'),
                                    portsServed = Ext.getCmp('main-viewport').getViewModel().get('portsServed'),
                                    fileId = invitation.getVoyage().getPortcall().get('file_id');

                                if (!portId) return;

                                let filter = [
                                    {
                                        property: 'port_id',
                                        value: portId,
                                        operator: '=',
                                    },
                                ];

                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'ports_served',
                                    method: 'GET',
                                    params: {
                                        filter: JSON.stringify(filter),
                                    },
                                    success: function (response) {
                                        if (!response) return;

                                        let data = Ext.decode(response.responseText);

                                        if (!data) return;

                                        if (data.total) {
                                            if (fileId) {
                                                invitation.set('status', 'Accepted');
                                                invitation.save({
                                                    success: function (record) {
                                                        if (dialog) {
                                                            dialog.hide();
                                                        }
                                                        Ext.toast('Invitation accepted');
                                                        window.location.hash =
                                                            '#portcall/' + record.get('invitable_id');
                                                        invitations.reload();
                                                    },
                                                });
                                            } else {
                                                invitationController.showFileIdPrompt(invitationMainVM, dialog);
                                            }
                                        } else {
                                            let portDialog = Ext.create('Ext.MessageBox', {
                                                ui: 'info',
                                                title: 'Info',
                                                message:
                                                    'Port of <b>"' +
                                                    portName +
                                                    '"</b>is not listed in your default served ports.<br>Upon acceptance the port will be added automatically.',
                                                testId: 'invitationMainVMNotListedPrompt',
                                                closeAction: 'destroy',
                                                zIndex: 999,
                                                width: 380,
                                                dataTitle: 'Info',
                                                bbar: {
                                                    items: [
                                                        '->',
                                                        {
                                                            xtype: 'button',
                                                            text: 'OK',
                                                            testId: 'invitationMainVMFileIdPromptOkButton',
                                                            ui: 'action',
                                                            handler: function () {
                                                                let portModel = new Abraxa.model.common.PortServed({
                                                                    port_id: portId,
                                                                    port_name: portName,
                                                                });
                                                                portsServed.add(portModel);
                                                                portsServed.sync({
                                                                    success: function () {
                                                                        portDialog.destroy();
                                                                        portsServed.reload();
                                                                        if (fileId) {
                                                                            invitation.set('status', 'Accepted');
                                                                            invitation.save({
                                                                                success: function (record) {
                                                                                    if (dialog) {
                                                                                        dialog.hide();
                                                                                    }
                                                                                    Ext.toast('Invitation accepted');
                                                                                    window.location.hash =
                                                                                        '#portcall/' +
                                                                                        record.get('invitable_id');
                                                                                    invitations.reload();
                                                                                },
                                                                            });
                                                                        } else {
                                                                            invitationController.showFileIdPrompt(
                                                                                invitationMainVM,
                                                                                dialog
                                                                            );
                                                                        }
                                                                    },
                                                                });
                                                            },
                                                        },
                                                    ],
                                                },
                                            });
                                            portDialog.show();
                                        }
                                    },
                                });
                            } else {
                                invitation.set('status', 'Accepted');
                                invitation.save({
                                    success: function (record) {
                                        if (dialog) {
                                            dialog.hide();
                                        }
                                        Ext.toast('Invitation accepted');
                                        invitations.reload();
                                        window.location.hash = '#portcall/' + record.get('invitable_id');
                                    },
                                });
                            }
                        },
                    };
                    items.push(declined, accepted);
                } else if (currentUserType === 'principal') {
                    let withdrawn = {
                        xtype: 'button',
                        ui: 'danger outlined',
                        text: 'Withdraw',
                        testId: 'invitationMainVMWithdrawButton',
                        handler: function (me) {
                            let invitationMainVM = me.upVM(),
                                invitation = invitationMainVM.get('invitation');
                            Ext.Msg.confirm(
                                'Confirm',
                                'Are you sure you want to withdraw the invitation?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        invitation.set('status', 'Withdrawn');
                                        Ext.ComponentQuery.query('[itemId=invitationRightContainer]')[0].hide();
                                        invitation.save({
                                            success: function () {
                                                Ext.toast('Record updated');
                                            },
                                        });
                                    }
                                },
                                this,
                                [
                                    {
                                        xtype: 'button',
                                        itemId: 'no',
                                        testId: 'invitationMainVMWithdrawButtonNoButton',
                                        text: 'No',
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'yes',
                                        testId: 'invitationMainVMWithdrawButtonYesButton',
                                        ui: 'action',
                                        text: 'Yes',
                                    },
                                ]
                            );
                        },
                    };
                    items.push(withdrawn);
                }
                return items;
            },
        },
        attachmentItems: {
            bind: {
                bindTo: '{portcall}',
                deep: true,
            },
            get: function (portcall) {
                if (portcall && portcall.get('created_files') && portcall.get('created_files').length > 0) {
                    let items = [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Attachments',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            ui: 'transparent',
                            itemTpl:
                                '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{extension}"></div><div><a class="file_name" href="javascript:void(0);">{original_name}</a><span class="sm-title">{size}kb</span></div></div>',
                            itemConfig: {
                                cls: 'a-attachment-item',
                                minWidth: 0,
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                },
                            },
                            bind: {
                                data: '{files}',
                            },
                            listeners: {
                                childtap: function (me, location) {
                                    let selectedFile = location.record;
                                    if (selectedFile) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .previewFile(me, selectedFile.getDocument(), [selectedFile]);
                                    }
                                },
                            },
                        },
                    ];
                    return items;
                }
            },
        },
        etaRendererDate: {
            bind: {
                bindTo: '{portcall.port_eta}',
                deep: true,
            },
            get: function (date) {
                if (date) {
                    return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        portFunction: {
            bind: {
                bindTo: '{portcall.nomination}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record.get('port_function');
                }
            },
        },
        dateReceived: {
            bind: {
                bindTo: '{portcall.nomination.date_received}',
                deep: true,
            },
            get: function (date) {
                if (date) {
                    return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
    },
});
