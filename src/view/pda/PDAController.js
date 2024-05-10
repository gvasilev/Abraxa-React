Ext.define('Abraxa.view.pda.PDAConmtroller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pda-controller',
    init: function () {},

    listen: {
        controller: {
            '#pdacalculationcontroller': {
                parseOfferDataFields: 'applyFields',
                parseItemFields: 'applyItemFields',
            },
        },
        store: {
            '#offerDataFieldsStore': {
                refresh: 'onOfferDataFieldsLoad',
            },
        },
    },
    control: {
        'field[cls~=offer_data_field]:not(combobox)': {
            focusleave: 'updateOfferDataField',
        },
        'combobox[cls~=offer_data_field] boundlist': {
            select: 'updateOfferDataFieldCombobox',
        },
        'componentdataview[cls~=offer_data_complex] combobox boundlist': {
            select: 'updateOfferDataFieldComboboxComponentDataView',
        },
        'componentdataview[cls~=offer_data_complex] field:not(combobox)': {
            focusleave: 'updateOfferDataFieldComponentDataView',
        },
    },

    onCalculationServiceFieldComplete: function (editor) {
        const store = editor.up('grid').upVM().get('calculationServices');

        store.sync({
            success: function () {
                Ext.toast('Record updated', 1000);
            },
            failure: function (error) {
                store.reload();
            },
        });
    },

    updateOfferDataFieldComponentDataView: function (field) {
        let subField = field,
            record = subField.getParent().serviceField;

        if (subField.dirty) {
            let fieldID = subField.fieldID,
                data = JSON.parse(record.get('childrenRaw')),
                calculationServices = subField.upVM().get('calculationServices'),
                offerDataFields = subField.upVM().get('offerDataFieldsStore'),
                calculation = subField.upVM().get('calculation');

            Ext.Object.each(data, function (key, value) {
                value.items.forEach(function (item) {
                    if (item.fieldID === fieldID) {
                        item.value = subField.getValue();
                    }
                });
            });

            record.set('children', data);
            if (record.dirty) {
                record.save({
                    success: function () {
                        calculation.load({
                            callback: function () {
                                calculationServices.reload();
                                Ext.toast('Record updated');
                            },
                        });
                    },
                });
            }
        }
    },

    updateOfferDataFieldComboboxComponentDataView: function (field) {
        let subField = field.ownerCmp,
            record = subField.getParent().serviceField;

        if (subField.dirty) {
            let fieldID = subField.fieldID,
                data = JSON.parse(record.get('childrenRaw')),
                calculationServices = subField.upVM().get('calculationServices'),
                offerDataFields = this.getView().upVM().get('offerDataFieldsStore'),
                calculation = subField.upVM().get('calculation');

            Ext.Object.each(data, function (key, value) {
                value.items.forEach(function (item) {
                    if (item.fieldID === fieldID) {
                        item.value = subField.getValue();
                    }
                });
            });

            record.set('children', data);
            if (record.dirty) {
                record.save({
                    success: function () {
                        subField.blur();
                        calculation.load({
                            callback: function () {
                                calculationServices.reload();
                                Ext.toast('Record updated');
                            },
                        });
                    },
                });
            }
        }
    },

    updateOfferDataField: function (field) {
        let record = field.upVM().get('record'),
            fieldsStore = field.upVM().get('offerDataFieldsStore');
        if (record.dirty) {
            record.save({
                success: function (record, operation) {
                    field.blur();
                    // field.upVM().get('calculation').load();
                    field.upVM().get('calculationServices').reload();
                    Ext.toast('Record updated');
                    fieldsStore.load();
                },
            });
        }
    },
    updateOfferDataFieldCombobox: function (field) {
        let record = field.upVM().get('record'),
            fieldsStore = field.upVM().get('offerDataFieldsStore');

        if (record.dirty) {
            record.save({
                success: function (record, operation) {
                    field.ownerCmp.blur();
                    // field.upVM().get('calculation').load();
                    field.upVM().get('calculationServices').reload();
                    fieldsStore.load();
                    Ext.toast('Record updated');
                },
            });
        }
    },

    applyFields: function (fields) {
        this.getView().upVM().set('offerDataFields', fields);
    },

    applyItemFields: function (fields, vm) {
        vm.set('itemFields', fields);
    },

    onOfferDataFieldsLoad: function (store) {
        this.fireEvent(
            'buildOfferDataFields',
            {
                fields: store,
                calculation_id: this.getView().lookupViewModel().get('calculationId'),
            },
            this.getView().upVM()
        );
    },

    buildOfferDataFields: function (record, vm) {
        this.fireEvent(
            'buildOfferDataFields',
            {
                fields: record.dataFields(),
                calculation_id: record.get('id'),
            },
            vm
        );
    },

    buildItemFields: function (record, vm) {
        this.fireEvent('buildItemFields', {
            fields: record.serviceFields(),
            calculation_id: Ext.ComponentQuery.query('[xtype=pda]')[0].getVM().get('calculationId'),
            vm: vm,
            record: record,
        });
    },

    save: function (cmp) {
        let vm = cmp.upVM(),
            record = vm.get('pda_record'),
            updated = false,
            relations = {
                items: record.items(),
                cargoes: record.cargoes(),
                berths: record.berths(),
                shifting: record.shifting(),
            };

        if (record.dirty) {
            record.save();
            updated = true;
        }

        for (var relation in relations) {
            let store = relations[relation];
            if (store.needsSync) {
                store.getProxy().setExtraParams({
                    pda_id: record.get('id'),
                });
                store.sync();
                updated = true;
            }
        }

        if (updated) Ext.toast('Record updated', 1000);
    },
    sumPdaRender: function (value) {
        return Ext.util.Format.number(value, '0,000.00');
    },
    onDragLeave: function (target, info) {
        this.getView().element.removeCls('active');
    },

    onDragOverListItem: function (target, info) {
        if (this.getViewModel().get('pda.status') !== 'draft') return;
        Ext.get('pda-attachments-container').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        if (this.getViewModel().get('pda.status') !== 'draft') return;
        Ext.get('pda-attachments-container').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        if (this.getViewModel().get('pda.status') !== 'draft') return;

        if (event.browserEvent) {
            Ext.get('pda-attachments-container').removeCls('a-dropped');
            event.browserEvent.preventDefault();
            var dataTransferNative = event.browserEvent.dataTransfer,
                files = dataTransferNative.files,
                fileStore = this.getView().upVM().get('object_record').attachments(),
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
    upload: function (files, el) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            store = vm.get('object_record').attachments(),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('pda');
        fd.append('ownerable_id', record.get('id'));
        fd.append('attachmentable_id', record.get('id'));
        fd.append('attachmentable_type', record.get('model_name'));
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
            me.clearFileUpload(el.id);
            return;
        }
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                record.load();
                Ext.getCmp('uploadProgress').hide();
                Abraxa.utils.Functions.updateInquiry(vm.get('object_record'));
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                Ext.getCmp('uploadProgress').hide();
                let result = Ext.decode(response.responseText);
                Ext.Msg.warning('Unsupported file format', 'The file format you are trying to upload is not supported');
                me.clearFileUpload(el.id);
            },
        });
    },
    uploadFiles: function (element) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            totalSize = 0,
            files = element.getFiles(),
            fd = new FormData();
        Ext.getCmp('uploadProgress').show();
        let record = vm.get('pda');
        fd.append('ownerable_id', record.get('id'));
        fd.append('attachmentable_id', record.get('id'));
        fd.append('attachmentable_type', record.get('model_name'));
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files.item(i));
            let ext = files.item(i).name.split('.').pop();
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
            url: Env.ApiEndpoint + 'attachments',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let jsonData = JSON.parse(response.responseText);
                record.load();
                Ext.getCmp('uploadProgress').hide();
                Abraxa.utils.Functions.updateInquiry(vm.get('object_record'));
                Ext.toast('Record updated', 2000);
            },
            failure: function failure(response) {
                Ext.getCmp('uploadProgress').hide();
                let result = Ext.decode(response.responseText);
                Ext.Msg.warning('Unsupported file format', 'The file format you are trying to upload is not supported');
                me.clearFileUpload(element.id);
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
    deleteFiles: function (ids, record, object_record) {
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'attachments/' + record.get('id'),
            jsonData: {
                attachments: ids,
            },
            method: 'DELETE',
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                Abraxa.utils.Functions.updateInquiry(object_record);
            },
            failure: function failure(response) {
                // resolve(false);
            },
        });
    },
});
