Ext.define('Abraxa.view.directory.ports.TerminalsTab.TerminalsLDRates', {
    extend: 'Ext.Container',
    xtype: 'TerminalsLDRates',
    items: [
        {
            xtype: 'div',
            html: 'Loading and Discharging Rates',
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right is-collapsed',
            listeners: {
                click: {
                    element: 'element',
                    fn: function fn() {
                        let component = this.component;
                        component.toggleCls('is-collapsed');
                        component.up('container').down('[cls~=a-collapsible-container]').toggleCls('is-collapsed');
                    },
                },
            },
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container is-collapsed',
            layout: {
                type: 'hbox',
                justify: 'space-between',
            },
            items: [
                {
                    //left container
                    xtype: 'container',
                    margin: '0 32 0 0',
                    flex: 1,
                    //every container has defaults
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            xtype: 'div',
                        },
                    },
                    items: [
                        //every item is container because of parent defaults
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Bulk Cargo',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_bulk ? selectedRecord.load_rate_bulk + " tph" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Containers',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_container ? selectedRecord.load_rate_container + " TEU/h" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Gas',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_gas ? selectedRecord.load_rate_gas + " m³/h" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Livestock',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_livestock ? selectedRecord.load_rate_livestock + " u/h" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    //right container
                    xtype: 'container',
                    margin: '0 0 0 32',
                    flex: 1,
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        //every container has defaults
                        defaults: {
                            xtype: 'div',
                        },
                    },
                    items: [
                        //every item is container because of parent defaults
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Liquid Cargo',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_liquid ? selectedRecord.load_rate_liquid + " m³/h" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'RoRo',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_roro ? selectedRecord.load_rate_roro + " u/h" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'LNG',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_lng ? selectedRecord.load_rate_lng + " m³/h"  : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Passengers',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.load_rate_passengers ? selectedRecord.load_rate_passengers + " p/h" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
