import './PDACalculationItemsFieldsGrid';
import '../PDAController';

Ext.define('Abraxa.view.pda.calculation.PDACalculationItemsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'pda.calculation.items.grid',
    cls: 'abraxa-grid a-disb-grid a-calculation-items-grid',
    ui: 'bordered',
    flex: 1,
    itemRipple: false,
    ripple: false,
    columnResize: false,
    scrollToTopOnRefresh: false,
    enableColumnMove: false,
    reference: 'pdaCalculationItemsGrid',
    infinite: true,
    pinHeaders: false,
    variableHeights: true,
    itemId: 'pdaCalculationItemsGrid',
    controller: 'pda-controller',
    itemsFocusable: false,
    onFocusEnter: Ext.emptyFn,
    onFocusLeave: Ext.emptyFn,
    selectable: false,
    plugins: {
        gridcellediting: {
            triggerEvent: 'tap',
            selectOnEdit: false,
        },
    },
    weighted: true,
    store: [],
    bind: {
        store: '{calculationServices}',
    },
    itemConfig: {
        collapsed: false,
        viewModel: {
            formulas: {
                createFields: {
                    bind: {
                        bindTo: '{record}',
                    },
                    get: function (record) {
                        if (record) {
                            const controller = Abraxa.getApplication()
                                .getController('AbraxaController')
                                .getParentController(null, this);
                            controller.buildItemFields(record, this);
                        }
                    },
                },
            },
        },
        body: {
            xtype: 'pda.calculation.items.fields.container',
            bind: {
                hidden: '{record.serviceFields.count && record.enabled && pda.status == "draft" && !nonEditable ? false : true}',
            },
        },
        bind: {
            // CORE-2858 TODO: remove style binding and create a css class for this
            style: '{record.enabled ? "opacity: 1;" : "opacity: 0.4;"}',
        },
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
            minWidth: 450,
            flex: 1,
            dataIndex: 'name',
            sortable: false,
            cls: 'a-column-item',
            cell: {
                encodeHtml: false,
                bind: {
                    cls: 'a-cell-item',
                },
            },
            summaryCell: {
                xtype: 'gridcell',
                encodeHtml: false,
                cls: 'a-cell-item',
            },
            menuDisabled: true,
            editor: {
                field: {
                    xtype: 'default.expense.items.combo',
                    itemCls: 'a-disb-costs-combo',
                    displayField: 'name',
                    placeholder: 'Choose item',
                    valueField: 'name',
                    matchFieldWidth: false,
                    listeners: {
                        painted: function (field) {
                            let record = field.up().ownerCmp.getRecord();

                            if (record && record.get('name')) this.setInputValue(record.get('name'));
                        },
                    },
                },
                listeners: {
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('calculationServices'),
                            gridRecord = editor.ownerCmp.getRecord();
                        const defaultExpenseItem =
                            editor && editor.getField() && editor.getField().getSelection()
                                ? editor.getField().getSelection().get('id')
                                : null;
                        gridRecord.set('default_expense_item_id', defaultExpenseItem);
                        gridRecord.set('name', editor.getField().getValue());
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record;
                        if (record && record.get('type') === 'template') return false;
                    },
                },
            },
            summaryRenderer: function (val) {
                return '<span style="display:block; text-align: right;">Total</span>';
            },
            renderer: function (val, selection) {
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge small mr-16 a-badge-services"><i class="md-icon-outlined md-icon-layers"></i></div>' +
                        selection.get('name') +
                        '</div>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">Choose item</span>';
                }
            },
        },
        {
            text: '',
            width: 90,
            dataIndex: 'accounting_code',
            align: 'right',
            sortable: false,
            hidden: true,
            bind: {
                hidden: '{pda.show_accounting_code ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-code',
            },
            menuDisabled: true,
        },
        {
            dataIndex: 'currency',
            text: 'Currency',
            width: 90,
            sortable: false,
            editable: false,
            menuDisabled: true,
            align: 'center',
            cls: 'a-column-bl',
            cell: {
                cls: 'a-cell-bl a-cell-non-editable',
                align: 'center',
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
        },
        {
            dataIndex: 'display_amount',
            text: 'PDA price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
                tools: [
                    {
                        xtype: 'button',
                        hidden: true,
                        bind: {
                            hidden: '{record.custom_amount !== null && record.type != "custom" ? false : true}',
                            disabled: '{pda.status != "draft"}',
                        },
                        arrow: false,
                        focusable: false,
                        iconCls: 'md-icon-settings-backup-restore',
                        ui: 'tool-xs round',
                        zone: 'start',
                        tooltip: {
                            anchorToTarget: true,
                            html: 'Restore calculated price',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                        },
                        handler: function (me) {
                            let store = me.up('grid').upVM().get('calculationServices'),
                                record = me.upVM().get('record');

                            record.set('custom_amount', null);

                            store.sync({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        },
                    },
                ],
                bind: {
                    cls: 'a-cell-amount a-final-da-cell',
                },
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: '00.00',
                    clearable: false,
                    xtype: 'abraxa.pricefield',
                    minValue: 0,
                },
                listeners: {
                    complete: function (editor, value) {
                        let store = editor.up('grid').upVM().get('calculationServices'),
                            record = editor.ownerCmp.getRecord();

                        if (record.get('amount') !== value) {
                            record.set('custom_amount', value);
                        }

                        //BEWARE: this to make sure the record is updated with the custom_amount
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
            dataIndex: 'exchange_rate',
            width: 100,
            text: 'ROE',
            sortable: false,
            menuDisabled: true,
            hidden: true,
            align: 'center',
            cls: 'a-column-bl',
            editable: false,
            bind: {
                hidden: '{showExchangeRateColumn}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl a-cell-non-editable',
            },
            editor: {
                field: {
                    xtype: 'abraxa.currency.field',
                    placeholder: '0.000',
                    clearable: false,
                    textAlign: 'center',
                    ui: 'classic',
                },
                listeners: {
                    complete: 'onCalculationServiceFieldComplete',
                },
            },
            renderer: function (value) {
                return Abraxa.utils.Functions.formatROE(value);
            },
        },
        {
            text: 'Calc. price',
            hidden: true,
            dataIndex: 'calculated_price',
            sortable: false,
            menuDisabled: true,
            width: 120,
            align: 'right',
            cls: 'a-column-bl',
            bind: {
                hidden: '{showCalculatedPriceColumn ? false : true}',
                text: 'Calc. price<div class="sm-title text-center c-black">({pda.currency})</div>',
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
            dataIndex: 'discount',
            sortable: false,
            width: 90,
            align: 'center',
            menuDisabled: true,
            cls: 'a-column-bl',
            hidden: true,
            bind: {
                hidden: '{pda.show_discount ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl',
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
                    complete: 'onCalculationServiceFieldComplete',
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
            dataIndex: 'discounted_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            cls: 'a-column-bl',
            hidden: true,
            bind: {
                hidden: '{pda.show_discount ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
                align: 'right',
            },
            formatter: 'number("0,000.00")',
        },
        {
            text: 'VAT',
            dataIndex: 'vat',
            width: 90,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            cls: 'a-column-bl',
            hidden: true,
            bind: {
                hidden: '{pda.show_vat ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'center',
                cls: 'a-cell-bl',
            },
            zeroValue: '<span class="a-cell-placeholder">0%</span>',
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
                    complete: 'onCalculationServiceFieldComplete',
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
            dataIndex: 'final_price',
            text: 'PDA Final price',
            menuDisabled: true,
            align: 'right',
            width: 120,
            cls: 'a-column-bl a-column-variance',
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-cell-final-price a-cell-variance',
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
            text: 'Service comments',
            dataIndex: 'comment',
            sortable: false,
            menuDisabled: true,
            flex: 1,
            minWidth: 160,
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl',
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: 'Enter comment',
                    clearable: false,
                    xtype: 'textfield',
                },
                listeners: {
                    complete: 'onCalculationServiceFieldComplete',
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
            text: 'Customer code',
            dataIndex: 'customer_code',
            sortable: false,
            menuDisabled: true,
            width: 120,
            hidden: true,
            bind: {
                hidden: '{pda.show_customer_code ? false : true}',
            },
            cls: 'a-column-bl',
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl',
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: 'Enter code',
                    clearable: false,
                    xtype: 'textfield',
                },
                listeners: {
                    complete: 'onCalculationServiceFieldComplete',
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
                            arrow: false,
                            focusable: false,
                            iconCls: 'md-icon-remove-circle-outline',
                            ui: 'tool-xs round',
                            hidden: true,
                            bind: {
                                hidden: '{record.type == "custom" ? false : true}',
                                disabled: '{pda.status != "draft"}',
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
                            handler: function (me) {
                                let service = me.upVM().get('record'),
                                    services = me.upVM().get('calculationServices'),
                                    object_record = me.upVM().get('object_record');

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you want to delete this item?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            services.remove(service);
                                            services.sync({
                                                success: function () {
                                                    Abraxa.utils.Functions.updateInquiry(object_record);
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
                        {
                            xtype: 'button',
                            arrow: false,
                            focusable: false,
                            ui: 'tool-xs round',
                            hidden: true,
                            bind: {
                                hidden: '{record.type == "template" ? false : true}',
                                disabled: '{pda.status != "draft"}',
                                iconCls: 'md-icon-outlined md-icon-visibility{record.enabled ? "-off" : ""}',
                                tooltip: {
                                    anchorToTarget: true,
                                    html: '{record.enabled ? "Exclude" : "Include"}',
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                            },
                            handler: function (me) {
                                let service = me.upVM().get('record'),
                                    services = me.upVM().get('calculationServices'),
                                    enabled = service.get('enabled');

                                Ext.Msg.confirm(
                                    enabled ? 'Exclude service' : 'Include service',
                                    'Are you sure you want to do ' +
                                        (enabled ? 'exclude' : 'include') +
                                        ' this service?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            service.set('enabled', !enabled);
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
                                            ui: 'action alt',
                                            text: 'Confirm',
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
                handler: function (me) {},
            },
        ],
    },
    listeners: {
        beforeedit: function (me, boundEl) {
            let record = boundEl.cell.lookupViewModel().get('record'),
                pda = boundEl.cell.lookupViewModel().get('pda');

            if (pda.get('status') !== 'draft') return false;
            if (!record.get('enabled')) return false;
            if (boundEl.event && boundEl.event.target.localName === 'button') return false;
        },
    },
});
