Ext.define('Abraxa.view.portcall.appointment.InstructionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portcall-instruction-controller',
    requires: ['Ext.drag.Target'],

    canEdit: function () {
        return this.getView().upVM().get('nonEditable');
    },
    onCreate: function (btn) {
        let form = this.lookup('instructionForm'),
            view = this.getView(),
            me = this,
            record = view.upVM().get('instruction'),
            nomination = view.upVM().get('nomination'),
            instructions = view.upVM().get('instructions'),
            files = view.upVM().get('files'),
            editMode = view.upVM().get('editMode');
        record.getProxy().setExtraParams({
            org_id: nomination.get('appointing_party_id'),
        });
        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            Abraxa.getApplication().getController('AbraxaController').setInstructionTitleOrDescription(record);
            record.save({
                success: function (rec) {
                    if (editMode) {
                        Ext.toast('Record updated', 1000);
                        record.load();
                        btn.toggle();
                        view.destroy();
                    } else {
                        if (files.getCount() > 0) {
                            me.upload(files, rec, nomination).then(function (result) {
                                if (result) {
                                    rec.load();
                                    instructions.add(rec);
                                    instructions.commitChanges();
                                    Ext.toast('Record created', 1000);
                                    btn.toggle();
                                    view.destroy();
                                } else {
                                    Ext.Msg.warning(
                                        'Unsupported file format',
                                        'The file format you are trying to upload is not supported'
                                    );
                                }
                            });
                        } else {
                            instructions.add(rec);
                            instructions.commitChanges();
                            Ext.toast('Record created', 1000);
                            btn.toggle();
                            view.destroy();
                        }
                    }
                },
            });
        } else {
            btn.toggle();
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('dropped-create-instructions').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-create-instructions').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-create-instructions').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('files'),
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;

            let size = function (size) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (size == 0) return '0 Byte';
                var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
            };

            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
                ext = files.item(i).name.split('.').pop();
                let record = {
                    ext: ext,
                    firstName: files.item(i).name.split('.').shift(),
                    file: files.item(i),
                    size: size(totalSize),
                };
                fileStore.add(record);
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
                document.querySelector("input[type='file']").value = '';
                me.setValue(null);
                return;
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
                fileStore.remove(fileStore.last());
                return;
            }
            if (!len) return;
        }
    },
    onDragOverListItemRight: function (target, info) {
        if (this.canEdit()) return;
        Ext.get('dropped-portcall-right-instructions').addCls('a-dropped');
    },

    onDragLeaveListItemRight: function (target, info) {
        if (this.canEdit()) return;
        Ext.get('dropped-portcall-right-instructions').removeCls('a-dropped');
    },
    onDropRight: function (event, info, eOpts) {
        if (this.canEdit()) return;
        if (event.browserEvent) {
            Ext.get('dropped-portcall-right-instructions').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = Ext.create('Ext.data.Store'),
                nomination = this.getView().upVM().get('nomination'),
                len = files.length,
                me = this,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;
            let size = function (size) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (size == 0) return '0 Byte';
                var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
            };

            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
                ext = files.item(i).name.split('.').pop();
                let record = {
                    ext: ext,
                    firstName: files.item(i).name.split('.').shift(),
                    file: files.item(i),
                    size: size(totalSize),
                };
                fileStore.add(record);
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
                document.querySelector("input[type='file']").value = '';
                return;
            }
            if (!len) return;

            me.upload(fileStore, targetComponent.upVM().get('selectedInstruction'), nomination).then(function (result) {
                if (result) {
                    targetComponent.upVM().get('selectedInstruction').load();
                    Ext.toast('Record updated', 1000);
                } else {
                    Ext.Msg.warning(
                        'Unsupported file format',
                        'The file format you are trying to upload is not supported'
                    );
                }
            });
        }
    },
    upload: function (files, record, nomination) {
        return new Ext.Promise(function (resolve, reject) {
            let me = this,
                fd = new FormData(),
                object_record = Ext.ComponentQuery.query(
                    Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                )[0]
                    .upVM()
                    .get('object_record');
            fd.append('ownerable_id', object_record.get('id'));
            fd.append('ownerable_type', object_record.get('model_name'));
            fd.append('documentable_id', record.get('id'));
            fd.append('documentable_type', record.get('model_name'));

            Ext.Array.each(files.getData().items, function (value, index) {
                fd.append('files[]', value.get('file'));
            });
            Ext.Ajax.request({
                url:
                    Env.ApiEndpoint +
                    'cdb/' +
                    nomination.get('appointing_party_id') +
                    '/instructions/' +
                    record.get('id') +
                    '/files',
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
    uploadFiles: function (element, record, nomination) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            files = element.getFiles(),
            fd = new FormData(),
            object_record = Ext.ComponentQuery.query(
                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
            )[0]
                .upVM()
                .get('object_record');
        Ext.getCmp('uploadProgress').show();
        fd.append('ownerable_id', object_record.get('id'));
        fd.append('ownerable_type', object_record.get('model_name'));
        fd.append('documentable_id', record.get('id'));
        fd.append('documentable_type', record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
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
            me.clearFileUpload(element.id);
            Ext.getCmp('uploadProgress').hide();
            return;
        }
        Ext.Ajax.request({
            url:
                Env.ApiEndpoint +
                'cdb/' +
                nomination.get('appointing_party_id') +
                '/instructions/' +
                record.get('id') +
                '/files',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let jsonData = JSON.parse(response.responseText);
                record.load();
                Ext.getCmp('uploadProgress').hide();
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                Ext.getCmp('uploadProgress').hide();
                me.clearFileUpload(element.id);
            },
        });
    },
    deleteFiles: function (ids, instruction) {
        let view = this.getView(),
            vm = view.upVM(),
            record = vm.get('object_record');
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'instructions/documents',
            jsonData: {
                documents: ids,
                instruction_id: instruction.get('id'),
            },
            method: 'DELETE',
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let currentUser = view.upVM().get('currentUser');
                record.set('user', currentUser.getData());
                record.set('updated_at', new Date());
                record.load();
            },
        });
    },
    clearFileUpload(id) {
        // get the file upload element
        let fileField = document.getElementById(id),
            tmpForm = document.createElement('form'),
            parentNod = fileField.parentNode;

        parentNod.replaceChild(tmpForm, fileField);
        tmpForm.appendChild(fileField);
        tmpForm.reset();
        parentNod.replaceChild(fileField, tmpForm);
    },
});
