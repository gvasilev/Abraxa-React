Ext.define('Abraxa.view.mail.SendmailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sendmail-controller',

    init: function () {},

    sendMessage: function (element) {
        let view = this.getView(),
            form = view.down('sendmail-editor'),
            froalaField = view.down('[xtype=froalaeditorfield]'),
            vm = view.lookupViewModel(),
            companyVerified = vm.get('companyVerified'),
            mailAttachments = vm.get('attachments');
        mixpanel.track('Send button - reporting');
        if (form.validate()) {
            if (companyVerified) {
                view.down('container[cls=required_fields]').hide();
                view.mask({
                    xtype: 'loadmask',
                    message: 'Sending mail...',
                });
                let data = form.getValues(),
                    storeRecords = this.getView().down('list[cls=attachment-list]').getStore(),
                    attachments = [];

                storeRecords.each(function (record) {
                    let document = record.getData();
                    if (document) {
                        document.document = record.getData();
                    }
                    attachments.push(document);
                });
                if (vm.get('template_html')) {
                    data.mail_content = Ext.query('.email_body')[0].innerHTML
                        ? Ext.query('.email_body')[0].innerHTML
                        : '<div style="padding-left: 8px; padding-right: 8px;"><br><div style="pointer-events: none !important;"><br></div></div>';
                } else {
                    data.mail_content = data.template_html
                        ? data.template_html
                        : '<div style="padding-left: 8px; padding-right: 8px;"><br><div style="pointer-events: none !important;"><br></div></div>';
                }

                data.mailable_type = vm.get('object_record').get('model_name');
                data.mailable_id = vm.get('object_record').get('id');
                if (attachments.length > 0) {
                    data.attachments = attachments;
                }

                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'mail/send',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    jsonData: data,
                    success: function (response) {
                        Ext.toast('Mail sent', 1000);
                        vm.set('template_html', null);
                        vm.set('htmlTemplate', false);
                        vm.get('amails').reload();
                        const mailFrom = form.getValues().mail_from;
                        form.reset(true);
                        form.setValues({ mail_from: mailFrom });
                        mailAttachments.removeAll();
                        froalaField.setValue(
                            '<div style="padding-left: 8px; padding-right: 8px;"><br><div style="pointer-events: none !important;"><br></div></div>'
                        );
                        view.unmask();
                    },
                    failure: function (response) {
                        view.unmask();
                    },
                });
            } else {
                Ext.Msg.warning(
                    '<div class="hbox"><i class="material-icons c-grey my-8 mr-16">verified_user</i>Company verification</div>',
                    '<b>Your company is not verified</b>.<br>Please submit the verification form to us before you can<br> start inviting your counterparties and explore the system.'
                );
            }
        } else {
            this.getView().down('container[cls=required_fields]').show();
        }
    },

    uploadFiles: function (element) {
        var me = this,
            view = me.getView(),
            list = view.down('list'),
            vm = view.upVM(),
            files = element.getFiles(),
            totalSize = 0,
            fd = new FormData();
        list.setMasked('Uploading...');
        fd.append('object_id', 3);
        fd.append('object_meta_id', vm.get('object_meta_id'));
        for (var i = 0; i < files.length; i++) {
            totalSize += files.item(i).size;
            fd.append('files[]', files.item(i));
        }
        if (totalSize > 10 * 1024 * 1024) {
            Ext.Msg.warning(
                'Upload Cancelled',
                'Your file(s) payload size (' +
                    (totalSize / 1024 / 1024).toFixed(2) +
                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />'
            );
            return;
        }
        let urlToUpload = Env.ApiEndpoint + 'portcall/' + vm.get('object_meta_id') + '/mail-documents';
        if (vm.get('object_id') && vm.get('object_id') == 6) {
            urlToUpload = Env.ApiEndpoint + 'inquiry/' + vm.get('object_meta_id') + '/mail-documents';
        }
        Ext.Ajax.request({
            url: urlToUpload,
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let result = Ext.decode(response.responseText),
                    data = result.data;
                if (data.length > 0) {
                    Ext.Array.each(data, function (value) {
                        list.getStore().add(value);
                    });
                }
                list.setMasked(false);
                me.clearFileUpload(element.id);
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                me.clearFileUpload(element.id);
                list.setMasked(false);
            },
        });
    },
    clearFileUpload(id) {
        // get the file upload element
        fileField = document.getElementById(id);
        // get the file upload parent element
        parentNod = fileField.parentNode;
        // create new element
        tmpForm = document.createElement('form');
        parentNod.replaceChild(tmpForm, fileField);
        tmpForm.appendChild(fileField);
        tmpForm.reset();
        parentNod.replaceChild(fileField, tmpForm);
    },
    // uploadFiles: function (element) {
    //     var folders = element.lookupViewModel().get('folders');
    //     var filesStore = element.lookupViewModel().get('allFiles');
    //     var extraFilesFolder = folders.findRecord('name', 'Uploads');
    //     var files = element.getFiles();
    //     var fd = new FormData();
    //     for (var i = 0; i < files.length; i++) {
    //         fd.append('files[]', files.item(i));
    //     }

    //     fd.append('folder_id', extraFilesFolder.get('id'));
    //     fd.append('portcall_id', extraFilesFolder.get('portcall_id'));

    //     Ext.Ajax.request({
    //         url: Env.ApiEndpoint + 'documentation/files/' + extraFilesFolder.get('id'),
    //         rawData: fd,
    //         headers: {
    //             "Authorization": "Bearer " + localStorage.getItem('id_token'),
    //             'Content-Type': null
    //         },
    //         success: function (response) {
    //             folders.reload();
    //             filesStore.reload();
    //         }
    //     });
    // }
    previewFile: function (record, store = null) {
        let vm = this.getView().upVM(),
            selectedFile = record,
            attachments = vm.get('attachments');
        if (store) {
            attachments = store;
        }
        selectedFile.set('isLocked', true);
        selectedFile.set('hide_status', true);
        let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
            viewModel: {
                data: {
                    documentForSelect: selectedFile,
                    selectedDocuments: attachments,
                    hideLeftMenu: true,
                    needsPanel: false,
                    members: vm.get('members'),
                    object_record: vm.get('object_record'),
                    hideStatus: true,
                    previewOnly: true,
                },
                formulas: {
                    selectedDocument: {
                        bind: {
                            bindTo: '{documentsList.selection}',
                        },
                        get: function (record) {
                            return record;
                        },
                    },
                    loadDocument: {
                        bind: {
                            bindTo: '{selectedDocument.id}',
                            // deep: true
                        },
                        get: function (id) {
                            let selectedDocument = this.get('selectedDocument');
                            if (selectedDocument) {
                                const me = this;
                                if (selectedDocument.get('shouldGenerate')) {
                                    me.getView()
                                        .getController()
                                        .loadDocument(
                                            Env.ApiEndpoint +
                                                'pdf/generate/' +
                                                record.get('modelId') +
                                                '/' +
                                                record.get('modelType')
                                        );
                                } else {
                                    me.getView()
                                        .getController()
                                        .loadDocument(Env.ApiEndpoint + 'get_pdf/' + selectedDocument.get('id'));
                                }
                            }
                        },
                    },
                },
            },
        });
        dialog.show();
        if (Ext.getCmp('sendmail-files')) {
            Ext.getCmp('sendmail-files').hide();
        }
    },
});
