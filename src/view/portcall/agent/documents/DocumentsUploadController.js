Ext.define('Abraxa.view.portcall.documents.DocumentsUploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documents.uploadcontroller',

    requires: ['Ext.drag.Target'],

    // init: function (view) {
    // 	view.addCls('drag-file-ct');

    // 	this.target = new Ext.drag.Target({
    // 		element: view.element,
    // 		listeners: {
    // 			scope: this,
    // 			dragenter: this.onDragEnter,
    // 			dragover: this.onDragOver,
    // 			dragleave: this.onDragLeave,
    // 			drop: this.onDrop
    // 		}
    // 	});
    // 	this.enableBubble('drop');
    // },

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-container').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component,
                totalSize = 0;

            for (var i = 0; i < len; i++) {
                files.item(i).split = null;
                totalSize += files.item(i).size;
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

            if (!len) return;
            this.upload(files, targetComponent);
        }
    },

    destroy: function (e, info) {
        Ext.undefer(this.timer);
        this.target = Ext.destroy(this.target);
        this.callParent();
    },

    onDragOverListItem: function (target, info) {
        Ext.get('dropped-container').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-container').removeCls('a-dropped');
    },

    upload: function (files, el) {
        let me = this,
            view = me.getView(),
            vm = view.upVM(),
            store = Ext.getCmp('documentList').getStore(),
            fd = new FormData(),
            record = vm.get('selectedSection.selection'),
            container = Ext.getCmp('dropped-container'),
            totalSize = 0;

        container.mask();

        fd.append('section', record.get('id'));
        fd.append('object_id', record.get('object_id'));
        fd.append('object_meta_id', record.get('object_meta_id'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
            totalSize += files.item(i).size;
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
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'folders_files',
            rawData: fd,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                'Content-Type': null,
            },
            success: function (response) {
                store.getProxy().setExtraParams({
                    object_id: record.get('object_id'),
                    object_meta_id: record.get('object_meta_id'),
                    folder_id: record.get('id'),
                });
                store.reload();
                Ext.get('dropped-container').removeCls('a-dropped');
                Ext.toast('Record updated', 2000);
                container.unMask();
            },
            failure: function failure(response) {
                let result = Ext.decode(response.responseText);
                Ext.Msg.alert('Something went wrong', result.message);
                Ext.get('dropped-container').removeCls('a-dropped');
                //store.reload();
            },
        });
    },
    // uploadFiles: function (element) {
    // 	let me = this,
    // 		view = me.getView(),
    // 		vm = view.upVM(),
    // 		files = element.getFiles(),

    // 		store = Ext.getCmp('documentList').getStore(),
    // 		fd = new FormData(),
    // 		record = vm.get("selectedSection.selection");
    // 	fd.append('section', record.get('id'));
    // 	fd.append('object_id', record.get('object_id'));
    // 	fd.append('object_meta_id', record.get('object_meta_id'));
    // 	for (var i = 0; i < files.length; i++) {
    // 		fd.append('files[]', files.item(i));
    // 	}
    // 	Ext.Ajax.request({
    // 		url: Env.ApiEndpoint + 'folders_files',
    // 		rawData: fd,
    // 		headers: {
    // 			"Authorization": "Bearer " + localStorage.getItem('id_token'),
    // 			'Content-Type': null
    // 		},
    // 		success: function (response) {
    // 			store.getProxy().setExtraParams({
    // 				object_id: record.get('object_id'),
    // 				object_meta_id: record.get('object_meta_id'),
    // 				folder_id: record.get('id')
    // 			});
    // 			store.reload();
    // 			Ext.toast('Record updated', 2000);
    // 		},
    // 		failure: function failure(response) {
    // 			let result = Ext.decode(response.responseText);
    // 			Ext.Msg.alert("Error!", result.message);
    // 			me.clearFileUpload(element.id);
    // 		}
    // 	});
    // },

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
