Ext.define('Abraxa.view.pda.PDAItemsGridReadOnly', {
    extend: 'Ext.grid.Grid',
    xtype: 'pda.items.read.only.grid',
    cls: 'abraxa-grid a-disb-grid',
    ui: 'bordered',
    flex: 1,
    itemRipple: false,
    ripple: false,
    columnResize: false,
    scrollToTopOnRefresh: false,
    enableColumnMove: false,
    reference: 'pdaItemsGrid',
    selectable: false,
    infinite: false,
    pinHeaders: false,
    variableHeights: true,
    itemId: 'pdateItemsGrid',
    publishes: ['grouped'],
    plugins: {
        gridsummaryrow: {
            row: {
                xtype: 'gridsummaryrow',
                docked: null,
                // weight: -2,
                itemId: 'disb-grid-summary',
                cls: 'a-bb-0',
                hidden: true,
                bind: {
                    hidden: '{disbursementItems.count ? false : true}',
                },
            },
        },
    },
    weighted: true,
    store: [],
    bind: {
        hideHeaders: '{services.count ? false : true}',
        store: '{services}',
    },
    collapsible: {
        tool: {
            zone: 'start',
            ui: 'tool-sm',
            margin: '0 0 0 2',
        },
    },
    grouped: true,
    groupHeader: {
        cls: 'a-bt-100',
        padding: '12 14',
        tpl: new Ext.XTemplate(
            '<div class="hbox"><div class="a-badge small a-badge-{[this.icon(values.children[0])]}"><i></i></div><div class="ml-16">{[this.title(values.children[0])]}</div></div>',
            {
                icon: function (record) {
                    if (record.get('default_expense_item')) return record.get('default_expense_item').category.name;

                    return '';
                },
                title: function (record) {
                    if (record.get('default_expense_item'))
                        return Ext.String.capitalize(record.get('default_expense_item').category.name);

                    return 'Empty';
                },
            }
        ),
    },
    itemConfig: {
        viewModel: true,
    },
    columns: [
        {
            menuDisabled: true,
            editable: false,
            sortable: false,
            width: 32,
            hidden: true,
            bind: {
                hidden: '{pdaItemsGrid.grouped ? false : true}',
            },
        },
        {
            width: 32,
            sortable: false,
            startWidth: 40,
            padding: '0 16',
            hidden: true,
            cell: {
                encodeHtml: false,
                cls: 'a-cell-disb-badge',
                bind: {
                    hidden: '{pdaItemsGrid.grouped ? false : true}',
                },
            },
            menuDisabled: true,
            editable: false,
            renderer: function (val, record) {
                if (record) {
                    return (
                        '<div class="a-supply"><div class="a-badge small a-badge-' +
                        (record.get('default_expense_item')
                            ? record.get('default_expense_item').category.name
                            : 'financial') +
                        ' a-pseudo-' +
                        (record.get('default_expense_item')
                            ? record.get('default_expense_item').category.name
                            : 'financial') +
                        '"><i></i></div></div>'
                    );
                }
                return '';
            },
        },
        {
            text: 'Item',
            width: 240,
            dataIndex: 'default_expense_item_id',
            sortable: false,
            cell: {
                encodeHtml: false,
                bind: {
                    cls: 'a-br-100 a-main-costs',
                },
            },
            summaryCell: {
                xtype: 'gridcell',
                encodeHtml: false,
                cls: 'a-br-100 a-main-costs',
            },
            menuDisabled: true,
            editable: true,
            editor: {
                field: {
                    xtype: 'default.expense.items.combo',
                    itemCls: 'a-disb-costs-combo',
                    displayField: 'name',
                    placeholder: 'Choose item',
                    // valueField: 'id',
                    matchFieldWidth: false,
                    listeners: {
                        painted: function (field) {
                            let record = field.up().ownerCmp.getRecord();

                            if (record && record.get('default_expense_item_name'))
                                this.setInputValue(record.get('default_expense_item_name'));
                        },
                    },
                },
                listeners: {
                    beforecomplete: function (editor) {
                        var val = editor.getField().getInputValue(),
                            type = editor.getField().getSelection();

                        let gridRecord = editor.ownerCmp.getRecord();
                        gridRecord.set('name', val);
                        // gridRecord.set('type', type ? type.get('type').name : null);
                    },
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('services');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            summaryRenderer: function (val) {
                return '<span style="display:block; text-align: right;">Total</span>';
            },
            renderer: function (val, selection) {
                if (val) {
                    return selection.get('name');
                } else {
                    return '<span class="a-cell-placeholder">Choose item</span>';
                }
            },
        },
        {
            dataIndex: 'value',
            text: 'PDA price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
                bind: {
                    cls: 'a-cell-amount a-final-da-cell a-br-100',
                },
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: '00.00',
                    clearable: false,
                    xtype: 'abraxa.pricefield',
                },
                listeners: {
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('services');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            summary: 'sum',
            summaryRenderer: 'sumPdaRender',
        },
        {
            dataIndex: 'currency',
            text: 'Currency',
            width: 82,
            sortable: false,
            editable: false,
            menuDisabled: true,
            align: 'center',
            cell: {
                cls: 'a-br-100',
                align: 'center',
                bind: {
                    cls: 'a-br-100',
                },
            },
            editor: {
                field: {
                    xtype: 'common-combo-currency',
                    ui: 'classic',
                    clearable: false,
                    slug: 'portcallDisbursementCurrency',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    // forceSelection: true,
                },
                listeners: {
                    complete: function (editor, value) {
                        let store = editor.up('grid').upVM().get('sertvices'),
                            selectedAccount = editor.up('grid').upVM().get('selectedAccount'),
                            record = editor.upVM().get('record');

                        if (selectedAccount.get('account_currency') === value) record.set('exchange_rate', 1);

                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record;

                        if (record && record.vouchers().count()) return false;
                    },
                },
            },
            renderer: function (value, record) {
                if (record) {
                    let pda = this.up('grid').upVM().get('pda');
                    return pda.get('currency');
                } else {
                    return '';
                }
            },
        },
        {
            dataIndex: 'exchange_rate',
            width: 66,
            text: 'ROE',
            sortable: false,
            menuDisabled: true,
            align: 'center',
            slug: 'portcallDisbursementCurrency',
            bind: {
                permission: '{userPermissions}',
            },
            cell: {
                encodeHtml: false,
                bind: {
                    cls: 'a-br-100 {invoices.count ? "hide_cell_content before_centered" : ""}',
                },
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
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record;

                        if (record && record.vouchers().count()) return false;
                    },
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('services');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            renderer: function (value) {
                if (value) {
                    Abraxa.utils.Functions.formatROE(value);
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Calc. price',
            dataIndex: 'pda_calculated_price',
            summaryDataIndex: 'pda_calculated_price',
            sortable: false,
            menuDisabled: true,
            width: 120,
            align: 'right',
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-br-100 a-cell-amount a-cell-non-editable',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_calculated_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
        },
        {
            text: 'Discount',
            dataIndex: 'pda_discount_amount',
            sortable: false,
            width: 120,
            align: 'center',
            menuDisabled: true,
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalDiscount');

                return '<b class="fw-b c-yellow">-' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            cell: {
                encodeHtml: false,
                cls: 'a-br-100',
                align: 'center',
                zeroValue: '<span class="a-cell-placeholder">0</span>',
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: '0',
                    clearable: false,
                    xtype: 'textfield',
                    validators: [new RegExp('^[0-9]*?[.]?[0-9]{1}?[%]?$')],
                    validationMessage: "Use only numbers and +-% ex. '+22%', or -125",
                    textAlign: 'center',
                },
                listeners: {
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('services');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">0</span>';
                }
            },
        },
        {
            text: 'Disc. price',
            dataIndex: 'pda_discounted_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-br-100 a-cell-amount a-cell-non-editable',
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
        },
        {
            text: 'VAT',
            dataIndex: 'pda_vat_amount',
            width: 120,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            cell: {
                encodeHtml: false,
                align: 'center',
                cls: 'a-br-100',
            },
            zeroValue: '<span class="a-cell-placeholder">0%</span>',
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalVAT');

                return '<b class="fw-b">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: '0%',
                    clearable: false,
                    maxValue: 100,
                    xtype: 'numberfield',
                    textAlign: 'center',
                },
                listeners: {
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('services');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            renderer: function (value) {
                if (value) {
                    return value + '%';
                } else {
                    return '<span class="a-cell-placeholder">0%</span>';
                }
            },
        },
        {
            sortable: false,
            dataIndex: 'pda_final_price',
            text: 'PDA Final price',
            menuDisabled: true,
            align: 'right',
            width: 120,
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-cell-final-price a-br-100',
                },
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
        },
        {
            text: 'Comment',
            dataIndex: 'comment',
            sortable: false,
            menuDisabled: true,
            flex: 1,
            minWidth: 180,
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
                        let store = editor.up('grid').upVM().get('services');
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
            sortable: false,
            text: '',
            menu: false,
            menuDisabled: true,
            width: 72,
            cell: {
                xtype: 'widgetcell',
                cls: 'a-cell-more',
                align: 'right',
                focusable: false,
                widget: {
                    xtype: 'container',
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
                            handler: function (me) {
                                let service = me.upVM().get('record'),
                                    services = me.upVM().get('services');

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you want to delete this item?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            services.remove(service);
                                            services.sync({
                                                success: function () {
                                                    Ext.toast('Record updated', 1000);
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
    emptyText: {
        xtype: 'container',
        layout: {
            type: 'vbox',
        },
        zIndex: 10,
        flex: 1,
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No items available</div></div>',
            },
            {
                xtype: 'button',
                cls: 'a-no-content-btn chameleon_disbursements_add_row_big',
                text: 'Item',
                slug: 'portcallDisbursementAddItem',
                subObject: 'disbursements',
                bind: {
                    cls: '{nonEditable ? "hidden a-no-content-btn chameleon_disbursements_add_row_big" : "a-no-content-btn chameleon_disbursements_add_row_big"}',
                    permission: '{userPermissions}',
                    objectPermission: '{objectPermissions}',
                    disabled: '{selectedDisbursement.status != "draft" ? true : false}',
                },
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: function (me) {
                    let store = me.upVM().get('expenses'),
                        disbursement = me.upVM().get('selectedDisbursement'),
                        disbursementTypeId = me.upVM().get('selectedDisbursement.type') + '_id',
                        record = Ext.create('Abraxa.model.portcall.Expense', {
                            disbursement_id: me.upVM().get('selectedDisbursement.group_id'),
                            account_id: me.upVM().get('selectedDisbursement.account_id'),
                            account_name: me.upVM().get('selectedDisbursement.organization_name'),
                            portcall_id: me.upVM().get('selectedDisbursement.portcall_id'),
                            [disbursementTypeId]: me.upVM().get('selectedDisbursement.id'),
                            currency: disbursement.get('disbursement_currency'),
                            exchange_rate: 1,
                        });

                    let vouchers = new Abraxa.model.disbursement.Voucher(Object.assign({}, [])),
                        attachments = new Abraxa.model.portcall.Attachment(Object.assign({}, []));

                    record.vouchers().setData(vouchers);
                    record.attachments().setData(attachments);
                    store.add(record);
                    store.sync({
                        success: function () {
                            me.upVM().set('updateGridItems', new Date());
                            me.upVM()
                                .get('selectedDisbursement')
                                .set('updated_by_user', me.upVM().get('currentUser').getData());
                            me.upVM().get('selectedDisbursement').set('updated_at', new Date());
                            Ext.toast('Record updated');
                            me.up('grid').syncRows();
                        },
                    });
                },
            },
        ],
    },
    listeners: {
        dragenter: {
            element: 'outerCt',
            delegate: '.voucher_drop',
            fn: function (me, element) {
                let type = this.component.upVM().get('selectedDisbursement.type');

                if (type === 'pda') return;
                if (this.component.upVM().get('nonEditable')) {
                    return;
                }
                Ext.get(Ext.dom.Element.query('.disb-grid-drop-candidate')).removeCls('disb-grid-drop-candidate');
                me.browserEvent.dataTransfer.dropEffect = 'none';
                me.browserEvent.dataTransfer.dropEffect = 'move';
                Ext.get(element.id).addCls('disb-grid-drop-candidate');
            },
        },
        dragleave: {
            element: 'outerCt',
            delegate: '*',
            fn: function (me, element) {
                if (element && element.id) Ext.get(element.id).removeCls('disb-grid-drop-candidate');
            },
        },
        drop: {
            element: 'element',
            delegate: '*',
            fn: 'onDrop',
        },
    },
});
