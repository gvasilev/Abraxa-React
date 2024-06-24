Ext.define('Abraxa.view.directory.ports.TerminalsTab.TerminalsMaxVessel', {
    extend: 'Ext.Container',
    xtype: 'TerminalsMaxVessel',
    items: [
        {
            xtype: 'div',
            html: 'Max vessel size entries',
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
                    flex: 1,
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        //every item is container because of parent defaults
                        {
                            //first row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Bulk Carriers',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_bulk ? selectedRecord.vessel_bulk + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'LNG Carriers',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_lng ? selectedRecord.vessel_lng + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Container Ships',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_container ? selectedRecord.vessel_container + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Cruise Ships',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_cruise ? selectedRecord.vessel_cruise + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //fifth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'RoRo Vessels',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_roro ? selectedRecord.vessel_roro + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
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
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        //every item is container because of parent defaults
                        {
                            //first row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Pleasure Craft',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_pleasure_craft ? selectedRecord.vessel_pleasure_craft + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'General Cargo Ships',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_general_cargo ? selectedRecord.vessel_general_cargo + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Fishing Ships',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.vessel_fishing ? selectedRecord.vessel_fishing + " dwt" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Navy Ships',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{yesNoVesselNavyTerminal}',
                                    },
                                },
                            ],
                        },
                        {
                            //fifth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Special Purpose Vessels',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoVesselSpecialPurposeTerminal}',
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
