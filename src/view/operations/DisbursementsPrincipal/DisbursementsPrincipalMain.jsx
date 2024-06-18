import './DisbursementsPrincipalMainViewModel';
import './DisbursementsPrincipalMainController';
import './grids/DisbursementsPrincipalGridsViewModel';
import './grids/DisbursementsPrincipalGridsController';
import './grids/DisbursementsPrincipalGridAll';
import './grids/DisbursementsPrincipalGridApproved';
import './grids/DisbursementsPrincipalGridAwaitingApproval';
import './grids/DisbursementsPrincipalGridCompleted';
import './grids/DisbursementsPrincipalGridSubmitted';

Ext.define('Abraxa.view.operations.DisbursementsPrincipal.DisbursementsPrincipalMain', {
    extend: 'Ext.Container',
    xtype: 'DisbursementsPrincipalMain',
    viewModel: 'DisbursementsPrincipalMainViewModel',
    controller: 'DisbursementsPrincipalMainController',
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
                    xtype: 'title',
                    title: 'Disbursements',
                },
                {
                    xtype: 'searchfield',
                    ui: 'classic filled-light',
                    cls: 'a-field-icon icon-search',
                    placeholder: 'Search disbursements',
                    width: 300,
                    height: 42,
                    centered: true,
                    flex: 1,
                    listeners: {
                        change: {
                            buffer: 500,
                            fn: 'searchDisbursements',
                        },
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-tools',
                    flex: 1,
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                            ui: 'tool-text-sm',
                            testId: 'portcallsAgentTabbarExportMenu',
                            arrow: false,
                            text: 'Export',
                            margin: '0 0 0 8',
                            menu: {
                                items: [
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
                            handler: function(button) {
                                const currentTab = button
                                    .up('DisbursementsPrincipalMain')
                                    .getViewModel()
                                    .get('currentTab');
                                const grid = button
                                    .up('DisbursementsPrincipalMain')
                                    .down('#disbursementsPrincipalGrid' + currentTab.trim().replace(' ', ''));
                                grid.getPlugin('gridviewoptions').showViewOptions();
                            },
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
                hidden: '{tabbarItems.length===0}',
            },
            items: [
                {
                    xtype: 'tabbar',
                    ui: 'tabbar-filter',
                    stateful: ['activeTabIndex'],
                    stateId: 'disbursements-principal-tabbar',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'middle',
                    },
                    defaults: {
                        ui: 'tab-filter',
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
            xtype: 'DisbursementsPrincipalGridAll',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="All"}',
            },
        },
        {
            xtype: 'DisbursementsPrincipalGridAwaitingapproval',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="Awaiting approval"}',
            },
        },
        {
            xtype: 'DisbursementsPrincipalGridSubmitted',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="Submitted"}',
            },
        },
        {
            xtype: 'DisbursementsPrincipalGridApproved',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="Approved"}',
            },
        },
        {
            xtype: 'DisbursementsPrincipalGridCompleted',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="Completed"}',
            },
        },
    ],
});
