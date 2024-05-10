Ext.define('Abraxa.view.common.dialog.port.PortGeneralInfo', {
    extend: 'Ext.Container',
    xtype: 'port.dialog.generalinfo',
    padding: '0 32',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    html: '<h2 class="mt-0">Additional Port Information</h2>',
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    cls: 'a-vessel-data',
                    defaults: {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 1,
                        defaults: {
                            xtype: 'displayfield',
                            ui: 'default',
                            encodeHtml: false,
                            padding: 8,
                            labelAlign: 'left',
                            bodyAlign: 'end',
                            labelWidth: 'auto',
                        },
                    },
                    items: [
                        //container
                        {
                            margin: '0 24 0 0',
                            items: [
                                {
                                    label: 'Alternative Names',
                                    bind: {
                                        value: '{port.meta_name_alternatives ? port.meta_name_alternatives :"---"}',
                                    },
                                },
                                {
                                    label: 'Operational Status',
                                    bind: {
                                        value: '{port.entrance_restriction_ice ? port.entrance_restriction_ice : "---"}',
                                    },
                                },
                                {
                                    label: 'Region',
                                    bind: {
                                        value: '{port.overhead_limits ? port.overhead_limits : "---"}',
                                    },
                                },
                                {
                                    label: 'UN Country subdivision',
                                    bind: {
                                        value: '{port.anchorage_depth ? port.anchorage_depth : "---"}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Load Lines',
                                    bind: {
                                        value: '{port.entrance_restriction_swell ? port.entrance_restriction_swell : "---"}',
                                    },
                                },
                                {
                                    label: 'Water Density',
                                    bind: {
                                        value: '{port.entrance_restriction_other ? port.entrance_restriction_other : "---"}',
                                    },
                                },
                                {
                                    label: 'NOA Deadline',
                                    bind: {
                                        value: '{port.channel_depth ? port.channel_depth : "---"}',
                                    },
                                },
                                {
                                    label: 'US Representative',
                                    bind: {
                                        value: '{port.cargo_pier_depth ? port.cargo_pier_depth : "---"}',
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
            margin: '24 0 0 0',
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Restrictions</h2>',
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    cls: 'a-vessel-data',
                    defaults: {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 1,
                        defaults: {
                            xtype: 'displayfield',
                            ui: 'default',
                            padding: 8,
                            labelAlign: 'left',
                            bodyAlign: 'end',
                            labelWidth: 'auto',
                        },
                    },
                    items: [
                        //container
                        {
                            margin: '0 24 0 0',
                            items: [
                                {
                                    label: 'Channel Draft',
                                    bind: {
                                        value: '{port.load_offload_wharves ? port.load_offload_wharves : "---"}',
                                    },
                                },
                                {
                                    label: 'Anchorage Draft',
                                    bind: {
                                        value: '{port.load_offload_anchor ? port.load_offload_anchor : "---"}',
                                    },
                                },
                                {
                                    label: 'Daylight Navigation',
                                    bind: {
                                        value: '{port.load_offload_med_moor ? port.load_offload_med_moor : "---"}',
                                    },
                                },
                                {
                                    label: 'International Navigation Limits',
                                    bind: {
                                        value: '{port.load_offload_beach_moor ? port.load_offload_beach_moor : "---"}',
                                    },
                                },
                                {
                                    label: 'Swell',
                                    bind: {
                                        value: '{port.load_offload_ice_moor ? port.load_offload_ice_moor : "---"}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Piracy',
                                    bind: {
                                        value: '{port.cranes_fixed ? port.cranes_fixed : "---"}',
                                    },
                                },
                                {
                                    label: 'War Area',
                                    bind: {
                                        value: '{port.cranes_mobile ? port.cranes_mobile : "---"}',
                                    },
                                },
                                {
                                    label: 'Tides',
                                    bind: {
                                        value: '{port.cranes_floating ? port.cranes_floating : "---"}',
                                    },
                                },
                                {
                                    label: 'First Port of Entry',
                                    bind: {
                                        value: '{port.lifts_100_tons_plus ? port.lifts_100_tons_plus : "---"}',
                                    },
                                },
                                {
                                    label: 'Armed Guards',
                                    bind: {
                                        value: '{port.lifts_50_100_tons ? port.lifts_50_100_tons : "---"}',
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
            margin: '24 0',
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Health Information</h2>',
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    cls: 'a-vessel-data',
                    defaults: {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 1,
                        defaults: {
                            xtype: 'displayfield',
                            ui: 'default',
                            padding: 8,
                            labelAlign: 'left',
                            bodyAlign: 'end',
                            labelWidth: 'auto',
                        },
                    },
                    items: [
                        //container
                        {
                            margin: '0 24 0 0',
                            items: [
                                {
                                    label: 'Free Pratique',
                                    bind: {
                                        value: '{port.load_offload_wharves ? port.load_offload_wharves : "---"}',
                                    },
                                },
                                {
                                    cls: 'no-border',
                                    label: 'Deratting certificate',
                                    bind: {
                                        value: '{port.load_offload_anchor ? port.load_offload_anchor : "---"}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Crew vaccination required',
                                    bind: {
                                        value: '{port.cranes_fixed ? port.cranes_fixed : "---"}',
                                    },
                                },
                                {
                                    cls: 'no-border',
                                    label: 'Other',
                                    bind: {
                                        value: '{port.cranes_mobile ? port.cranes_mobile : "---"}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            // Port details footer
            xtype: 'container',
            cls: 'a-bt-100',
            height: 64,
            docked: 'bottom',
            padding: '0 32',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    bind: {
                        html: '<span class="c-grey-500">Last port updated:</span> <span class="a-date">{port.updated_at ? (port.updated_at:date("d M y - H:i")):"---"}</span>',
                    },
                },
                {
                    xtype: 'button',
                    hidden: true,
                    bind: {
                        hidden: '{currentUserType == "agent" ? true:false}',
                    },
                    ui: 'action loading',
                    text: 'View port details',
                    height: 36,
                    handler: function (me) {
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo('port-info/' + me.upVM().get('port.id'));
                        me.up('dialog').destroy();
                    },
                },
            ],
        },
    ],
});
