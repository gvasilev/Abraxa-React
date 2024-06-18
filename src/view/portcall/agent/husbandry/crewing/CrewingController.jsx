import './CreateEditCrewing';

Ext.define('Abraxa.view.portcall.husbandary.crewing.CrewingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.crewing-controller',

    onCreate: function (btn) {
        let view = this.getView(),
            me = this,
            object_record = view.upVM().get('object_record'),
            record = view.upVM().get('crewing'),
            crewings = view.upVM().get('crewings'),
            husbandry = view.upVM().get('husbandry'),
            services = view.upVM().get('crewing').services(),
            files = view.upVM().get('files'),
            editMode = view.upVM().get('editMode'),
            form = this.lookup('createVisitor');
        services.getProxy().setExtraParams({
            portcall_id: object_record.get('id'),
            crewing_id: record.get('id'),
        });
        if (form.validate()) {
            record.getProxy().setExtraParams({
                portcall_id: object_record.get('id'),
            });
            this.getView().down('form\\.error').hide();
            if (editMode) {
                files.needsSync = false;
                let newFiles = false;
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
                                        if (services.needsSync) {
                                            services.sync();
                                        }
                                        record.load();
                                        btn.toggle();
                                        Ext.toast('Record updated', 1000);
                                        view.destroy();
                                    },
                                });
                            } else {
                                //record not dirty check for delete files
                                if (idsForDelete.length == 0) {
                                    record.load();
                                    btn.toggle();
                                    Ext.toast('Record updated', 1000);
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
                    me.deleteFiles(idsForDelete);
                    if (record.dirty) {
                        record.save({
                            success: function (rec) {
                                if (services.needsSync) {
                                    services.sync();
                                }
                                record.load();
                                btn.toggle();
                                Ext.toast('Record updated', 1000);
                                view.destroy();
                            },
                        });
                    } else {
                        //record not dirty check for delete files
                        if (!newFiles) {
                            record.load();
                            btn.toggle();
                            Ext.toast('Record updated', 1000);
                            view.destroy();
                        } else {
                            record.load();
                            btn.toggle();
                            Ext.toast('Record updated', 1000);
                            view.destroy();
                        }
                    }
                }
                if (!newFiles && idsForDelete.length == 0) {
                    if (record.dirty) {
                        record.save({
                            success: function (rec) {
                                if (services.needsSync) {
                                    services.sync();
                                }
                                Ext.toast('Record updated', 1000);
                                btn.toggle();
                                view.destroy();
                            },
                        });
                    } else {
                        btn.toggle();
                        view.destroy();
                    }
                }
                if (!newFiles && idsForDelete.length == 0 && !record.dirty && services.needsSync) {
                    services.sync({
                        success: function (rec) {
                            Ext.toast('Record updated', 1000);
                            btn.toggle();
                            view.destroy();
                        },
                    });
                }
            } else {
                record.save({
                    success: function (rec) {
                        if (files.getCount() > 0) {
                            me.upload(files, record).then(function (result) {
                                if (result) {
                                    view.close();
                                    record.load({
                                        success: function () {
                                            crewings.add(record);
                                            mixpanel.track('Visitor - added');
                                            Ext.toast('Record created', 1000);
                                            btn.toggle();
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
                                    crewings.add(record);
                                    Ext.toast('Record created', 1000);
                                    btn.toggle();
                                    view.destroy();
                                },
                            });
                        }
                        mixpanel.track('Crew/Visitor created');
                    },
                    failure: function (batch) {
                        Ext.Msg.alert('Something went wrong', 'Something went wrong');
                    },
                });
            }
        } else {
            btn.toggle();
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },
    create: function () {
        mixpanel.track('Visitor button');
        this.crewingDialog();
    },

    crewingDialog: function (editMode = false, model = null) {
        let view = this.getView(),
            record = null,
            stores = null;

        if (editMode) {
            record = model;
            let fileStore = model.attachments();
            fileStore.getProxy().setExtraParams({
                supply_id: model.get('id'),
                portcall_id: model.get('portcall_id'),
            });
            stores = {
                files: fileStore,
                servicePerCrewing: {
                    source: '{expenses}',
                    filters: '{servicePerCrewingFilter}',
                },
            };
        } else {
            record = Ext.create('Abraxa.model.husbandry.Crewing', {});
            stores = {
                files: Ext.create('Ext.data.Store'),
                servicePerCrewing: Ext.create('Ext.data.Store'),
            };
        }
        let dialog = Ext.create('Abraxa.view.portcall.husbandry.crewing.CreateEditCrewing', {
            viewModel: {
                parent: view.upVM(),
                data: {
                    crewing: record,
                    editMode: editMode,
                    crewingAdvanced: false,
                },
                stores: stores,
                formulas: {
                    servicePerCrewingFilter: {
                        bind: {
                            bindTo: '{crewing.services}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store) {
                                let servicePerCrewing = this.get('servicePerCrewing');
                                if (servicePerCrewing) servicePerCrewing.clearFilter();
                                return function (rec) {
                                    let serviceRecord = store.findRecord(
                                        'da_crewing_and_visitors_service_types_id',
                                        rec.get('id'),
                                        0,
                                        false,
                                        false,
                                        true
                                    );
                                    if (serviceRecord) {
                                        return true;
                                    }
                                };
                            } else {
                                return function (item) {
                                    return true;
                                };
                            }
                        },
                    },
                    showFiles: {
                        bind: {
                            bindTo: '{files.count}',
                            deep: true,
                        },
                        get: function (count) {
                            if (count) {
                                return false;
                            }
                            return true;
                        },
                    },
                },
            },
        });
        setTimeout(() => {
            dialog.show();
        }, 500);
    },

    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        Ext.get('dropped-create-visitor').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-create-visitor').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (event.browserEvent) {
            Ext.get('dropped-create-visitor').removeCls('a-dropped');
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
        let object_record = this.getView().upVM().get('object_record');
        return new Ext.Promise(function (resolve, reject) {
            let me = this,
                fd = new FormData();
            fd.append('da_crewing_visitors_id', record.get('id'));
            fd.append('documentable_id', record.get('id'));
            fd.append('documentable_type', record.get('model_name'));
            fd.append('ownerable_id', object_record.get('id'));
            fd.append('ownerable_type', object_record.get('model_name'));
            Ext.Array.each(files.getData().items, function (value, index) {
                if (!value.get('document_id')) {
                    fd.append('files[]', value.get('document').file);
                }
            });
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'crewing_files',
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

    deleteFiles: function (ids) {
        let object_record = Ext.ComponentQuery.query(Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main')[0]
            .upVM()
            .get('object_record');
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments/' + object_record.get('id'),
            jsonData: {
                attachments: ids,
            },
            method: 'DELETE',
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                //resolve(true);
            },
            failure: function failure(response) {
                // resolve(false);
            },
        });
    },
    assignService: function () {
        let view = this.getView(),
            vm = view.getVM(),
            form = view.down('formpanel'),
            assingFromCreate = vm.get('assingFromCreate'),
            assingFromEdit = vm.get('assingFromEdit'),
            allServices = form.query('checkbox'),
            atLeastOneCheck = false,
            servicePerCrewing = vm.get('servicePerCrewing'),
            crewing = vm.get('crewing'),
            checkedServices = [],
            checkedRecords = [],
            crewingStore = vm.get('crewings');
        Ext.Array.each(allServices, function (value, index) {
            if (value.getChecked()) {
                atLeastOneCheck = true;
                checkedServices.push(value.getRecord().getData());
                if (assingFromEdit) {
                    let serviceRecord = servicePerCrewing.findRecord(
                        'id',
                        value.getRecord().get('id'),
                        0,
                        false,
                        false,
                        true
                    );
                    if (!serviceRecord) {
                        let cloneRecord = value.getRecord().clone(null),
                            recordData = cloneRecord.getData();
                        delete recordData['id'];
                        let newServiceRecord = new Abraxa.model.portcall.Service(Object.assign({}, recordData));
                        newServiceRecord.set('da_crewing_and_visitors_service_types_id', value.getRecord().get('id'));
                        checkedRecords.push(newServiceRecord);
                    }
                } else if (assingFromCreate) {
                    let cloneRecord = value.getRecord().clone(null),
                        recordData = cloneRecord.getData();
                    delete recordData['id'];
                    let newServiceRecord = new Abraxa.model.portcall.Service(Object.assign({}, recordData));
                    newServiceRecord.set('da_crewing_and_visitors_service_types_id', value.getRecord().get('id'));
                    checkedRecords.push(newServiceRecord);
                }
            }
        });
        if (!atLeastOneCheck) {
            this.getView().down('form\\.error').setHtml('Please check at least one service').show().addCls('error');
            return false;
        }
        if (form.validate()) {
            this.getView().down('form\\.error').setHtml('Please fill all required fields').hide();
            if (assingFromCreate) {
                servicePerCrewing.removeAll(true);
                crewing.services().removeAll(true);
                servicePerCrewing.add(checkedRecords);
                crewing.services().add(checkedRecords);
                view.destroy();
            } else if (assingFromEdit) {
                crewing.services().add(checkedRecords);
                view.destroy();
            } else {
                let data = {
                        crewings: {},
                        services: {},
                    },
                    appointmentId = vm.get('appointmentId'),
                    grid = vm.get('grid');

                data.services = checkedServices;
                data.crewings = vm.get('selectedIds');
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'portcall/' + appointmentId + '/crewings/services_assign',
                    jsonData: data,
                    method: 'POST',
                    success: function (response) {
                        if (response.status === 200) {
                            if (vm.get('selectedIds').length > 1) {
                                crewingStore.reload();
                            }
                            if (vm.get('selectedIds').length == 1) {
                                let id = vm.get('selectedIds')[0],
                                    record = crewingStore.getById(id);
                                record.getProxy().setExtraParams({
                                    portcall_id: crewing.get('portcall_id'),
                                });
                                record.load();
                            }
                            view.destroy();
                            Ext.toast('Record updated', 1000);
                            mixpanel.track('Assigned a service');
                        }
                    },
                    failure: function (record, operation) {
                        Ext.Msg.alert('Warning', 'Could not assign services!');
                    },
                });
            }
        } else {
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },
});
