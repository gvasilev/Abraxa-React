Ext.define('Abraxa.view.portcall.husbandary.supplies.SuppliesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.supplies-controller',

    onCreate: function (btn) {
        let view = this.getView(),
            object_record = view.upVM().get('object_record'),
            record = view.upVM().get('record'),
            supplies = view.upVM().get('supplies'),
            editMode = view.upVM().get('editMode'),
            form = view.down('formpanel');
        if (form.validate()) {
            record.getProxy().setExtraParams({
                portcall_id: object_record.get('id'),
            });
            this.getView().down('form\\.error').hide();
            if (editMode) {
                if (record.dirty) {
                    record.save({
                        success: function (rec) {
                            Ext.toast('Record updated', 1000);
                            btn.toggle();
                            view.destroy();
                        },
                    });
                } else {
                    btn.toggle();
                    view.destroy();
                }
            } else {
                if (record.get('type') == 'cash to master') {
                    record.set('default_expense_item_name', 'Cash to master');
                }
                record.save({
                    success: function (rec) {
                        supplies.add(record);
                        Ext.toast('Record created', 1000);
                        btn.toggle();
                        mixpanel.track('Created a Service');
                        view.destroy();
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
        mixpanel.track('Service button');
        this.supplyDialog('services');
    },
    createSupply: function () {
        this.supplyDialog('supplies');
    },
    createDisposal: function () {
        this.supplyDialog('disposal');
    },
    createBunkers: function () {
        this.supplyDialog('bunkers');
    },
    createService: function () {
        this.supplyDialog('services');
    },

    supplyDialog: function (type = null, editMode = false, model = null) {
        let view = this.getView();
        if (editMode) {
            let fileStore = model.attachments();
            fileStore.getProxy().setExtraParams({
                supply_id: model.get('id'),
                portcall_id: model.get('portcall_id'),
            });
        } else {
            model = Ext.create('Abraxa.model.portcall.Expense', {
                type: type,
                status: 'new',
                paid: 0,
            });
        }
        let dialog = Ext.create('Abraxa.view.portcall.husbandry.supplies.CreateEditSupplies', {
            viewModel: {
                parent: view.upVM(),
                data: {
                    record: model,
                    editMode: editMode,
                    currencyRateStore: view.upVM().get('rates'),
                    disbItemStore: view.upVM().get('disbItemStore'),
                    accounts: view.upVM().get('accounts'),
                    orgs: view.upVM().get('orgs'),
                    places: view.upVM().get('places'),
                    object_record: view.upVM().get('object_record'),
                    supplies: view.upVM().get('supplies'),
                },
                // stores: stores,
                formulas: {
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
                    dialogTitle: {
                        bind: {
                            bindTo: '{record.type}',
                            deep: true,
                        },
                        get: function (type) {
                            if (type) {
                                let string = editMode ? 'Edit ' : 'Add ',
                                    icon = '<div class="a-badge a-badge-disposal"></i></div>';
                                switch (type) {
                                    case 'supplies':
                                        string += 'supply';
                                        icon =
                                            '<div class="a-badge a-badge-supplies"><i class="abraxa-icon-layers"></i></div>';
                                        break;
                                    case 'disposal':
                                        string += 'disposal';
                                        icon =
                                            '<div class="a-badge a-badge-disposal"><i class="abraxa-icon-recycle"></i></div>';
                                        break;
                                    case 'bunkers':
                                        string += 'bunkers';
                                        icon =
                                            '<div class="a-badge a-badge-bunkers"><i class="abraxa-icon-oil"></i></div>';
                                        break;
                                    case 'services':
                                        string += 'service';
                                        icon =
                                            '<div class="a-badge a-badge-services"><i class="md-icon-outlined md-icon-layers"></i></div>';
                                        break;
                                    default:
                                        break;
                                }
                                return (icon += string);
                            } else {
                                return '';
                            }
                        },
                    },
                    amountValue: {
                        bind: {
                            amount: '{record.amount}',
                            amount_xr: '{record.amount_xr}',
                        },
                        get: function (data) {
                            if (data.amount && data.amount_xr) {
                                let record = this.get('record');
                                record.set('amount_bce', data.amount * data.amount_xr);
                                return data.amount * data.amount_xr;
                            }
                        },
                    },
                    commissionValue: {
                        bind: {
                            commission: '{record.commission}',
                            commission_xr: '{record.commission_xr}',
                        },
                        get: function (data) {
                            if (data.commission && data.commission_xr) {
                                let record = this.get('record');
                                record.set('commission_bce', data.commission * data.commission_xr);
                                return data.commission * data.commission_xr;
                            }
                        },
                    },
                    chargesValue: {
                        bind: {
                            charges: '{record.final_da}',
                            final_da_xr: '{record.final_da_xr}',
                        },
                        get: function (data) {
                            if (data.charges && data.final_da_xr) {
                                let record = this.get('record');
                                record.set('final_da_bce', data.charges * data.final_da_xr);
                                return data.charges * data.final_da_xr;
                            }
                        },
                    },
                    suppliesIcon: {
                        bind: {
                            bindTo: '{record.type}',
                            deep: true,
                        },
                        get: function (type) {
                            if (type) {
                                let icon = '';
                                let cls = '';
                                switch (type) {
                                    case 'supplies':
                                        cls = 'a-logo-supplies';
                                        icon = 'abraxa-icon-layers';
                                        break;
                                    case 'disposal':
                                        cls = 'a-logo-disposal';
                                        icon = 'abraxa-icon-recycle';
                                        break;
                                    case 'bunkers':
                                        cls = 'a-logo-bunkers';
                                        icon = 'abraxa-icon-oil';
                                        break;
                                    case 'cash to master':
                                        cls = 'a-logo-ctm';
                                        icon = 'abraxa-icon-atm';
                                        break;

                                    default:
                                        cls = '';
                                        icon = '';
                                        break;
                                }
                                return {
                                    icon: icon,
                                    cls: cls,
                                };
                            }
                        },
                    },
                    currencyRateStore: {
                        bind: {
                            bindTo: '{currencyRates}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store) {
                                return store;
                            }
                        },
                    },
                    disbursementGrouping: {
                        bind: {
                            bindTo: '{accountsCombo.selection.disbursements}',
                            deep: true,
                        },
                        get: function (store) {
                            let result = [];
                            if (store && store.getCount()) {
                                result = Ext.Array.map(store.collect('group_id'), function (item, index) {
                                    return {
                                        id: index + 1,
                                        name: item,
                                    };
                                });
                            }
                            return result;
                        },
                    },
                },
            },
        });
        dialog.show();
    },

    upload: function (files, el) {
        var me = this,
            view = me.getView(),
            vm = view.upVM(),
            element = el,
            portcall_id = vm.get('object_record').get('id'),
            expence = vm.get('suppliesGrid.selection'),
            default_currency = vm.get('currentUser').getCompany().get('default_currency'),
            expense_id = expence.get('id'),
            account_id = expence.get('account_id'),
            disbursement_id = expence.get('disbursement_id') ? expence.get('disbursement_id') : 0,
            xhr = new XMLHttpRequest(),
            totalSize = 0,
            formdata = new FormData(),
            url = Env.ApiEndpoint + 'disbursement_uploadfiles';
        let allowedExtensions = ['application/pdf'];
        let errorFile = false;

        expence.getProxy().setExtraParams({
            portcall_id: portcall_id,
        });

        for (var i = 0; i < files.length; i++) {
            totalSize += files.item(i).size;
            if (!allowedExtensions.includes(files.item(i).type)) {
                errorFile = true;
            }
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
        if (errorFile) {
            Ext.Msg.error(
                '<span class="hbox"><i class="md-icon-outlined mr-8">info</i>Information</span>',
                'Only PDF format allowed!'
            );
            return false;
        }
        xhr.open('POST', url, true);

        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'));

        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
            }
        };

        xhr.onloadstart = function (e) {
            Ext.getCmp('uploadProgress').show();
        };

        xhr.onloadend = function (e) {
            Ext.getCmp('uploadProgress').hide();
        };

        xhr.onerror = function (e) {};

        xhr.onreadystatechange = function () {
            // Server Status 300 - Multiple Choices Avaible

            if (xhr.readyState == 4 && xhr.status == 300) {
                var data = JSON.parse(xhr.responseText);

                if (data.notallowed.length) {
                    Ext.Msg.alert(
                        'Unsupported type',
                        'Some of the files you are trying to upload are not supported.',
                        Ext.emptyFn
                    );
                }
                if (data.data.length) {
                    Ext.create({
                        xtype: 'split.files.dialog',
                        caller: me,
                        files: files,
                        mydata: data.data,
                        domEl: element,
                    }).show();
                }
            }

            // Server Status 200 - Succeful Upload

            if (xhr.readyState == 4 && xhr.status == 200) {
                if (element.xtype) {
                    //ext component
                    element.setValue(null);
                } else {
                    element.value = '';
                }
                Ext.toast('Record updated');
                Ext.getCmp('uploadProgress').hide();

                expence.set('exchange_rate', null);
                // expence.set('currency', null);
                expence.save();

                var data = JSON.parse(xhr.responseText);
                let store = vm.get('vouchers'),
                    service = vm.get('suppliesGrid.selection'),
                    orgs = vm.get('organizations'),
                    supplies = vm.get('supplies'),
                    currencyRateStore = vm.get('currencyRateStore'),
                    list = Ext.ComponentQuery.query('[cls~=vouchers_list]')[0];

                if (data && data.vouchers) {
                    let vouchers = data.vouchers,
                        first = null;
                    Ext.each(vouchers, function (value, index) {
                        let model = Ext.create('Abraxa.model.disbursement.Voucher', value),
                            document = new Abraxa.model.document.Document(Object.assign({}, value.document));
                        model.setDocument(document);
                        store.add(model);

                        service.vouchers().add(model);
                        if (index == 0) {
                            first = model;
                        }
                    });
                    service.vouchers().commitChanges();
                    if (first) {
                        Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                            viewModel: {
                                parent: vm,
                                data: {
                                    selectVoucher: first,
                                    account_id: service.get('account_id'),
                                    nonEditable: vm.get('nonEditable'),
                                },
                                formulas: {
                                    selectedVoucher: {
                                        bind: {
                                            bindTo: '{vouchersList.selection}',
                                            deep: true,
                                        },
                                        get: function (record) {
                                            if (record) {
                                                return record;
                                            }
                                        },
                                    },
                                    loadDodument: {
                                        bind: {
                                            bindTo: '{vouchersList.selection.id}',
                                            // deep: true
                                        },
                                        get: function (id) {
                                            let record = this.get('vouchersList.selection');
                                            if (record) {
                                                // Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(true);
                                                var me = this;
                                                let file = record.getDocument(),
                                                    pdf = record.get('pdf') ? true : false;

                                                // return me.getView().getController().previewFile(file);

                                                me.getView()
                                                    .getController()
                                                    .loadDocument(Env.ApiEndpoint + 'get_pdf/' + file.get('id'));

                                                // if (!pdf) {
                                                //     record.loadPDF2().then(function (blob) {
                                                //         let test = {
                                                //             blob: blob,
                                                //             name: record.get('name') + '.' + file.get('extension')
                                                //         }
                                                //         me.getView().getController().loadDocument(test);
                                                //     });
                                                // } else {
                                                //
                                                //     let blob = record.get('pdf');
                                                //     let test = {
                                                //         blob: blob,
                                                //         name: record.get('name') + '.' + file.get('extension')
                                                //     }
                                                //     me.getView().getController().loadDocument(test);
                                                // }
                                            }
                                        },
                                    },
                                    canEditPerm: {
                                        bind: {
                                            bindTo: '{disbursementRecord}',
                                            deep: true,
                                        },
                                        get: function (record) {
                                            if (record) {
                                                let objectPermissions = this.get('objectPermissions'),
                                                    nonEditable = this.get('nonEditable'),
                                                    store = this.get('userPermissions'),
                                                    result = false;
                                                if (record.get('is_locked')) {
                                                    return false;
                                                } else {
                                                    if (!nonEditable) {
                                                        if (store && Object.keys(store).length > 0) {
                                                            let record = store['disbursements'];
                                                            if (record && record.edit) {
                                                                return true;
                                                            } else {
                                                                return false;
                                                            }
                                                        }
                                                    } else {
                                                        if (objectPermissions && objectPermissions['disbursements']) {
                                                            if (objectPermissions['disbursements'].can_edit) {
                                                                result = true;
                                                                if (store && Object.keys(store).length > 0) {
                                                                    let record = store['disbursements'];
                                                                    if (record && !record.edit) {
                                                                        result = false;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        return result;
                                                    }
                                                }
                                            } else {
                                                return false;
                                            }
                                        },
                                    },
                                    dragListeners: {
                                        bind: {
                                            bindTo: '{userPermissions}',
                                            deeP: true,
                                        },
                                        get: function (store) {
                                            if (store && Object.keys(store).length > 0) {
                                                let record = store['portcallInvoiceCreate'];
                                                if (record && record.edit) {
                                                    return {
                                                        element: 'element',
                                                        drop: 'onDrop',
                                                        dragleave: 'onDragLeaveListItem',
                                                        dragover: 'onDragOverListItem',
                                                    };
                                                } else {
                                                    return {};
                                                }
                                            } else {
                                                return {};
                                            }
                                        },
                                    },
                                    nonEditableForSharing: {
                                        bind: {
                                            bindTo: '{member}',
                                            deep: true,
                                        },
                                        get: function (member) {
                                            if (member && member.get('role') == 'can edit') {
                                                this.set('nonEditable', false);
                                            }
                                        },
                                    },
                                },
                            },
                        }).show();
                    }
                }
            }

            // Server Status 413 - Post request size exceeds server limit
            if (xhr.status == 413) {
                Ext.Msg.error(
                    'Server Error 413',
                    'Your files upload request exceeds maximum server allowed size per upload.</br>' +
                        'Please upload files on smaller chunks , or at reduced size'
                );
                return false;
            }

            // Server Error 500

            if (xhr.readyState == 4 && xhr.status == 500) {
                var errorMsg = '';
                try {
                    var responseMsg = JSON.parse(xhr.responseText);
                    errorMsg = responseMsg.message;
                } catch (e) {
                    errorMsg = JSON.parse(xhr.responseText.message) || 'Files failed to upload';
                }

                Ext.Msg.error('Server Error', errorMsg);
            }
        };

        for (var i = 0; i < files.length; i++) {
            formdata.append('files[]', files.item(i));
            formdata.append('split[]', files.item(i).split);
        }
        formdata.append('portcall_id', portcall_id);
        formdata.append('expense_id', expense_id);
        formdata.append('account_id', account_id);
        formdata.append('disbursement_id', disbursement_id);
        xhr.send(formdata);
        mixpanel.track('Uploaded a voucher');
    },

    // onDragLeave: function (target, info) {
    //     this.getView().element.removeCls('active');
    // },

    onDragOverListItem: function (target, info) {
        if (this.getView().upVM().get('nonEditable')) {
            return;
        }
        if (!this.getView().upVM().get('canAddInvoice')) {
            return;
        }
        Ext.get('dropped-container-supply-drop').addCls('a-dropped');
    },

    onDragLeaveListItem: function (target, info) {
        Ext.get('dropped-container-supply-drop').removeCls('a-dropped');
    },

    onDrop: function (event, info, eOpts) {
        Ext.get('dropped-container-supply-drop').removeCls('a-dropped');
        event.browserEvent.preventDefault();

        var me = this,
            view = this.getView(),
            el = view.element,
            dataTransferNative = event.browserEvent.dataTransfer,
            files = dataTransferNative.files,
            len = files.length,
            totalSize = 0;
        if (this.getView().upVM().get('nonEditable')) {
            return;
        }
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

        this.upload(files, el);
    },

    deleteFiles: function (ids) {
        let view = this.getView(),
            record = view.upVM().get('suppliesGrid.selection');
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
                //resolve(true);
            },
            failure: function failure(response) {
                // resolve(false);
            },
        });
    },

    checkPermission: function () {
        return this.getView().getVM().get('canEditPerm');
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
