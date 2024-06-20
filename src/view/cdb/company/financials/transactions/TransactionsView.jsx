import './TransactionsGrid';
import '../../../../../store/payments/Payments';

Ext.define('Abraxa.view.cdb.company.financials.transations.TransactionsView', {
    extend: 'Ext.Container',
    flex: 1,
    layout: 'fit',
    xtype: 'company.transactions.view',
    weighted: true,
    viewModel: {
        stores: {
            companyPayments: {
                type: 'payments',
                autoLoad: true,
                filters: [
                    {
                        property: 'organizationTransactions',
                        value: '{object_record.org_id}',
                    },
                ],
            },
        },
        formulas: {
            totalTransactionsRecords: {
                bind: {
                    bindTo: '{companyPayments}',
                    deep: true,
                },
                get: function (store) {
                    return store.getTotalCount();
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            weight: 1,
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Transactions',
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'hovered-underline',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search...',
                            centered: true,
                            width: 280,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var store = this.find('company-transactions-grid').getStore();
                                    if (newValue == '') store.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                                    var store = this.find('company-transactions-grid').getStore();
                                    store.removeFilter('search');
                                    if (query.length > 2) {
                                        store.addFilter({
                                            id: 'search',
                                            property: 'search',
                                            operator: '=',
                                            value: query,
                                            exactMatch: true,
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            right: 16,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    enableToggle: true,
                                    iconCls: 'md-icon-filter-alt md-icon-outlined',
                                    text: 'Filter',
                                    handler: function () {
                                        let grid = this.find('company-transactions-grid'),
                                            toggled = this.getPressed(),
                                            org_id = this.upVM().get('object_record.org_id');

                                        if (toggled) {
                                            grid.showFilterBar();
                                        } else {
                                            grid.hideFilterBar();
                                            grid.getStore().clearFilter();
                                            grid.getStore().filter('organizationTransactions', org_id);
                                            // grid.getStore().load();
                                        }
                                    },
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    ui: 'tool-text-sm',
                                    arrow: false,
                                    text: 'Export',
                                    margin: '0 0 0 8',
                                    menu: {
                                        items: [
                                            {
                                                text: 'Export to Excel',
                                                separator: true,
                                                iconCls: 'md-icon-outlined md-icon-difference',
                                                handler: function (me) {
                                                    let grid = this.find('company-transactions-grid');
                                                    grid.saveDocumentAs({
                                                        type: 'xlsx', // exporter alias
                                                        title: 'Active transactions',
                                                        showSummary: true,
                                                        fileName: 'Transactions.xlsx',
                                                    });
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-settings',
                                    text: 'Customize',
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        this.find('company-transactions-grid')
                                            .getPlugin('gridviewoptions')
                                            .showViewOptions();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'company.transactions.grid',
        },
    ],
});
