Ext.define('Abraxa.view.portcall.disbursements.DisbursementItemsVouchersGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'disbursement.item.vouchers.grid',
    cls: 'a-disb-grid a-vouchers-grid vouchers_grid',
    flex: 1,
    itemRipple: false,
    ripple: false,
    columnResize: false,
    scrollToTopOnRefresh: false,
    enableColumnMove: false,
    selectable: false,
    hideHeaders: true,
    infinite: false,
    variableHeights: true,
    pinHeaders: false,
    scrollable: false,
    columns: [
        {
            menuDisabled: true,
            editable: false,
            sortable: false,
            width: 32,
            hidden: true,
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? false : true}',
            },
        },
        {
            menuDisabled: true,
            editable: false,
            sortable: false,
            width: 54,
            hidden: true,
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? true : false}',
            },
        },
        {
            dataIndex: 'name',
            width: 220,
            sortable: false,
            menuDisabled: true,
            cell: {
                encodeHtml: false,
                cls: 'a-cell-attachment',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.voucher_link',
                        fn: function () {
                            let voucher = this.component.getRecord(),
                                vm = this.component.up('grid').upVM(),
                                disbursement = vm.get('selectedDisbursement');
                            if (voucher) {
                                Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            selectVoucher: voucher,
                                            disbursementRecord: disbursement,
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
                                                },
                                                get: function () {
                                                    let record = this.get('vouchersList.selection');
                                                    if (record) {
                                                        Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(
                                                            true
                                                        );
                                                        const me = this;
                                                        let file = record.getDocument();
                                                        me.getView()
                                                            .getController()
                                                            .loadDocument(
                                                                Env.ApiEndpoint + 'get_pdf/' + file.get('id')
                                                            );
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
                                                    if (member && member.get('role') === 'can edit') {
                                                        this.set('nonEditable', false);
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
            renderer: function (value, record) {
                if (record.getDocument())
                    return (
                        '<a class="cursor-pointer voucher_link a-voucher-link" "javascript:void(0)"><i class="md-icon-outlined">attach_file</i>' +
                        value +
                        '.' +
                        record.getDocument().get('extension') +
                        '</a>'
                    );
            },
        },
        {
            text: '',
            width: 130,
            dataIndex: 'index_code',
            sortable: false,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_accounting ? false : true}',
            },
            cell: {
                encodeHtml: false,
                renderer: function () {
                    return '';
                },
            },
            menuDisabled: true,
        },
        {
            text: '',
            width: 180,
            dataIndex: 'index_code',
            sortable: false,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_my_cost_center ? false : true}',
            },
            cell: {
                encodeHtml: false,
                renderer: function () {
                    return '';
                },
            },
            menuDisabled: true,
        },
        {
            width: 90,
            cell: {
                cls: 'a-bl-200',
            },
            bind: {
                hidden: '{selectedDisbursement.data.show_quantity ? false : true}',
            },
        },
        {
            width: 180,
            cell: {
                cls: 'a-bl-200',
            },
            bind: {
                hidden: '{selectedDisbursement.data.show_vendor ? false : true}',
            },
        },
        {
            text: 'PDA price',
            sortable: false,
            menuDisabled: true,
            width: 120,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.pda_id && (selectedDisbursement.type === "dda" || selectedDisbursement.type === "fda" && selectedDisbursement.type !== "sda") ? false : true}',
            },
            cell: {
                bind: {
                    cls: 'a-cell-amount {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-non-editable"}',
                },
            },
        },
        {
            text: 'DDA price',
            sortable: false,
            menuDisabled: true,
            width: 120,
            cell: {
                bind: {
                    cls: 'a-cell-amount {selectedDisbursement.data.show_variance && !selectedDisbursement.pda_id ? "a-cell-variance" : "a-cell-non-editable"}',
                },
            },
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.dda_id && (selectedDisbursement.type != "pda" && selectedDisbursement.type != "sda") ? false : true}',
            },
        },
        {
            dataIndex: 'price',
            text: 'Voucher price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount a-final-da-cell a-br-100',
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: '0.00',
                    clearable: false,
                    xtype: 'numberfield',
                },
                listeners: {
                    complete: function (editor, value, startValue, eOpts) {
                        let gridRecord = editor.ownerCmp.getRecord(),
                            disbursementType = editor.upVM().get('selectedDisbursement.type'),
                            service = editor.upVM().get('gridExpence'),
                            vouchers = editor.upVM().get('invoices'),
                            sum = 0;

                        vouchers.each(function (voucher) {
                            sum += parseFloat(voucher.get('calculated_price'));
                        });
                        if (gridRecord && gridRecord.dirty) {
                            gridRecord.getProxy().setExtraParams({
                                portcall_id: gridRecord.get('portcall_id'),
                            });
                            gridRecord.save({
                                success: function () {
                                    service.getProxy().setExtraParams({
                                        portcall_id: service.get('portcall_id'),
                                    });
                                    service.set(disbursementType + '_price', sum);
                                    service.save({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                },
                                failure: function () {
                                    gridRecord.reject();
                                },
                            });
                        }
                    },
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return Ext.util.Format.number(value, '0,000.00');
                } else {
                    return '<span class="a-cell-placeholder">0.00</span>';
                }
            },
        },
        {
            dataIndex: 'currency',
            text: 'Currency',
            width: 82,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            slug: 'portcallDisbursementCurrency',
            bind: {
                permission: '{userPermissions}',
            },
            cell: {
                align: 'center',
            },
            editor: {
                field: {
                    xtype: 'common-combo-currency',
                    ui: 'classic',
                    clearable: false,
                },
                listeners: {
                    complete: function (editor, value) {
                        let gridRecord = editor.ownerCmp.getRecord(),
                            accountCurrency = editor.upVM().get('selectedAccount.account_currency'),
                            object_record = editor.upVM().get('object_record'),
                            disbursement = editor.upVM().get('selectedDisbursements'),
                            invoices = editor.upVM().get('invoices');

                        if (value === accountCurrency) gridRecord.set('exchange_rate', 1);

                        if (gridRecord && gridRecord.dirty) {
                            gridRecord.getProxy().setExtraParams({
                                portcall_id: object_record.get('id'),
                            });
                            gridRecord.save({
                                success: function () {
                                    if (disbursement) {
                                        if (invoices.getCount()) {
                                            let multiCurrency = editor
                                                .upVM()
                                                .get('vouchers')
                                                .queryBy(function (voucher) {
                                                    if (voucher.get('expense_id') === gridRecord.get('expense_id')) {
                                                        return (
                                                            voucher.get('currency') !=
                                                            disbursement.get('disbursement_currency')
                                                        );
                                                    }
                                                }).items.length;
                                            if (multiCurrency) {
                                                disbursement.set('multi_currency', 1);
                                            } else {
                                                disbursement.set('multi_currency', 0);
                                            }
                                            if (disbursement.dirty) disbursement.save();
                                        }
                                    }
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function () {
                                    gridRecord.reject();
                                },
                            });
                        }
                    },
                },
            },
        },
        {
            dataIndex: 'exchange_rate',
            text: 'ROE',
            width: 100,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            slug: 'portcallDisbursementCurrency',
            hidden: true,
            bind: {
                permission: '{userPermissions}',
                hidden: '{selectedDisbursement.multi_currency ? false : true}',
            },
            cell: {
                align: 'center',
                cls: 'a-cell-bl',
            },
            editor: {
                field: {
                    xtype: 'abraxa.currency.field',
                    placeholder: '0.000',
                    decimalSeparator: '.',
                    decimals: 3,
                    clearable: false,
                    textAlign: 'center',
                    ui: 'classic',
                },
                listeners: {
                    complete: function (editor, value) {
                        let gridRecord = editor.ownerCmp.getRecord(),
                            disbursementType = editor.upVM().get('selectedDisbursement.type'),
                            object_record = editor.upVM().get('object_record'),
                            service = editor.upVM().get('gridExpence'),
                            vouchers = editor.upVM().get('invoices'),
                            sum = 0;

                        vouchers.each(function (voucher) {
                            sum += parseFloat(voucher.get('calculated_price'));
                        });

                        if (gridRecord && gridRecord.dirty) {
                            gridRecord.getProxy().setExtraParams({
                                portcall_id: object_record.get('id'),
                            });
                            gridRecord.save({
                                success: function () {
                                    service.getProxy().setExtraParams({
                                        portcall_id: object_record.get('id'),
                                    });
                                    service.set(disbursementType + '_price', sum);
                                    service.save({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                },
                                failure: function () {
                                    gridRecord.reject();
                                },
                            });
                        }
                    },
                },
            },
            renderer: function (value) {
                if (value) {
                    return Abraxa.utils.Functions.formatROE(value);
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Calc. price',
            dataIndex: 'calculated_price',
            sortable: false,
            menuDisabled: true,
            width: 120,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.show_calculated_price ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
            },
            formatter: 'number("0,000.00")',
        },
        {
            text: 'Discount',
            sortable: false,
            width: 100,
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_discount ? false : true}',
            },
            cell: {
                cls: 'a-cell-bl',
            },
        },
        {
            text: 'Disc. price',
            sortable: false,
            menuDisabled: true,
            hidden: true,
            width: 120,
            bind: {
                hidden: '{selectedDisbursement.data.show_discount ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-value">0,000.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
            },
        },
        {
            text: 'VAT',
            width: 100,
            sortable: false,
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_vat ? false : true}',
            },
            cell: {
                cls: 'a-cell-bl',
            },
        },
        {
            text: 'Final price',
            dataIndex: 'final_price',
            sortable: false,
            menuDisabled: true,
            width: 120,
            cell: {
                bind: {
                    cls: 'a-cell-amount a-br-100 {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                encodeHtml: false,
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
            },
        },
        {
            text: 'Variance',
            width: 100,
            sortable: false,
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_variance ? false : true}',
            },
            cell: {
                cls: 'a-br-100',
            },
        },
        {
            dataIndex: 'note',
            text: 'Comment',
            sortable: false,
            menuDisabled: true,
            minWidth: 160,
            flex: 1,
            cell: {
                encodeHtml: false,
                cls: 'a-br-100',
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: 'Enter comment',
                    clearable: false,
                    xtype: 'textfield',
                },
                listeners: {
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('vouchers');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            renderer: function (val, selection) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Voucher',
            dataIndex: 'voucher_number',
            sortable: false,
            width: 100,
            align: 'center',
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_voucher && selectedDisbursement.type === "fda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-br-100',
                align: 'center',
                zeroValue: '<span class="a-cell-placeholder"></span>',
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder"></span>';
                }
            },
        },
        {
            text: 'Customer code',
            dataIndex: 'account_number',
            sortable: false,
            menuDisabled: true,
            minWidth: 120,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_account_number ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-br-100',
            },
            renderer: function (val) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder"></span>';
                }
            },
        },
        {
            text: 'Customer cost center',
            dataIndex: 'customer_cost_center',
            sortable: false,
            menuDisabled: true,
            minWidth: 180,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_customer_cost_center ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-br-100',
            },
            renderer: function (val, selection) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder"></span>';
                }
            },
        },
        {
            text: 'Variance comment',
            dataIndex: 'variance_comment',
            sortable: false,
            menuDisabled: true,
            flex: 1,
            minWidth: 160,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_variance_comment ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-br-100',
            },
            renderer: function (val) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder"></span>';
                }
            },
        },
        {
            sortable: false,
            text: '',
            menu: false,
            menuDisabled: true,
            width: 78,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.status === "draft" ? false : true}',
            },
            cell: {
                xtype: 'widgetcell',
                cls: 'a-cell-more',
                align: 'right',
                hideMode: 'opacity',
                focusable: false,
                widget: {
                    xtype: 'container',
                    padding: '0 12',
                    focusable: false,
                    layout: {
                        type: 'hbox',
                        pack: 'end',
                    },
                    items: [
                        {
                            xtype: 'button',
                            // hideMode: 'opacity',
                            arrow: false,
                            focusable: false,
                            iconCls: 'md-icon-remove-circle-outline',
                            ui: 'tool-xs round',
                            slug: 'portcallDisbursementDeleteItem',
                            //subObject: 'disbursements',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""} last_focusable_element',
                                objectPermission: '{objectPermissions}',
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                var record = this.upVM().get('record');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you want to delete this invoice?<br>All related payments to this invoice will be deleted accordingly.',
                                    function (answer) {
                                        if (answer === 'yes') {
                                            Ext.ComponentQuery.query(
                                                Env.currentUser.get('company').type + 'portcall\\.main'
                                            )[0]
                                                .getController()
                                                .deleteVouchers([record]);
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
                        },
                    ],
                },
            },
        },
    ],
    listeners: {
        painted: function () {
            this.refreshInnerWidth();
            this.syncRows();
        },
    },
});
