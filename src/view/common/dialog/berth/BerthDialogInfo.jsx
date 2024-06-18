Ext.define('Abraxa.view.common.dialog.berth.BerthDialogInfo', {
    extend: 'Ext.Container',
    xtype: 'BerthDialogInfo',
    margin: '42 0 0 0',
    padding: '0 32',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    items: [
        {
            xtype: 'container',
            cls: 'a-port-details-header',
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-header-title-bar',
                    width: 'auto',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'hbox',
                            bind: {
                                html: '<div class="a-header-title">{berth.name}</div><span class="a-status-badge a-status-md bg-light-yellow">Berth</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container', // berth header container
                    cls: 'a-header-info-bar',
                    width: 'auto',
                    layout: {
                        type: 'hbox',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-header-info-item',
                            bind: {
                                html: '<div class="a-header-info-title sm-title">Berth IMO</div><div class="a-header-info-value">{berth.country ? berth.country:"<span class=\'a-placeholder\'>---</span>"}</div>',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-header-info-item',
                            bind: {
                                html: '<div class="a-header-info-title sm-title">Terminal</div><div class="a-header-info-value c-blue cursor-pointer">{berth.terminal.name ? berth.terminal.name:"<span class=\'a-placeholder\'>---</span>"}</div>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: '.cursor-pointer',
                                    fn: function () {
                                        Ext.getCmp('main-viewport')
                                            .getController()
                                            .redirectTo('port-info/' + this.component.upVM().get('object_record.id'));
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-header-info-item',
                            bind: {
                                html: '<div class="a-header-info-title sm-title">Port</div><div class="a-header-info-value c-blue cursor-pointer">{object_record.name ? object_record.name:"<span class=\'a-placeholder\'>---</span>"}</div>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: '.cursor-pointer',
                                    fn: function () {
                                        Ext.getCmp('main-viewport')
                                            .getController()
                                            .redirectTo('port-info/' + this.component.upVM().get('object_record.id'));
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            margin: '16 0 0 0',
            items: [
                {
                    xtype: 'div',
                    html: '<h2>General Information</h2>',
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
                                        value: '{berth.meta_name_alternatives ? berth.meta_name_alternatives :"---"}',
                                    },
                                },
                                {
                                    label: 'Location type',
                                    bind: {
                                        value: '{berth.entrance_restriction_ice ? berth.entrance_restriction_ice : "---"}',
                                    },
                                },
                                {
                                    label: 'Location coordinates',
                                    bind: {
                                        value: '{berth.overhead_limits ? berth.overhead_limits : "---"}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Operational Status',
                                    bind: {
                                        value: '{berth.entrance_restriction_swell ? berth.entrance_restriction_swell : "---"}',
                                    },
                                },
                                {
                                    label: 'ISPS',
                                    bind: {
                                        value: '{berth.entrance_restriction_other ? berth.entrance_restriction_other : "---"}',
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
                                    label: 'Width',
                                    bind: {
                                        value: '{berth.load_offload_wharves ? berth.load_offload_wharves : "---"}',
                                    },
                                },
                                {
                                    label: 'Ship Length',
                                    bind: {
                                        value: '{berth.load_offload_anchor ? berth.load_offload_anchor : "---"}',
                                    },
                                },
                                {
                                    label: 'Draft',
                                    bind: {
                                        value: '{berth.load_offload_med_moor ? berth.load_offload_med_moor : "---"}',
                                    },
                                },
                                {
                                    label: 'Air Draft',
                                    bind: {
                                        value: '{berth.load_offload_beach_moor ? berth.load_offload_beach_moor : "---"}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Berth Height',
                                    bind: {
                                        value: '{berth.cranes_fixed ? berth.cranes_fixed : "---"}',
                                    },
                                },
                                {
                                    label: 'Water Line-to-Hatch',
                                    bind: {
                                        value: '{berth.cranes_mobile ? berth.cranes_mobile : "---"}',
                                    },
                                },
                                {
                                    label: 'NAABSA',
                                    bind: {
                                        value: '{berth.cranes_floating ? berth.cranes_floating : "---"}',
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
            margin: '16 0 24 0',
            items: [
                {
                    xtype: 'div',
                    html: '<h3>Other restrictions</h3>',
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    cls: 'a-vessel-data',
                    html: 'Lorem Ispum...',
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
                        html: '<span class="c-grey-500">Last berth updated:</span> <span class="a-date">{berth.updated_at ? (berth.updated_at:date("d M y - H:i")):"---"}</span>',
                    },
                },
                {
                    xtype: 'button',
                    hidden: true,
                    bind: {
                        hidden: '{currentUserType == "agent" ? true:false}',
                    },
                    ui: 'action loading',
                    text: 'View berth details',
                    height: 36,
                    handler: function (me) {
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo(
                                'port-info/' + me.upVM().get('port.id') + '/berths/' + me.upVM().get('berth.id')
                            );
                        me.up('dialog').destroy();
                    },
                },
            ],
        },
    ],
});
