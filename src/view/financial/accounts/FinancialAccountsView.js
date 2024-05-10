Ext.define('Abraxa.view.financial.accounts.FinancialAccountsView', {
    extend: 'Ext.Container',
    layout: 'fit',
    xtype: 'financial.accounts.view',
    testId: 'financialAccountsView',
    viewModel: {
        stores: {
            accountsStore: {
                type: 'accounts',
                autoLoad: true,
            },
            portcallAgentStatus: {
                type: 'portcall.statuses',
                autoLoad: true,
            },
        },
        formulas: {
            totalAccountRecords: {
                bind: {
                    bindTo: '{accountsStore}',
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
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    controller: 'portcalls-agent-controller',
                    items: [
                        {
                            xtype: 'button',
                            testId: 'financialAccountsViewPortcallBtn',
                            text: 'Port call',
                            iconCls: 'md-icon-add',
                            cls: 'chameleon_add_portcall',
                            ui: 'action small',
                            hideMode: 'opacity',
                            slug: 'portcallCreate',
                            bind: {
                                permission: '{userPermissions}',
                                handler:
                                    '{currentUser.company.type == "agent" ? "createPortcallAgent" : "createPrincipalPortcall"}',
                            },
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
                                    var store = this.find('financial-accounts-grid').getStore();
                                    if (newValue == '') store.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    var query = this.getValue().toLowerCase();
                                    var store = this.find('financial-accounts-grid').getStore();
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
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-br-100',
                                    padding: '0 8 0 0',
                                    items: [
                                        {
                                            xtype: 'button',
                                            testId: 'financialAccountsViewArchiveBtn',
                                            ui: 'tool-text-sm',
                                            enableToggle: true,
                                            iconCls: 'md-icon-inventory-2 md-icon-outlined',
                                            text: 'Archive',
                                            listeners: {
                                                painted: function (me) {
                                                    const stateProvider = Ext.state.Provider.get();
                                                    const state =
                                                        stateProvider.state['financial-accounts-grid-filterbar'];
                                                    if (state && state.find((s) => s.id === 'archived')) {
                                                        me.setPressed(true);
                                                    }
                                                },
                                            },
                                            handler: function () {
                                                let store = this.find('financial-accounts-grid').getStore(),
                                                    toggled = this.getPressed();

                                                if (toggled) {
                                                    store.addFilter({
                                                        id: 'archived',
                                                        property: 'only_archived',
                                                        operator: '=',
                                                        value: true,
                                                    });
                                                } else {
                                                    store.removeFilter('archived');
                                                }
                                                // store.load();
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'GridFiltersButton',
                                    gridItemId: 'financial-accounts-grid',
                                },

                                {
                                    xtype: 'button',
                                    testId: 'financialAccountsViewExportBtn',
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
                                                    let grid = this.find('financial-accounts-grid');
                                                    grid.saveDocumentAs({
                                                        type: 'xlsx', // exporter alias
                                                        title: 'Active port calls',
                                                        showSummary: true,
                                                        fileName: 'Port calls.xlsx',
                                                    });
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    testId: 'financialAccountsViewCustomizeBtn',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-settings',
                                    text: 'Customize',
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        this.find('financial-accounts-grid')
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
            xtype: 'financial.accounts.grid',
        },
    ],
});
