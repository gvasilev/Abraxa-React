Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoSupplies', {
    extend: 'Ext.Container',
    xtype: 'PortInfoSupplies',
    items: [
        {
            xtype: 'div',
            html: 'Supplies',
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
                            //first row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Provisions',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{object_record.supplies_provisions ? "<span class=\'a-value-yes\'><i class=\'md-icon\'></i>" + object_record.supplies_provisions + "</span>" : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Medical',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: "{object_record.supplies_medical ? \"<span class='a-value-yes'><i class='md-icon'></i>\" + object_record.supplies_medical + \"</span>\" : \"<span class='a-value-no'><i class='md-icon'></i>No</span>\"}",
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Fresh water',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.supplies_water ? object_record.supplies_water:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Fuel',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.supplies_fuel_oil ? object_record.supplies_fuel_oil:"<span class=\'a-placeholder\'>---</span>"}',
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
                                    html: 'Deck',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.supplies_deck ? object_record.supplies_deck :  "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Engine',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.supplies_engine ? object_record.supplies_engine:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Electricity',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.supplies_electricity ? object_record.supplies_electricity:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Drydock',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.infrastructure_drydock ? object_record.infrastructure_drydock:"<span class=\'a-placeholder\'>---</span>"}',
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
