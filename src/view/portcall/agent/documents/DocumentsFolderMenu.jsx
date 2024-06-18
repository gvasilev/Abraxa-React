Ext.define('Abraxa.view.portcall.documents.DocumentsFolderMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'documents.folder.menu',
    minWidth: 180,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Members',
            iconCls: 'md-icon-outlined md-icon-group',
            handler: function () {
                let vm = this.upVM(),
                    menu = Ext.create('Abraxa.view.portcall.MembersPreviewMenu', {
                        viewModel: {
                            parent: vm,
                        },
                    });
                menu.showBy(Ext.ComponentQuery.query('[cls~=folder_members_link]')[0]);
            },
        },
        {
            text: 'Rename',
            slug: 'portcallDocumentRename',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (me) {
                let store = this.upVM().get('folders'),
                    record = this.upVM().get('record'),
                    name = record.get('name');

                Ext.create('Ext.Dialog', {
                    closable: true,
                    viewModel: {
                        parent: me.upVM(),
                    },
                    title: 'Rename folder',
                    items: [
                        {
                            xtype: 'textfield',
                            labelAlign: 'top',
                            label: 'Name',
                            ui: '',
                            placeholder: 'Folder name',
                            clearable: false,
                            cls: 'a-field-icon icon-folder',
                            bind: {
                                value: '{record.name}',
                            },
                            listeners: {
                                painted: function () {
                                    this.focus();
                                },
                            },
                        },
                    ],
                    buttons: [
                        {
                            text: 'Cancel',
                            margin: '0 8 0 0',
                            handler: function () {
                                store.rejectChanges();
                                this.up('dialog').destroy();
                            },
                        },
                        {
                            text: 'Save',
                            ui: 'action',
                            handler: function () {
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated');
                                    },
                                });
                                this.up('dialog').destroy();
                            },
                        },
                    ],
                }).show();

                // Ext.Msg.prompt('Rename folder', 'Folder', function (btn, value) {
                //     if (btn == 'ok') {
                //         store.sync({
                //             success: function () {
                //                 Ext.ComponentQuery.query('portcall\\.document\\.sections')[0].select(record);
                //                 Ext.toast('Record updated');
                //             }
                //         });
                //     } else {
                //         this.destroy();
                //     }
                // }, null, false, null, {
                //     viewModel: me.upVM(),
                //     ui: 'hovered-underline',
                //     cls: 'a-field-icon icon-folder',
                //     placeholder: 'Enter folder name',
                //     value: name
                // });
            },
        },
        {
            text: 'Delete',
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            separator: true,
            // bind: {
            //     hidden: '{record.is_default}'
            // },
            handler: function (cmp) {
                let store = this.upVM().get('folders'),
                    record = this.upVM().get('record');

                Ext.Msg.show({
                    viewModel: {
                        parent: cmp.upVM(),
                    },
                    title: 'Delete',
                    bind: {
                        message:
                            "{record.members.count ? \"<div style='margin-top: -16px;' class='a-info-box a-warning-box'><i class='material-icons-outlined'>report_problem</i><div class='a-info-text'><b>Warning</b><br>This folder has active members!</div></div><br>Are you sure you want to delete this folder?<br>All files will be permanently deleted.\" : \"Are you sure you want to delete this folder?<br>All files will be permanently deleted.\"}",
                    },
                    // buttons: Ext.MessageBox.YESNO,
                    buttons: [
                        {
                            xtype: 'button',
                            itemId: 'no',
                            margin: '0 8 0 0',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            itemId: 'yes',
                            ui: 'decline alt',
                            text: 'Delete',
                        },
                    ],
                    fn: function (btn) {
                        if (btn == 'yes') {
                            store.remove(record);
                            store.sync({
                                success: function () {
                                    Ext.ComponentQuery.query('portcall\\.document\\.sections')[0].select(0);
                                    Ext.toast('Record updated');
                                },
                            });
                        }
                    },
                });

                // Ext.Msg.confirm('Delete', {
                //     html: 'Are you sure you want to delete this folder?'
                // }, function (btn, value) {
                //     if (btn == 'yes') {
                //         store.remove(record);
                //         store.sync({
                //             success: function () {
                //                 Ext.ComponentQuery.query('portcall\\.document\\.sections')[0].select(0);
                //                 Ext.toast('Record updated');
                //             }
                //         });
                //     }
                // });
            },
        },
    ],
});
