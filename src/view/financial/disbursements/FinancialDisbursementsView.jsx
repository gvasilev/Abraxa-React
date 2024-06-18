import '../../../store/disbursements/Disbursements';
import './FinancialDisbursementsGrid';
import './FinancialRightCard';

Ext.define('Abraxa.view.financial.FinancialDisbursementsView', {
    extend: 'Ext.Container',
    layout: 'fit',
    xtype: 'financial.disbursements.view',
    testId: 'financialDisbursementsView',
    weighted: true,
    viewModel: {
        stores: {
            disbursementsStore: {
                type: 'disbursements',
                autoLoad: true,
            },
        },
        formulas: {
            totalDisbursementRecords: {
                bind: {
                    bindTo: '{disbursementsStore}',
                    deep: true,
                },
                get: function(store) {
                    return store.getTotalCount();
                },
            },
            selectedDisbursement: {
                bind: {
                    bindTo: '{financialDisbursementGrid.selection}',
                },
                get: function(selection) {
                    return selection;
                },
            },
            subObjects: {
                bind: {
                    bindTo: '{disbursementsStore}',
                    deep: true,
                },
                get: function(store) {
                    let data = [];
                    store.each(function(record, index) {
                        var disbursement = record.getData();
                        disbursement.name = disbursement.name;
                        disbursement.icon = 'md-icon-attach-money';
                        disbursement.type = 'disbursement';
                        disbursement.subOject = 'portcallDisbursements';
                        disbursement.model = disbursement.model_name;
                        disbursement.subobject_id = disbursement.id;

                        data.push(disbursement);
                    });
                    Ext.getCmp('main-viewport').getVM().set('subObjects', data);
                    return data;
                },
            },
            relatedObjects: {
                bind: {
                    bindTo: '{disbursementsStore}',
                    deep: true,
                },
                get: function(store) {
                    let data = [];
                    if (store) {
                        store.each(function(rec) {
                            data.push(rec);
                        });
                    }
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
                            testId: 'financialDisbursementsViewPortcallBtn',
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
                            placeholder: 'Search by DA ID or Billing party',
                            centered: true,
                            width: 280,
                            listeners: {
                                change: function(field, newValue, oldValue, eOpts) {
                                    var store = this.find('financial-disbursement-grid').getStore();
                                    if (newValue == '') store.removeFilter('search');
                                },
                                action: function(me, newValue, oldValue, eOpts) {
                                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                                    var store = this.find('financial-disbursement-grid').getStore();
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
                                            testId: 'financialDisbursementsViewArchiveBtn',
                                            ui: 'tool-text-sm',
                                            enableToggle: true,
                                            iconCls: 'md-icon-inventory-2 md-icon-outlined',
                                            text: 'Archive',
                                            listeners: {
                                                painted: function(me) {
                                                    const stateProvider = Ext.state.Provider.get();
                                                    const state =
                                                        stateProvider.state['financial-disbursement-grid-filterbar'];
                                                    if (state && state.find((s) => s.id === 'archived')) {
                                                        me.setPressed(true);
                                                    }
                                                },
                                            },
                                            handler: function() {
                                                let store = this.find('financial-disbursement-grid').getStore(),
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
                                    gridItemId: 'financial-disbursement-grid',
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    ui: 'tool-text-sm',
                                    arrow: false,
                                    text: 'Export',
                                    testId: 'financialDisbursementsViewExportBtn',
                                    margin: '0 0 0 8',
                                    menu: {
                                        items: [
                                            {
                                                text: 'Export to Excel',
                                                separator: true,
                                                iconCls: 'md-icon-outlined md-icon-difference',
                                                handler: function(me) {
                                                    let grid = this.find('financial-disbursement-grid');
                                                    grid.saveDocumentAs({
                                                        type: 'xlsx', // exporter alias
                                                        title: 'Active disbursements',
                                                        showSummary: true,
                                                        fileName: 'Disbursements.xlsx',
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
                                    testId: 'financialDisbursementsViewCustomizeBtn',
                                    margin: '0 0 0 8',
                                    handler: function() {
                                        this.find('financial-disbursement-grid')
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
            xtype: 'financial.disbursement.grid',
        },
        {
            xtype: 'financial.right.card',
            docked: 'right',
            height: '100%',
            weight: 0,
        },
    ],
});
