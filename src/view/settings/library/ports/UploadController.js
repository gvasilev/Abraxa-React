Ext.define('Abraxa.view.settings.library.ports.UploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ports.uploadcontroller',

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('port-files-dropped-container').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('port-files-dropped-container').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('port-files-dropped-container').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('portsServerGrid.selection').attachments(),
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;

            for (var i = 0; i < len; i++) {
                totalSize += files.item(i).size;
                ext = files.item(i).name.split('.').pop();
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
        let record = vm.get('portsServerGrid.selection');
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
            document.querySelector("input[type='file']").value = '';
            element.setValue(null);
            Ext.getCmp('uploadProgress').hide();
            return;
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'port-served/' + record.get('port_id') + '/files',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                record.load();
                Ext.getCmp('uploadProgress').hide();
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                let result = Ext.decode(response.responseText);
                Ext.Msg.warning('Unsupported file format', 'The file format you are trying to upload is not supported');
                me.clearFileUpload(element.id);
            },
        });
    },
    upload: function (files, el) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            store = vm.get('portsServerGrid.selection').attachments(),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('portsServerGrid.selection');
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'port-served/' + record.get('port_id') + '/files',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                record.load();
                let currentUser = view.upVM().get('currentUser');
                record.set('user', currentUser.getData());
                record.set('updated_at', new Date());
                Ext.getCmp('uploadProgress').hide();
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                let result = Ext.decode(response.responseText);
                Ext.Msg.warning('Unsupported file format', 'The file format you are trying to upload is not supported');
                me.clearFileUpload(el.id);
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

    deleteFiles: function (ids) {
        let view = this.getView(),
            vm = view.upVM(),
            record = vm.get('portsServerGrid.selection');
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments/' + record.get('id'),
            jsonData: {
                attachments: ids,
                port_id: record.get('id'),
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
                //resolve(true);
            },
            failure: function failure(response) {
                // resolve(false);
            },
        });
    },
});
