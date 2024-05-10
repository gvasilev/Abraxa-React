Ext.define('Abraxa.view.portcall.disbursements.DisbursementItemsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'disbursement.items.grid',
    testId: 'disbursementItemsGrid',
    controller: 'disbursements.uploadcontroller',
    cls: 'abraxa-grid a-disb-grid a-disb-items-grid disbursementItemsGrid',
    ui: 'bordered',
    flex: 1,
    itemRipple: false,
    ripple: false,
    columnResize: false,
    scrollToTopOnRefresh: false,
    enableColumnMove: false,
    reference: 'disbursementItemsGrid',
    selectable: false,
    infinite: true,
    itemId: 'disbursementItemsGrid',
    publishes: ['grouped'],
    plugins: {
        gridcellediting: {
            triggerEvent: 'tap',
            selectOnEdit: false,
        },
        gridexporter: true,
        gridsummaryrow: {
            row: {
                xtype: 'gridsummaryrow',
                docked: null,
                scrollDock: 'end',
                itemId: 'disb-grid-summary',
                cls: 'a-bb-100',
                bind: {
                    hidden: '{disbursementItems.count ? false : true}',
                },
            },
        },
    },
    weighted: true,
    grouped: false,
    store: [],
    bind: {
        hideHeaders: '{disbursementItems.count ? false : true}',
        store: '{disbursementItemsGrid.grouped ? disbursementItems : disbursementExpenses}',
    },
    collapsible: {
        tool: {
            zone: 'start',
            ui: 'tool-sm',
            margin: '0 0 0 2',
        },
    },
    pinHeaders: false,
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
        viewModel: {
            stores: {
                disbursementInvoices: {
                    source: '{vouchers}',
                    filters: '{invoiceFilter}',
                },
            },
            formulas: {
                invoiceFilter: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            let store = this.get('invoices');
                            if (store) store.clearFilter();
                            return function (rec) {
                                return rec.get('expense_id') === record.get('id');
                            };
                        } else {
                            return function () {
                                return false;
                            };
                        }
                    },
                },
                gridExpence: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        return record;
                    },
                },
                lockItem: {
                    bind: {
                        bindTo: '{selectedDisbursement.status}',
                        deep: true,
                    },
                    get: function (status) {
                        if (status) {
                            let record = this.get('record');
                            if (record) {
                                if (status !== 'draft') {
                                    record.set('lockItem', true);
                                } else {
                                    record.set('lockItem', false);
                                }
                            }
                        }
                    },
                },
            },
        },
        collapsed: false,
        bind: {
            cls: 'liveEditable {selectedDisbursement.status != "draft" ? "a-row-locked" : ""} voucher_drop',
            liveGridRecordId: '{record.id}',
        },
        body: {
            xtype: 'disbursement.item.vouchers.grid',
            bind: {
                hidden: '{selectedDisbursement.type == "pda" ? true : false}',
                store: '{disbursementInvoices}',
            },
        },
    },
    columns: [
        {
            menuDisabled: true,
            editable: false,
            sortable: false,
            width: 32,
            hidden: true,
            cls: 'a-column-sort-disabled',
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? false : true}',
            },
        },
        {
            width: 54,
            sortable: false,
            startWidth: 54,
            hidden: true,
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? true : false}',
            },
            padding: '0 16',
            cell: {
                encodeHtml: false,
                cls: 'a-cell-disb-badge',
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
            text: 'Service item',
            height: 48,
            width: 220,
            dataIndex: 'default_expense_item_id',
            sortable: false,
            cell: {
                encodeHtml: false,
                bind: {
                    cls: 'a-main-costs {record.lockItem ? "a-supply-locked" : ""}',
                },
            },
            summaryCell: {
                xtype: 'gridcell',
                encodeHtml: false,
                cls: 'a-main-costs',
            },
            menuDisabled: true,
            editor: {
                field: {
                    xtype: 'default.expense.items.combo',
                    itemCls: 'a-disb-costs-combo',
                    displayField: 'name',
                    placeholder: 'Choose item',
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
                        let value = editor.getField().getInputValue();
                        let gridRecord = editor.ownerCmp.getRecord();
                        gridRecord.set('default_expense_item_name', value);
                    },
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record;

                        if (record && record.get('lockItem')) return false;
                    },
                },
            },
            renderer: function (value, selection) {
                if (value) {
                    return selection.get('default_expense_item_name');
                } else {
                    return '<span class="a-cell-placeholder">Choose item</span>';
                }
            },
            exportRenderer: function exportRenderer(value, selection) {
                if (value) {
                    return selection.get('default_expense_item_name');
                } else {
                    return 'Choose item';
                }
            },
            summaryRenderer: function () {
                let currency = this.row.upVM().get('selectedDisbursement.disbursement_currency');
                return (
                    '<span style="display:block; text-align: right;">Total <span class="fw-n">(' +
                    currency +
                    ')</span></span>'
                );
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let currency = grid.upVM().get('selectedDisbursement.disbursement_currency');
                return 'Total (' + currency + ')';
            },
        },
        {
            text: 'My accounting code',
            dataIndex: 'accounting_code',
            width: 130,
            menuDisabled: true,
            sortable: false,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_accounting ? false : true}',
            },
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return value;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'My cost center',
            dataIndex: 'cost_center_id',
            width: 180,
            sortable: false,
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_my_cost_center ? false : true}',
            },
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                const defaultExpenseItemsLabel = AbraxaConstants.labels.defaultExpenseItems;
                if (
                    record &&
                    record.get(defaultExpenseItemsLabel) &&
                    record.get(defaultExpenseItemsLabel).cost_center_name
                ) {
                    return record.get(defaultExpenseItemsLabel).cost_center_name;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            editor: {
                field: {
                    xtype: 'myCostcentersCombo',
                    bind: {
                        value: '{record.default_expense_item.cost_center_id}',
                    },
                },
            },
        },
        {
            text: 'Quantity',
            width: 90,
            dataIndex: 'quantity',
            sortable: false,
            menuDisabled: true,
            align: 'center',
            bind: {
                hidden: '{selectedDisbursement.data.show_quantity ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'center',
                cls: 'a-cell-quantity a-bl-200',
                bind: {
                    cls: '{record.lockItem ? "a-cell-quantity a-cell-locked a-bl-200" : "a-cell-quantity a-bl-200"}',
                },
            },
            editor: {
                field: {
                    ui: 'classic',
                    xtype: 'abraxa.numberfield',
                    decimalPrecision: 2,
                },
                listeners: {
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record;

                        if (record && record.get('lockItem')) return false;
                    },
                },
            },
            summaryRenderer: function () {
                return '';
            },
            renderer: function (value) {
                if (value) {
                    return Ext.util.Format.number(value, '0,000.00');
                } else {
                    return '<span class="a-cell-placeholder">0,000.00</span>';
                }
            },
        },
        {
            text: 'Vendor',
            width: 180,
            dataIndex: 'vendor_id',
            sortable: false,
            menuDisabled: true,
            cell: {
                encodeHtml: false,
                cls: 'a-bl-200',
                bind: {
                    cls: '{record.lockItem ? "a-cell-locked a-bl-200" : "a-bl-200"}',
                },
            },
            bind: {
                hidden: '{selectedDisbursement.data.show_vendor ? false : true}',
            },
            editor: {
                field: {
                    ui: 'classic',
                    xtype: 'organization.combo.noFilters',
                    bind: {
                        inputValue: '{record.vendor_name}',
                    },
                },
                listeners: {
                    beforecomplete: function (editor) {
                        const val = editor.getField().getInputValue();

                        let gridRecord = editor.ownerCmp.getRecord();
                        gridRecord.set('vendor_name', val);
                    },
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record;

                        if (record && record.get('lockItem')) return false;
                    },
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return record.get('vendor_name');
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(value, record) {
                if (value) {
                    return record.get('vendor_name');
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            dataIndex: 'pda_final_price',
            text: 'PDA final price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            cls: 'disb_special_column text_right',
            isHeaderContainer: 'false',
            formatter: 'number("0,000.00")',
            summary: 'sum',
            width: 120,
            padding: '8 12 8 0',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.pda_id && selectedDisbursement.type != "sda" ? false : true}',
            },
            items: [
                {
                    xtype: 'div',
                    flex: 1,
                    cls: 'cursor-pointer',
                    bind: {
                        html: '<a class="disbursement_pda_link fw-b" href="javascript:void(0);" data-disbursement-id="{selectedDisbursement.pda_id}">PDA final price</a>',
                    },
                },
                {
                    xtype: 'div',
                    bind: {
                        html: '<div class="a-status-badge a-status-sm status-{selectedDisbursement.pda.status}">{selectedDisbursement.pda.status:capitalize}</div>',
                    },
                },
            ],
            cell: {
                encodeHtml: false,
                bind: {
                    cls: 'a-cell-amount a-final-da-cell {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-non-editable"}',
                },
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
            },
            listeners: {
                click: {
                    element: 'element',
                    delegate: 'a.disbursement_pda_link',
                    fn: function (el) {
                        let disbursement_id = el.target.getAttribute('data-disbursement-id'),
                            component = this.component,
                            store = component.upVM().get('disbursements'),
                            grid = component.find('disbursementsGrid'),
                            record = store.getById(disbursement_id);

                        grid.deselectAll();
                        component.find('disbursementDetails').setMasked(true);

                        if (record) grid.select(record);
                    },
                },
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            dataIndex: 'dda_final_price',
            text: 'DDA final price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            cls: 'disb_special_column text_right',
            formatter: 'number("0,000.00")',
            summary: 'sum',
            hidden: true,
            padding: '8 12 8 0',
            bind: {
                hidden: '{(selectedDisbursement.dda_id && (selectedDisbursement.type != "pda" )) && selectedDisbursement.type != "sda" ? false : true}',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'cursor-pointer',
                    bind: {
                        html: '<a class="disbursement_dda_link fw-b" href="javascript:void(0);" data-disbursement-id="{selectedDisbursement.dda_id}">DDA final price</a>',
                    },
                },
                {
                    xtype: 'div',
                    bind: {
                        html: '<div class="a-status-badge a-status-sm status-{selectedDisbursement.dda.status}">{selectedDisbursement.dda.status:capitalize}</div>',
                    },
                },
            ],
            cell: {
                encodeHtml: false,
                align: 'right',
                bind: {
                    cls: 'a-cell-amount a-final-da-cell {selectedDisbursement.data.show_variance && !selectedDisbursement.pda_id ? "a-cell-variance" : "a-cell-non-editable"}',
                },
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
            },
            listeners: {
                click: {
                    element: 'element',
                    delegate: 'a.disbursement_dda_link',
                    fn: function (el) {
                        let disbursement_id = el.target.getAttribute('data-disbursement-id'),
                            component = this.component,
                            store = component.upVM().get('disbursements'),
                            grid = component.find('disbursementsGrid'),
                            record = store.getById(disbursement_id);

                        grid.deselectAll();
                        component.find('disbursementDetails').setMasked(true);

                        if (record) grid.select(record);
                    },
                },
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            dataIndex: 'pda_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type == "pda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
                bind: {
                    cls: 'a-cell-amount a-final-da-cell a-br-100 {invoices.count && selectedDisbursement.type != "pda" ? "hide_cell_content" : ""}',
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
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record,
                            disbursement = editor.upVM().get('selectedDisbursement'),
                            disbursementType = editor.upVM().get('selectedDisbursement.type');
                        if (record && disbursement) {
                            if (disbursement.get('status') !== 'draft') return false;

                            if (disbursementType === 'pda' && record.vouchers().count()) return false;

                            if (record.vouchers().count() && disbursementType !== 'pda') return false;
                        }
                    },
                },
            },
            summaryRenderer: function () {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            dataIndex: 'dda_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type == "dda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
                bind: {
                    cls: 'a-cell-amount a-final-da-cell a-br-100 {invoices.count && selectedDisbursement.type != "pda" ? "hide_cell_content" : ""}',
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
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record,
                            disbursement = editor.upVM().get('selectedDisbursement'),
                            disbursementType = editor.upVM().get('selectedDisbursement.type');
                        if (record && disbursement) {
                            if (disbursement && disbursement.get('status') !== 'draft') return false;

                            if (record.vouchers().count() && disbursementType !== 'pda') return false;
                        }
                    },
                },
            },
            summaryRenderer: function () {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            dataIndex: 'fda_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type == "fda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
                bind: {
                    cls: 'a-cell-amount a-final-da-cell a-br-100 {invoices.count && selectedDisbursement.type != "pda" ? "hide_cell_content" : ""}',
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
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record,
                            disbursement = editor.upVM().get('selectedDisbursement'),
                            disbursementType = editor.upVM().get('selectedDisbursement.type');
                        if (record && disbursement) {
                            if (disbursement.get('status') !== 'draft') return false;

                            if (record.vouchers().count() && disbursementType !== 'pda') return false;
                        }
                    },
                },
            },
            summaryRenderer: function () {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            dataIndex: 'sda_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type === "sda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
                bind: {
                    cls: 'a-cell-amount a-final-da-cell a-br-100 {invoices.count && selectedDisbursement.type !== "pda" ? "hide_cell_content" : ""}',
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
                    beforestartedit: function (editor, boundEl, value, eOpts) {
                        let record = eOpts.record,
                            disbursement = editor.upVM().get('selectedDisbursement'),
                            disbursementType = editor.upVM().get('selectedDisbursement.type');
                        if (record && disbursement) {
                            if (disbursement.get('status') !== 'draft') return false;
                            if (record.vouchers().count() && disbursementType !== 'pda') return false;
                        }
                    },
                },
            },
            summaryRenderer: function () {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            dataIndex: 'currency',
            text: 'Currency',
            width: 82,
            sortable: false,
            menuDisabled: true,
            slug: 'portcallDisbursementCurrency',
            bind: {
                permission: '{userPermissions}',
            },
            align: 'center',
            cell: {
                align: 'center',
                bind: {
                    cls: '{invoices.count ? "hide_cell_content before_centered" : ""}',
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
                },
                listeners: {
                    complete: function (editor, value) {
                        let store = editor.up('grid').upVM().get('expenses'),
                            selectedAccount = editor.up('grid').upVM().get('selectedAccount'),
                            record = editor.ownerCmp.getRecord();
                        if (record && selectedAccount.get('account_currency') === value) record.set('exchange_rate', 1);

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
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            dataIndex: 'exchange_rate',
            width: 100,
            text: 'ROE',
            sortable: false,
            menuDisabled: true,
            align: 'center',
            hidden: true,
            slug: 'portcallDisbursementCurrency',
            bind: {
                permission: '{userPermissions}',
                hidden: '{selectedDisbursement.multi_currency ? false : true}',
            },
            cell: {
                encodeHtml: false,
                bind: {
                    cls: 'a-cell-bl {invoices.count ? "hide_cell_content before_centered" : ""}',
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
                },
            },
            renderer: function (value) {
                if (value) {
                    return Abraxa.utils.Functions.formatROE(value);
                } else {
                    return '';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return Abraxa.utils.Functions.formatROE(value);
                } else {
                    return '';
                }
            },
            summaryRenderer: function () {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            hidden: true,
            dataIndex: 'pda_calculated_price',
            summaryDataIndex: 'pda_calculated_price',
            bind: {
                text: 'Calc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.show_calculated_price && selectedDisbursement.type == "pda" ? false : true}',
            },
            sortable: false,
            menuDisabled: true,
            width: 120,
            align: 'right',
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_calculated_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_calculated_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            hidden: true,
            dataIndex: 'dda_calculated_price',
            summaryDataIndex: 'dda_calculated_price',
            bind: {
                text: 'Calc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.show_calculated_price && selectedDisbursement.type == "dda" ? false : true}',
            },
            sortable: false,
            menuDisabled: true,
            width: 120,
            align: 'right',
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_calculated_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_calculated_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            hidden: true,
            dataIndex: 'fda_calculated_price',
            summaryDataIndex: 'fda_calculated_price',
            bind: {
                text: 'Calc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.show_calculated_price && selectedDisbursement.type == "fda" ? false : true}',
            },
            sortable: false,
            menuDisabled: true,
            width: 120,
            align: 'right',
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_calculated_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_calculated_price');
                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            hidden: true,
            dataIndex: 'sda_calculated_price',
            summaryDataIndex: 'sda_calculated_price',
            bind: {
                text: 'Calc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.show_calculated_price && selectedDisbursement.type == "sda" ? false : true}',
            },
            sortable: false,
            menuDisabled: true,
            width: 120,
            align: 'right',
            cell: {
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_calculated_price');
                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_calculated_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            text: 'Discount',
            dataIndex: 'pda_discount_amount',
            sortable: false,
            width: 100,
            align: 'center',
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "pda" ? false : true}',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">0</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value;
                } else {
                    return '0';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalDiscount');
                return '<b class="fw-b c-yellow">-' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalDiscount');
                return '-' + Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            text: 'Discount',
            dataIndex: 'dda_discount_amount',
            sortable: false,
            width: 100,
            align: 'center',
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "dda" ? false : true}',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">0</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value;
                } else {
                    return '0';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalDiscount');

                return '<b class="fw-b c-yellow">-' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalDiscount');
                return '-' + Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            text: 'Discount',
            dataIndex: 'fda_discount_amount',
            sortable: false,
            width: 100,
            align: 'center',
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "fda" ? false : true}',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">0</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value;
                } else {
                    return '0';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalDiscount');
                return '<b class="fw-b c-yellow">-' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalDiscount');
                return '-' + Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            text: 'Discount',
            dataIndex: 'sda_discount_amount',
            sortable: false,
            width: 100,
            align: 'center',
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "sda" ? false : true}',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">0</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value;
                } else {
                    return '0';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalDiscount');

                return '<b class="fw-b c-yellow">-' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalDiscount');
                return '-' + Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            dataIndex: 'pda_discounted_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            hidden: true,
            width: 120,
            bind: {
                text: 'Disc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "pda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            text: 'Disc. price',
            dataIndex: 'dda_discounted_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            hidden: true,
            width: 120,
            bind: {
                text: 'Disc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "dda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            text: 'Disc. price',
            dataIndex: 'fda_discounted_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            hidden: true,
            width: 120,
            bind: {
                text: 'Disc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "fda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            text: 'Disc. price',
            dataIndex: 'sda_discounted_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            hidden: true,
            width: 120,
            bind: {
                text: 'Disc. price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.data.show_discount && selectedDisbursement.type == "sda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                cls: 'a-cell-amount a-cell-non-editable',
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_discounted_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            text: 'TAX',
            dataIndex: 'pda_vat_amount',
            width: 100,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_vat && selectedDisbursement.type == "pda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl',
                align: 'center',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value + '%';
                } else {
                    return '<span class="a-cell-placeholder">0%</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value + '%';
                } else {
                    return '0%';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalVAT');

                return '<b class="fw-b">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalVAT');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            text: 'TAX',
            dataIndex: 'dda_vat_amount',
            width: 100,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_vat && selectedDisbursement.type == "dda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl',
                align: 'center',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value + '%';
                } else {
                    return '<span class="a-cell-placeholder">0%</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value + '%';
                } else {
                    return '0%';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalVAT');

                return '<b class="fw-b">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalVAT');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            text: 'TAX',
            dataIndex: 'fda_vat_amount',
            width: 100,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_vat && selectedDisbursement.type == "fda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl',
                align: 'center',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value + '%';
                } else {
                    return '<span class="a-cell-placeholder">0%</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value + '%';
                } else {
                    return '0%';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalVAT');

                return '<b class="fw-b">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalVAT');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            text: 'TAX',
            dataIndex: 'sda_vat_amount',
            width: 100,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_vat && selectedDisbursement.type == "sda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                cls: 'a-cell-bl',
                align: 'center',
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
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value + '%';
                } else {
                    return '<span class="a-cell-placeholder">0%</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value + '%';
                } else {
                    return '0%';
                }
            },
            summaryRenderer: function (grid, context) {
                let value = context.grid.upVM().get('totalVAT');

                return '<b class="fw-b">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let value = grid.upVM().get('totalVAT');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            sortable: false,
            dataIndex: 'pda_final_price',
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} Final price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.type == "pda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-cell-final-price a-br-100 {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            sortable: false,
            dataIndex: 'dda_final_price',
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} Final price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.type === "dda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-br-100 a-cell-final-price {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            sortable: false,
            dataIndex: 'fda_final_price',
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} Final price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.type == "fda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-br-100 a-cell-final-price {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            sortable: false,
            dataIndex: 'sda_final_price',
            menuDisabled: true,
            align: 'right',
            width: 120,
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} Final price<div class="sm-title text-center c-black">({selectedDisbursement.disbursement_currency})</div>',
                hidden: '{selectedDisbursement.type == "sda" ? false : true}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-br-100 a-cell-final-price {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
            },
            formatter: 'number("0,000.00")',
            summaryRenderer: function (grid, context) {
                let type = context.grid.upVM().get('selectedDisbursement.type'),
                    value = context.grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let type = grid.upVM().get('selectedDisbursement.type'),
                    value = grid.getStore().sum(type + '_final_price');

                return Ext.util.Format.number(value, '0,000.00');
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
            },
        },
        {
            dataIndex: 'variance',
            text: 'Variance',
            sortable: false,
            width: 100,
            menuDisabled: true,
            hidden: true,
            align: 'right',
            bind: {
                hidden: '{selectedDisbursement.data.show_variance ? false : true}',
            },
            summaryRenderer: function (val, data) {
                let store = data.store,
                    pda_price = store.sum('pda_final_price'),
                    dda_price = store.sum('dda_final_price'),
                    final_price = store.sum('fda_final_price')
                        ? store.sum('fda_final_price')
                        : store.sum('dda_final_price');

                let start_price = pda_price ? pda_price : dda_price;

                if (!start_price && !final_price) return;

                if (final_price === 0 && start_price) final_price = start_price;

                if (start_price === 0 && final_price) start_price = final_price;

                const reDiff = function relDiff(a, b) {
                    return Math.abs((b - a) / a) * 100;
                };

                let variance = parseFloat(reDiff(start_price, final_price)).toFixed(1),
                    sign = start_price > final_price ? '-' : start_price < final_price ? '+' : '',
                    cls = start_price > final_price ? 'c-red' : start_price < final_price ? 'c-green' : 'c-blue',
                    icon =
                        start_price > final_price
                            ? 'trending_down'
                            : start_price < final_price
                            ? 'trending_up'
                            : 'trending_flat';

                return (
                    '<div class="variance_cell hbox ' +
                    cls +
                    '"><i class="material-icons-outlined md-16 ' +
                    cls +
                    '">' +
                    icon +
                    '</i><span>' +
                    sign +
                    '' +
                    variance +
                    '%</span></div>'
                );
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                let grid = Ext.ComponentQuery.query('grid[reference=disbursementItemsGrid]')[0];
                let store = grid.getStore(),
                    pda_price = store.sum('pda_final_price'),
                    dda_price = store.sum('dda_final_price'),
                    final_price = store.sum('fda_final_price')
                        ? store.sum('fda_final_price')
                        : store.sum('dda_final_price');

                let start_price = pda_price ? pda_price : dda_price;

                if (!start_price && !final_price) return;

                if (final_price === 0 && start_price) final_price = start_price;

                if (start_price === 0 && final_price) start_price = final_price;

                const reDiff = function relDiff(a, b) {
                    return Math.abs((b - a) / a) * 100;
                };

                let variance = parseFloat(reDiff(start_price, final_price)).toFixed(1),
                    sign = start_price > final_price ? '-' : start_price < final_price ? '+' : '';

                return sign + variance + '%';
            },
            cell: {
                encodeHtml: false,
                cls: 'a-br-100',
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            text: 'Service comment',
            dataIndex: 'comment',
            sortable: false,
            menuDisabled: true,
            flex: 1,
            minWidth: 160,
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
                listeners: {},
            },
            renderer: function (val) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
            summaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
        },
        {
            text: 'Voucher No',
            dataIndex: 'voucher_number',
            sortable: false,
            width: 100,
            align: 'center',
            menuDisabled: true,
            hidden: true,
            bind: {
                hidden: '{selectedDisbursement.data.show_voucher ? false : true}',
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
                    validators: [new RegExp('^[0-9-]*$')],
                    validationMessage: 'Use only numbers and -',
                    textAlign: 'center',
                },
                listeners: {},
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">0</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value;
                } else {
                    return 0;
                }
            },
            summaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Center',
                },
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

            editor: {
                field: {
                    xtype: 'CostCentersCombo',
                    itemCls: 'a-disb-costs-combo',
                    displayField: 'accounting_code',
                    placeholder: 'Choose item',
                    valueField: 'accounting_code',
                    secondDisplayField: 'name',
                    type: 'account_number',
                    sourceButtonName: 'Add custom code',
                    itemTpl: new Ext.XTemplate(
                        '<div class="cost-center-combo-item"><div class="_value">{[this.formatValue(values.accounting_code)]}</div> <div  class="align-item">{[this.qtip(values.description)]}</div></div>',
                        '<div lass="cost-center-item-secod-value">{[this.formatValue(values.name)]}</div>',
                        {
                            formatValue: function (value) {
                                return value ? value : AbraxaConstants.placeholders.emptyValue;
                            },
                            qtip: function (value) {
                                if (value) {
                                    let description =
                                        '<i  class="align-icon material-icons md-icon-info info-icon-hovered align-icon" data-qtip="' +
                                        value +
                                        '" data-qalign="bc-tc" data-qanchor="true"></i>';

                                    return description;
                                } else {
                                    return '';
                                }
                            },
                        }
                    ),
                },
            },
            renderer: function (val, record) {
                const defaultExpenseItems =
                    record && record.get('default_expense_item') ? record.get('default_expense_item') : null;
                const sharedCostCenters = defaultExpenseItems ? defaultExpenseItems.shared_cost_centers : null;
                let isDescription = false;
                if (sharedCostCenters) {
                    isDescription = sharedCostCenters.filter((el) => el.accounting_code === val);
                }
                const description =
                    isDescription && isDescription[0] && isDescription[0].description
                        ? isDescription[0].description
                        : null;
                const qtip = description
                    ? '<i  class="material-icons md-icon-info info-icon-hovered" data-qtip="' +
                      description +
                      '" data-qalign="bc-tc" data-qanchor="true" ></i>'
                    : '';
                if (val) {
                    return '<div class="cost-center-info">' + val + qtip + ' </div> ';
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(value, record) {
                if (value && record.get('account_number')) {
                    return record.get('account_number');
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
            summaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
            },
        },
        {
            text: 'Customer center',
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
            editor: {
                xtype: 'CostCentersCombo',
                itemId: 'customerCostCenterCombo',
                itemCls: 'a-disb-costs-combo',
                displayField: 'name',
                valueField: 'name',
                placeholder: 'Choose item',
                secondValueField: 'accounting_code',
                sourceButtonName: 'Add custom cost center',
                type: 'customer_cost_center',
                itemTpl: new Ext.XTemplate(
                    '<div class="cost-center-combo-item"><div class="_value">{[this.formatValue(values.name)]}</div> <div  class="align-item"> {[this.qtip(values.description)]}</div></div>',
                    '<div lass="cost-center-item-secod-value">{[this.formatValue(values.accounting_code)]}</div>',
                    {
                        formatValue: function (value) {
                            return value ? value : AbraxaConstants.placeholders.emptyValue;
                        },
                        qtip: function (value) {
                            if (value) {
                                let description =
                                    '<i  class="align-icon material-icons md-icon-info info-icon-hovered align-icon" data-qtip="' +
                                    value +
                                    '" data-qalign="bc-tc" data-qanchor="true"></i>';

                                return description;
                            } else {
                                return '';
                            }
                        },
                    }
                ),
            },
            renderer: function (val, record) {
                const defaultExpenseItems =
                    record && record.get('default_expense_item') ? record.get('default_expense_item') : null;
                const sharedCostCenters = defaultExpenseItems ? defaultExpenseItems.shared_cost_centers : null;
                let isDescription = false;
                if (sharedCostCenters) {
                    isDescription = sharedCostCenters.filter((el) => el.name === val);
                }
                const description =
                    isDescription && isDescription[0] && isDescription[0].description
                        ? isDescription[0].description
                        : null;
                const qtip = description
                    ? '<i  class="material-icons md-icon-info info-icon-hovered" data-qtip="' +
                      description +
                      '" data-qalign="bc-tc" data-qanchor="true" ></i>'
                    : '';
                if (val) {
                    return '<div class="cost-center-info">' + val + qtip + ' </div> ';
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(value, record) {
                if (record && record.get('customer_cost_center')) {
                    return record.get('customer_cost_center');
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
            summaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
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
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: 'Enter comment',
                    clearable: false,
                    xtype: 'textfield',
                },
                listeners: {},
            },
            renderer: function (val) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            exportRenderer: function exportRenderer(value) {
                if (value) {
                    return value;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
            summaryRenderer: function exportSummaryRenderer() {
                return '';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '';
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
                hidden: '{selectedDisbursement.status == "draft" ? false : true}',
            },
            cell: {
                xtype: 'widgetcell',
                cls: 'a-cell-more',
                align: 'right',
                focusable: false,
                widget: {
                    xtype: 'container',
                    focusable: false,
                    padding: '0 12',
                    layout: {
                        type: 'hbox',
                        pack: 'end',
                    },
                    items: [
                        {
                            xtype: 'button',
                            margin: '0 6 0 0',
                            cls: 'a-no-content-btn a-filebutton',
                            iconCls: 'md-icon-attach-file md-icon-outlined',
                            ui: 'tool-xs round',
                            slug: 'portcallInvoiceCreate',
                            focusable: false,
                            text: '',
                            subObject: 'disbursements',
                            hidden: true,
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{selectedDisbursement.type == "pda" ? true : false}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Attach invoice',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (me) {
                                let expense = me.upVM().get('record');
                                Ext.create('Abraxa.view.adocs.CreateFinancialPopup', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            expense: expense,
                                            currentUser: this.upVM().get('currentUser'),
                                            userPermissions: this.upVM().get('userPermissions'),
                                            fromSupply: true,
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'button',
                            arrow: false,
                            focusable: false,
                            iconCls: 'md-icon-remove-circle-outline',
                            ui: 'tool-xs round',
                            subObject: 'disbursements',
                            slug: 'portcallDisbursementDeleteItem',
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
                            handler: function (me) {
                                let expense = me.upVM().get('record'),
                                    selectedDisbursement = me.upVM().get('selectedDisbursement'),
                                    invoices = me.upVM().get('invoices');

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you want to delete this item?',
                                    function (answer) {
                                        if (answer === 'yes') {
                                            let allTypes = ['pda_id', 'dda_id', 'sda_id', 'fda_id'];
                                            expense.set(selectedDisbursement.get('type') + '_id', null);
                                            //check for others if is null
                                            let allNull = true;
                                            Ext.Array.each(allTypes, function (type) {
                                                if (type !== selectedDisbursement.get('type') + '_id') {
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
                                                        Ext.toast('Record updated', 1000);
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
                testId: 'disbursementsGridItemBtn',
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
        painted: function () {
            let grouped = this.upVM().get('selectedDisbursement')
                ? this.upVM().get('selectedDisbursement').get('grouped')
                : false;
            this.setGrouped(grouped);
            this.refreshInnerWidth();
            this.syncRows();
            this.syncRowsToHeight(true);
        },
        refresh: function () {
            this.find('disbursementDetails').setMasked(false);
        },
        beforeedit: function () {
            let canEdit = this.upVM().get('editableDisbursementPermissions');
            if (!canEdit) {
                return false;
            }
            let store = this.upVM().get('userPermissions');
            if (store && Object.keys(store).length > 0) {
                let record = store['portcallDisbursements'];
                if (record && !record.edit) return false;
            }
            let disbursement = this.upVM().get('selectedDisbursement');

            if (disbursement.get('status') !== 'draft') return false;
        },
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
