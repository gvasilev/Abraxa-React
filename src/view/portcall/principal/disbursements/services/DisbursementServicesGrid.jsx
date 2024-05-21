import './DisbursementServicesGridController.jsx';
Ext.define('Abraxa.view.portcall.principal.disbursements.services.DisbursementServicesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'DisbursementServicesGrid',
    controller: 'DisbursementServicesGridController',
    infinite: false,
    minHeight: 120,
    hideScrollbar: true,
    cls: 'a-grid-compact a-disb-grid a-disb-items-grid a-offset-grid',
    ui: 'bordered',
    reference: 'disbursementItemsGrid',
    publishes: ['grouped'],
    bind: {
        store: '{disbursementItemsGrid.grouped ? disbursementServicesStoreGrouped : disbursementServicesStore}',
        hideHeaders: '{disbursementServicesStore.count ? false : true}',
    },
    plugins: {
        gridsummaryrow: {
            row: {
                xtype: 'gridsummaryrow',
                // docked: null,
                // scrollDock: 'end',
                // // weight: -2,
                itemId: 'disb-grid-summary',
                // cls: 'a-bb-100',
                bind: {
                    hidden: '{disbursementServicesStore.count ? false : true}',
                },
                // body: {
                //     html: 'Total',
                // },
            },
        },
    },
    itemConfig: {
        viewModel: true,
    },
    collapsible: {
        tool: {
            margin: '0 8',
            zone: 'start',
        },
    },
    sortable: false,
    grouped: false,
    toggleGrouped: function () {
        this.setGrouped(!this.getGrouped());
    },
    pinHeaders: false,
    groupHeader: {
        xtype: 'DisbursementServicesGroupHeader',
        padding: '16 0',
        tpl: '{name}',
        listeners: {
            painted: function () {
                // this "if" fix terrible extjs framework unexpected behaviour!!!
                //Broke the grid , when change groun/ungrouped state some times
                if (this.getGroup().previousGroup) this.getGroup().collapse();
            },
        },
    },
    selectable: {
        mode: 'single',
    },
    emptyText: {
        xtype: 'container',
        height: 320,
        layout: {
            type: 'vbox',
        },
        zIndex: 10,
        flex: 1,
        items: [
            {
                xtype: 'div',
                centered: true,
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No items available</div></div>',
            },
        ],
    },
    columns: [
        {
            width: 42,
            sortable: false,
            menuDisabled: true,
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? false : true}',
            },
        },
        {
            text: 'Service item',
            width: 220,
            dataIndex: 'default_expense_item_id',
            sortable: false,
            menuDisabled: true,
            resizable: false,
            cls: 'a-column-offset-x24',
            cell: {
                encodeHtml: false,
                cls: 'a-main-costs fw-b a-cell-offset-x24',
            },
            summaryCell: {
                xtype: 'gridcell',
                encodeHtml: false,
                cls: 'a-main-costs',
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
        },
        {
            menuDisabled: true,
            sortable: false,
            resizable: false,
            width: 32,
            cell: {
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'div',
                    cls: 'hbox justify-content-center',
                    html: '<i class="md-icon-outlined md-icon-chat md-18"></i>',
                    bind: {
                        hidden: '{!record.comment.length ? true : false}',
                    },
                    tooltip: {
                        anchorToTarget: true,
                        anchor: true,
                        html: 'Service comment',
                        align: 'bc-tc?',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        allowOver: false,
                        closeAction: 'destroy',
                    },
                },
            },
        },
        {
            text: 'Cost center',
            resizable: false,
            width: 180,
            sortable: false,
            menuDisabled: true,
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? true : false}',
            },
            cell: {
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'CostCentersComboPrincipal',
                    placeholder: AbraxaConstants.placeholders.emptyValue,
                    bind: {
                        store: '{store}',
                    },
                    ui: 'classic',
                    displayField: 'name',
                    secondDisplayField: 'accounting_code',
                    type: 'customer_cost_center',
                },
            },
        },
        {
            text: 'Accounting code',
            dataIndex: 'account_number',
            width: 180,
            sortable: false,
            menuDisabled: true,
            bind: {
                hidden: '{disbursementItemsGrid.grouped ? true : false}',
            },
            cell: {
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'CostCentersComboPrincipal',
                    placeholder: AbraxaConstants.placeholders.emptyValue,
                    bind: {
                        store: '{store}',
                    },
                    ui: 'classic',
                    displayField: 'accounting_code',
                    secondDisplayField: 'name',
                    type: 'accounting_code',
                },
            },
        },

        {
            //TODO: this columns needs to me removed after implement BE for cost centers - WDEV-46
            text: 'Customer code',
            dataIndex: 'account_number',
            resizable: false,
            width: 130,
            menuDisabled: true,
            sortable: false,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            //TODO: this columns needs to me removed after implement BE for cost centers - WDEV-46
            text: 'Customer center',
            dataIndex: 'customer_cost_center',
            resizable: false,
            width: 130,
            menuDisabled: true,
            hidden: true,
            sortable: false,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Vendor',
            width: 180,
            dataIndex: 'vendor_id',
            sortable: false,
            menuDisabled: true,
            resizable: false,
            cell: {
                encodeHtml: false,
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
            summaryRenderer: function () {
                return '<div class="fs-16 fw-b text-right">Total:</div>';
            },
            exportSummaryRenderer: function exportSummaryRenderer() {
                return '<div class="fs-16 fw-b text-right">Total:</div>';
            },
        },
        {
            dataIndex: 'pda_final_price',
            resizable: false,
            text: 'PDA price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            cls: 'disb_special_column text_right a-column-bl',
            isHeaderContainer: 'false',
            summary: 'sum',
            width: 160,
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
                        html: '<a class="disbursement_pda_link fw-b" href="javascript:void(0);" data-disbursement-id="{selectedDisbursement.pda_id}">PDA price</a>',
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
                zeroValue: '<span class="a-cell-placeholder c-grey">0.00</span>',
            },
            listeners: {
                click: {
                    element: 'element',
                    delegate: 'a.disbursement_pda_link',
                    fn: function () {
                        let disbursement = this.component.upVM().get('selectedDisbursement');
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo(
                                'portcall/' +
                                    disbursement.get('portcall_id') +
                                    '/disbursements/' +
                                    disbursement.get('pda_id')
                            );
                    },
                },
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
            renderer: 'currencyWithAmountRenderer',
            summaryRenderer: 'currencyWithAmountRenderer',
        },
        {
            dataIndex: 'dda_final_price',
            text: 'DDA price',
            sortable: false,
            menuDisabled: true,
            resizable: false,
            align: 'right',
            width: 160,
            cls: 'disb_special_column text_right a-column-bl',
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
                        html: '<a class="disbursement_dda_link fw-b" href="javascript:void(0);" data-disbursement-id="{selectedDisbursement.dda_id}">DDA price</a>',
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
                zeroValue: '<span class="a-cell-placeholder c-grey">0.00</span>',
            },
            listeners: {
                click: {
                    element: 'element',
                    delegate: 'a.disbursement_dda_link',
                    fn: function () {
                        let disbursement = this.component.upVM().get('selectedDisbursement');
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo(
                                'portcall/' +
                                    disbursement.get('portcall_id') +
                                    '/disbursements/' +
                                    disbursement.get('dda_id')
                            );
                    },
                },
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
            renderer: 'currencyWithAmountRenderer',
            summaryRenderer: 'currencyWithAmountRenderer',
        },
        {
            dataIndex: 'exchange_rate',
            width: 66,
            text: 'ROE',
            resizable: false,
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
                    complete: function (editor) {
                        let store = editor.up('grid').upVM().get('expenses');
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
            sortable: false,
            dataIndex: 'pda_final_price',
            menuDisabled: true,
            align: 'right',
            resizable: false,
            width: 160,
            hidden: true,
            summary: 'sum',
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type == "pda" ? false : true}',
            },
            cls: 'disb_special_column text_right a-column-bl',
            padding: '8 12 8 0',
            items: [
                {
                    xtype: 'div',
                    bind: {
                        html: '<span class="disbursement_dda_link fw-b">PDA price</span>',
                    },
                },
                {
                    xtype: 'div',
                    bind: {
                        html: '<div class="a-status-badge a-status-sm status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
                    },
                },
            ],
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value fw-n c-grey">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-cell-final-price {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
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
            renderer: 'currencyWithAmountRenderer',
            summaryRenderer: 'currencyWithAmountRenderer',
        },
        {
            sortable: false,
            dataIndex: 'dda_final_price',
            menuDisabled: true,
            align: 'right',
            width: 160,
            resizable: false,
            hidden: true,
            summary: 'sum',
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type == "dda" ? false : true}',
            },
            cls: 'disb_special_column text_right a-column-bl',
            padding: '8 12 8 0',
            items: [
                {
                    xtype: 'div',
                    bind: {
                        html: '<span class="disbursement_dda_link fw-b">DDA price</span>',
                    },
                },
                {
                    xtype: 'div',
                    bind: {
                        html: '<div class="a-status-badge a-status-sm status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
                    },
                },
            ],
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value c-grey fw-n">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-cell-final-price {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
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
            renderer: 'currencyWithAmountRenderer',
            summaryRenderer: 'currencyWithAmountRenderer',
        },
        {
            sortable: false,
            dataIndex: 'fda_final_price',
            menuDisabled: true,
            resizable: false,
            align: 'right',
            width: 160,
            summary: 'sum',
            hidden: true,
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type == "fda" ? false : true}',
            },
            cls: 'disb_special_column text_right a-column-bl',
            padding: '8 12 8 0',
            items: [
                {
                    xtype: 'div',
                    bind: {
                        html: '<span class="disbursement_dda_link fw-b">FDA price</span>',
                    },
                },
                {
                    xtype: 'div',
                    bind: {
                        html: '<div class="a-status-badge a-status-sm status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
                    },
                },
            ],
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value c-grey">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-cell-final-price {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
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
            renderer: 'currencyWithAmountRenderer',
            summaryRenderer: 'currencyWithAmountRenderer',
        },
        {
            sortable: false,
            dataIndex: 'sda_final_price',
            menuDisabled: true,
            align: 'right',
            resizable: false,
            width: 160,
            hidden: true,
            summary: 'sum',
            bind: {
                text: '{selectedDisbursement.type:uppercase} price',
                hidden: '{selectedDisbursement.type == "sda" ? false : true}',
            },
            cls: 'disb_special_column text_right a-column-bl',
            padding: '8 12 8 0',
            items: [
                {
                    xtype: 'div',
                    bind: {
                        html: '<span class="disbursement_dda_link fw-b">SDA price</span>',
                    },
                },
                {
                    xtype: 'div',
                    bind: {
                        html: '<div class="a-status-badge a-status-sm status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
                    },
                },
            ],
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-value">0.00</span>',
                bind: {
                    cls: 'a-cell-amount a-cell-final-price {selectedDisbursement.data.show_variance ? "a-cell-variance" : "a-cell-variance"}',
                },
                align: 'right',
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
            renderer: 'currencyWithAmountRenderer',
            summaryRenderer: 'currencyWithAmountRenderer',
        },
        {
            dataIndex: 'variance',
            text: 'Variance',
            sortable: false,
            width: 100,
            menuDisabled: true,
            cls: 'a-column-bl',
            resizable: false,
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
                    '<div class="hbox ' +
                    cls +
                    '"><i class="material-icons-outlined md-16 ' +
                    cls +
                    '">' +
                    icon +
                    '</i><span class="ml-8">' +
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
                cls: 'variance_cell a-cell-bl',
            },
            exportStyle: {
                alignment: {
                    horizontal: 'Right',
                },
            },
        },
        {
            dataIndex: 'vouchers',
            resizable: false,
            sortable: false,
            menuDisabled: true,
            flex: 1,
            cell: {
                encodeHtml: false,
                align: 'right',
                hideMode: 'opacity',
                bind: {
                    hidden: '{record.vouchers.count ? false : true}',
                    tpl: '<div class="hbox justify-content-end mr-16"><i data-qtip="Invoices" data-qalign="bc-tc" data-qanchor="true" class="md-icon-outlined md-icon-attach md-18 c-link">attach_file</i><span class="fw-n ml-6">{record.vouchers.count}</span></div>',
                },
            },
        },
    ],
    listeners: {
        painted: function () {
            this.focus();
        },
    },
});
