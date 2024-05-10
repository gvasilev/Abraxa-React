Ext.define('Abraxa.view.common.dialog.VesselMainDetails', {
    extend: 'Ext.Container',
    xtype: 'vessel.main.details',
    testId: 'vesselMainDetails',
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
                    html: '<h2>Tonnage information</h2>',
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
                                    label: 'Deadweight',
                                    bind: {
                                        value: '{vessel.dwt}',
                                    },
                                },
                                {
                                    label: 'Gross tonnage',
                                    bind: {
                                        value: '{vessel.gt}',
                                    },
                                },
                                {
                                    label: 'Net tonnage',
                                    bind: {
                                        value: '{vessel.nt}',
                                    },
                                },
                                {
                                    label: 'Lakes fitted',
                                    bind: {
                                        value: '{vessel.is_lakes}',
                                    },
                                },
                                {
                                    label: 'Light weight',
                                    bind: {
                                        value: '{vessel.light_weight}',
                                    },
                                },
                            ],
                        },
                        //container
                        {
                            margin: '0 0 0 24',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    label: 'DWCC',
                                    bind: {
                                        value: '{vessel.dwcc}',
                                    },
                                },
                                {
                                    label: 'TPC',
                                    bind: {
                                        value: '{vessel.tpc}',
                                    },
                                },
                                {
                                    label: 'Air draft',
                                    bind: {
                                        value: '{vessel.air_draft}',
                                    },
                                },
                                {
                                    label: 'Logs fitted',
                                    bind: {
                                        value: '{vessel.is_fitted_logs}',
                                    },
                                },
                                {
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
            xtype: 'container',
            margin: '24 0 0 0',
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Cargo</h2>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    cls: 'a-vessel-data',
                    defaults: {
                        xtype: 'container',
                        padding: 0,
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
                                    label: 'Grain capacity',
                                    bind: {
                                        value: '{vessel.grain}',
                                    },
                                },
                                {
                                    label: 'Bale capacity',
                                    bind: {
                                        value: '{vessel.bale}',
                                    },
                                },
                                {
                                    label: 'TEU',
                                    bind: {
                                        value: '{vessel.teu}',
                                    },
                                },
                                {
                                    label: 'Hatches',
                                    bind: {
                                        value: '{vessel.hatches}',
                                    },
                                },
                                {
                                    label: 'Grabs',
                                    bind: {
                                        value: '{vessel.grabs}',
                                    },
                                },
                                {
                                    label: 'CO2 fitted',
                                    bind: {
                                        value: '{vessel.is_fitted_co2}',
                                    },
                                },
                                {
                                    label: 'Strength for heavy cargo',
                                    cls: 'no-border',
                                    bind: {
                                        value: '{vessel.is_strengthened_heavy_cargo}',
                                    },
                                },
                            ],
                        },
                        {
                            //container
                            margin: '0 0 0 24',
                            items: [
                                //displayfield
                                {
                                    label: 'Ballast water',
                                    bind: {
                                        value: '{vessel.ballast_water}',
                                    },
                                },
                                {
                                    label: 'Total CBM',
                                    bind: {
                                        value: '{vessel.total_cbm}',
                                    },
                                },
                                {
                                    label: 'Holds',
                                    bind: {
                                        value: '{vessel.holds}',
                                    },
                                },
                                {
                                    label: 'Gear',
                                    bind: {
                                        value: '{vessel.geared}',
                                    },
                                },
                                {
                                    label: 'Decks',
                                    bind: {
                                        value: '{vessel.decks}',
                                    },
                                },
                                {
                                    label: 'Bulkheads',
                                    bind: {
                                        value: '{vessel.bulk_heads}',
                                    },
                                },
                                {
                                    label: 'OFAC',
                                    bind: {
                                        value: '{vessel.compliance}',
                                    },
                                    renderer: function renderer(val) {
                                        let str = '',
                                            icon = '';
                                        if (val) {
                                            str =
                                                '<div class="a-check"><i class="md-icon-outlined c-green">done</i></div>';
                                        }
                                        if (str.length > 0) {
                                            return '' + icon + str + ' ';
                                        }
                                        return AbraxaConstants.placeholders.emptyValue;
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
