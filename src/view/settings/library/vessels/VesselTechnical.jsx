Ext.define('Abraxa.view.settings.library.vessels.VesselsTechnical', {
    extend: 'Ext.Container',
    xtype: 'settings.library.vessels.technicals',
    padding: '8 24 16 32',
    scrollable: true,
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Technical information</h2>',
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
                        {
                            margin: '0 24 0 0',
                            items: [
                                //displayfield
                                {
                                    label: 'Engine type',
                                    bind: {
                                        value: '{vesselsGrid.selection.engine_model ? vesselsGrid.selection.engine_model : "---"}',
                                    },
                                },
                                {
                                    label: 'Engine power',
                                    bind: {
                                        value: '{vesselsGrid.selection.kw_total ? vesselsGrid.selection.kw_total : "---"}',
                                    },
                                },
                                {
                                    label: 'HP',
                                    bind: {
                                        value: '{vesselsGrid.selection.hp_total ? vesselsGrid.selection.hp_total : "---"}',
                                    },
                                },
                                {
                                    label: 'Speed',
                                    bind: {
                                        value: '{vesselsGrid.selection.speed ? vesselsGrid.selection.speed : "---"}',
                                    },
                                },
                                {
                                    label: 'Consumption',
                                    bind: {
                                        value: '{vesselsGrid.selection.cons ? vesselsGrid.selection.cons : "---"}',
                                    },
                                },
                                {
                                    label: 'Registration',
                                    bind: {
                                        value: '{vesselsGrid.selection.registration_date}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }

                                        return Ext.util.Format.date(getDate, 'Y-m-d');
                                    },
                                },
                            ],
                        },
                        {
                            //container
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Hull number',
                                    bind: {
                                        value: '{vesselsGrid.selection.hull_number ? vesselsGrid.selection.hull_number : "---"}',
                                    },
                                },
                                {
                                    label: 'Ice class',
                                    bind: {
                                        value: '{vesselsGrid.selection.ice_class ? vesselsGrid.selection.ice_class : "---"}',
                                    },
                                },
                                {
                                    label: 'RPM',
                                    bind: {
                                        value: '{vesselsGrid.selection.rpm ? vesselsGrid.selection.rpm : "---"}',
                                    },
                                },
                                {
                                    label: 'Keel laying',
                                    bind: {
                                        value: '{vesselsGrid.selection.keel_laying_date}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                                    },
                                },
                                {
                                    label: 'Launching',
                                    bind: {
                                        value: '{vesselsGrid.selection.launching_date}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                                    },
                                },
                                {
                                    label: 'Order date',
                                    bind: {
                                        value: '{vesselsGrid.selection.order_date}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
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
                    html: '<h2>Classification society</h2>',
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
                        {
                            //container
                            margin: '0 24 0 0',
                            items: [
                                //displayfield
                                {
                                    label: 'Class',
                                    bind: {
                                        value: '{vesselsGrid.selection.classification.class_soc_class}',
                                    },
                                },
                            ],
                        },
                        {
                            //container
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Date of Survey',
                                    bind: {
                                        value: '{vesselsGrid.selection.classification.class_soc_date_of_survey}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                                    },
                                },
                            ],
                        },
                    ],
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
                        {
                            //container
                            margin: '0 24 0 0',
                            items: [
                                //displayfield
                                {
                                    label: 'Date of next Survey',
                                    bind: {
                                        value: '{vesselsGrid.selection.classification.class_soc_date_of_next_survey}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                                    },
                                },
                            ],
                        },
                        {
                            //container
                            margin: '0 0 0 24',
                            items: [
                                {
                                    label: 'Date of latest Status',
                                    bind: {
                                        value: '{vesselsGrid.selection.classification.class_soc_date_of_lastest_status ? vesselsGrid.selection.classification.class_soc_date_of_lastest_status : "---"}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                                    },
                                },
                            ],
                        },
                    ],
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
                        {
                            //container
                            margin: '0 24 0 0',
                            items: [
                                //displayfield
                                {
                                    label: 'Status',
                                    bind: {
                                        value: '{vesselsGrid.selection.classification.class_soc_status ? vesselsGrid.selection.classification.class_soc_status : "---"}',
                                    },
                                },
                            ],
                        },
                        {
                            //container
                            margin: '0 0 0 24',
                        },
                    ],
                },
            ],
        },
    ],
});
