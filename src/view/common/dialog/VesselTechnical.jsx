Ext.define('Abraxa.view.common.dialog.VesselTechnical', {
    extend: 'Ext.Container',
    xtype: 'vessel.main.technical',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    _formatDate: function (value) {
        if (Abraxa.utils.Functions.isValue(value)) {
            return AbraxaConstants.placeholders.emptyValue;
        } else {
            var getDate = new Date(value);
        }
        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
    },
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
                                        value: '{vessel.engine_model}',
                                    },
                                },
                                {
                                    label: 'Engine power',
                                    bind: {
                                        value: '{vessel.kw_total}',
                                    },
                                },
                                {
                                    label: 'HP',
                                    bind: {
                                        value: '{vessel.hp_total}',
                                    },
                                },
                                {
                                    label: 'Speed',
                                    bind: {
                                        value: '{vessel.speed}',
                                    },
                                },
                                {
                                    label: 'Consumption',
                                    bind: {
                                        value: '{vessel.cons}',
                                    },
                                },
                                {
                                    label: 'Registration',
                                    bind: {
                                        value: '{vessel.registration_date}',
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
                                        value: '{vessel.hull_number}',
                                    },
                                },
                                {
                                    label: 'Ice class',
                                    bind: {
                                        value: '{vessel.ice_class}',
                                    },
                                },
                                {
                                    label: 'RPM',
                                    bind: {
                                        value: '{vessel.rpm}',
                                    },
                                },
                                {
                                    label: 'Keel laying',
                                    bind: {
                                        value: '{vessel.keel_laying_date}',
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
                                        value: '{vessel.launching_date}',
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
                                        value: '{vessel.order_date}',
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
                                        value: '{vessel.class_soc_class}',
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
                                        value: '{vessel.class_soc_date_of_survey}',
                                    },
                                    renderer: function (value, item) {
                                        return this.up('vessel\\.main\\.technical')._formatDate(value);
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
                                        value: '{vessel.class_soc_date_of_next_survey}',
                                    },
                                    renderer: function (value, item) {
                                        return this.up('vessel\\.main\\.technical')._formatDate(value);
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
                                        value: '{vessel.class_soc_date_of_lastest_status}',
                                    },
                                    renderer: function (value, item) {
                                        return this.up('vessel\\.main\\.technical')._formatDate(value);
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
                                        value: '{vessel.class_soc_status}',
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
