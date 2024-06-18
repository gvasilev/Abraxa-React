Ext.define('Abraxa.view.settings.library.PortInfo', {
    extend: 'Ext.Container',
    xtype: 'settings.library.port.info',
    testId: 'settingsLibraryPortInfo',
    flex: 1,
    layout: 'hbox',
    items: [
        //left container
        {
            xtype: 'container',
            cls: 'a-port-left-panel',
            width: 340,
            layout: 'vbox',
            items: [
                {
                    xtype: 'image',
                    margin: '24 24 0 32',
                    align: 'stretch',
                    layout: 'fit',
                    minHeight: 196,
                    maxHeight: 196,
                    flex: 1,
                    bind: {
                        src: '{portImg}',
                    },
                },
                {
                    xtype: 'container',
                    padding: '0 24 0 32',
                    flex: 1,
                    scrollable: true,
                    defaults: {
                        xtype: 'container',
                        layout: 'hbox',
                        margin: '4 0',
                        padding: '4 0',
                        cls: 'a-bb-100',
                        defaults: {
                            xtype: 'displayfield',
                            ui: 'default',
                            encodeHtml: false,
                            cls: 'col-6',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    ui: 'default',
                                    encodeHtml: false,
                                    labelAlign: 'top',
                                    ui: 'field-xl',
                                    cls: 'col-12',
                                    margin: '8 0',
                                    bind: {
                                        label: 'Port',
                                        value: '{portTitleComponent}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    label: 'Locode',
                                    bind: {
                                        value: '{portsServerGrid.selection.port.code}',
                                    },
                                },
                                {
                                    label: 'Timezone',
                                    bind: {
                                        value: '{portsServerGrid.selection.port.time_zone}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    label: 'Coordinates',
                                    bind: {
                                        value: '{lat}',
                                    },
                                },
                                {
                                    // Need to put empty label, because without label the layout
                                    // of the Longitude displayfield is above the Latitude field above.
                                    label: AbraxaConstants.placeholders.emptyHtmlChar,
                                    bind: {
                                        value: '{lon}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    label: 'Season',
                                    bind: {
                                        value: '{portSeason:capitalize}',
                                    },
                                },
                                {
                                    label: 'Water',
                                    bind: {
                                        value: '{portWaterType:capitalize}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    label: '(S)ECA',
                                    bind: {
                                        value: '{portsServerGrid.selection.port.is_seca === true ? "Yes" : "No"}',
                                    },
                                },
                                {
                                    label: 'Shelter Afforded',
                                    bind: {
                                        value: '{shelterAffordedCode:capitalize}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    label: 'Harbor Size',
                                    bind: {
                                        value: '{portsServerGrid.selection.port.harbor_size_code:capitalize}',
                                    },
                                },
                                {
                                    label: 'Harbor Type',
                                    bind: {
                                        value: '{portsServerGrid.selection.port.harbor_type_code:capitalize}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-bb-0',
                            items: [
                                {
                                    label: 'Max Vessel Size',
                                    cls: 'col-12',
                                    bind: {
                                        value: '{portsServerGrid.selection.port.maxsize_vessel_code}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        //right container
        {
            xtype: 'container',
            padding: '8 24 16 32',
            flex: 1,
            scrollable: true,
            items: [
                //Section Entrance
                {
                    xtype: 'container',
                    cls: 'a-vessel-data',
                    items: [
                        {
                            xtype: 'div',
                            html: '<h2>Entrance</h2>',
                        },
                        {
                            xtype: 'container',
                            defaults: {
                                xtype: 'container',
                                layout: 'hbox',
                                defaults: {
                                    xtype: 'displayfield',
                                    flex: 1,
                                    ui: 'default',
                                    encodeHtml: false,
                                    padding: 8,
                                    labelAlign: 'left',
                                    bodyAlign: 'end',
                                    labelWidth: 'auto',
                                },
                            },
                            items: [
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Entrance Restriction Tide',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.entrance_restriction_tide ? portsServerGrid.selection.port.entrance_restriction_tide :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Entrance Restriction Swell',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.entrance_restriction_swell ? portsServerGrid.selection.port.entrance_restriction_swell :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Entrance Restriction Ice',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.entrance_restriction_ice ? portsServerGrid.selection.port.entrance_restriction_ice :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Entrance Restriction Other',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.entrance_restriction_other ? portsServerGrid.selection.port.entrance_restriction_other :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Overhead Limits',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.overhead_limits ? portsServerGrid.selection.port.overhead_limits :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Channel Depth',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.channel_depth ? portsServerGrid.selection.port.channel_depth :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Anchorage Depth',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.anchorage_depth ? portsServerGrid.selection.port.anchorage_depth :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Cargo Pier Depth',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.cargo_pier_depth ? portsServerGrid.selection.port.cargo_pier_depth :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Oil Terminal Depth',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.oil_terminal_depth ? portsServerGrid.selection.port.oil_terminal_depth :"---"}',
                                            },
                                        },
                                        {
                                            label: 'US Representative',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.info_us_representative ? portsServerGrid.selection.port.info_us_representative :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'First Port Of Entry',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.restriction_first_port_of_entry ? portsServerGrid.selection.port.restriction_first_port_of_entry :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Quarantine Pratique',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.quarantine_deratt_cert ? portsServerGrid.selection.port.quarantine_deratt_cert :"---"}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                //Section Port/Equipment
                {
                    xtype: 'container',
                    cls: 'a-vessel-data',
                    margin: '24 0 0 0',
                    items: [
                        {
                            xtype: 'div',
                            html: '<h2>Port/Equipment</h2>',
                        },
                        {
                            xtype: 'container',
                            defaults: {
                                xtype: 'container',
                                layout: 'hbox',
                                defaults: {
                                    xtype: 'displayfield',
                                    flex: 1,
                                    ui: 'default',
                                    encodeHtml: false,
                                    padding: 8,
                                    labelAlign: 'left',
                                    bodyAlign: 'end',
                                    labelWidth: 'auto',
                                },
                            },
                            items: [
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Load Offload Wharves',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.load_offload_berth ? portsServerGrid.selection.port.load_offload_berth :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Load Offload Anchor',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.load_offload_anchor ? portsServerGrid.selection.port.load_offload_anchor :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Load Offload Med Moor',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.load_offload_med_moor ? portsServerGrid.selection.port.load_offload_med_moor :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Load Offload Beach Moor',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.load_offload_beach_moor ? portsServerGrid.selection.port.load_offload_beach_moor :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Load Offload Ice Moor',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.load_offload_ice_moor ? portsServerGrid.selection.port.load_offload_ice_moor :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Lifts 25 49 tons',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.lifts_25_49_tons ? portsServerGrid.selection.port.lifts_25_49_tons :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Cranes Fixed',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.cranes_fixed ? portsServerGrid.selection.port.cranes_fixed :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Cranes Mobile',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.cranes_mobile ? portsServerGrid.selection.port.cranes_mobile :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Cranes Floating',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.cranes_floating ? portsServerGrid.selection.port.cranes_floating :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Lifts 100 tons plus',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.lifts_100_tons_plus ? portsServerGrid.selection.port.lifts_100_tons_plus :"---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Container
                                    items: [
                                        {
                                            label: 'Lifts 50 100 tons',
                                            margin: '0 24 0 0',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.lifts_50_100_tons ? portsServerGrid.selection.port.lifts_50_100_tons :"---"}',
                                            },
                                        },
                                        {
                                            label: 'Lifts 0 24 tons',
                                            margin: '0 0 0 24',
                                            bind: {
                                                value: '{portsServerGrid.selection.port.lifts_0_24_tons ? portsServerGrid.selection.port.lifts_0_24_tons :"---"}',
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
