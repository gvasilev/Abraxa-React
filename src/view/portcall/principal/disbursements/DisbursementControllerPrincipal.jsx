Ext.define('Abraxa.view.portcall.principal.disbursements.DisbursementControllerPrincipal', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.DisbursementControllerPrincipal',

    listen: {
        component: {
            '*': {
                disbursementLoadStart: 'onDisbursementLoadStart',
                disbursementLoadEnd: 'onDisbursementLoadEnd',
            },
        },
    },

    onDisbursementLoadStart: function (disbursement) {
        this.getView().down('DisbursementServicesGrid').mask('Loading...');
    },

    onDisbursementLoadEnd: function (disbursement) {
        this.getView().down('DisbursementServicesGrid').unmask();
    },

    showInvoiceDialog: function (button) {
        let disbursement = button.upVM().get('selectedDisbursement'),
            vouchers = button.upVM().get('disbursementInvoices'),
            vm = button.upVM(),
            expenses = vm.get('disbursementServicesStore');

        Ext.create('Abraxa.view.vouchers.VouchersDialog', {
            viewModel: {
                parent: vm,
                data: {
                    selectVoucher: null,
                    disbursementRecord: disbursement,
                    vouchers: vouchers,
                    expenses: expenses,
                    nonEditable: true,
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
                    loadDocument: {
                        bind: {
                            bindTo: '{vouchersList.selection.id}',
                        },
                        get: function (id) {
                            let record = this.get('vouchersList.selection');
                            if (record) {
                                Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(true);
                                var me = this;
                                let file = record.getDocument(),
                                    pdf = record.get('pdf') ? true : false;

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
    },
});
