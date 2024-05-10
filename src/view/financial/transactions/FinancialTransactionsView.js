Ext.define('Abraxa.view.financial.FinancialTransactionsView', {
    extend: 'Ext.Container',
    flex: 1,
    layout: 'fit',
    xtype: 'financial.transactions.view',
    weighted: true,
    viewModel: {
        stores: {
            paymentsStore: {
                type: 'payments',
                autoLoad: true,
                filters: [
                    {
                        property: 'archived_at',
                        operator: '=',
                        value: null,
                        exactMatch: true,
                    },
                ],
            },
        },
        formulas: {
            // selectedTransaction: {
            // 	bind: {
            // 		bindTo: '{financialTransactionsGrid.selection}',
            // 		deep: true,
            // 	},
            // 	get: function (selection) {
            // 		return selection;
            // 	},
            // },
            object_record: {
                bind: {
                    bindTo: '{financialTransactionsGrid.selection.owner}',
                    deep: true,
                },
                get: function (portcall) {
                    if (portcall) return Ext.create('Abraxa.model.portcall.Portcall', portcall);
                },
            },
            totalTransactionsRecords: {
                bind: {
                    bindTo: '{paymentsStore}',
                    deep: true,
                },
                get: function (store) {
                    return store.getTotalCount();
                },
            },
            subObjects: {
                bind: {
                    bindTo: '{paymentsStore}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    store.each(function (record, index) {
                        var payment = record.getData();
                        payment.subOject = 'portcallPayments';
                        payment.model = payment.model_name;
                        switch (payment.kind) {
                            case 'incoming':
                                payment.name = 'Incoming payment from ' + payment.org_name;
                                payment.icon = 'md-icon-outlined md-icon-add';
                                break;
                            case 'outgoing':
                                payment.name = 'Outgoing payment to ' + payment.org_name;
                                payment.icon = 'md-icon-outlined md-icon-remove';
                                break;
                            case 'requested':
                                payment.name = 'Request payment from ' + payment.org_name;
                                payment.icon = 'md-icon-outlined md-icon-inventory';
                                break;
                            default:
                                break;
                        }
                        payment.subobject_id = payment.id;
                        payment.type = payment.kind;

                        data.push(payment);
                    });
                    Ext.getCmp('main-viewport').getVM().set('subObjects', data);
                    return data;
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
                    controller: 'portcalls-agent-controller',
                    items: [
                        {
                            xtype: 'button',
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
                                    var store = this.find('financial-transactions-grid').getStore();
                                    if (newValue == '') store.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    var query = this.getValue().toLowerCase();
                                    var store = this.find('financial-transactions-grid').getStore();
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
                                            ui: 'tool-text-sm',
                                            enableToggle: true,
                                            iconCls: 'md-icon-inventory-2 md-icon-outlined',
                                            text: 'Archive',
                                            listeners: {
                                                painted: function (me) {
                                                    const stateProvider = Ext.state.Provider.get();
                                                    const state =
                                                        stateProvider.state['financial-transactions-grid-filterbar'];
                                                    if (state && state.find((s) => s.id === 'archived')) {
                                                        me.setPressed(true);
                                                    }
                                                },
                                            },

                                            handler: function () {
                                                let store = this.find('financial-transactions-grid').getStore(),
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
                                    gridItemId: 'financial-transactions-grid',
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
                                                    let grid = this.find('financial-transactions-grid');
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
                                        this.find('financial-transactions-grid')
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
            xtype: 'financial.transactions.grid',
        },
        {
            xtype: 'financial.transactions.right.card',
            docked: 'right',
            height: '100%',
            weight: 0,
        },
    ],
});
