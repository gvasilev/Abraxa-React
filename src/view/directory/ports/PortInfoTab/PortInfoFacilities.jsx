Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoFacilities', {
    extend: 'Ext.Container',
    xtype: 'PortInfoFacilities',
    items: [
        {
            xtype: 'div',
            html: 'Facilities',
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
                                    html: 'Mobile Cranes',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_mobile ? object_record.cranes_mobile :"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Floating Cranes',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_floating ? object_record.cranes_floating:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Grain Elevator',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_grain_elevator ? object_record.cranes_grain_elevator:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Gantry Crane',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_gantry ? object_record.cranes_gantry:"<span class=\'a-placeholder\'>---</span>"}',
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
                                    html: 'Cranes 0 - 24 tons',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_0_24_tons ? object_record.cranes_0_24_tons : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Cranes 25 - 49 tons',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_25_49_tons ? object_record.cranes_25_49_tons:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Cranes 50 - 99 tons',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_50_100_tons ? object_record.cranes_50_100_tons:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Cranes > 100 tons',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.cranes_100_tons_plus ? object_record.cranes_100_tons_plus:"<span class=\'a-placeholder\'>---</span>"}',
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
