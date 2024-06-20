import '../../model/portnews/PortNewsCreate';

Ext.define('Abraxa.view.portnews.CreateNewPostDialogController', {
    extend: 'Ext.app.ViewController',
    id: 'createNewPostDialogController',
    alias: 'controller.CreateNewPostDialogController',

    addFiles: function (me, newValue) {
        const vm = this.getView().getViewModel();
        if (newValue) {
            let files = me.getFiles(),
                len = files.length,
                ext,
                fileStore = me.upVM().get('files'),
                addedFiles = me.upVM().get('addedFiles'),
                totalSize = 0;

            const size = Abraxa.utils.Functions.size;

            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
            }
            if (totalSize > 10 * 1024 * 1024) {
                Ext.create('Ext.MessageBox', {
                    ui: 'warning',
                    title: 'Upload Cancelled',
                    innerCls: 'a-bgr-white',
                    message:
                        'Your file(s) payload size (' +
                        (totalSize / 1024 / 1024).toFixed(2) +
                        ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                        '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />',
                    width: 500,
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
                fileField = document.getElementById(me.id);
                // get the file upload parent element
                parentNod = fileField.parentNode;
                // create new element
                tmpForm = document.createElement('form');
                parentNod.replaceChild(tmpForm, fileField);
                tmpForm.appendChild(fileField);
                tmpForm.reset();
                parentNod.replaceChild(fileField, tmpForm);
                document.querySelector("input[type='file']").value = '';
                me.setValue(null);
                return;
            }
            for (let i = 0; i < len; i++) {
                ext = files.item(i).name.split('.').pop();
                let record = {
                    ext: ext,
                    firstName: files.item(i).name.split('.').shift(),
                    file: files.item(i),
                    size: size(totalSize),
                };

                fileStore.add(record);
                addedFiles.add(record);
            }
        }
        document.querySelector("input[type='file']").value = '';
        me.setValue(null);
    },

    onDelete: function (button) {
        Ext.Msg.confirm(
            'Delete',
            'Are you sure you want to delete this post?',
            function (answer) {
                if (answer == 'yes') {
                    const dialog = button.up('dialog');
                    const record = this.getView().getViewModel().get('record');
                    const store = Ext.getStore('portNewsStore');
                    store.remove(record);
                    store.sync({
                        success: function (err, msg) {
                            Ext.toast('Post was deleted .', 2000);
                            dialog.destroy();
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
                    separator: true,
                },
            ]
        );
    },

    onCancel: function (button) {
        Ext.Msg.confirm(
            'Confirmation',
            'Would you like to discard all changes?',
            function (answer) {
                if (answer == 'yes') {
                    button.upVM().get('files').removeAll();
                    const dialog = button.up('dialog');
                    if (dialog) {
                        dialog.close();
                    } else {
                        button.close();
                    }
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
                    enableToggle: true,
                    ui: 'action loading',
                    text: 'Discard',
                },
            ]
        );
    },

    onSubmit: function (button) {
        const controller = this.getView().getController();
        const vm = this.getView().getViewModel();

        const files = vm.get('files');
        const addedFiles = vm.get('addedFiles');

        let form = button.up('dialog').down('formpanel');

        const isEdit = vm.get('isEdit');

        const formValues = form.getValues();
        const validity_from = formValues.date[0];
        const validity_to = formValues.date[1];

        delete formValues.date;
        const currentUser = vm.get('currentUser');
        const company_id = currentUser.get('company').id;

        var fd = new FormData();

        const buttons = button.up().query('button');
        let record;
        if (isEdit) {
            record = Ext.create('Abraxa.model.portnews.PortNewsCreate', Object.assign({}, vm.get('record')));
            // record = vm.get('record');

            //New post
        } else {
            record = Ext.create('Abraxa.model.portnews.PortNewsCreate', {});
            Ext.Array.each(files.getData().items, function (value, index) {
                if (!value.get('document_id')) {
                    fd.append('files', value.get('file'));
                }
            });
        }
        if (form.validate()) {
            const dialog = button.up('dialog');

            record.set(
                Object.assign({}, formValues, {
                    validity_from: Ext.Date.format(new Date(validity_from), 'Y-m-d H:i:s'),
                    validity_to: Ext.Date.format(new Date(validity_to), 'Y-m-d H:i:s'),
                    attachments: fd,
                })
            );
            buttons[0].setDisabled(true);
            record.save({
                callback: function (record, operation, success) {
                    if (success) {
                        const store = Ext.getStore('portNewsStore');
                        if (isEdit) {
                            let storeRecord = store.findRecord('id', record.get('id'));

                            // DELETE FILES //ADD FILES
                            const arrayOfPromises = [];
                            const idsForDelete = vm.get('removedAttachmentsIds');
                            arrayOfPromises.push(
                                idsForDelete.length > 0
                                    ? controller.deleteFiles(idsForDelete, record)
                                    : Promise.resolve()
                            );
                            arrayOfPromises.push(
                                addedFiles.getCount() > 0 ? controller.upload(addedFiles, record) : Promise.resolve()
                            );
                            Promise.allSettled(arrayOfPromises).then((results) => {
                                let status;
                                let resultmain;
                                let message = 'Something went wrong.';
                                if (results.length) {
                                    results.forEach((result) => {
                                        if (result.status === 'rejected') {
                                            status = 'rejected';
                                            message = result.reason.statusText;
                                        }
                                        resultmain = result;
                                    });
                                }
                                if (status !== 'rejected') {
                                    const attachments = resultmain.value
                                        ? JSON.parse(resultmain.value.responseText).data
                                        : [];

                                    if (attachments.length > 0) {
                                        attachments.forEach((rec) => {
                                            const ext = rec.document.extension;
                                            const fileSize = rec.document.size;

                                            rec.firstName = rec.document.name;
                                            rec.ext = ext;
                                            rec.size = fileSize;
                                        });
                                    }

                                    idsForDelete.forEach((id) => {
                                        const index = storeRecord.attachments().find('id', id);
                                        storeRecord.attachments().removeAt(index);
                                    });

                                    storeRecord.attachments().add(attachments);
                                    storeRecord.set(record.getData());
                                    Ext.toast('Post was updated!', 3000);
                                    dialog.destroy();
                                } else {
                                    Ext.Msg.warning('File(s) not updated!', message);
                                    button.toggle();
                                }
                            });
                        } else {
                            if (files.getCount() > 0) {
                                controller
                                    .upload(files, record)
                                    .then(function (result, event) {
                                        if (result) {
                                            store.loadPage(1, {
                                                callback: function (records, operation, success) {
                                                    if (success) {
                                                        store.setData(records);
                                                        Ext.toast('A new post was created!', 3000);
                                                        dialog.destroy();
                                                    }
                                                },
                                            });
                                            // store.load({
                                            //     callback: function (records, operation, success) {
                                            //         if (success) {
                                            //             store.setData(records);
                                            //             Ext.toast('A new post was created!', 3000);
                                            //             dialog.destroy();
                                            //         }
                                            //     },
                                            // });
                                        }
                                    })
                                    .catch(function (error) {
                                        Ext.Msg.warning(
                                            'File(s) not uploaded',
                                            error.statusText || 'Something went wrong.'
                                        );
                                        button.toggle();
                                    });
                            } else {
                                store.loadPage(1, {
                                    callback: function (records, operation, success) {
                                        if (success) {
                                            store.setData(records);
                                            Ext.toast('A new post was created!', 3000);
                                            dialog.destroy();
                                        }
                                    },
                                });
                                Ext.toast('A new post was created!', 3000);
                                dialog.destroy();
                            }
                            Ext.fireEvent('updateNewPortNewsCount');
                        }
                        buttons[0].setDisabled(false);
                    } else {
                        button.toggle();
                        Ext.Msg.warning(
                            operation.error.response.statusText,
                            operation.error.response.responseJson.message
                        );
                        buttons[0].setDisabled(false);
                    }
                },
            });
        } else {
            button.toggle();
        }
    },

    upload: function (files, record) {
        return new Ext.Promise(function (resolve, reject) {
            let me = this;
            let fd = new FormData();
            fd.append('ownerable_id', record.get('id'));
            fd.append('attachmentable_id', record.get('id'));
            fd.append('attachmentable_type', record.get('model_name'));
            fd.append('model_type', record.get('model_name'));
            fd.append('model_id', record.get('id'));

            Ext.Array.each(files.getData().items, function (value, index) {
                if (value.get('file')) fd.append('files[]', value.get('file'));
            });

            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'port-news/' + record.get('id') + '/attachments',
                rawData: fd,
                headers: {
                    'Content-Type': null,
                },
                success: function (response) {
                    resolve(response);
                },
                failure: function failure(response) {
                    reject(response);
                },
            });
        });
    },

    deleteFiles: function (ids, record) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'port-news/' + record.get('id') + '/attachments',
                jsonData: {
                    attachment_ids: ids,
                },
                method: 'DELETE',
                success: function (res) {
                    resolve(res);
                },
                failure: function failure(res) {
                    reject(res);
                },
            });
        });
    },

    setUpCommodityServedCombo: function (combo) {
        const dialogVM = combo.up('dialog').getViewModel();
        if (dialogVM.get('isEdit')) combo.getStore().loadData(dialogVM.get('recordCopy.commodities'));
    },
});
