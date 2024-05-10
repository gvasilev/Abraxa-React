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
                                                html: '{selectedRecord.width ? selectedRecord.width : "<span class=\'a-placeholder\'>---</span>" }',
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
                                                html: '{selectedRecord.ship_length ? selectedRecord.ship_length : "<span class=\'a-placeholder\'>---</span>" }',
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
                                                html: '{selectedRecord.restriction_max_draft ? selectedRecord.restriction_max_draft : "<span class=\'a-placeholder\'>---</span>" }',
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
                                                html: '{selectedRecord.restriction_max_air_draft ? selectedRecord.restriction_max_air_draft : "<span class=\'a-placeholder\'>---</span>" }',
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
                                                html: '{selectedRecord.restriction_berth_height ? selectedRecord.restriction_berth_height : "<span class=\'a-placeholder\'>---</span>" }',
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
                                                html: '{selectedRecord.restriction_wlthc ? selectedRecord.restriction_wlthc : "<span class=\'a-placeholder\'>---</span>" }',
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
                                                html: '{selectedRecord.restriction_naabsa ? selectedRecord.restriction_naabsa : "<span class=\'a-placeholder\'>---</span>" }',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'my-16',
                            html: "<div class='hbox'><div class='a-panel-title fs-14 fw-b'>Other Restrictions</div></div>",
                        },
                        {
                            xtype: 'div',
                            cls: 'a-display-value',
                            bind: {
                                html: '{selectedRecord.restriction_other ? selectedRecord.restriction_other : "<span class=\'a-placeholder\'>---</span>" }',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
