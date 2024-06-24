import './DisbursementsUploadController';

Ext.define('Abraxa.view.portcall.disbursements.DisbursementsUploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.disbursements.uploadcontroller',

    requires: ['Ext.drag.Target'],
    bindings: {
        onDisbursementChange: '{selectedDisbursement}',
    },

    control: {
        'grid[cls~=a-disb-items-grid]': {
            storechange: 'updateStore',
        },
        'grid[reference=disbursementItemsGrid] editor': {
            complete: 'completeDisbursementGridEdit',
        },
    },
    onDisbursementChange: function (disbursement) {
        this.disbursement = disbursement;
    },
    updateStore: function (disbusementGrid, disbursementItemsStore) {
        this.disbursementItems = disbursementItemsStore;
    },

    completeDisbursementGridEdit: function (editor, context) {
        if (!editor.up('grid').reference) {
            //stop propagation to nested grid for vouchers grid
            //prevent double update requests for voucher price
            return;
        }
        let record = editor.ownerCmp.getRecord();
        if (record && record.dirty) {
            record.getProxy().setExtraParams({
                portcall_id: record.get('portcall_id'),
            });
            record.save({
                success: function () {
                    Ext.toast(AbraxaConstants.messages.updateRecord);
                },
            });
        }
    },
    completeVoucherGridEdit: function (editor) {
        let expenseVoucher = editor.ownerCmp.getRecord(),
            disbursementType = editor.upVM().get('selectedDisbursement.type'),
            expense = editor.upVM().get('gridExpence'),
            vouchers = editor.upVM().get('disbursementInvoices'),
            sum = 0;
        vouchers.each(function (voucher) {
            if (voucher.get('expense_id') === expense.get('id')) {
                sum += parseFloat(voucher.get('calculated_price'));
            }
        });
        if (expenseVoucher && expenseVoucher.dirty) {
            expenseVoucher.getProxy().setExtraParams({
                portcall_id: expenseVoucher.get('portcall_id'),
            });
            expenseVoucher.save({
                success: function () {
                    expense.getProxy().setExtraParams({
                        portcall_id: expense.get('portcall_id'),
                    });
                    expense.set(disbursementType + '_price', sum);
                    expense.save({
                        success: function () {
                            Ext.toast('Record updated', 1000);
                        },
                    });
                },
                failure: function () {
                    expenseVoucher.reject();
                },
            });
        }
    },

    upload: function (files, el, record) {
        let me = this,
            view = me.getView(),
            vm = view.upVM(),
            element = el,
            portcall_id = vm.get('object_record').get('id'),
            expense_id = record.get('id'),
            account_id = record.get('account_id'),
            disbursement_id = record.get('disbursement_id') ? record.get('disbursement_id') : 0,
            accountVouchers = vm.get('accountVouchers'),
            xhr = new XMLHttpRequest(),
            totalSize = 0,
            formdata = new FormData(),
            url = Env.ApiEndpoint + 'disbursement_uploadfiles',
            expense = record;
        for (let i = 0; i < files.length; i++) {
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
                const data = JSON.parse(xhr.responseText);

                if (data.notallowed.length) {
                    Ext.Msg.alert(
                        'Unsupported file format',
                        'The file format you are trying to upload is not supported',
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
                        rec: record,
                    }).show();
                }
            }

            // Server Status 200 - Succeful Upload

            if (xhr.readyState === 4 && xhr.status === 200) {
                Ext.getCmp('uploadProgress').hide();
                const data = JSON.parse(xhr.responseText),
                    vouchersStore = vm.get('vouchers');

                if (element.xtype && element.xtype != 'gridrow') {
                    //ext component
                    element.setValue(null);
                } else {
                    element.value = '';
                }
                Ext.toast('Record updated');

                if (expense) {
                    expense.getProxy().setExtraParams({
                        portcall_id: portcall_id,
                    });
                    expense.set('exchange_rate', null);
                    expense.save();
                }

                if (data && data.data) {
                    let vouchers = data.data,
                        first = null;
                    Ext.each(vouchers, function (value, index) {
                        let model = Ext.create('Abraxa.model.disbursement.Voucher', value),
                            document = new Abraxa.model.document.Document(Object.assign({}, value.document));
                        model.setDocument(document);
                        vouchersStore.add(model);
                        record.vouchers().add(model);
                        if (index === 0) {
                            first = model;
                        }
                    });
                    vouchersStore.reload();
                    record.vouchers().commitChanges();
                    if (first) {
                        let data = {
                            selectVoucher: first,
                            vouchers: accountVouchers,
                        };
                        if (vm.get('fromSupply')) {
                            data = {
                                selectVoucher: first,
                                account_id: expense.get('account_id'),
                            };
                        }
                        Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                            viewModel: {
                                parent: Ext.ComponentQuery.query(
                                    Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type +
                                        'portcall\\.main'
                                )[0].upVM(),
                                data: data,
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
                                    loadDocument: {
                                        bind: {
                                            bindTo: '{vouchersList.selection.id}',
                                        },
                                        get: function () {
                                            let record = this.get('vouchersList.selection');
                                            if (record) {
                                                let me = this;
                                                let file = record.getDocument();
                                                me.getView()
                                                    .getController()
                                                    .loadDocument(Env.ApiEndpoint + 'get_pdf/' + file.get('id'));
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
                        if (Ext.ComponentQuery.query('[xtype=adocs\\.create\\.financial\\.popup]')[0])
                            Ext.ComponentQuery.query('[xtype=adocs\\.create\\.financial\\.popup]')[0].destroy();
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
                let errorMsg = '';
                try {
                    const responseMsg = JSON.parse(xhr.responseText);
                    errorMsg = responseMsg.message;
                } catch (e) {
                    errorMsg = JSON.parse(xhr.responseText.message) || 'Files failed to upload';
                }

                Ext.Msg.error('Server Error', errorMsg);
            }
        };

        for (let i = 0; i < files.length; i++) {
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
    checkFilesMaxSize: function (files) {
        let totalSize = 0;
        for (let i = 0; i < files.length; i++) {
            totalSize += files.item(i).size;
        }

        if (totalSize > 10 * 1024 * 1024) {
            return totalSize;
        }
        return 0;
    },
    onDrop: function (event, info, eOpts) {
        let type = this.getView().upVM().get('selectedDisbursement.type');
        if (type === 'pda') return;
        if (this.getView().upVM().get('nonEditable')) {
            return;
        }
        Ext.get(Ext.dom.Element.query('.disb-grid-drop-candidate')).removeCls('disb-grid-drop-candidate');
        event.browserEvent.preventDefault();

        let me = this,
            view = me.getView(),
            el = view.element,
            dataTransferNative = event.browserEvent.dataTransfer,
            files = dataTransferNative.files,
            len = files.length,
            totalSize = 0,
            targetComponent = Ext.get(event.browserEvent.target).component,
            record = targetComponent.getRecord();

        if (targetComponent && targetComponent.xtype !== 'gridrow') return;

        for (let i = 0; i < len; i++) {
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
        this.upload(files, targetComponent, record);
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

    hideDisbursementColumn: function (button) {
        let selectedDisbursement = this.getView().upVM().get('selectedDisbursement');
        let currentValue = selectedDisbursement.get(button.hidableLabel);
        if (!currentValue) {
            selectedDisbursement.set(button.hidableLabel, 1);
        } else {
            selectedDisbursement.set(button.hidableLabel, 0);
        }
        selectedDisbursement.save();
    },

    deleteDisbursementExpense: function (button) {
        const view = this.getView();
        const vm = view.upVM();
        const expense = button.getParent().ownerCmp.getRecord(),
            selectedDisbursement = vm.get('selectedDisbursement'),
            currentUser = vm.get('currentUser'),
            invoices = button.upVM().get('disbursementInvoices');
        let deleteMsg = AbraxaConstants.messages.deleteItem;
        if (currentUser.get('current_company_id') !== expense.get('company_id')) {
            deleteMsg = AbraxaConstants.messages.deleteSharedRecord;
        }
        Ext.Msg.confirm(
            AbraxaConstants.titles.delete,
            deleteMsg,
            function (answer) {
                if (answer === 'yes') {
                    let allTypes = ['pda_id', 'dda_id', 'sda_id', 'fda_id'];
                    expense.set(selectedDisbursement.get(AbraxaConstants.labels.type) + '_id', null);
                    //check for others if is null
                    let allNull = true;
                    Ext.Array.each(allTypes, function (type) {
                        if (type !== selectedDisbursement.get(AbraxaConstants.labels.type) + '_id') {
                            if (expense.get(type)) {
                                allNull = false;
                            }
                        }
                    });
                    if (allNull) {
                        expense.set('disbursement_id', null);
                    }

                    if (expense.dirty) {
                        expense.getProxy().setExtraParams({
                            portcall_id: expense.get('portcall_id'),
                        });
                        expense.save({
                            success: function () {
                                if (invoices.count()) {
                                    invoices.each(function (invoice) {
                                        invoice.set('expense_id', null);
                                    });
                                    invoices.sync();
                                }
                                Ext.toast(AbraxaConstants.messages.updateRecord);
                            },
                        });
                    }
                }
            },
            this,
            [
                {
                    xtype: 'button',
                    itemId: 'no',
                    margin: '0 8 0 0',
                    text: 'Cancel',
                },
                {
                    xtype: 'button',
                    itemId: 'yes',
                    ui: 'decline alt',
                    text: 'Delete',
                    separator: true,
                },
            ]
        );
    },

    deleteDisbursement: function (button) {
        const vm = button.upVM();
        let store = vm.get('disbursements'),
            //the next line is set in this way, because  this function has been used in different casses
            disbursement = vm.get('disbursement') || vm.get('selectedDisbursement'),
            expenses = vm.get('expenses'),
            selectedAccount = vm.get('selectedAccount'),
            allDisbursementsFromGroup = store.query('group_id', disbursement.get('group_id'));

        Ext.Msg.confirm(
            AbraxaConstants.titles.delete,
            AbraxaConstants.messages.deleteDisbursement,
            function (answer) {
                if (answer == 'yes') {
                    if (allDisbursementsFromGroup.items && allDisbursementsFromGroup.items.length == 1) {
                        //this is the last disbursement from this group detach all expenses
                        let allExpensesFromGroup = expenses.query('disbursement_id', disbursement.get('group_id'));
                        if (allExpensesFromGroup.items && allExpensesFromGroup.items.length) {
                            Ext.Array.each(allExpensesFromGroup.items, function (rec) {
                                rec.set('disbursement_id', null);
                            });
                            expenses.sync();
                        }
                    }
                    //detach disbursement
                    if (allDisbursementsFromGroup.items.length) {
                        Ext.Array.each(allDisbursementsFromGroup.items, function (rec) {
                            rec.set(disbursement.get(AbraxaConstants.labels.type) + '_id', null);
                        });
                    }
                    let disbursementExpenses = expenses.query(
                        disbursement.get(AbraxaConstants.labels.type) + '_id',
                        disbursement.get('id')
                    );
                    Ext.Array.each(disbursementExpenses.items, function (rec) {
                        rec.set(disbursement.get(AbraxaConstants.labels.type) + '_id', null);
                    });
                    expenses.sync();
                    store.remove(store.getById(disbursement.get('id')));
                    store.sync({
                        success: function () {
                            if (selectedAccount) selectedAccount.load();
                            Ext.toast(AbraxaConstants.messages.updateRecord);
                        },
                    });
                }
            },
            this,
            [
                {
                    xtype: 'button',
                    itemId: 'no',
                    margin: '0 8 0 0',
                    text: 'Cancel',
                },
                {
                    xtype: 'button',
                    itemId: 'yes',
                    ui: 'decline alt',
                    text: 'Yes, Delete DA',
                    separator: true,
                },
            ]
        );
    },

    cellAmountRenderer: function (value, row) {
        let total = 0;
        const disbursement = this.disbursement;
        const disbursementItems = this.disbursementItems;
        if (disbursementItems && disbursement) {
            //grouped field comes from database
            //we save group state in table product request it
            if (disbursement.get('grouped')) {
                //when disbursement is grouped we need to sum all services skip filters
                //when disbursement group is collapse total sum must be not affected
                disbursementItems.queryBy(function (rec) {
                    total += rec.get(row.dataIndex);
                });
            } else {
                //we use sum method of store because need to sum filtered services for selected disbursement
                disbursementItems.each(function (disbursement) {
                    total += parseFloat(row.dataIndex);
                });
            }
        }
        return Ext.util.Format.number(total, AbraxaConstants.placeholders.zeroValue);
    },

    summaryCellAmountRenderer: function (value, row, dataIndex) {
        let total = 0;
        const disbursement = this.disbursement;
        const disbursementItems = this.disbursementItems;
        if (disbursementItems && disbursement) {
            if (disbursement.get('grouped')) {
                disbursementItems.queryBy(function (rec) {
                    total += rec.get(dataIndex);
                });
            } else {
                total += disbursementItems.sum(dataIndex);
            }
        }
        return Ext.util.Format.number(total, AbraxaConstants.placeholders.zeroValue);
    },

    emptySummaryRenderer: function () {
        return '';
    },

    disbursementValueRender: function (value) {
        if (value) {
            return Ext.util.Format.number(value, AbraxaConstants.placeholders.zeroValue);
        } else {
            return AbraxaConstants.placeholders.emptyAmountSpan;
        }
    },

    varianceRenderer: function (val, row) {
        let pda_price = 0,
            dda_price = 0,
            final_price = 0;
        row.store.queryBy(function (rec) {
            pda_price += rec.get('pda_final_price');
            dda_price += rec.get('dda_final_price');
            final_price += rec.get('fda_final_price');
        });
        return Abraxa.utils.Functions.calculateVariance(pda_price, dda_price, final_price);
    },
    varianceExportRenderer: function (val, row) {
        let pda_price = 0,
            dda_price = 0,
            final_price = 0;
        if (this.disbursementItems) {
            this.disbursementItems.queryBy(function (rec) {
                pda_price += rec.get('pda_final_price');
                dda_price += rec.get('dda_final_price');
                final_price += rec.get('fda_final_price');
            });
        }
        return Abraxa.utils.Functions.calculateVariance(pda_price, dda_price, final_price, false);
    },

    varianceSummaryRenderer: function (val, row) {
        let pda_price = 0,
            dda_price = 0,
            final_price = 0;
        if (this.disbursementItems) {
            this.disbursementItems.queryBy(function (rec) {
                pda_price += rec.get('pda_final_price');
                dda_price += rec.get('dda_final_price');
                final_price += rec.get('fda_final_price');
            });
        }
        return Abraxa.utils.Functions.calculateVariance(pda_price, dda_price, final_price, false);
    },
});
