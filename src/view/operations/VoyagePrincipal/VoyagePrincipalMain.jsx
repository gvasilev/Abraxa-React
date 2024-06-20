import './VoyagePrincipalMainController';
import './VoyagePrincipalMainViewModel';
import './VoyagePrincipalGrid';
import './VoyageDetailsRightCard';
import '../../tasks/TaskRightContainer';

Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyagePrincipalMain', {
    extend: 'Ext.Container',
    xtype: 'VoyagePrincipalMain',
    controller: 'VoyagePrincipalMainController',
    viewModel: 'VoyagePrincipalMainViewModel',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            height: 64,
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'button',
                    ui: 'action small',
                    text: 'New voyage',
                    iconCls: 'md-icon-add',
                    handler: 'openNewVoyageForm',
                },
                {
                    xtype: 'searchfield',
                    ui: 'classic filled-light',
                    cls: 'a-field-icon icon-search',
                    placeholder: 'Search voyage',
                    width: 300,
                    height: 42,
                    minChars: 3,
                    centered: true,
                    listeners: {
                        change: {
                            buffer: 500,
                            fn: function (field, newValue, oldValue, eOpts) {
                                const store = field.up('VoyagePrincipalMain').down('VoyagesGrid').getStore();
                                if (newValue.length === 0) store.removeFilter('searchFilter');
                                if (newValue.length <= 2) return;
                                store.addFilter({
                                    id: 'searchFilter',
                                    property: 'search',
                                    value: newValue,
                                    operator: '=',
                                    exactMatch: true,
                                });
                            },
                        },
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-tools',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                            ui: 'tool-text-sm',
                            arrow: false,
                            text: 'Export',
                            margin: '0 0 0 8',
                            slug: 'portcallGridExport',
                            menu: {
                                items: [
                                    // {
                                    //     text: 'Export',
                                    //     iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    //     disabled: true,
                                    // },
                                    {
                                        text: 'Export to Excel',
                                        iconCls: 'md-icon-outlined md-icon-difference',
                                        handler: 'exportToExcel',
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-outlined md-icon-settings',
                            text: 'Manage columns',
                            margin: '0 0 0 8',
                            handler: 'manageColumns',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-grid-filter',
            hidden: true,
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            bind: {
                hidden: '{tabbarItems.length === 0}',
            },
            items: [
                {
                    xtype: 'tabbar',
                    id: 'voyages-principal-tabbar-filter-buttons',
                    stateful: ['activeTabIndex'],
                    stateId: 'voyages-tabbar-principal',
                    ui: 'tabbar-filter',
                    // activeTabIndex: 0,
                    width: '100%',
                    scrollable: 'x',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'middle',
                    },
                    defaults: {
                        // xtype: 'button',
                        ui: 'tab-filter',
                        // enableToggle: true,
                        cls: 'a-has-counter',
                    },
                    bind: {
                        items: '{tabbarItems}',
                        activeTab: '{activeTabIndex}',
                    },

                    listeners: {
                        activeTabchange: 'activeTabchange',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
            },
            items: [
                {
                    xtype: 'VoyagesGrid',
                },
                {
                    xtype: 'VoyageDetailsRightCard',
                    hidden: true,
                    bind: {
                        hidden: '{!currentVoyage}',
                        selectedVoyage: '{currentVoyage}',
                    },
                },
                {
                    xtype: 'tasks.right.container',
                    bind: {
                        hidden: '{selectedTask ? false : true}',
                    },
                },
            ],
        },
    ],
});
