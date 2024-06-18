Ext.define('Abraxa.view.portcall.documents.SendForApprovalDialog', {
    extend: 'Ext.Dialog',
    xtype: 'send.for.approval.diialog',
    closable: true,
    draggable: false,
    minHeight: 500,
    width: 580,
    cls: 'a-dialog-create a-dialog-has-icon',
    layout: 'vbox',
    bind: {
        title: '<div class="a-badge a-badge-request-approval"><i class="material-icons-outlined">check_circle</i></div><div class="a-title-multiline">Request approval<div class="sm-title">{selectedFiles ? selectedFiles.length : "0"} files selected</div></div>',
    },
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                var store = this.upVM().get('folderMembers');
                store.rejectChanges();
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Request',
            enableToggle: true,
            ui: 'action loading',
            disabled: true,
            bind: {
                disabled: '{membersForApproval.length ? false : true}',
            },
            handler: function (me) {
                let selectedFiles = this.upVM().get('selectedFiles'),
                    documentList = Ext.ComponentQuery.query('documents\\.list')[0],
                    membersForApproval = this.upVM().get('membersForApproval');
                Ext.Array.each(selectedFiles, function (file) {
                    let folder_file = file.getParent().upVM().get('record'),
                        store = folder_file.approvals(),
                        object_meta_id = this.upVM().get('object_record').get('id');

                    store.getProxy().setExtraParams({
                        object_id: 3,
                        object_meta_id: object_meta_id,
                    });
                    Ext.Array.each(membersForApproval, function (member) {
                        let member_data = member.getParent().upVM().get('record'),
                            comment = Ext.ComponentQuery.query('[cls~=approval_comment]')[0].getValue(),
                            record_exists = store.queryBy(function (rec, id) {
                                return (
                                    rec.get('member_id') == member_data.get('id') &&
                                    rec.get('document_folder_file_id') == folder_file.get('id')
                                );
                            }).items;

                        Ext.Array.each(record_exists, function (rec) {
                            if (rec) {
                                if (rec.get('status') == 'pending') {
                                    rec.set('status', 'canceled');
                                }
                            }
                        });
                        store.add({
                            document_folder_file_id: folder_file.get('id'),
                            document_folder_id: folder_file.get('document_folder_id'),
                            member_id: member_data.get('id'),
                            status: 'pending',
                            comment: comment,
                        });
                    });
                    store.sync({
                        success: function () {
                            folder_file.getProxy().setExtraParams({
                                object_id: 3,
                                object_meta_id: object_meta_id,
                            });
                            folder_file.load();
                            documentList.deselectAll();
                            folder_file.set('is_checked', false);
                            if (file.baseCls == 'x-checkboxfield') file.setChecked(false);

                            if (me.up('dialog')) me.up('dialog').destroy();
                            Abraxa.popup.showSuccessDialog('The approval request has been sent', '');
                            mixpanel.track('Request approval sent');
                        },
                    });
                });
                this.upVM().set('selectedFiles', null);
            },
        },
    ],
    items: [
        // {
        //     xtype: 'div',
        //     bind: {
        //         html: '<div class="sm-title">{selectedFiles ? selectedFiles.length : "0"} files selected</div>'
        //     }
        // },
        {
            xtype: 'div',
            cls: 'c-text',
            padding: '0 0 8 48',
            html: 'Select at least one company to request approval from',
        },
        {
            xtype: 'abraxa.formlist',
            margin: '24 0 0 0',
            flex: 1,
            showAnimation: {
                type: 'slide',
                direction: 'right',
            },
            emptyText: {
                xtype: 'container',
                zIndex: 999,
                minHeight: 290,
                layout: {
                    type: 'vbox',
                    pack: 'middle',
                },
                items: [
                    {
                        xtype: 'div',
                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 124 124"><g transform="translate(-658 -388)"><g transform="translate(-176 43)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M21.6,29.5C15.048,29.5,2,32.776,2,39.3v4.9H41.2V39.3C41.2,32.776,28.152,29.5,21.6,29.5ZM8.552,38.6c2.352-1.624,8.036-3.5,13.048-3.5s10.7,1.876,13.048,3.5ZM21.6,24.6a9.8,9.8,0,1,0-9.8-9.8A9.811,9.811,0,0,0,21.6,24.6Zm0-14a4.2,4.2,0,1,1-4.2,4.2A4.194,4.194,0,0,1,21.6,10.6ZM41.312,29.668C44.56,32.02,46.8,35.156,46.8,39.3v4.9H58V39.3C58,33.644,48.2,30.424,41.312,29.668ZM38.4,24.6A9.8,9.8,0,1,0,38.4,5a9.647,9.647,0,0,0-4.2.98,15.291,15.291,0,0,1,0,17.64A9.647,9.647,0,0,0,38.4,24.6Z" transform="translate(690 425.4)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No members<span class="fs-13">Invite your partners to jointly collaborate</span></div></div>',
                    },
                    // ToDo: Fix button handler
                    // {
                    //     xtype: 'button',
                    //     text: 'Add members',
                    //     cls: 'a-no-content-btn',
                    //     ui: 'normal-light medium',
                    //     iconCls: 'md-icon-outlined md-icon-group-add',
                    //     handler: function () {
                    //         this.upVM().set('invite_mode', true);
                    //     }
                    // }
                ],
            },
            bind: {
                store: '{folderMembersApprovers}',
            },
            itemConfig: {
                viewModel: {
                    // formulas: {
                    //     member: {
                    //         bind: {
                    //             bindTo: '{record}',
                    //             deep: true
                    //         },
                    //         get: function (record) {
                    //             let store = this.get('members'),
                    //                 member = store.getById(record.get('member_id'));
                    //             return member;
                    //         }
                    //     }
                    // }
                },
                xtype: 'container',
                cls: 'a-invite-company-item',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                margin: '0 0 16 0',
                items: [
                    {
                        xtype: 'checkbox',
                        ui: 'medium',
                        cls: 'approval_checkbox',
                        margin: '0 20 0 4',
                        listeners: {
                            change: function () {
                                var membersForApproval = Ext.ComponentQuery.query(
                                    '[cls="approval_checkbox"][checked="true"]'
                                );
                                this.upVM().getParent().set('membersForApproval', membersForApproval);
                            },
                        },
                    },
                    {
                        xtype: 'div',
                        flex: 1,
                        bind: {
                            html:
                                '<div class="party-item">' +
                                '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                                '<a href="javascript:void(0);" class="sm-company fw-b">{record.org_name}</a><div class="sm-type">{record.invitation.invitation_email}</div>' +
                                '</div>',
                        },
                    },
                    {
                        // xtype: 'div',
                        // cls: 'a-status-badge status-default a-status-md text-capitalize no-border',
                        // bind: {
                        //     html: '{record.role}',
                        // }
                    },
                ],
            },
        },
        {
            xtype: 'textareafield',
            margin: '24 0 0 0',
            ui: 'classic no-border',
            cls: 'a-field-icon icon-short approval_comment',
            label: false,
            labelAlign: 'top',
            placeholder: 'Add a message (optional)',
            bind: {
                hidden: '{folderMembersApprovers.length ? false : true}',
            },
        },
    ],
});
