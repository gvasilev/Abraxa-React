Ext.define('Abraxa.view.portcall.documents.DocumentsEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'documents.edit.menu',
    ui: 'has-icons medium',
    minWidth: 180,
    items: [
        {
            text: 'Request approval',
            slug: 'portcallDocumentApproval',
            bind: {
                hidden: '{selectedSection.selection.is_default || nonEditable ? true : false}',
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-check-circle',
            handler: function () {
                Ext.create('Abraxa.view.approval.SendForApprovalDialog', {
                    viewModel: {
                        parent: this.upVM(),
                        data: {
                            selectedRecords: [this.up('menu').upVM().get('record')],
                            approvalMembers: this.upVM().get('sectionMembers'),
                        },
                    },
                }).show();
                mixpanel.track('Request approval button clicked (Disbursement)');
            },
        },
        {
            text: 'Move to',
            slug: 'portcallDocumentChangeFolder',
            bind: {
                cls: '{nonEditable ? "hidden" : ""}',
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-folder',
            handler: function (me) {
                let vm = me.upVM(),
                    record = this.up('menu').upVM().get('record'),
                    file = this.up('menu').upVM().get('record'),
                    store = this.up('menu').upVM().get('selectedSection.selection.documents'),
                    folders = this.up('menu').upVM().get('folders'),
                    approvals = record.approvals(),
                    approval_records = approvals.getRange(),
                    folder_file = record.getFolderFile();

                if (approval_records.length) {
                    Ext.Msg.confirm(
                        'Confirmation',
                        'Are you sure you want to move the document to another folder?<br><br>The document has been submitted for approval.<br>Moving it will cancel the approval process.',
                        function (answer) {
                            if (answer == 'yes') {
                                Ext.create('Ext.Dialog', {
                                    closable: true,
                                    viewModel: {
                                        data: {
                                            record: record,
                                            file: file,
                                            folder_file: folder_file,
                                        },
                                    },
                                    title: 'Move to',
                                    items: [
                                        {
                                            xtype: 'selectfield',
                                            labelAlign: 'top',
                                            label: 'Folder',
                                            ui: '',
                                            cls: 'a-field-icon icon-folder non-editable',
                                            valueField: 'id',
                                            displayField: 'name',
                                            queryMode: 'local',
                                            reference: 'newFolder',
                                            store: folders,
                                            bind: {
                                                value: '{folder_file.document_folder_id}',
                                            },
                                        },
                                    ],
                                    buttons: [
                                        {
                                            text: 'Cancel',
                                            margin: '0 8 0 0',
                                            handler: function () {
                                                record.reject();
                                                this.up('dialog').destroy();
                                            },
                                        },
                                        {
                                            text: 'Save',
                                            ui: 'action',
                                            handler: function (cmp) {
                                                var me = this;
                                                folder_file.save({
                                                    success: function (rec, opt) {
                                                        Ext.toast('Document updated', 1500);
                                                        store.remove(folder_file);
                                                        let new_folder = folders.getById(
                                                            cmp
                                                                .up('dialog')
                                                                .getVM()
                                                                .get('newFolder.selection')
                                                                .get('id')
                                                        );
                                                        new_folder.documents().add(record);
                                                        vm.set('refreshFolderCount', new Date());
                                                        cmp.up('dialog').destroy();
                                                    },
                                                    failure: function (batch, operations) {
                                                        Ext.Msg.alert('Something went wrong', 'Could not update file.');
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                }).show();
                            }
                        },
                        this,
                        [
                            {
                                xtype: 'button',
                                itemId: 'no',
                                margin: '0 8 0 0',
                                text: 'No',
                            },
                            {
                                xtype: 'button',
                                itemId: 'yes',
                                ui: 'decline alt',
                                text: 'Yes',
                            },
                        ]
                    );
                } else {
                    Ext.create('Ext.Dialog', {
                        closable: true,
                        viewModel: {
                            data: {
                                record: record,
                                file: file,
                                folder_file: folder_file,
                            },
                        },
                        title: 'Move to',
                        items: [
                            {
                                xtype: 'selectfield',
                                labelAlign: 'top',
                                label: 'Folder',
                                ui: '',
                                cls: 'a-field-icon icon-folder non-editable',
                                valueField: 'id',
                                displayField: 'name',
                                queryMode: 'local',
                                store: folders,
                                reference: 'newFolder',
                                bind: {
                                    value: '{folder_file.document_folder_id}',
                                },
                            },
                        ],
                        buttons: [
                            {
                                text: 'Cancel',
                                margin: '0 8 0 0',
                                handler: function () {
                                    record.reject();
                                    this.up('dialog').destroy();
                                },
                            },
                            {
                                text: 'Save',
                                ui: 'action',
                                handler: function (cmp) {
                                    folder_file.save({
                                        success: function (rec, opt) {
                                            Ext.ComponentQuery.query('documents\\.list')[0].deselectAll();
                                            if (cmp.up('dialog').getVM().get('newFolder.selection').get('is_shared')) {
                                                store.remove(store.getById(folder_file.get('document_id')));
                                            } else {
                                                store.remove(folder_file);
                                            }
                                            let new_folder = folders.getById(
                                                cmp.up('dialog').getVM().get('newFolder.selection').get('id')
                                            );
                                            new_folder.documents().add(record);
                                            vm.set('refreshFolderCount', new Date());
                                            Ext.toast('Document updated', 1500);
                                            cmp.up('dialog').destroy();
                                        },
                                        failure: function (batch, operations) {
                                            Ext.Msg.alert('Something went wrong', 'Could not update file.');
                                        },
                                    });
                                },
                            },
                        ],
                    }).show();
                }

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
            text: 'Rename',
            slug: 'portcallDocumentRename',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (me) {
                let record = this.up('menu').upVM().get('record');

                Ext.create('Ext.Dialog', {
                    closable: true,
                    alwaysOnTop: 2,
                    viewModel: {
                        parent: me.upVM(),
                        data: {
                            selectedDocument: record,
                        },
                    },
                    title: 'Rename document',
                    items: [
                        {
                            xtype: 'textfield',
                            labelAlign: 'top',
                            label: 'Name',
                            ui: '',
                            placeholder: 'Document name',
                            clearable: false,
                            required: true,
                            cls: 'a-field-icon icon-file',
                            bind: {
                                value: '{selectedDocument.name}',
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
                                record.reject();
                                this.up('dialog').destroy();
                            },
                        },
                        {
                            text: 'Save',
                            ui: 'action',
                            handler: function () {
                                record.save({
                                    success: function () {
                                        Ext.toast('Record updated');
                                    },
                                });
                                this.up('dialog').destroy();
                            },
                        },
                    ],
                }).show();
            },
        },
        {
            text: 'Download',
            slug: 'portcallDocumentDownload',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-save-alt',
            handler: function () {
                var record = this.upVM().get('record'),
                    name = this.upVM().get('record').get('name'),
                    urlToSend = Env.ApiEndpoint + 'file/' + record.get('id') + '/download/' + name,
                    form = Ext.DomHelper.append(document.body, {
                        tag: 'form',
                        method: 'get',
                        standardSubmit: true,
                        action: urlToSend,
                    });
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            },
        },
        {
            text: 'Set status',
            iconCls: 'md-icon-outlined md-icon-add',
            hidden: true,
            slug: 'portcallDocumentStatus',
            bind: {
                hidden: '{record.status ? true : false}',
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let record = this.upVM().get('record'),
                    button = me.up('button'),
                    fileController = Ext.ComponentQuery.query('documents\\.main')[0].getController();

                fileController.setStatus('draft', record);
            },
        },
        {
            text: 'Remove status',
            iconCls: 'md-icon-outlined md-icon-close',
            hidden: true,
            slug: 'portcall',
            bind: {
                // hidden: '{record.status ? false : true}',
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let record = this.upVM().get('record'),
                    fileController = Ext.ComponentQuery.query('documents\\.main')[0].getController(),
                    approvals = record.approvals(),
                    approval_records = approvals.getRange();

                if (approval_records.length) {
                    Ext.Msg.confirm(
                        'Confirmation',
                        'Are you sure you want to remove the document status?<br><br>The document has been submitted for approval.<br>Removing its status will cancel the approval process.',
                        function (answer) {
                            if (answer == 'yes') {
                                approvals.remove(approval_records);
                                approvals.sync();
                                fileController.setStatus(null, record);
                            }
                        },
                        this,
                        [
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
                                text: 'Remove',
                            },
                        ]
                    );
                } else {
                    fileController.setStatus(null, record);
                }
            },
        },
        {
            text: 'Delete',
            slug: 'portcallDocumentDelete',
            bind: {
                permission: '{userPermissions}',
            },
            separator: true,
            ui: 'decline',
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (me) {
                var record = this.upVM().get('record'),
                    selection = this.upVM().get('selectedSection.selection');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you want to delete this document?<br>Uploaded files will be <b>permanently</b> deleted.',
                    function (answer) {
                        if (answer == 'yes') {
                            let store = Ext.ComponentQuery.query('documents\\.list')[0].getStore(),
                                folderfile = record.getFolderFile(),
                                folderStore = this.upVM().get('selectedSection.selection').documents(),
                                allDocuments = this.upVM().get('documents');

                            store.remove(record);

                            store.sync({
                                success: function (batch, opt) {
                                    const documentSections = Ext.ComponentQuery.query('[itemId=documentSections]');
                                    if (documentSections && documentSections.length) {
                                        Ext.ComponentQuery.query('[itemId=documentSections]')[0]
                                            .upVM()
                                            .set('refreshFolderCount', new Date());
                                    }

                                    // me.upVM().getParent().set('refreshFolderCount', new Date());
                                    Ext.toast('Document deleted', 1500);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Could not delete document.');
                                },
                            });
                        }
                    },
                    this,
                    [
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
                    ]
                );
            },
        },
    ],
});
