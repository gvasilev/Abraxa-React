Ext.define('Abraxa.view.settings.library.vessels.VesselMainDetailsForm', {
    extend: 'Ext.Container',
    xtype: 'vessel.main.detailsform',
    layout: {
        type: 'vbox',
        // align: 'stretch'
    },
    items: [
        {
            xtype: 'abraxa.container',
            bodyPadding: 0,
            margin: 0,
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Tonnage information</h2>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    cls: 'a-vessel-input-data',

                    items: [
                        {
                            // Left
                            xtype: 'container',
                            margin: '0 24 0 0',
                            layout: {
                                type: 'vbox',
                            },
                            flex: 1,
                            defaults: {
                                cls: 'vesselmodal',
                                labelWidth: 200,
                                clearable: false,
                                labelAlign: 'left',
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                ui: 'hovered-underline',
                            },

                            items: [
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Deadweight',
                                    bind: {
                                        value: '{vessel.dwt}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Gross Tonnage',
                                    bind: {
                                        value: '{vessel.gt}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Net Tonnage',
                                    bind: {
                                        value: '{vessel.nt}',
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Lakes Fitted',
                                    bind: {
                                        value: '{vessel.is_lakes}',
                                    },
                                    options: [
                                        {
                                            text: AbraxaConstants.placeholders.emptyValue,
                                            value: AbraxaConstants.placeholders.emptyValue,
                                        },
                                        {
                                            text: 'Yes',
                                            value: 'Yes',
                                        },
                                        {
                                            text: 'No',
                                            value: 'No',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Light Weight',
                                    bind: {
                                        value: '{vessel.light_weight}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'St.Lawrence Max Draft',
                                    bind: {
                                        value: '{vessel.st_laurence_max_draft}',
                                    },
                                },
                            ],
                        },
                        {
                            // Right
                            xtype: 'container',
                            margin: '0 0 0 24',
                            layout: {
                                type: 'vbox',
                            },
                            flex: 1,
                            defaults: {
                                cls: 'vesselmodal',
                                labelAlign: 'left',
                                labelWidth: 200,
                                clearable: false,
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                ui: 'hovered-underline',
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'DWCC',
                                    bind: {
                                        value: '{vessel.dwcc}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'TPC',
                                    bind: {
                                        value: '{vessel.tpc}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Air Draft',
                                    bind: {
                                        value: '{vessel.air_draft}',
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Logs Fitted',
                                    bind: {
                                        value: '{vessel.is_fitted_logs}',
                                    },
                                    options: [
                                        {
                                            text: AbraxaConstants.placeholders.emptyValue,
                                            value: AbraxaConstants.placeholders.emptyValue,
                                        },
                                        {
                                            text: 'Yes',
                                            value: 'Yes',
                                        },
                                        {
                                            text: 'No',
                                            value: 'No',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Depth',
                                    bind: {
                                        value: '{vessel.depth}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'abraxa.container',
            bodyPadding: 0,
            margin: '24 0 0 0',
            flex: 1,
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Cargo</h2>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        //wrap: true,
                    },
                    cls: 'a-vessel-input-data',
                    items: [
                        {
                            // Left
                            xtype: 'container',
                            margin: '0 24 0 0',
                            layout: {
                                type: 'vbox',
                            },
                            flex: 1,
                            defaults: {
                                cls: 'vesselmodal',
                                labelAlign: 'left',
                                labelWidth: 200,
                                clearable: false,
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                ui: 'hovered-underline',
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Grain Capacity',
                                    bind: {
                                        value: '{vessel.grain}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Bale Capacity',
                                    bind: {
                                        value: '{vessel.bale}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'TEU',
                                    bind: {
                                        value: '{vessel.teu}',
                                    },
                                },
                                {
                                    label: 'Hatches',
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    bind: {
                                        value: '{vessel.hatches}',
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Grabs',
                                    bind: {
                                        value: '{vessel.grabs}',
                                    },
                                    options: [
                                        {
                                            text: AbraxaConstants.placeholders.emptyValue,
                                            value: AbraxaConstants.placeholders.emptyValue,
                                        },
                                        {
                                            text: 'Yes',
                                            value: 'Yes',
                                        },
                                        {
                                            text: 'No',
                                            value: 'No',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'CO2 Fitted',
                                    bind: {
                                        value: '{vessel.is_fitted_co2}',
                                    },
                                    options: [
                                        {
                                            text: AbraxaConstants.placeholders.emptyValue,
                                            value: AbraxaConstants.placeholders.emptyValue,
                                        },
                                        {
                                            text: 'Yes',
                                            value: 'Yes',
                                        },
                                        {
                                            text: 'No',
                                            value: 'No',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Strength for Heavy Cargo',
                                    bind: {
                                        value: '{vessel.is_strengthened_heavy_cargo}',
                                    },
                                    options: [
                                        {
                                            text: AbraxaConstants.placeholders.emptyValue,
                                            value: AbraxaConstants.placeholders.emptyValue,
                                        },
                                        {
                                            text: 'Yes',
                                            value: 'Yes',
                                        },
                                        {
                                            text: 'No',
                                            value: 'No',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            // Right
                            xtype: 'container',
                            margin: '0 0 0 24',
                            layout: {
                                type: 'vbox',
                            },
                            flex: 1,
                            defaults: {
                                cls: 'vesselmodal',
                                labelAlign: 'left',
                                labelWidth: 200,
                                clearable: false,
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                ui: 'hovered-underline',
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Ballast Water',
                                    bind: {
                                        value: '{vessel.ballast_water}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Total CBM',
                                    bind: {
                                        value: '{vessel.total_cbm}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Holds',
                                    bind: {
                                        value: '{vessel.holds}',
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Gear',
                                    bind: {
                                        value: '{vessel.geared}',
                                    },
                                    options: [
                                        {
                                            text: AbraxaConstants.placeholders.emptyValue,
                                            value: AbraxaConstants.placeholders.emptyValue,
                                        },
                                        {
                                            text: 'Yes',
                                            value: 'Yes',
                                        },
                                        {
                                            text: 'No',
                                            value: 'No',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Decks',
                                    bind: {
                                        value: '{vessel.decks}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    autoComplete: false,
                                    maxLength: 10,
                                    label: 'Bulkheads',
                                    bind: {
                                        value: '{vessel.bulk_heads}',
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
