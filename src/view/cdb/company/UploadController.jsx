Ext.define('Abraxa.view.cdb.company.UploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.company.uploadcontroller',

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('cdb-dropped-container').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('cdb-dropped-container').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('cdb-dropped-container').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('documents'),
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;

            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
                ext = files.item(i).name.split('.').pop();
                // let record = {
                //     document: {
                //         extension: ext,
                //         original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
                //         file: files.item(i),
                //         size: files.item(i).size
                //     },
                // };
                // fileStore.add(record);
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
            this.upload(files, targetComponent);
        }
    },
    uploadFiles: function (element) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            files = element.getFiles(),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('object_record');
        fd.append('model_id', record.get('org_id'));
        fd.append('model_type', record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
            let ext = files.item(i).name.split('.').pop();
            totalSize += files.item(i).size;
            // let record = {
            //     document: {
            //         extension: ext,
            //         original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
            //         file: files.item(i),
            //         size: files.item(i).size
            //     },
            // };
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
            url: Env.ApiEndpoint + 'organizations/documents',
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
    upload: function (files, el) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            store = vm.get('documents'),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('object_record');
        fd.append('org_id', record.get('org_id'));
        fd.append('model_id', record.get('org_id'));
        fd.append('model_type', record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
            totalSize += files.item(i).size;
            // let ext = files.item(i).name.split('.').pop();
            // let record = {
            //     document: {
            //         extension: ext,
            //         original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
            //         file: files.item(i),
            //         size: files.item(i).size
            //     },
            // };
            // store.add(record);
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
            me.clearFileUpload(el.id);
            return;
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'organizations/documents',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                record.load();
                let currentUser = view.upVM().get('currentUser');
                record.set('updated_by_user', currentUser.getData());
                record.set('updated_at', new Date());
                Ext.getCmp('uploadProgress').hide();
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                Ext.getCmp('uploadProgress').hide();
                me.clearFileUpload(el.id);
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

    deleteFiles: function (ids) {
        let view = this.getView(),
            vm = view.upVM(),
            record = vm.get('object_record');

        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'organizations/' + record.get('org_id') + '/documents',
            jsonData: {
                documents: ids,
            },
            method: 'DELETE',
            // headers: {
            //     'Content-Type': null,
            // },
            success: function (response) {
                let currentUser = view.upVM().get('currentUser');
                record.set('updated_by_user', currentUser.getData());
                record.set('updated_at', new Date());
                record.load();
                //resolve(true);
            },
            failure: function failure(response) {
                // resolve(false);
            },
        });
    },
});
