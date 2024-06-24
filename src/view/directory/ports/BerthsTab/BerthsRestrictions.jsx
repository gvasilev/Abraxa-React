Ext.define('Abraxa.view.directory.ports.BerthsTab.BerthsRestrictions', {
    extend: 'Ext.Container',
    xtype: 'BerthsRestrictions',
    items: [
        {
            xtype: 'div',
            html: 'Restrictions',
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
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
            cls: 'a-collapsible-container',
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
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
                                            html: 'Width',
                                        },
                                        {
                                            cls: 'a-display-value fw-b',
                                            bind: {
                                                html: '{selectedRecord.restriction_max_beam ? selectedRecord.restriction_max_beam + " m" : "<span class=\'a-placeholder\'>---</span>" }',
                                            },
                                        },
                                    ],
                                },
                                {
                                    //second row container
                                    items: [
                                        {
                                            cls: 'a-display-label',
                                            html: 'Ship Length',
                                        },
                                        {
                                            cls: 'a-display-value fw-b',
                                            bind: {
                                                html: '{selectedRecord.restriction_max_loa ? selectedRecord.restriction_max_loa + " m" : "<span class=\'a-placeholder\'>---</span>" }',
                                            },
                                        },
                                    ],
                                },
                                {
                                    //third row container
                                    items: [
                                        {
                                            cls: 'a-display-label',
                                            html: 'Draft',
                                        },
                                        {
                                            cls: 'a-display-value fw-b',
                                            bind: {
                                                html: '{selectedRecord.restriction_max_draft ? selectedRecord.restriction_max_draft + " m" : "<span class=\'a-placeholder\'>---</span>" }',
                                            },
                                        },
                                    ],
                                },
                                {
                                    //fourth row container
                                    items: [
                                        {
                                            cls: 'a-display-label',
                                            html: 'Air Draft',
                                        },
                                        {
                                            cls: 'a-display-value fw-b',
                                            bind: {
                                                html: '{selectedRecord.restriction_max_air_draft ? selectedRecord.restriction_max_air_draft + " m" : "<span class=\'a-placeholder\'>---</span>" }',
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
                                            html: 'Berth Height',
                                        },
                                        {
                                            cls: 'a-display-value fw-b',
                                            bind: {
                                                html: '{selectedRecord.restriction_berth_height ? selectedRecord.restriction_berth_height + " m" : "<span class=\'a-placeholder\'>---</span>" }',
                                            },
                                        },
                                    ],
                                },
                                {
                                    //second row container
                                    items: [
                                        {
                                            cls: 'a-display-label',
                                            html: 'Water Line-To-Hatch Coaming',
                                        },
                                        {
                                            cls: 'a-display-value fw-b',
                                            bind: {
                                                html: '{selectedRecord.restriction_wlthc ? selectedRecord.restriction_wlthc + " m" : "<span class=\'a-placeholder\'>---</span>" }',
                                            },
                                        },
                                    ],
                                },
                                {
                                    //third row container
                                    items: [
                                        {
                                            cls: 'a-display-label',
                                            html: 'NAABSA',
                                        },
                                        {
                                            cls: 'a-display-value fw-b',
                                            bind: {
                                                html: '{yesNoNaabsaTerminalBerth}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
