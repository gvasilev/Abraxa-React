import './ServiceLibraryController.jsx';
Ext.define('Abraxa.view.settings.library.expenses.ExpensesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.expenses.grid',
    controller: 'ServiceLibraryController',
    cls: 'a-offset-grid abraxa-grid',
    ui: 'bordered',
    shadow: false,
    flex: 1,
    reference: 'LibraryServicesGrid',
    itemId: 'LibraryServicesGrid',
    viewModel: {
        formulas: {
            serviceGridSelection: {
                bind: {
                    bindTo: '{defaultExpenseItems}',
                    deep: true,
                },
                get: function (store) {
                    return store.queryBy(function (record) {
                        return record.get('is_checked') == true;
                    }).items;
                },
            },
        },
    },
    bind: {
        store: '{defaultExpenseItems}',
    },
    itemConfig: {
        height: 48,
        viewModel: true,
    },
    plugins: {
        gridviewoptions: true,
    },
    selectable: true,
    items: [
        {
            xtype: 'container',
            docked: 'top',
            padding: '0 24 0 32',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    flex: 1,
                },
                {
                    xtype: 'searchfield',
                    ui: 'classic filled-light',
                    cls: 'a-field-icon icon-search',
                    placeholder: 'Search service',
                    width: 300,
                    height: 40,
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            var disbursementsItems = this.upVM().get('defaultExpenseItems');
                            if (newValue == '') disbursementsItems.removeFilter('search');
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            var query = this.getValue().toLowerCase();
                            var disbursementsItems = this.upVM().get('defaultExpenseItems');
                            disbursementsItems.removeFilter('disbursementsItems');
                            if (query.length > 2) {
                                disbursementsItems.addFilter(
                                    new Ext.data.Query({
                                        id: 'search',
                                        source: 'name like "' + query + '"',
                                    })
                                );
                            }
                        },
                    },
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        pack: 'end',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-add md-icon-outlined',
                            text: 'Assign my cost center',
                            margin: '0 8 0 0',
                            disabled: true,
                            bind: {
                                disabled: '{!serviceGridSelection.length}',
                            },
                            handler: 'assignCostCenterMultiple',
                        },
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-settings md-icon-outlined',
                            text: 'Manage columns',
                            margin: '0 8 0 0',
                            handler: function () {
                                this.up('grid').getPlugin('gridviewoptions').showViewOptions();
                            },
                        },
                    ],
                },
            ],
        },
    ],
    selectable: {
        headerCheckbox: false,
        checkbox: true,
        checkboxDefaults: {
            xtype: 'selectioncolumn',
            text: null,
            dataIndex: '',
            cell: {
                hideMode: 'opacity',
            },
            width: 40,
            listeners: {
                checkchange: function (me, rowIndex, checked, record, e, eOpts) {
                    if (checked) {
                        record.set('is_checked', true);
                    } else {
                        record.set('is_checked', false);
                    }
                },
            },
        },
    },
    columns: [
        {
            text: 'Name',
            dataIndex: 'system_name',
            groupable: false,
            minWidth: 320,
            flex: 2,
            cell: {
                encodeHtml: false,
            },
        },
        {
            text: 'Alias name',
            dataIndex: 'alias_name',
            groupable: false,
            minWidth: 220,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return value;
                }
                return AbraxaConstants.placeholders.emptyCellSpan;
            },
        },
        {
            text: 'Accounting code',
            dataIndex: 'accounting_code',
            groupable: false,
            minWidth: 220,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return value;
                }
                return AbraxaConstants.placeholders.emptyCellSpan;
            },
        },
        {
            text: 'My cost center',
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record && record.cost_centers().count() == 2) {
                    return record.cost_centers().getAt(1).get('name');
                } else if (record && record.cost_centers().count() > 2) {
                    return (
                        'Multiple' + '&nbsp;<span class="sm-title">(' + (record.cost_centers().count() - 1) + ')</span>'
                    );
                }
                return AbraxaConstants.placeholders.emptyCellSpan;
            },
        },
        // {
        //     text: 'Recoverable',
        //     minWidth: 120,
        // },
        {
            text: 'Reference ID',
            dataIndex: 'alias',
            minWidth: 180,
            hidden: true,
            cell: {
                cls: 'c-grey',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value && value.reference) {
                    return value.reference;
                }
                return AbraxaConstants.placeholders.emptyCellSpan;
            },
        },
        {
            text: 'Updated by',
            minWidth: 180,
            cell: {
                cls: 'a-cell-py8',
                height: 48,
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.alias.updated_by_user}',
                            updated_at: '{record.alias.updated_at}',
                        },
                    },
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cls: 'a-column-actions',
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                hideMode: 'opacity',
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
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (me, selection) {},
    },
});
