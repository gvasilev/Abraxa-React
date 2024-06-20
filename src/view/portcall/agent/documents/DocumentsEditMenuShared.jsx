Ext.define('Abraxa.view.portcall.documents.DocumentsEditMenuShared', {
    extend: 'Ext.menu.Menu',
    ui: 'has-icons medium',
    minWidth: 180,
    items: [
        {
            text: 'Rename',
            slug: 'portcallDocumentRename',
            bind: {
                permission: '{userPermissions}',
                hidden: '{record.document.company_id == currentUser.current_company_id ? false : true}',
            },
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (me) {
                let store = this.up('menu').upVM().get('selectedSection.selection.files'),
                    record = this.up('menu').upVM().get('record'),
                    name = record.get('name');
                record.getProxy().setExtraParams({
                    folder_id: record.get('document_folder_id'),
                    object_id: record.getDocument().get('object_id'),
                    object_meta_id: record.getDocument().get('object_meta_id'),
                });

                Ext.create('Ext.Dialog', {
                    closable: true,
                    viewModel: {
                        data: {
                            record: record,
                        },
                    },
                    title: 'Rename file',
                    items: [
                        {
                            xtype: 'textfield',
                            labelAlign: 'top',
                            label: 'File',
                            clearable: false,
                            ui: '',
                            cls: 'a-field-icon icon-file',
                            placeholder: 'File name',
                            bind: {
                                value: '{record.name}',
                                // inputMask: "*.{record.extension}"
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
                                    success: function (batch, opt) {
                                        Ext.toast('Document updated', 1500);
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
            text: 'Delete',
            separator: true,
            slug: 'portcallDocumentDelete',
            ui: 'decline',
            separator: true,
            bind: {
                permission: '{userPermissions}',
                hidden: '{record.document.company_id == currentUser.current_company_id ? false : true}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (me) {
                var record = this.upVM().get('record'),
                    selection = this.upVM().get('selectedSection.selection');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you want to delete this document?<br>Uploaded files will be <b>permanently</b> deleted.',
                    function (answer) {
                        if (answer == 'yes') {
                            let store = Ext.ComponentQuery.query('documents\\.list')[0].getStore();
                            store.getProxy().setExtraParams({
                                object_id: selection.get('object_id'),
                                object_meta_id: selection.get('object_meta_id'),
                                folder_id: selection.get('id'),
                            });
                            store.remove(record);

                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Document deleted', 1500);
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
