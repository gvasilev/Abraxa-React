Ext.define('Abraxa.view.portcall.documents.FolderMembersDialog', {
    extend: 'Ext.Dialog',
    xtype: 'folder.members.dialog',
    closable: false,
    draggable: false,
    minHeight: 500,
    width: 580,
    cls: 'chameleon_portcall_documents_folder_members_dialog',
    bind: {
        title: '{folder.name} members',
    },
    tools: {
        close: {
            handler: function () {
                let store = this.upVM().get('folderMembers');

                store.rejectChanges();
                this.up('dialog').destroy();
            },
        },
    },
    buttonDefaults: {
        bind: {
            hidden: '{nonEditable}',
        },
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
            text: 'Save',
            enableToggle: true,
            ui: 'action loading',
            disabled: true,
            bind: {
                disabled: '{folderMembers.needsSync ? false : true}',
                hidden: '{nonEditable}',
            },
            handler: function (me) {
                var store = me.upVM().get('folderMembers');
                store.sync({
                    success: function () {
                        Ext.toast('Record updated');
                    },
                });
                this.up('dialog').destroy();
                Abraxa.popup.showSuccessDialog('Members have been updated successfully');
                mixpanel.track('Invited/Removed shared folder members');
            },
        },
    ],
    items: [
        {
            xtype: 'member.combo',
            ui: 'field-xl no-border classic',
            reference: 'newFolderMembers',
            clearable: false,
            labelAlign: 'top',
            label: false,
            cls: 'a-field-icon icon-search',
            name: 'email',
            placeholder: 'Choose a member',
            bind: {
                hidden: '{nonEditable}',
            },
            listeners: {
                painted: function (me) {
                    me.focus();
                },
                select: function (me, selection) {
                    if (selection) {
                        let folderMembers = me.upVM().get('folderMembers'),
                            folder = me.upVM().get('folder'),
                            memberExists = folderMembers.queryBy(function (record) {
                                return record.get('member_id') === selection.get('id');
                            });
                        if (memberExists.items.length > 0) {
                            Ext.Msg.alert(
                                'Something went wrong',
                                selection.get('org_name') + ' already has access to this folder.'
                            );
                            me.getValueCollection().remove(selection);
                        } else {
                            let existingRecord = folderMembers.findRecord(
                                'member_id',
                                selection.get('id'),
                                0,
                                false,
                                false,
                                true
                            );
                            if (!existingRecord) {
                                folderMembers.add({
                                    member_id: selection.get('id'),
                                    document_folder_id: folder.get('id'),
                                });
                            }
                            me.getValueCollection().removeAll();
                        }
                    }
                },
            },
        },
        {
            xtype: 'abraxa.formlist',
            margin: '24 0 0 0',
            flex: 1,
            showAnimation: {
                type: 'slide',
                direction: 'right',
            },
            // minHeight: 66,
            hidden: false,
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
                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 124 124"><g transform="translate(-658 -388)"><g transform="translate(-176 43)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M21.6,29.5C15.048,29.5,2,32.776,2,39.3v4.9H41.2V39.3C41.2,32.776,28.152,29.5,21.6,29.5ZM8.552,38.6c2.352-1.624,8.036-3.5,13.048-3.5s10.7,1.876,13.048,3.5ZM21.6,24.6a9.8,9.8,0,1,0-9.8-9.8A9.811,9.811,0,0,0,21.6,24.6Zm0-14a4.2,4.2,0,1,1-4.2,4.2A4.194,4.194,0,0,1,21.6,10.6ZM41.312,29.668C44.56,32.02,46.8,35.156,46.8,39.3v4.9H58V39.3C58,33.644,48.2,30.424,41.312,29.668ZM38.4,24.6A9.8,9.8,0,1,0,38.4,5a9.647,9.647,0,0,0-4.2.98,15.291,15.291,0,0,1,0,17.64A9.647,9.647,0,0,0,38.4,24.6Z" transform="translate(690 425.4)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No members! <span class="fs-13">Choose a member to share the folder with</span></div></div>',
                    },
                ],
            },
            bind: {
                store: '{folderMembers}',
            },
            itemConfig: {
                viewModel: {
                    formulas: {
                        member: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                let store = this.get('members'),
                                    member = store.getById(record.get('member_id'));

                                return member;
                            },
                        },
                    },
                },
                xtype: 'container',
                cls: 'a-invite-company-item',
                layout: {
                    type: 'hbox',
                    pack: 'space-between',
                },
                flex: 1,
                margin: '0 0 16 0',
                items: [
                    {
                        xtype: 'div',
                        flex: 1,
                        bind: {
                            html:
                                '<div class="party-item">' +
                                '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                                '<a href="javascript:void(0);" class="sm-company fw-b">{member.org_name}</a><div class="sm-type">{member.org_email}</div>' +
                                '</div>',
                        },
                    },
                    // {
                    //     xtype: 'container',
                    //     padding: '0 16',
                    //     bind: {
                    //         hidden: '{member.is_owner ? true : false}'
                    //     },
                    //     items: [{
                    //         xtype: 'button',
                    //         margin: '0 16 0 0',
                    //         iconCls: 'md-icon-outlined md-icon-share',
                    //         bind: {
                    //             hidden: '{member.status_name != "Accepted" ? true : false}',
                    //             ui: 'tool round {member.has_left ? "default" : "normal"}',
                    //             disabled: '{member.has_left ? true : false}',
                    //             tooltip: {
                    //                 showDelay: 0,
                    //                 hideDelay: 0,
                    //                 align: 'bc-tc?',
                    //                 html: '{member.has_left ? "Inactive" : "Active"}'
                    //             }
                    //         }
                    //     }, {
                    //         xtype: 'button',
                    //         iconCls: 'md-icon-mail md-icon-outlined',
                    //         ui: 'tool round normal',
                    //         tooltip: {
                    //             html: 'Default mail template',
                    //             align: 'bc-tc?',
                    //             showDelay: 0,
                    //             hideDelay: 0,
                    //         }
                    //     }]
                    // },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-status-badge status-default text-capitalize a-status-md no-border',
                                bind: {
                                    html: '<i class="material-icons-outlined md-18 mr-8">{member.role == "viewer" ? "remove_red_eye" : "edit"}</i>{member.role}',
                                },
                            },
                            {
                                xtype: 'button',
                                margin: '0 0 0 4',
                                hidden: true,
                                bind: {
                                    hidden: '{nonEditable}',
                                },
                                ui: 'tool round tool-md',
                                iconCls: 'md-icon-more-vert',
                                arrow: false,
                                menu: {
                                    ui: 'info has-icons',
                                    width: 320,
                                    items: [
                                        {
                                            html: '<i class="md-icon-outlined">delete</i><div class="sm-header c-red">Remove member</div><div class="sm-desc">This member will be removed from the shared folder, however a copy will be kept for each file that was already shared with them.</div>',
                                            separator: true,
                                            handler: function (me) {
                                                let member = me.upVM().get('record');
                                                me.upVM().get('folderMembers').remove(member);
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
});
