Ext.define('Abraxa.view.portcall.principal.disbursements.services.DisbursementServicesRightPanel', {
    extend: 'Ext.Container',
    xtype: 'DisbursementServicesRightPanel',
    cls: 'a-right-container a-disbursements-right-container',
    hidden: true,
    bind: {
        hidden: '{disbursementItemsGrid.selection ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    scrollable: 'y',
    viewModel: {
        formulas: {
            disbursementTypeFinalPrice: {
                bind: {
                    bindTo: '{disbursementItemsGrid.selection}',
                },
                get: function (selection) {
                    if (selection) {
                        let selectedDisbursementType = this.get('selectedDisbursement.type');
                        return selection.get(selectedDisbursementType + '_final_price');
                    }
                },
            },
            disbursementTypePrice: {
                bind: {
                    bindTo: '{disbursementItemsGrid.selection}',
                },
                get: function (selection) {
                    if (selection) {
                        let selectedDisbursementType = this.get('selectedDisbursement.type');
                        return selection.get(selectedDisbursementType + '_price');
                    }
                },
            },
            disbursementTypeDiscount: {
                bind: {
                    bindTo: '{disbursementItemsGrid.selection}',
                },
                get: function (selection) {
                    if (selection) {
                        let selectedDisbursementType = this.get('selectedDisbursement.type');
                        return selection.get(selectedDisbursementType + '_discount_amount');
                    }
                },
            },
            disbursementTypeVat: {
                bind: {
                    bindTo: '{disbursementItemsGrid.selection}',
                },
                get: function (selection) {
                    if (selection) {
                        let selectedDisbursementType = this.get('selectedDisbursement.type');
                        return selection.get(selectedDisbursementType + '_vat_amount');
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            docked: 'top',
            height: 64,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '{disbursementItemsGrid.selection.default_expense_item_name}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function () {
                                let grid = Ext.ComponentQuery.query('DisbursementServicesGrid')[0];

                                grid.deselectAll();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: 24,
            cls: 'a-bb-100',
            items: [
                {
                    xtype: 'div',
                    cls: 'a-display-label fw-b',
                    bind: {
                        html: '{selectedDisbursement.type:uppercase} price',
                    },
                },
                {
                    xtype: 'div',
                    flex: 1,
                    cls: 'a-bgr-50 border-radius hbox',
                    padding: 12,
                    margin: '12 0 4',
                    bind: {
                        html: '<span class="a-display-value fw-n mr-8 c-grey">{selectedDisbursement.disbursement_currency}</span><span class="fw-b">{disbursementTypeFinalPrice:number("0,000.00")}</span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            padding: 24,
            cls: 'a-bb-100',
            items: [
                {
                    xtype: 'div',
                    margin: '0 0 16',
                    html: '<span class="fw-b">Additional information</span>',
                },
                {
                    xtype: 'container',
                    cls: 'a-disbursement-additional-info',
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Account of',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{disbursementItemsGrid.selection.account_of ? disbursementItemsGrid.selection.account_of : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Cost center',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{disbursementItemsGrid.selection.default_expense_item.cost_center_name}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Accounting code',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{disbursementItemsGrid.selection.default_expense_item.accounting_code ? disbursementItemsGrid.selection.default_expense_item.accounting_code : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Customer center',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{disbursementItemsGrid.selection.customer_cost_center ? disbursementItemsGrid.selection.customer_cost_center : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Customer code',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{disbursementItemsGrid.selection.account_number ? disbursementItemsGrid.selection.account_number : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            margin: '6 0',
                            cls: 'a-divider',
                            html: '<hr>',
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Vendor',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{disbursementItemsGrid.selection.vendor_name ? disbursementItemsGrid.selection.vendor_name : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Initial price',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '<span class="a-display-value fw-n mr-8 c-grey">{selectedDisbursement.disbursement_currency}</span><span class="fw-b">{disbursementTypePrice:number("0,000.00")}</span>',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Discount',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{disbursementTypeDiscount ? disbursementTypeDiscount : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Tax',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{disbursementTypeVat ? disbursementTypeVat : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Total price',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '<span class="a-display-value fw-n mr-8 c-grey">{selectedDisbursement.disbursement_currency}</span><span class="fw-b">{disbursementTypeFinalPrice:number("0,000.00")}</span>',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: 24,
            cls: 'a-disbursement-invoices a-bb-100',
            // TODO: Hide if empty
            bind: {
                hidden: '{disbursementItemsGrid.selection.vouchers.count ? false : true}',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-display-label fw-b',
                    bind: {
                        html: 'Invoices',
                    },
                },
                {
                    xtype: 'abraxa.componentdataview',
                    margin: '24 0 0 0',
                    bind: {
                        store: '{disbursementItemsGrid.selection.vouchers}',
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            xtype: 'div',
                        },
                        items: [
                            {
                                cls: 'hbox',
                                flex: 1,
                                bind: {
                                    html: '<i class="material-icons-outlined md-18 mr-2 c-link">attach_file</i><span class="a-link cursor-pointer text-truncate a_attachment" style="width:160px">{record.document.name}.{record.document.extension}</span>',
                                },
                            },
                            {
                                cls: 'a-display-value text-right',
                                bind: {
                                    html: '<span class="c-grey mr-8">{record.currency}</span><span class="fw-b">{record.price:number("0,000.00")}</span>',
                                },
                            },
                        ],
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'span.a_attachment',
                                fn: function () {
                                    let vm = this.component.upVM(),
                                        service = this.component.upVM().get('disbursementItemsGrid.selection'),
                                        invoice = this.component.getRecord(),
                                        disbursement = this.component.upVM().get('selectedDisbursement'),
                                        expenses = this.component.upVM().get('disbursementServicesStore');

                                    if (invoice) {
                                        Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    selectVoucher: invoice,
                                                    disbursementRecord: disbursement,
                                                    vouchers: service.vouchers(),
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
                                                            // deep: true
                                                        },
                                                        get: function () {
                                                            let record = this.get('vouchersList.selection');
                                                            if (record) {
                                                                Ext.ComponentQuery.query(
                                                                    '[cls~=pdf-preview]'
                                                                )[0].setMasked(true);
                                                                let me = this;
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
                                },
                            },
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            padding: 24,
            // Hide if empty
            bind: {
                hidden: '{disbursementItemsGrid.selection.comment ? false : true}',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-display-label fw-b',
                    bind: {
                        html: 'Service comments',
                    },
                },
                {
                    xtype: 'container',
                    margin: '24 0',
                    layout: {
                        type: 'hbox',
                        align: 'top',
                    },
                    items: [
                        {
                            xtype: 'div',
                            width: 32,
                            margin: '0 8 0 0',
                            html: '<span class="md-icon md-icon-outlined">comment</span>',
                        },
                        {
                            xtype: 'div',
                            flex: 1,
                            bind: {
                                html: '{disbursementItemsGrid.selection.comment ? disbursementItemsGrid.selection.comment : "<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
