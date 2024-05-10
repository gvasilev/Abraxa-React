Ext.define('Abraxa.view.settings.library.vessels.VesselsMainDetails', {
    extend: 'Ext.Container',
    xtype: 'settings.library.vessels.main.details',
    hidden: true,
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    viewModel: {
        formulas: {
            flag: {
                bind: {
                    bindTo: '{vesselsGrid.selection.flags.country_code}',
                    deep: true,
                },
                get: function (flag) {
                    if (flag) {
                        return AbraxaConstants.urls.staticAbraxa + 'flags/1x1/' + flag.toLowerCase() + '.svg';
                    }
                },
            },
            vesselImg: {
                bind: {
                    bindTo: '{vesselsGrid.selection}',
                    deep: true,
                },
                get: function (vessel) {
                    if (vessel) {
                        if (vessel.get('vessel_img')) {
                            return vessel.get('vessel_img');
                        }
                        return ' //static.abraxa.com/ships/' + vessel.get('imo') + '.jpg';
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    width: 340,
                    cls: 'a-vessel-left-panel',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'image',
                            align: 'stretch',
                            layout: 'fit',
                            minHeight: 196,
                            maxHeight: 196,
                            margin: '24 24 0 32',
                            flex: 1,
                            bind: {
                                src: '{vesselImg}',
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
                                    renderer: function (value) {
                                        if (value) {
                                            return value;
                                        } else {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-bb-0',
                                    items: [
                                        {
                                            labelAlign: 'top',
                                            ui: 'field-xl',
                                            cls: 'col-12',
                                            margin: '8 0',
                                            bind: {
                                                label: 'Vessel',
                                                value: '<div class="hbox"><img data-qtip="{vesselsGrid.selection.flags.country_code:lowercase}" data-qalign="bc-tc" height="24" class="a-img-round mr-16" src="{flag}" alt="" />{vesselsGrid.selection.name}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: '4 0 16',
                                    layout: {
                                        type: 'hbox',
                                        pack: 'space-between',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Compliant',
                                            cls: 'c-blue-grey fs-13',
                                        },
                                        {
                                            xtype: 'checkboxfield',
                                            ui: 'switch icon',
                                            label: false,
                                            slug: 'settingsLibraryVesselCompliance',
                                            bind: {
                                                permission: '{userPermissions}',
                                                checked: '{vesselsGrid.selection.compliance ? true : false}',
                                            },
                                            right: 0,
                                            listeners: {
                                                painted: function () {},
                                                check: function () {
                                                    let vessel = this.upVM().get('vesselsGrid.selection');

                                                    if (vessel && !vessel.getCompliance()) {
                                                        let compliance = new Abraxa.model.vessel.VesselCompliance({
                                                            vessel_id: vessel.get('id'),
                                                        });

                                                        compliance.save({
                                                            success: function () {
                                                                vessel.setCompliance(compliance);
                                                                vessel.set('updated_at', new Date());
                                                                Ext.toast('Record updated');
                                                            },
                                                        });
                                                    }
                                                },
                                                uncheck: function () {
                                                    let vessel = this.upVM().get('vesselsGrid.selection');
                                                    if (vessel && vessel.getCompliance()) {
                                                        let compliance = vessel.getCompliance();
                                                        compliance.erase({
                                                            success: function () {
                                                                vessel.set('updated_at', new Date());
                                                                vessel.set('compliance', null);
                                                                Ext.toast('Record updated');
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Type',
                                            bind: {
                                                value: '{vesselsGrid.selection.vessel_type ? vesselsGrid.selection.vessel_type : "---"}',
                                            },
                                        },
                                        {
                                            label: 'Year',
                                            bind: {
                                                value: '{vesselsGrid.selection.built}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'IMO',
                                            bind: {
                                                value: '{vesselsGrid.selection.imo ? vesselsGrid.selection.imo : "---"}',
                                            },
                                        },
                                        {
                                            label: 'Call sign',
                                            bind: {
                                                value: '{vesselsGrid.selection.call_sign ? vesselsGrid.selection.call_sign : "---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'DWT',
                                            bind: {
                                                value: '{vesselsGrid.selection.dwt ? vesselsGrid.selection.dwt : "---"}',
                                            },
                                        },
                                        {
                                            label: 'MMSI',
                                            bind: {
                                                value: '{vesselsGrid.selection.mmsi ? vesselsGrid.selection.mmsi : "---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'GT',
                                            bind: {
                                                value: '{vesselsGrid.selection.gt ? vesselsGrid.selection.gt : "---"}',
                                            },
                                        },
                                        {
                                            label: 'Length (bp)',
                                            bind: {
                                                value: '{vesselsGrid.selection.lbp ? vesselsGrid.selection.lbp : "---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'NT',
                                            bind: {
                                                value: '{vesselsGrid.selection.nt ? vesselsGrid.selection.nt : "---"}',
                                            },
                                        },
                                        {
                                            label: 'LOA',
                                            bind: {
                                                value: '{vesselsGrid.selection.loa ? vesselsGrid.selection.loa : "---"}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-bb-0',
                                    items: [
                                        {
                                            label: 'Draft',
                                            bind: {
                                                value: '{vesselsGrid.selection.draft ? vesselsGrid.selection.draft : "---"}',
                                            },
                                        },
                                        {
                                            label: 'Beam',
                                            bind: {
                                                value: '{vesselsGrid.selection.beam ? vesselsGrid.selection.beam : "---"}',
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
                    flex: 1,
                    padding: '8 24 16 32',
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
                                                        value: '{vesselsGrid.selection.dwt ? vesselsGrid.selection.dwt : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Gross tonnage',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.gt ? vesselsGrid.selection.gt : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Net tonnage',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.nt ? vesselsGrid.selection.nt : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Lakes fitted',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.is_lakes ? vesselsGrid.selection.is_lakes : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Light weight',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.light_weight ? vesselsGrid.selection.light_weight : "---"}',
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
                                                        value: '{vesselsGrid.selection.dwcc ? vesselsGrid.selection.dwcc : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'TPC',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.tpc ? vesselsGrid.selection.tpc : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Air draft',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.air_draft ? vesselsGrid.selection.air_draft : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Logs fitted',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.is_fitted_logs ? vesselsGrid.selection.is_fitted_logs : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Depth',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.depth ? vesselsGrid.selection.depth : "---"}',
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
                                                        value: '{vesselsGrid.selection.grain ? vesselsGrid.selection.grain : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Bale capacity',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.bale ? vesselsGrid.selection.bale : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'TEU',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.teu ? vesselsGrid.selection.teu : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Hatches',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.hatches ? vesselsGrid.selection.hatches : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Grabs',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.grabs ? vesselsGrid.selection.grabs : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'CO2 fitted',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.is_fitted_co2 ? vesselsGrid.selection.is_fitted_co2 : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Strength for heavy cargo',
                                                    cls: 'no-border',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.is_strengthened_heavy_cargo ? vesselsGrid.selection.is_strengthened_heavy_cargo : "---"}',
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
                                                        value: '{vesselsGrid.selection.ballast_water ? vesselsGrid.selection.ballast_water : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Total CBM',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.total_cbm ? vesselsGrid.selection.total_cbm : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Holds',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.holds ? vesselsGrid.selection.holds : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Gear',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.geared ? vesselsGrid.selection.geared : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Decks',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.decks ? vesselsGrid.selection.decks : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'Bulkheads',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.bulk_heads ? vesselsGrid.selection.bulk_heads : "---"}',
                                                    },
                                                },
                                                {
                                                    label: 'OFAC',
                                                    bind: {
                                                        value: '{vesselsGrid.selection.compliance}',
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
                },
            ],
        },
    ],
});
