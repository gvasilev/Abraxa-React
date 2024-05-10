Ext.define('Abraxa.view.portcall.disbursements.DisbursementItemAttachmentTooltip', {
    extend: 'Ext.menu.Menu',
    xtype: 'disbursement.item.attachment.menu',
    // width: 380,
    ui: 'dropdown',
    items: [
        {
            xtype: 'div',
            cls: 'h5',
            margin: '8 24',
            bind: {
                html: 'Invoices',
            },
        },
        {
            xtype: 'list',
            flex: 1,
            padding: '16 0 0',
            minHeight: 60,
            bind: {
                store: '{attachments}',
            },
            itemConfig: {
                viewModel: {},
                xtype: 'container',
                margin: '0 0 24 0',
                padding: '0 24',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'div',
                        flex: 1,
                        bind: {
                            html: '<a href="javascript:void(0);" class="mr-8">{record.name}</a>',
                        },
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a',
                                fn: function (me, element, eOpts) {
                                    let component = this.component,
                                        itemRecord = component.upVM().get('record'),
                                        controller = Abraxa.getApplication().getController('AbraxaController'),
                                        disbursement = component.upVM().get('selectedDisbursement'),
                                        vm = Ext.ComponentQuery.query('[xtype=disbursements\\.items\\.grid]')[0].upVM(),
                                        fileStore = disbursement.vouchers(),
                                        store = component.upVM().get('disbItemsStore'),
                                        fileRecord = fileStore.getById(itemRecord.get('id'));

                                    if (fileRecord) {
                                        Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    nonEditable: component.upVM().get('nonEditable'),
                                                    disbursementVouchers: disbursement.vouchers(),
                                                    disbursementRecord: disbursement,
                                                    disbursementItems: store,
                                                    selectVoucher: fileRecord,
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
                                                        },
                                                        get: function () {
                                                            let record = this.get('vouchersList.selection');
                                                            if (record && record.getDocument()) {
                                                                const me = this;
                                                                return me
                                                                    .getView()
                                                                    .getController()
                                                                    .previewFile(record.getDocument());
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
                                                                        if (
                                                                            objectPermissions &&
                                                                            objectPermissions['disbursements']
                                                                        ) {
                                                                            if (
                                                                                objectPermissions['disbursements']
                                                                                    .can_edit
                                                                            ) {
                                                                                result = true;
                                                                                if (
                                                                                    store &&
                                                                                    Object.keys(store).length > 0
                                                                                ) {
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
                                                },
                                            },
                                        }).show();
                                    }
                                },
                            },
                        },
                    },
                    {
                        xtype: 'tool',
                        iconCls: 'md-icon-close',
                        ui: 'tool-xs',
                        subObject: 'disbursements',
                        bind: {
                            cls: '{nonEditable || selectedDisbursement.is_locked ? "hidden" : ""}',
                            objectPermission: '{objectPermissions}',
                        },
                        handler: function () {
                            let me = this,
                                store = this.upVM().get('attachments'),
                                record = this.upVM().get('record'),
                                item = this.upVM().get('item'),
                                disbursement = me.upVM().get('selectedDisbursement'),
                                attachmentStore = disbursement.vouchers(),
                                attachmentRecord = attachmentStore.getById(record.get('id'));

                            attachmentRecord.getProxy().setExtraParams({
                                appointmnet_id: record.get('portcall_id'),
                                disbursement_id: record.get('disbursement_id'),
                            });
                            record.set('disbursement_item_id', null);
                            attachmentRecord.save({
                                success: function () {
                                    me.upVM()
                                        .get('selectedDisbursement')
                                        .set('updated_by_user', me.upVM().get('currentUser').getData());
                                    me.upVM().get('selectedDisbursement').set('updated_at', new Date());
                                    store.remove(record);
                                    item.set('autoupdated', new Date());
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function () {
                                    attachment.reject();
                                },
                            });
                        },
                    },
                ],
            },
        },
    ],
});
