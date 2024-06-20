import './PortcallsPrincipalMainController';
import './PortcallsPrincipalMainViewModel';
import './grids/PortCallsPricipalGridsViewModel';
import './grids/PortCallPrincipalGridsController';
import './grids/PortCallsPricipalGridAll';
import './grids/PortCallsPricipalGridClosed';
import './grids/PortCallsPricipalGridEnRoute';
import './grids/PortCallsPricipalGridInPort';
import './grids/PortCallsPricipalGridPendingAppointments';
import './grids/PortCallsPricipalGridSailed';

Ext.define('Abraxa.view.operations.PortcallsPrincipal.PortcallsPrincipalMain', {
    extend: 'Ext.Container',
    xtype: 'PortcallsPrincipalMain',
    controller: 'PortcallsPrincipalMainController',
    viewModel: 'PortcallsPrincipalMainViewModel',
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
                    text: 'New appointment',
                    iconCls: 'md-icon-add',
                    handler: 'openNewVoyageForm',
                },
                {
                    xtype: 'searchfield',
                    ui: 'classic filled-light',
                    cls: 'a-field-icon icon-search',
                    placeholder: 'Search port calls',
                    width: 300,
                    height: 42,
                    centered: true,
                    flex: 1,
                    listeners: {
                        change: {
                            buffer: 500,
                            fn: 'searchPortcalls',
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
                            arrow: false,
                            text: 'Export',
                            margin: '0 0 0 8',
                            menu: {
                                items: [
                                    // {
                                    //     text: 'Export',
                                    //     disabled: true,
                                    //     iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
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
                            handler: function (button) {
                                const currentTab = button.up('PortcallsPrincipalMain').getViewModel().get('currentTab');
                                const grid = button
                                    .up('PortcallsPrincipalMain')
                                    .down('#PortCallsPricipalGrid' + currentTab.trim().replace(' ', ''));
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
            // docked: 'top',
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
                    ui: 'tabbar-filter',
                    width: '100%',
                    scrollable: 'x',
                    stateful: ['activeTabIndex'],
                    stateId: 'portcall-principal-tabbar',
                    // activeTab: 0,
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
            xtype: 'PortCallsPricipalGridAll',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="All"}',
            },
        },
        {
            xtype: 'PortCallsPricipalGridInport',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="In port"}',
            },
        },
        {
            xtype: 'PortCallsPricipalGridEnroute',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="En route"}',
            },
        },
        {
            xtype: 'PortCallsPricipalGridSailed',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="Sailed"}',
            },
        },
        {
            xtype: 'PortCallsPricipalGridPendingappointments',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="Pending appointments"}',
            },
        },
        {
            xtype: 'PortCallsPricipalGridClosed',
            hidden: true,
            bind: {
                hidden: '{currentTab!=="Closed"}',
            },
        },
    ],
});
