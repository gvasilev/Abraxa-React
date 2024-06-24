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
                                        value: '{alternativeNamesPort}',
                                    },
                                },
                                {
                                    label: 'Operational Status',
                                    bind: {
                                        value: '{port.meta_status ? port.meta_status : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                                {
                                    label: 'Region',
                                    bind: {
                                        value: '{port.meta_region ? port.meta_region : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                                {
                                    label: 'UN Country subdivision',
                                    bind: {
                                        value: '{port.meta_subdivision ? port.meta_subdivision : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Water Salinity',
                                    bind: {
                                        value: '{waterSalinity:capitalize}',
                                    },
                                },
                                {
                                    label: 'Water Density',
                                    bind: {
                                        value: '{minMaxWaterDensity}',
                                    },
                                },
                                {
                                    label: 'NOA Deadline',
                                    bind: {
                                        value: '{port.eta_message ? port.eta_message + " hours" : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                                {
                                    label: 'US Representative',
                                    cls: 'a-display-value',
                                    bind: {
                                        value: '{yesNoUsRepresentativePort}',
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
                                    label: 'Channel Draft',
                                    bind: {
                                        value: '{minMaxChannelDraft}',
                                    },
                                },
                                {
                                    label: 'Anchorage Draft',
                                    bind: {
                                        value: '{minMaxAnchorageDraft}',
                                    },
                                },
                                {
                                    label: 'Daylight Navigation',
                                    bind: {
                                        value: '{yesNoDaylightNavigationPort}',
                                    },
                                },
                                {
                                    label: 'International Navigation Limits',
                                    bind: {
                                        value: '{port.restriction_inl ? port.restriction_inl : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                                {
                                    label: 'Swell',
                                    bind: {
                                        value: '{yesNoRestrictionSwellPort}',
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
                                        value: '{yesNoRestrictionPiracyPort}',
                                    },
                                },
                                {
                                    label: 'War Area',
                                    bind: {
                                        value: '{yesNoRestrictionWarAreaPort}',
                                    },
                                },
                                {
                                    label: 'Tides',
                                    bind: {
                                        value: '{yesNoRestrictionTidesPort}',
                                    },
                                },
                                {
                                    label: 'First Port of Entry',
                                    cls: 'a-display-value',
                                    bind: {
                                        value: '{yesNoFirstPortOfEntryPort}',
                                    },
                                },
                                {
                                    label: 'Armed Guards',
                                    cls: 'a-display-value',
                                    bind: {
                                        value: '{yesNoArmedGuardsPort}',
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
                    html: '<h2>Pilotage and Towage</h2>',
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
                                    label: 'Pilotage Requirement',
                                    bind: {
                                        value: '{port.pilotage_requirement ? (port.pilotage_requirement:capitalize) : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                                {
                                    label: 'Pilotage Availability',
                                    bind: {
                                        value: '{fromToPilotageAvailability}',
                                    },
                                },
                                {
                                    label: 'Pilotage Comments',
                                    bind: {
                                        value: '{port.pilotage_comments ? port.pilotage_comments : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Towage Requirement',
                                    bind: {
                                        value: '{port.towage_requirement ? (port.towage_requirement:capitalize) : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                                {
                                    label: 'Towage Availability',
                                    bind: {
                                        value: '{fromToTowageAvailability}',
                                    },
                                },
                                {
                                    label: 'Towage Comments',
                                    bind: {
                                        value: '{port.towage_comments ? port.towage_comments : "<span class=\'a-placeholder\'>---</span>"}',
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
                        html: '<span class="c-grey-500">Last port updated:</span> <span class="a-date">{port.updated_at ? (port.updated_at:date("d M y - H:i")) : "---" }</span>',
                    },
                },
                {
                    xtype: 'button',
                    hidden: true,
                    bind: {
                        hidden: '{currentUserType === "agent"}',
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
