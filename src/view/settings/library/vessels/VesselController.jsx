Ext.define('Abraxa.view.settings.library.vessels.VesselController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.vessels.vesselcontroller',

    onCreate: function (btn) {
        let form = this.lookup('vesselForm'),
            view = this.getView(),
            me = this,
            record = view.upVM().get('vessel'),
            vessels = view.upVM().get('vessels'),
            file = view.upVM().get('file'),
            isDefault = view.upVM().get('isDefault'),
            currentUserType = view.upVM().get('currentUserType'),
            editMode = view.upVM().get('editMode');
        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            record.save({
                success: function (rec) {
                    if (editMode) {
                        Ext.toast('Record updated', 1000);
                        if (vessels) {
                            vessels.load({
                                callback: function (records, operation, success) {
                                    // // the operation object
                                    // // contains all of the details of the load operation

                                    if (isDefault) {
                                        Ext.each(records, function (model) {
                                            if (model.get('id') == rec.get('id')) {
                                                let grid = Ext.ComponentQuery.query(
                                                    'settings\\.library\\.vessels\\.grid'
                                                )[0];
                                                if (grid.getSelection()) {
                                                    grid.select(model);
                                                }
                                            }
                                        });
                                    }
                                },
                            });
                        }
                        btn.toggle();
                        view.destroy();
                    } else {
                        if (file) {
                            me.upload(file, record).then(function (result) {
                                if (result) {
                                    Ext.toast('Record created', 1000);
                                    if (vessels) {
                                        vessels.load({
                                            callback: function (records, operation, success) {
                                                // // the operation object
                                                // // contains all of the details of the load operation

                                                if (isDefault) {
                                                    Ext.each(records, function (model) {
                                                        if (model.get('id') == rec.get('id')) {
                                                            let grid = Ext.ComponentQuery.query(
                                                                'settings\\.library\\.vessels\\.grid'
                                                            )[0];
                                                            if (grid.getSelection()) {
                                                                grid.select(model);
                                                            }
                                                        }
                                                    });
                                                }
                                            },
                                        });
                                    }
                                    btn.toggle();
                                    view.destroy();
                                } else {
                                    Ext.Msg.alert(
                                        'Unsupported file format',
                                        'The file format you are trying to upload is not supported'
                                    );
                                }
                            });
                        } else {
                            Ext.toast('Record created', 1000);
                            if (vessels) {
                                vessels.load({
                                    callback: function (records, operation, success) {
                                        // // the operation object
                                        // // contains all of the details of the load operation

                                        if (isDefault) {
                                            Ext.each(records, function (model) {
                                                if (model.get('id') == rec.get('id')) {
                                                    let grid = Ext.ComponentQuery.query(
                                                        'settings\\.library\\.vessels\\.grid'
                                                    )[0];
                                                    if (grid.getSelection()) {
                                                        grid.select(model);
                                                    }
                                                }
                                            });
                                        }
                                    },
                                });
                            }
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

    upload: function (file, record) {
        return new Ext.Promise(function (resolve, reject) {
            let fd = new FormData();
            fd.append('files[]', file[0]);

            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'company_vessels/upload/' + record.get('id'),
                rawData: fd,
                headers: {
                    'Content-Type': null,
                },
                success: function (response) {
                    resolve(response);
                },
                failure: function failure(response) {
                    resolve(false);
                },
            });
        });
    },
    onFileChange: function (element, record) {
        var files = event.target.files,
            self = this, // the controller
            vessels = this.getView().upVM().get('vessels');
        if (!files || files.length == 0) return; // make sure we got something
        // Let's read content as file
        for (var i = 0; i < files.length; i++) {
            self.getView().upVM().set('file', element.getFiles());
            Ext.ComponentQuery.query('#imageHeadVessel')[0].setSrc(URL.createObjectURL(files[i]));
        }
        if (record && Ext.isNumber(parseInt(record.get('id'))) && record.$className == 'Abraxa.model.common.Vessel') {
            self.upload(element.getFiles(), record).then(function (result) {
                if (result) {
                    let res = Ext.decode(result.responseText);
                    record.set('vessel_img', res.url);
                    if (vessels) {
                        vessels.load({
                            callback: function (records, operation, success) {
                                // // the operation object
                                // // contains all of the details of the load operation
                                // let grid = Ext.ComponentQuery.query('settings\\.library\\.cargoes\\.grid')[0];
                            },
                        });
                    }
                    Ext.toast('Record updated', 1000);
                } else {
                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                }
            });
        }
    },

    onDragLeave: function (target, info) {
        if (!this.getView().upVM().get('vesselsGrid.selection').get('company_id')) {
            return;
        }
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        if (!this.getView().upVM().get('vesselsGrid.selection').get('company_id')) {
            return;
        }
        Ext.get('vessel-files-dropped-container').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        if (!this.getView().upVM().get('vesselsGrid.selection').get('company_id')) {
            return;
        }
        Ext.get('vessel-files-dropped-container').removeCls('a-dropped');
    },

    // CORE-2865 TODO: On drop doesn't upload files
    onDrop: function (event, info, eOpts) {
        if (!this.getView().upVM().get('vesselsGrid.selection').get('company_id')) {
            return;
        }
        if (event.browserEvent) {
            Ext.get('vessel-files-dropped-container').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('vesselsGrid.selection').attachments(),
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
            this.uploadCertificate(files, targetComponent);
        }
    },
    uploadFiles: function (element) {
        let me = this,
            view = me.getView(),
            vm = view.upVM(),
            files = element.getFiles(),
            totalSize = 0,
            fd = new FormData();

        let record = vm.get('vesselsGrid.selection');
        fd.append('vessel_id', record.get('id'));
        for (let i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
            totalSize += files.item(i).size;
        }

        if (totalSize > AbraxaConstants.files.maxFileSize) {
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
            return;
        }
        const uploadProgressCmp = Ext.getCmp('uploadProgress');
        uploadProgressCmp.show();
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'vessel/' + record.get('id') + '/files',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                record.load();
                const vesselsGrid = Ext.ComponentQuery.query('grid[reference=vesselsGrid]')[0];
                let gridStore = vesselsGrid ? vesselsGrid.getStore() : null;
                if (gridStore) gridStore.load();

                uploadProgressCmp.hide();
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                me.clearFileUpload(element.id);
                const showErrorMessage = () => {
                    Ext.Msg.warning(
                        'Something went wrong',
                        'There was an error while uploading the file(s). Please try again.'
                    );
                    uploadProgressCmp.removeListener('hide', showErrorMessage);
                };
                // This is a legit way to add and remove Ext.js listeners.
                // It is necessary for avoiding a bug when the progress CMP won't hide if the Ext.Msg.warning is opened right after that.
                uploadProgressCmp.addListener('hide', showErrorMessage);
                uploadProgressCmp.hide();
            },
        });
    },
    uploadCertificate: function (files, el) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('vesselsGrid.selection');
        fd.append('vessel_id', record.get('id'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'vessel/' + record.get('id') + '/files',
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
                Ext.Msg.alert('Something went wrong', result.message);
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
            record = vm.get('vesselsGrid.selection');
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments/' + record.get('id'),
            jsonData: {
                attachments: ids,
                vessel_id: record.get('id'),
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
