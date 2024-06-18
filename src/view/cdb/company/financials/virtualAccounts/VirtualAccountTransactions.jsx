Ext.define('Abraxa.view.cdb.company.virtualAccounts.VirtualAccountTransactions', {
    extend: 'Ext.Container',
    xtype: 'virtual.accounts.transactions',
    cls: 'a-card-portcalls',
    flex: 1,
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-bb-100',
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar',
                    docked: 'top',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '<span class="a-panel-title">Transactions</span>',
                            },
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                // {
                                //     xtype: 'button',
                                //     ui: 'tool-text-sm',
                                //     margin: '0 0 0 6',
                                //     text: 'Filter',
                                //     iconCls: 'md-icon-filter-list md-icon-outlined',
                                //     enableToggle: true,
                                //     tooltip: {
                                //         html: 'Advanced filters',
                                //         align: "bc-tc?",
                                //     },
                                //     handler: function () {
                                //         let grid = this.find('vAtransactionsGrid'),
                                //             filterBar = grid.getPlugin('gridfilterbar'),
                                //             toggled = this.getPressed();

                                //         if (toggled) {
                                //             grid.showFilterBar();
                                //         } else {
                                //             grid.hideFilterBar();
                                //         }
                                //     }
                                // },
                                {
                                    xtype: 'button',
                                    text: 'Export',
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    ui: 'tool-text-sm',
                                    slug: 'cdbFinancialVirtualAccountsExport',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    menu: [
                                        {
                                            text: 'Export to Excel',
                                            iconCls: 'md-icon-outlined md-icon-difference',
                                            handler: function (me) {
                                                let grid = this.find('vAtransactionsGrid'),
                                                    virtualAccount = me.upVM().get('virtualAccountsGrid.selection');

                                                grid.saveDocumentAs({
                                                    type: 'xlsx', // exporter alias
                                                    title: virtualAccount.get('name') + ' transactions',
                                                    showSummary: true,
                                                    fileName: virtualAccount.get('name') + '_transactions.xlsx',
                                                });
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-settings',
                                    text: 'Customize',
                                    handler: function () {
                                        this.find('vAtransactionsGrid').getPlugin('gridviewoptions').showViewOptions();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'grid',
            flex: 1,
            slug: 'grid',
            ui: 'bordered',
            cls: 'abraxa-grid a-transactions-grid a-offset-grid transactions_grid',
            collapsible: false,
            pinHeaders: false,
            itemId: 'vAtransactionsGrid',
            reference: 'virtualAccountTransaction',
            stateful: ['plugins', 'columns'],
            plugins: {
                gridexporter: true,
                gridviewoptions: true,
                gridfilterbar: {
                    hidden: true,
                },
                pagingtoolbar: {
                    classCls: 'a-bt-100 a-wps-paging-toolbar',
                    pageSize: 25,
                    toolbar: {
                        bordered: true,
                        nextButton: {
                            ui: 'tool-sm round',
                        },
                        prevButton: {
                            ui: 'tool-sm round',
                        },
                        listeners: {
                            initialize: function () {
                                this.add({
                                    xtype: 'div',
                                    margin: '0 16',
                                    cls: 'sm-title',
                                    bind: {
                                        html: '<strong>{totalVirtualPaymentsRecords}</strong> records',
                                    },
                                });
                                this.add({
                                    xtype: 'div',
                                    width: '60%',
                                });
                            },
                        },
                    },
                },
            },
            selectable: {
                mode: 'single',
            },
            store: [],
            bind: {
                store: '{virtualAccountPayments}',
            },
            scrollToTopOnRefresh: false,
            scrollable: true,
            emptyText: {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                },
                centered: true,
                items: [
                    {
                        xtype: 'div',
                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-483 -193)"><g transform="translate(-351 -152)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><path d="M351.031,76.42h-2.478V56a3.723,3.723,0,0,0-3.717-3.717H333.618l-.3-.81a6.175,6.175,0,0,0-11.664,0l-.3.81H310.136A3.724,3.724,0,0,0,306.419,56v51.222a3.723,3.723,0,0,0,3.717,3.717h15.519a14.306,14.306,0,0,0,.892,2.478H310.138a6.2,6.2,0,0,1-6.2-6.2V56h0a6.2,6.2,0,0,1,6.2-6.2h9.532a8.638,8.638,0,0,1,15.628,0h9.532a6.2,6.2,0,0,1,6.2,6.2V76.42M313.441,68.8h0a1.652,1.652,0,0,0,1.652,1.652h24.758A1.652,1.652,0,0,0,341.5,68.8h0a1.652,1.652,0,0,0-1.652-1.652H315.093A1.652,1.652,0,0,0,313.441,68.8Zm0,16.52h0a1.652,1.652,0,0,0,1.652,1.652l12.758.06a1.652,1.652,0,0,0,1.652-1.652h0a1.652,1.652,0,0,0-1.652-1.652l-12.758-.06A1.652,1.652,0,0,0,313.441,85.319Zm0,8.26h0a1.652,1.652,0,0,0,1.652,1.652h6.758a1.652,1.652,0,0,0,1.652-1.652h0a1.652,1.652,0,0,0-1.652-1.652h-6.758A1.652,1.652,0,0,0,313.441,93.579Zm0-16.52h0a1.652,1.652,0,0,0,1.652,1.652h18.758a1.652,1.652,0,0,0,1.652-1.652h0a1.652,1.652,0,0,0-1.652-1.652H315.093A1.652,1.652,0,0,0,313.441,77.059ZM351.79,92.97v2h-4v-2Zm0,0v2h-4v-2Zm13-4v22a4.012,4.012,0,0,1-4,4h-22a4.012,4.012,0,0,1-4-4v-22a4.012,4.012,0,0,1,4-4h22A4.012,4.012,0,0,1,364.79,88.97Zm-6,14h-7v1h-4v-1H340.8l-.01,4a2,2,0,0,0,1.99,2h14.01a2,2,0,0,0,2-1.99Zm1-6a2.006,2.006,0,0,0-2-2h-4.01v-2l-2-2h-4l-2,2v2h-3.99a2.006,2.006,0,0,0-2,2v3a2,2,0,0,0,1.99,2h6.01v-2h4v2h6a2.006,2.006,0,0,0,2-2Zm-12-4h4v2h-4ZM327.49,49.8a3.72,3.72,0,1,0,3.71,3.72A3.719,3.719,0,0,0,327.49,49.8Zm1.85,3.72a1.855,1.855,0,1,1,0-.01Z" transform="translate(216.063 175.158)" fill="#c8d4e6"></path></g></svg><div class="a-no-content-txt">No transactions available</div></div>',
                    },
                ],
            },
            emptyTextDefaults: {
                xtype: 'emptytext',
                cls: 'a-empty-text',
            },
            itemConfig: {
                height: 56,
                viewModel: {},
            },
            columns: [
                {
                    text: '',
                    dataIndex: 'id',
                    cls: 'a-column-icon',
                    ignore: true,
                    cell: {
                        cls: 'a-cell-icon fs-18',
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (value) {
                            let virtualAccount = this.upVM().get('virtualAccountsGrid.selection');
                            if (record.get('is_refund')) {
                                return '<i class="md-icon-outlined c-yellow">add</i>';
                            } else {
                                if (record.get('to_id') == virtualAccount.get('id')) {
                                    return '<i class="md-icon-outlined c-green-500">add</i>';
                                } else if (record.get('from_id') == virtualAccount.get('id')) {
                                    return '<i class="md-icon-outlined c-red">remove</i>';
                                }
                            }
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                    ignoreExport: true,
                },
                {
                    text: 'Portcall',
                    dataIndex: 'updated_at',
                    cls: 'a-column-offset-x24',
                    cell: {
                        cls: 'a-cell-offset-x24',
                        encodeHtml: false,
                    },
                    flex: 1,
                    minWidth: 220,
                    filterType: {
                        // required configs
                        type: 'string',
                        // optional configs
                        dataIndex: 'vessel_name_id',
                        operator: 'like',
                        operators: ['like'],
                        fieldDefaults: {
                            ui: 'classic',
                            padding: 3,
                            placeholder: 'Vessel name or File ID',
                            // any Ext.form.field.Text configs accepted
                        },
                    },
                    renderer: function (value, record) {
                        if (record && record.get('owner')) {
                            let owner = record.get('owner');
                            if (owner.model_name.toLowerCase().indexOf('portcall') > -1) {
                                if (owner) {
                                    return (
                                        '<a href="javascript:void(0)" class="fw-b">' +
                                        owner.voyage.vessel_name +
                                        '</a><div class="sm-title">' +
                                        owner.file_id +
                                        '</div>'
                                    );
                                }
                            } else {
                                return '<span class="a-cell-placeholder">---</span>';
                            }
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                    exportRenderer: function (value, record, dataIndex, cell, column) {
                        if (value) {
                            if (record && record.get('owner').port_id) {
                                return record.get('owner').voyage.vessel_name;
                            }
                        }
                    },
                },
                {
                    text: 'Port',
                    // xtype: 'templatecolumn',
                    dataIndex: 'updated_at',
                    minWidth: 180,
                    cell: {
                        cls: 'expand a-cell-port',
                        encodeHtml: false,
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a',
                                fn: function (el) {
                                    let portId = el.currentTarget.getAttribute('data-portid');
                                    if (portId) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showPortDialogById(portId);
                                    }
                                },
                            },
                        },
                    },
                    filterType: {
                        // required configs
                        type: 'string',
                        // optional configs
                        dataIndex: 'port_name',
                        operator: 'like',
                        operators: ['like'],
                        fieldDefaults: {
                            ui: 'classic',
                            padding: 3,
                            placeholder: 'Port name',
                            // any Ext.form.field.Text configs accepted
                        },
                    },
                    renderer: function (value, record) {
                        let data = AbraxaConstants.placeholders.emptyValue;
                        if (record && record.get('owner') && record.get('owner').port_id) {
                            data = record.get('owner').port_name;
                        }
                        return data;
                    },
                    exportRenderer: function (value, record, dataIndex, cell, column) {
                        if (value) {
                            if (record && record.get('owner').port_id) {
                                return record.get('owner').port_name;
                            }
                        }
                    },
                },
                {
                    text: 'Date',
                    minWidth: 140,
                    dataIndex: 'created_at',
                    cell: {
                        cls: 'a-cell-date',
                        encodeHtml: false,
                    },
                    filterType: {
                        // required configs
                        type: 'date',
                        operator: '>',
                        // optional configs
                        // dataIndex: 'created_at',
                        operators: ['=', '>', '<='],
                        fieldDefaults: {
                            dateFormat: 'd/m/y',
                            ui: 'classic',
                            padding: 3,
                            placeholder: 'Date',
                            // any Ext.form.field.Text configs accepted
                        },
                        // serializer: function (value) {

                        //     return;
                        // }
                    },
                    renderer: function (value) {
                        if (value) {
                            return (
                                '<div class="hbox"><i class="material-icons-outlined md-18 mr-8">calendar_today</i>' +
                                moment(value).format('DD MMM YY') +
                                '</div>'
                            );
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                    exportRenderer: function (value, record, dataIndex, cell, column) {
                        if (value) {
                            return moment(new Date(value)).format(AbraxaConstants.formatters.date.dayMonthYearSlash);
                        }
                    },
                },
                {
                    text: 'Type',
                    minWidth: 120,
                    dataIndex: 'id',
                    cell: {
                        encodeHtml: false,
                    },
                    filterType: {
                        // required configs
                        type: 'string',
                        operator: '=',
                        operators: ['='],
                        // optional configs
                        fieldDefaults: {
                            xtype: 'selectfield',
                            placeholder: 'Type',
                            ui: 'classic',
                            padding: 3,
                            valueField: 'value',
                            displayField: 'name',
                            queryMode: 'local',
                            clearable: true,
                            options: [
                                {
                                    name: 'Debit',
                                    value: 'debit',
                                },
                                {
                                    name: 'Credit',
                                    value: 'credit',
                                },
                            ],
                            // any Ext.form.field.Text configs accepted
                        },
                    },
                    renderer: function (value, record) {
                        if (value) {
                            let virtualAccount = this.upVM().get('virtualAccountsGrid.selection');
                            if (record.get('is_refund')) {
                                return '<span class="a-status-badge a-status-md status-refund">Refund</span>';
                            } else {
                                if (record.get('to_id') == virtualAccount.get('id')) {
                                    return '<span class="a-status-badge a-status-md status-credit">Credit</span>';
                                } else if (record.get('from_id') == virtualAccount.get('id')) {
                                    return '<span  class="a-status-badge a-status-md status-debit">Debit</span>';
                                }
                            }
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                    exportRenderer: function (value, record, dataIndex, cell, column) {
                        if (value) {
                            let virtualAccount = column.upVM().get('virtualAccountsGrid.selection');
                            if (record.get('is_refund')) {
                                return '<span class="a-status-badge a-status-md status-refund">Refund</span>';
                            } else {
                                if (record.get('to_id') == virtualAccount.get('id')) {
                                    return '<span class="a-status-badge status-credit">Credit</span>';
                                } else if (record.get('from_id') == virtualAccount.get('id')) {
                                    return '<span  class="a-status-badge status-debit">Debit</span>';
                                }
                            }
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                },
                {
                    dataIndex: 'currency',
                    text: 'Currency',
                    minWidth: 100,
                    groupable: false,
                    sortable: false,
                    align: 'center',
                    cls: 'a-column-bl',
                    cell: {
                        cls: 'a-cell-bl',
                        align: 'center',
                    },
                },
                {
                    text: 'Amount',
                    dataIndex: 'amount',
                    sortable: false,
                    menuDisabled: true,
                    align: 'right',
                    cls: 'a-column-amount',
                    minWidth: 120,
                    // formatter: 'number("0,000.00")',
                    // summary: 'sum',
                    cell: {
                        encodeHtml: false,
                        // formatter: 'number("0,000.00")',
                        align: 'right',
                        cls: 'a-cell-amount a-final-da-cell',
                        zeroValue: '<span class="a-cell-placeholder">0,000.00</span>',
                    },
                    filterType: {
                        // required configs
                        type: 'number',
                        operator: '>',
                        // optional configs
                        operators: ['=', '>', '<='],
                        fieldDefaults: {
                            ui: 'classic',
                            padding: 3,
                            placeholder: 'Amount',
                            // any Ext.form.field.Text configs accepted
                        },
                        // serializer: function (value) {

                        //     return;
                        // }
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return '</b><b class="fw-b">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
                        }
                    },
                    exportRenderer: function (value, record, dataIndex, cell, column) {
                        if (value) {
                            return record.get('currency') + ' ' + Ext.util.Format.number(value, '0,000.00');
                        }
                    },
                },
                {
                    text: 'ROE',
                    minWidth: 100,
                    dataIndex: 'from_exchange_rate',
                    align: 'center',
                    cls: 'a-column-bl',
                    cell: {
                        cls: 'a-cell-bl',
                        encodeHtml: false,
                        align: 'center',
                    },
                    renderer: function (value, record) {
                        if (value) {
                            let virtualAccount = this.upVM().get('virtualAccountsGrid.selection');
                            if (record.get('to_id') == virtualAccount.get('id')) {
                                return Abraxa.utils.Functions.formatROE(record.get('to_exchange_rate'));
                            } else if (record.get('from_id') == virtualAccount.get('id')) {
                                return Abraxa.utils.Functions.formatROE(record.get('from_exchange_rate'));
                            }
                        } else {
                            return Abraxa.utils.Functions.formatROE(1);
                        }
                    },
                    exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                        if (val) {
                            let virtualAccount = column.upVM().get('virtualAccountsGrid.selection');
                            if (record.get('to_id') == virtualAccount.get('id')) {
                                return Abraxa.utils.Functions.formatROE(record.get('to_exchange_rate'));
                            } else if (record.get('from_id') == virtualAccount.get('id')) {
                                return Abraxa.utils.Functions.formatROE(record.get('from_exchange_rate'));
                            }
                        } else {
                            return Abraxa.utils.Functions.formatROE(1);
                        }
                    },
                },
                {
                    text: 'Balance',
                    dataIndex: 'balance_after_transaction',
                    sortable: false,
                    menuDisabled: true,
                    align: 'right',
                    minWidth: 120,
                    summary: 'sum',
                    cls: 'a-column-amount a-column-br',
                    cell: {
                        encodeHtml: false,
                        align: 'right',
                        cls: 'a-cell-amount a-cell-br',
                    },
                    filterType: {
                        // required configs
                        type: 'number',
                        operator: '>',
                        // optional configs
                        operators: ['=', '>', '<='],
                        fieldDefaults: {
                            ui: 'classic',
                            padding: 3,
                            placeholder: 'Balance',
                            // any Ext.form.field.Text configs accepted
                        },
                        // serializer: function (value) {

                        //     return;
                        // }
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return '<b class="fw-b">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
                        }
                    },
                    exportRenderer: function (value, record, dataIndex, cell, column) {
                        if (value) {
                            return (
                                column.upVM().get('virtualAccountsGrid.selection.currency') +
                                ' ' +
                                Ext.util.Format.number(value, '0,000.00')
                            );
                        }
                    },
                },
                {
                    dataIndex: '',
                    minWidth: 90,
                    // maxWidth: 90,
                    flex: 1,
                    sortable: false,
                    menuDisabled: true,
                    resizable: false,
                    hideable: false,
                    editable: false,
                    ignore: true,
                    cell: {
                        cls: 'no_expand a_grid_action a-cell-more',
                        align: 'right',
                        toolDefaults: {
                            zone: 'end',
                        },
                        tools: [
                            {
                                xtype: 'button',
                                iconCls: 'md-icon-navigate-next',
                                ui: 'tool-sm round normal raised',
                                tooltip: {
                                    anchorToTarget: true,
                                    align: 'bc-tc?',
                                    html: 'View details',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    closeAction: 'destroy',
                                },
                                handler: function () {
                                    let record = this.upVM().get('record');
                                    this.up('grid').select(record);
                                },
                            },
                        ],
                    },
                },
            ],
            preventSelectionOnTool: true,
        },
    ],
});
