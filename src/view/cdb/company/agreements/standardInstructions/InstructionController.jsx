Ext.define('Abraxa.view.cdb.company.agreements.standardInstructions.InstructionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.instruction-controller',
    requires: ['Ext.drag.Target'],

    onCreate: function (btn) {
        let form = this.lookup('instructionForm'),
            view = this.getView(),
            me = this,
            record = view.upVM().get('instruction'),
            organization = view.upVM().get('organization'),
            instructions = view.upVM().get('instructions'),
            files = view.upVM().get('files'),
            currentUserType = view.upVM().get('currentUserType'),
            editMode = view.upVM().get('editMode');
        record.getProxy().setExtraParams({
            org_id: organization.get('org_id'),
        });
        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            record.save({
                success: function (rec) {
                    if (editMode) {
                        Ext.toast('Record updated', 1000);
                        record.load();
                        btn.toggle();
                        view.destroy();
                    } else {
                        if (files.getCount() > 0) {
                            me.upload(files, rec).then(function (result) {
                                if (result) {
                                    rec.load();
                                    instructions.add(rec);
                                    instructions.commitChanges();
                                    Ext.toast('Record created', 1000);
                                    btn.toggle();
                                    view.destroy();
                                } else {
                                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                                }
                            });
                        } else {
                            rec.load();
                            instructions.add(rec);
                            instructions.commitChanges();
                            Ext.toast('Record created', 1000);
                            btn.toggle();
                            view.destroy();
                        }
                    }
                },
                failure: function (batch, operation) {
                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
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
    onDragOverListItemRight: function (target, info) {
        Ext.get('dropped-right-instructions').addCls('a-dropped');
    },

    onDragLeaveListItemRight: function (target, info) {
        Ext.get('dropped-right-instructions').removeCls('a-dropped');
    },
    onDropRight: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-right-instructions').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = Ext.create('Ext.data.Store'),
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

            me.upload(fileStore, targetComponent.upVM().get('selectedInstruction')).then(function (result) {
                if (result) {
                    targetComponent.upVM().get('selectedInstruction').load();
                    Ext.toast('Record updated', 1000);
                } else {
                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                }
            });
        }
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
    upload: function (files, record) {
        return new Ext.Promise(function (resolve, reject) {
            let me = this,
                fd = new FormData(),
                object_record = Ext.ComponentQuery.query('[xtype=company]')[0].getVM().get('object_record');
            fd.append('ownerable_id', object_record.get('org_id'));
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
                    object_record.get('org_id') +
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
    uploadFiles: function (element, record) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            files = element.getFiles(),
            fd = new FormData(),
            object_record = Ext.ComponentQuery.query('[xtype=company]')[0].getVM().get('object_record');
        Ext.getCmp('uploadProgress').show();
        fd.append('ownerable_id', object_record.get('org_id'));
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
                Env.ApiEndpoint + 'cdb/' + object_record.get('org_id') + '/instructions/' + record.get('id') + '/files',
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
                let result = Ext.decode(response.responseText);
                Ext.Msg.alert('Something went wrong', result.message);
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
                record.set('updated_by_user', currentUser.getData());
                record.set('updated_at', new Date());
                record.load();
            },
            failure: function failure(response) {},
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
});
