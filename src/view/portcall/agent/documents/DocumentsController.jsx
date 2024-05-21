Ext.define('Abraxa.view.portcall.documents.DocumentsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documents.controller',

    requires: ['Ext.drag.Target'],

    canEdit: function () {
        let permission = Ext.ComponentQuery.query(window.CurrentUser.get('company').type + 'portcall\\.main')[0]
            .upVM()
            .get('documentsEditable');
        return Object.keys(permission).length;
    },

    onDragLeave: function (target, info) {
        if (!this.canEdit()) return;
        this.getView().element.removeCls('active');
    },

    onDrop: function (event, info, eOpts) {
        if (!this.canEdit()) return;
        if (event.browserEvent) {
            Ext.get('dropped-container').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                len = files.length,
                targetComponent = Ext.get(event.browserEvent.target).component;

            for (var i = 0; i < len; i++) {
                files.item(i).split = null;
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
        if (!this.canEdit()) return;
        Ext.get('dropped-container').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        if (!this.canEdit()) return;
        Ext.get('dropped-container').removeCls('a-dropped');
    },

    upload: function (files, el) {
        let maxSize = this.checkFilesMaxSize(files);
        if (maxSize) {
            Ext.Msg.warning(
                'Upload Cancelled',
                'Your file(s) payload size (' +
                    (maxSize / 1024 / 1024).toFixed(2) +
                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />'
            );
            return;
        }
        let me = el,
            vm = me.upVM(),
            fd = new FormData(),
            object_record = vm.get('object_record'),
            section,
            store = object_record.documents(),
            folders = object_record.folders();

        section = vm.get('selectedSection.selection');

        let defaultFolder = folders.findRecord('is_default', 1);
        if (!section && defaultFolder) {
            section = defaultFolder;
        }
        let object_id = 3,
            object_meta_id = object_record.get('id');

        fd.append('folder', section.get('id'));
        fd.append('object_id', object_id);
        fd.append('object_meta_id', object_meta_id);
        fd.append('model_name', object_record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'documents/upload',
            rawData: fd,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                'Content-Type': null,
            },
            success: function (response) {
                let result = Ext.decode(response.responseText);
                Ext.each(result.data, function (doc) {
                    var model = Ext.create('Abraxa.model.document.Document', doc),
                        folder_file = new Abraxa.model.adocs.DocumentFolderFile(Object.assign({}, doc.folder_file));

                    model.setFolderFile(folder_file);
                    model.set('folder_id', section.get('id'));
                    section.documents().add(doc.folder_file);
                    store.add(model);
                });
                store.commitChanges();
                me.upVM().set('refreshFolderCount', new Date());
                Ext.get('dropped-container').removeCls('a-dropped');
                Ext.toast('Record updated', 2000);
                if (me.up('dialog')) me.up('dialog').destroy();
            },
            failure: function failure(response) {
                let result = Ext.decode(response.responseText);
                Ext.Msg.alert('Something went wrong', result.message);
                Ext.get('dropped-container').removeCls('a-dropped');
                //store.reload();
            },
        });
    },

    upload2: function (files, el) {
        let me = this,
            view = me.getView(),
            vm = view.upVM(),
            store = vm.get('folderFiles'),
            fd = new FormData(),
            record = vm.get('selectedSection.selection'),
            filesList = Ext.getCmp('documentList');

        Ext.getCmp('uploadProgress').show();

        fd.append('section', record.get('id'));
        fd.append('object_id', record.get('object_id'));
        fd.append('object_meta_id', record.get('object_meta_id'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'folders_files',
            rawData: fd,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                'Content-Type': null,
            },
            success: function (response) {
                let res = JSON.parse(response.responseText);

                Ext.each(res.data, function (file) {
                    var actualFile = file.document;
                    delete file.file;

                    var newFile = new Abraxa.model.adocs.DocumentFolderFile();
                    newFile.mergeData(file);
                    newFile.setDocument(Ext.create('Abraxa.model.adocs.Document', actualFile));
                    newFile.approvals().setData(file.approvals);
                    store.add(newFile);
                });
                Ext.get('dropped-container').removeCls('a-dropped');
                Ext.toast('Record updated', 2000);
                mixpanel.track('Documents uploaded file');
                Ext.getCmp('uploadProgress').hide();
            },
            failure: function failure(response) {
                let result = Ext.decode(response.responseText);
                Ext.Msg.alert('Something went wrong', result.message);
                Ext.get('dropped-container').removeCls('a-dropped');
                //store.reload();
            },
        });
    },

    checkFilesMaxSize: function (files) {
        let totalSize = 0;
        for (var i = 0; i < files.length; i++) {
            totalSize += files.item(i).size;
        }

        if (totalSize > 10 * 1024 * 1024) {
            return totalSize;
        }
        return 0;
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

    setStatus(status, file) {
        file.set('status', status);
        file.getProxy().setExtraParams({
            folder_id: file.get('document_folder_id'),
            object_id: file.getDocument().get('object_id'),
            object_meta_id: file.getDocument().get('object_meta_id'),
        });
        file.save({
            success: function (batch, opt) {
                Ext.toast('Record updated');
            },
            failure: function (batch, operations) {
                Ext.Msg.alert('Something went wrong', 'Could not update file.');
            },
        });
    },

    registerDragZone: function () {
        var me = this,
            documentsView = Ext.getCmp('documentList'),
            touchEvents = Ext.supports.Touch && Ext.supports.TouchEvents;
        me.dragZone = Ext.create('Ext.plugin.dd.DragZone', {
            element: documentsView.bodyElement,
            handle: '.a-document-row',
            view: documentsView,
            $configStrict: false,
            activateOnLongPress: touchEvents ? true : false,
            proxy: {
                cls: 'document-drag-proxy-el',
            },

            getDragText: function (info) {
                var selector = '.a-document-row',
                    record = Ext.fly(info.eventTarget).up(selector).component.getRecord(),
                    selectedFiles = Ext.fly(info.eventTarget).up(selector).component.upVM().get('selectedFiles'),
                    multiple = '',
                    cls = '';

                if (selectedFiles) {
                    let recordExists = selectedFiles.findIndex(function (file) {
                        return file.upVM().get('record').get('id') == record.get('id');
                    });

                    multiple = '<div class="count">' + (selectedFiles.length + (recordExists != -1 ? 0 : 1)) + '</div>';
                    cls = 'multiple';

                    if (selectedFiles.length == 1 && recordExists > -1) {
                        multiple = '';
                        cls = '';
                    }
                }

                return (
                    '<div class="draggable_file">' +
                    multiple +
                    '<span class="file-icon-new file-icon-lg-new draggable_document_icon ' +
                    cls +
                    '" data-type="' +
                    (record.get('system_extension') ? record.get('system_extension') : record.get('extension')) +
                    '"></span><div class="draggable_document_name"><span class="draggable_document_text">' +
                    record.get('name') +
                    '</span></div></div>'
                );
            },

            getDragData: function (e) {
                return {
                    fileData: this.view.mapToRecord(e),
                    selectedFiles: this.view.upVM().get('selectedFiles'),
                };
            },
        });
    },

    registerDropZone: function () {
        var me = this,
            currentController = this,
            view = me.getView(),
            sectionsView = Ext.ComponentQuery.query(window.CurrentUser.get('company').type + 'portcall\\.main')[0];

        me.dropZone = Ext.create('Ext.plugin.dd.DropZone', {
            element: sectionsView.bodyElement,
            view: sectionsView,
            $configStrict: false,
            prepareNameString: me.prepareNameString,

            onDragMove: function (info) {
                if (!currentController.canEdit()) return;
                var me = this,
                    ddManager = Ext.dd.Manager,
                    targetEl = ddManager.getTargetEl(info),
                    rowBody = Ext.fly(targetEl).up('.a-folder-item'),
                    isRowBody = rowBody ? rowBody.component.hasCls('a-folder-item') : false,
                    folder,
                    folder_id,
                    document_folder_id;

                me.toggleDropMarker(info, false);

                if (!isRowBody) {
                    return;
                }

                folder = rowBody.component.getRecord();
                folder_id = folder.get('id');
                document_folder_id = info.data.dragData.fileData.get('document_folder_id');

                if (folder && folder_id == document_folder_id) {
                    return;
                }

                me.ddEl = rowBody;
                me.toggleDropMarker(info, true);
            },

            onDrop: function (info) {
                if (!currentController.canEdit()) return;
                var me = this,
                    folder,
                    folder_id,
                    old_folder_id,
                    document_folder_id,
                    document,
                    file,
                    store,
                    folders,
                    component,
                    selectedFiles;

                if (!me.ddEl) {
                    return;
                }

                component = me.ddEl.component;
                folder = component.getRecord();
                folder_id = folder.get('id');
                document_folder_id = info.data.dragData.fileData.getFolderFile().get('document_folder_id');
                document = info.data.dragData.fileData;
                file = document.getFolderFile();
                selectedFiles = info.data.dragData.selectedFiles;
                store = folder.documents();
                folders = component.upVM().get('folders');
                old_folder_id = file ? file.get('document_folder_id') : null;

                if (folder && folder_id == document_folder_id) {
                    return;
                }

                if (selectedFiles) {
                    let approvalsCount;

                    Ext.each(selectedFiles, function (file) {
                        var record = file.upVM().get('record');
                        if (!approvalsCount) approvalsCount = record.approvals().count();

                        old_folder_id = record.getFolderFile().get('document_folder_id');
                    });

                    if (approvalsCount) {
                        Ext.Msg.confirm(
                            'Confirmation',
                            'Are you sure you want to move the document/s to another folder?<br><br>The document/s have been submitted for approval.<br>Proceeding will cancel the approval process.',
                            function (answer) {
                                if (answer == 'yes') {
                                    Ext.each(selectedFiles, function (selection) {
                                        selection.setChecked(false);
                                        let document = selection.upVM().get('record'),
                                            file = document.getFolderFile();

                                        let old_folder = folders.getById(old_folder_id),
                                            new_folder = folders.getById(folder_id);

                                        file.set('document_folder_id', folder_id);

                                        if (document.approvals().count()) document.set('status', 'draft');

                                        file.save({
                                            success: function (record, opt) {
                                                old_folder.documents().remove(file);
                                                new_folder.documents().add(record.data);
                                                component.upVM().set('refreshFolderCount', new Date());
                                                document.set('folder_id', old_folder.get('id'));
                                            },
                                            failure: function (batch, operations) {
                                                Ext.Msg.alert('Something went wrong', 'Could not update file.');
                                            },
                                        });
                                    });
                                    me.toggleDropMarker(info, false);
                                    Ext.toast('Record updated', 1500);
                                    component.upVM().set('selectedFiles', null);
                                } else {
                                    me.toggleDropMarker(info, false);
                                    return;
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
                        Ext.each(selectedFiles, function (selection) {
                            selection.setChecked(false);
                            let document = selection.upVM().get('record'),
                                file = document.getFolderFile();

                            let old_folder = folders.getById(old_folder_id),
                                new_folder = folders.getById(folder_id);

                            file.set('document_folder_id', folder_id);

                            if (document.approvals().count()) document.set('status', 'draft');

                            file.save({
                                success: function (record, opt) {
                                    old_folder.documents().remove(file);
                                    new_folder.documents().add(record.data);
                                    component.upVM().set('refreshFolderCount', new Date());
                                    document.set('folder_id', old_folder.get('id'));
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Could not update file.');
                                },
                            });
                        });
                        me.toggleDropMarker(info, false);
                        Ext.toast('Record updated', 1500);
                        component.upVM().set('selectedFiles', null);
                    }
                } else {
                    let approvalsCount = document.approvals().count();

                    if (approvalsCount) {
                        Ext.Msg.confirm(
                            'Confirmation',
                            'Are you sure you want to move the document/s to another folder?<br><br>The document/s have been submitted for approval.<br>Proceeding will cancel the approval process.',
                            function (answer) {
                                if (answer == 'yes') {
                                    let old_folder = folders.getById(old_folder_id),
                                        new_folder = folders.getById(folder_id);

                                    file.set('document_folder_id', folder_id);

                                    if (document.approvals().count()) document.set('status', 'draft');

                                    file.save({
                                        success: function (record, opt) {
                                            Ext.toast('Record updated', 1500);
                                            old_folder.documents().remove(file);
                                            new_folder.documents().add(record.data);
                                            component.upVM().set('refreshFolderCount', new Date());
                                            document.set('folder_id', new_folder.get('id'));
                                        },
                                        failure: function (batch, operations) {
                                            Ext.Msg.alert('Something went wrong', 'Could not update file.');
                                        },
                                    });
                                    me.toggleDropMarker(info, false);
                                } else {
                                    me.toggleDropMarker(info, false);
                                    return;
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
                        let old_folder = folders.getById(old_folder_id),
                            new_folder = folders.getById(folder_id);

                        file.set('document_folder_id', folder_id);

                        if (document.approvals().count()) document.set('status', 'draft');

                        file.save({
                            success: function (record, opt) {
                                Ext.toast('Record updated', 1500);
                                old_folder.documents().remove(file);
                                new_folder.documents().add(record.data);
                                component.upVM().set('refreshFolderCount', new Date());
                                document.set('folder_id', new_folder.get('id'));
                            },
                            failure: function (batch, operations) {
                                Ext.Msg.alert('Something went wrong', 'Could not update file.');
                            },
                        });
                        me.toggleDropMarker(info, false);
                    }
                }
            },

            toggleDropMarker: function (info, state) {
                var me = this,
                    ddManager;

                if (!me.ddEl) {
                    return;
                }

                ddManager = Ext.dd.Manager;
                ddManager.toggleTargetNodeCls(me.ddEl, 'folder-target-hover', state);
                ddManager.toggleProxyCls(info, me.validDropCls, state);

                if (!state) {
                    me.ddEl = null;
                }
            },
        });
    },

    prepareNameString: function (values) {
        var str = '',
            i = 0,
            ln = values.length;

        for (; i < ln; i++) {
            str += [
                '<div class="name-tag x-tooltiptool">',
                '<span>',
                values[i],
                '</span>',
                '<span index="',
                i,
                '" class="remove-icon x-icon-el x-font-icon x-tool-type-close"></span></div>',
            ].join('');
        }

        return str || 'Drop patients here';
    },

    onRemoveTapped: function (e, target) {
        var me = this,
            patientIndex = +target.getAttribute('index'),
            rowBody = Ext.Component.from(target),
            record = rowBody.getRecord(),
            patients = record.get('patients');

        if (patientIndex === -1) {
            return;
        }

        patients = Ext.Array.removeAt(patients, patientIndex, 0);
        rowBody.contentElement.update(me.prepareNameString(patients));

        if (!patients.length) {
            record.set('patients', null);
        }
    },

    destroy: function () {
        var me = this;

        me.dragZone = me.dropZone = Ext.destroy(me.dragZone, me.dragZone);
        me.callParent();
    },
});
