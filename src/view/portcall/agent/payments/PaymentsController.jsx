Ext.define('Abraxa.view.portcall.payment.PaymentsCreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.payments-controller',
    requires: ['Ext.drag.Target'],

    init: function () {},
    onCreate: function (type) {
        let form = this.lookup('createPayment'),
            view = this.getView(),
            me = this,
            record = view.upVM().get('payment'),
            payments = view.upVM().get('payments'),
            object_record = view.upVM().get('object_record'),
            files = view.upVM().get('files'),
            editMode = view.upVM().get('editMode');
        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            if (editMode) {
                files.needsSync = false;
                let newFiles = false;
                if (record.get('status') == 'draft') {
                    record.set('status', 'pending');
                }
                Ext.Array.each(files.getData().items, function (value, index) {
                    if (!value.get('document_id')) {
                        newFiles = true;
                    }
                });
                let idsForDelete = [];
                if (files.removed.length > 0) {
                    Ext.Array.each(files.removed, function (value, index) {
                        idsForDelete.push(value.get('id'));
                    });
                }
                if (newFiles) {
                    me.upload(files, record).then(function (result) {
                        if (result) {
                            if (record.dirty) {
                                record.save({
                                    success: function (rec) {
                                        record.load();
                                        Ext.toast('Record updated', 1000);
                                        if (type == 'send') {
                                            me.sendEmailDialog(object_record, record);
                                        }
                                        view.destroy();
                                    },
                                    failure: function failure(response, batch) {
                                        var msg = batch.error.response.responseJson.error;
                                        Ext.create('Ext.MessageBox', {
                                            ui: 'warning',
                                            title: 'Update Cancelled',
                                            innerCls: 'a-bgr-white',
                                            message: msg,
                                            width: 300,
                                            dataTitle: 'Warning',
                                            modal: true,
                                            draggable: false,
                                            bbar: {
                                                manageBorders: false,
                                                items: [
                                                    '->',
                                                    {
                                                        xtype: 'button',
                                                        ui: 'action',
                                                        text: 'Ok',
                                                        handler: function () {
                                                            this.up('dialog').destroy();
                                                        },
                                                    },
                                                ],
                                            },
                                        }).show();
                                    },
                                });
                            } else {
                                //record not dirty check for delete files
                                if (idsForDelete.length == 0) {
                                    record.load();
                                    Ext.toast('Record updated', 1000);
                                    if (type == 'send') {
                                        me.sendEmailDialog(object_record, record);
                                    }
                                    view.destroy();
                                }
                            }
                        } else {
                            Ext.Msg.warning(
                                'Unsupported file format',
                                'The file format you are trying to upload is not supported'
                            );
                        }
                    });
                }

                if (idsForDelete.length > 0) {
                    me.deleteFiles(idsForDelete, record);
                    if (record.dirty) {
                        record.save({
                            success: function (rec) {
                                record.load();
                                Ext.toast('Record updated', 1000);
                                if (type == 'send') {
                                    me.sendEmailDialog(object_record, record);
                                }
                                view.destroy();
                            },
                            failure: function failure(response, batch) {
                                var msg = batch.error.response.responseJson.error;
                                Ext.create('Ext.MessageBox', {
                                    ui: 'warning',
                                    title: 'Update Cancelled',
                                    innerCls: 'a-bgr-white',
                                    message: msg,
                                    width: 300,
                                    dataTitle: 'Warning',
                                    modal: true,
                                    draggable: false,
                                    bbar: {
                                        manageBorders: false,
                                        items: [
                                            '->',
                                            {
                                                xtype: 'button',
                                                ui: 'action',
                                                text: 'Ok',
                                                handler: function () {
                                                    this.up('dialog').destroy();
                                                },
                                            },
                                        ],
                                    },
                                }).show();
                            },
                        });
                    } else {
                        //record not dirty check for delete files
                        if (!newFiles) {
                            record.load();
                            Ext.toast('Record updated', 1000);
                            if (type == 'send') {
                                me.sendEmailDialog(object_record, record);
                            }
                            view.destroy();
                        } else {
                            record.load();
                            Ext.toast('Record updated', 1000);
                            if (type == 'send') {
                                me.sendEmailDialog(object_record, record);
                            }
                            view.destroy();
                        }
                    }
                }
                if (!newFiles && idsForDelete.length == 0) {
                    if (record.dirty) {
                        record.save({
                            success: function (rec) {
                                Ext.toast('Record updated', 1000);
                                if (type == 'send') {
                                    me.sendEmailDialog(object_record, record);
                                }
                                view.destroy();
                            },
                            failure: function failure(response, batch) {
                                var msg = batch.error.response.responseJson.error;
                                Ext.create('Ext.MessageBox', {
                                    ui: 'warning',
                                    title: 'Update Cancelled',
                                    innerCls: 'a-bgr-white',
                                    message: msg,
                                    width: 300,
                                    dataTitle: 'Warning',
                                    modal: true,
                                    draggable: false,
                                    bbar: {
                                        manageBorders: false,
                                        items: [
                                            '->',
                                            {
                                                xtype: 'button',
                                                ui: 'action',
                                                text: 'Ok',
                                                handler: function () {
                                                    this.up('dialog').destroy();
                                                },
                                            },
                                        ],
                                    },
                                }).show();
                            },
                        });
                    } else {
                        view.destroy();
                    }
                }
            } else {
                if (type == 'draft') {
                    record.set('status', 'draft');
                }
                if (record.get('status') === 'draft' && record.get('from_kind') === 'virtual_account') {
                    this.getView()
                        .down('form\\.error')
                        .setHtml('Payments from/to Virtual Accounts cannot be saved as Draft.')
                        .show()
                        .addCls('error');
                } else {
                    record.save({
                        success: function (rec) {
                            if (files.getCount() > 0) {
                                me.upload(files, record).then(function (result) {
                                    if (result) {
                                        view.close();
                                        record.load({
                                            success: function () {
                                                payments.add(record);
                                                payments.commitChanges();
                                                Ext.toast('Record created', 1000);
                                                mixpanel.track('Create payment - button');
                                                if (type == 'send') {
                                                    me.sendEmailDialog(object_record, record);
                                                }
                                                view.destroy();
                                            },
                                        });
                                    } else {
                                        Ext.Msg.warning(
                                            'Unsupported file format',
                                            'The file format you are trying to upload is not supported'
                                        );
                                    }
                                });
                            } else {
                                view.close();
                                record.load({
                                    success: function () {
                                        payments.add(record);
                                        payments.commitChanges();
                                        Ext.toast('Record created', 1000);
                                        mixpanel.track('Create payment - button');
                                        if (type == 'send') {
                                            me.sendEmailDialog(object_record, record);
                                        }
                                        view.destroy();
                                    },
                                });
                            }
                        },
                        failure: function failure(response, batch) {
                            var msg = 'Cannot update payment!';
                            let title = 'Update Cancelled';
                            const error = Abraxa.utils.Functions.getNestedProperty(
                                batch,
                                'batch.error.response.responseJson.error'
                            );
                            if (error) {
                                title = 'Insufficient funds';
                                msg = error;
                            }
                            Ext.create('Ext.MessageBox', {
                                ui: 'warning',
                                title: title,
                                innerCls: 'a-bgr-white',
                                message: msg,
                                width: 300,
                                dataTitle: 'Warning',
                                modal: true,
                                draggable: false,
                                bbar: {
                                    manageBorders: false,
                                    items: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            ui: 'action',
                                            text: 'Ok',
                                            handler: function () {
                                                this.up('dialog').destroy();
                                            },
                                        },
                                    ],
                                },
                            }).show();
                        },
                    });
                }
            }
        } else {
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('dropped-payment').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-payment').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-payment').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('files'),
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;
            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
                ext = files.item(i).name.split('.').pop();
                let record = {
                    document: {
                        extension: ext,
                        original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
                        file: files.item(i),
                        size: files.item(i).size,
                    },
                };
                fileStore.add(record);
            }
            fileStore.needsSync = false;
            if (totalSize > 10 * 1024 * 1024) {
                Ext.Msg.warning(
                    'Upload Cancelled',
                    'Your file(s) payload size (' +
                        (totalSize / 1024 / 1024).toFixed(2) +
                        ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                        '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />'
                );
                fileStore.remove(fileStore.last());
                return;
            }
            if (!len) return;
        }
    },
    upload: function (files, record) {
        return new Ext.Promise(function (resolve, reject) {
            let me = this,
                fd = new FormData();
            // fd.append('section', record.folders().getAt(0).get('id'));
            fd.append('object_id', 3);
            fd.append('object_meta_id', record.get('owner_id'));
            fd.append('payment_id', record.get('id'));
            Ext.Array.each(files.getData().items, function (value, index) {
                if (!value.get('document_id')) {
                    fd.append('files[]', value.get('document').file);
                }
            });
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'payments_files',
                rawData: fd,
                headers: {
                    'Content-Type': null,
                },
                success: function (response) {
                    resolve(true);
                },
                failure: function failure(response) {
                    resolve(false);
                },
            });
        });
    },
    deleteFiles: function (ids, record) {
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'payments_files',
            jsonData: {
                ids: ids,
            },
            method: 'DELETE',
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                Ext.Array.each(ids, function (value, index) {
                    record.attachments().remove(record.attachments().getById(value));
                });
                record.attachments().commitChanges();
                //resolve(true);
            },
            failure: function failure(response) {
                // resolve(false);
            },
        });
    },

    sendEmailDialog(object_record, payment) {
        let portCallVM = Ext.ComponentQuery.query(window.CurrentUser.get('company').type + 'portcall\\.main')[0].upVM(),
            view = Ext.ComponentQuery.query('[xtype=payments\\.create\\.payment]')[0],
            me = view,
            subject = null,
            attachments = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'memory',
                },
            }),
            companyVerified = portCallVM.get('currentCompany').get('verified');
        if (payment && payment.attachments() && payment.attachments().getRange().count) {
            Ext.Array.each(files, function (file) {
                attachments.add(file);
            });
        }
        if (object_record) {
            let vessel = null,
                file_id = object_record.get('file_id');

            if (object_record.getVoyage().get('vessel')) {
                vessel = object_record.getVoyage().get('vessel');
            }
            if (vessel) {
                if (vessel.general_type) {
                    subject = vessel.general_type.name + ' ' + vessel.name + ' ' + file_id;
                }
            }
        }
        let dialog = Ext.create('Abraxa.view.mail.Sendmail', {
            viewModel: {
                parent: portCallVM,
                data: {
                    object_record: portCallVM.get('object_record'),
                    object_id: 3,
                    object_meta_id: portCallVM.get('object_record').get('id'),
                    currentUser: portCallVM.get('currentUser'),
                    signature: portCallVM.get('currentUser').get('signature')
                        ? me.upVM().get('currentUser.signature.signature')
                        : '',
                    members: portCallVM.get('object_record.members'),
                    companyVerified: companyVerified,
                },
                stores: {
                    attachments: attachments,
                    mailTemplates: {
                        type: 'mail.templates',
                        autoLoad: true,
                        proxy: {
                            extraParams: {
                                object_id: 3,
                                object_meta_id: portCallVM.get('object_record').get('id'),
                            },
                        },
                        updateProxy: function (proxy) {
                            if (proxy) {
                                proxy.onAfter('extraparamschanged', this.load, this);
                            }
                        },
                    },
                    documentsForAmail: {
                        source: '{object_record.documents}',
                    },
                },
                formulas: {
                    emailSettings: {
                        bind: {
                            bindTo: '{currentUser}',
                            deep: true,
                        },
                        get: function (user) {
                            let emails = [];
                            if (user) {
                                if (user.get('current_office_id')) {
                                    let officeEmails = user.getOffice().emails();
                                    Ext.Array.each(officeEmails.getData().items, function (email) {
                                        let emailModel = email.get('email');
                                        emailModel.is_default = email.get('is_default');
                                        emails.push(emailModel);
                                    });
                                } else {
                                    let company = this.get('currentCompany');
                                    let officeEmails = company.get('email_settings');
                                    Ext.Array.each(officeEmails, function (email) {
                                        emails.push(email);
                                    });
                                }
                            }
                            return emails;
                        },
                    },
                },
            },
        });
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'payments/' + payment.get('id') + '/templates',
            params: {
                type: payment.get('kind'),
            },
            disableCaching: false,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            success: function (response) {
                var obj = Ext.decode(response.responseText);
                dialog.getVM().set('htmlTemplate', true);
                dialog.getVM().set('template_html', obj.html);
            },
            failure: function failure(response) {},
        });

        dialog.down('[name=attach_portcall_pdf]').setChecked(true);
        dialog.down('[itemId=emailSubject]').setValue(subject);
        dialog.showBy(view);
    },

    renderTransactions() {
        return 'Total';
    },
    renderRequestedPayments() {
        return 'Total';
    },
});
