Ext.define('Abraxa.view.directory.ports.TerminalsTab.TerminalsStorageCapacity', {
    extend: 'Ext.Container',
    xtype: 'TerminalsStorageCapacity',
    items: [
        {
            xtype: 'div',
            html: 'Storage Capacity',
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
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Bulk Cargo',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.storage_capacity_bulk ? selectedRecord.storage_capacity_bulk + " tn" : "<span class=\'a-placeholder\'>---</span>" }',
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
                                        html: '{selectedRecord.storage_capacity_container ? selectedRecord.storage_capacity_container + " TEU" : "<span class=\'a-placeholder\'>---</span>" }',
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
                                        html: '{selectedRecord.storage_capacity_gas ? selectedRecord.storage_capacity_gas + " m³" : "<span class=\'a-placeholder\'>---</span>" }',
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
                                        html: '{selectedRecord.storage_capacity_livestock ? selectedRecord.storage_capacity_livestock + " u" : "<span class=\'a-placeholder\'>---</span>" }',
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
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Liquid Cargo',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.storage_capacity_liquid ? selectedRecord.storage_capacity_liquid + " m³" : "<span class=\'a-placeholder\'>---</span>" }',
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
                                        html: '{selectedRecord.storage_capacity_roro ? selectedRecord.storage_capacity_roro + " u" : "<span class=\'a-placeholder\'>---</span>" }',
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
                                        html: '{selectedRecord.storage_capacity_lng ? selectedRecord.storage_capacity_lng + " m³" : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Cold Storage',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.storage_capacity_cold_storage ? selectedRecord.storage_capacity_cold_storage + " m³" : "<span class=\'a-placeholder\'>---</span>" }',
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
